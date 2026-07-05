# Production-Grade Project Architecture & Guidelines

This document outlines the folder structures, API routing conventions, and error-handling standards for both Backend (Node.js/Express/Prisma) and Frontend (React/Vite/Zustand) codebases. Use this guide to direct LLMs to write code that adheres to industry best practices.

---

## 1. Project Directory Structure

### Backend (Node.js + Express + Prisma + TypeScript)
```
backend/
├── prisma/
│   ├── schema.prisma             # Database schema definition
│   └── migrations/               # Database migration files
├── public/
│   └── temp/                     # Temporary folder for file uploads (multer)
├── src/
│   ├── controllers/              # Business logic & request handling
│   │   ├── auth.controller.ts
│   │   └── chat.controller.ts
│   ├── routes/                   # API endpoint maps
│   │   ├── auth.route.ts
│   │   └── chat.route.ts
│   ├── middlewares/              # Security, validation, multer, and global error middleware
│   │   ├── auth.middleware.ts
│   │   ├── multer.middleware.ts
│   │   └── error.middleware.ts   # Global error handling middleware
│   ├── lib/                      # Client instances (Prisma, Redis, Sockets, etc.)
│   │   ├── prisma.ts
│   │   └── socket.ts
│   ├── utils/                    # Helper classes and validation schemas
│   │   ├── ApiError.ts           # Standardized error class
│   │   ├── ApiResponse.ts         # Standardized JSON response class
│   │   ├── asyncHandler.ts       # Express async handler wrapper
│   │   ├── cloudinary.ts         # Cloudinary file uploading helper
│   │   └── schemas.ts            # Zod validation schemas
│   ├── generated/                # Automatically generated client codes (e.g. Prisma client)
│   ├── app.ts                    # Express app initialization (CORS, Parser, Routes setup)
│   └── index.ts                  # Server startup script
├── .env                          # Local environment secrets
├── package.json
└── tsconfig.json
```

### Frontend (React + Vite + Tailwind + Zustand + TypeScript)
```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/                   # Static resources (images, icons)
│   ├── components/               # Reusable presentational components (buttons, cards, inputs)
│   │   ├── ChatContainer.tsx
│   │   └── MessageInput.tsx
│   ├── pages/                    # Main page views (rendered by React Router)
│   │   ├── Home.tsx
│   │   ├── Chat.tsx
│   │   └── Login.tsx
│   ├── store/                    # Zustand stores for global state management
│   │   ├── useAuthStore.ts
│   │   └── useChatStore.ts
│   ├── lib/                      # Base client setup
│   │   └── axios.ts              # Custom Axios instance with interceptors
│   ├── helpers/                  # API communication functions
│   │   └── api-communicator.ts
│   ├── index.css                 # Global tailwind styles
│   ├── App.tsx                   # Main component (Routing, Provider setup)
│   └── main.tsx                  # Vite render mount
├── .env                          # App environment variables
├── package.json
└── vite.config.ts
```

---

## 2. Backend Error & Response Handling Standards

To ensure a robust backend API, all controllers must wrap logic using a standard `asyncHandler` wrapper, use a unified `ApiError` class for failures, and respond using `ApiResponse`.

### A. Custom ApiError Class (`src/utils/ApiError.ts`)
```typescript
export class ApiError extends Error {
  public statusCode: number;
  public data: any;
  public success: boolean;
  public errors: any[];

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: any[] = [],
    stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
```

### B. Custom ApiResponse Class (`src/utils/ApiResponse.ts`)
```typescript
export class ApiResponse<T> {
  public statusCode: number;
  public data: T;
  public message: string;
  public success: boolean;

  constructor(statusCode: number, data: T, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
```

### C. Async Handler Wrapper (`src/utils/asyncHandler.ts`)
```typescript
import type { Request, Response, NextFunction } from "express";

export const asyncHandler = (
  requestHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
```

### D. Global Error Handler Middleware (`src/middlewares/error.middleware.ts`)
Must be mounted after all routes to capture throw statements and next(error) calls.
```typescript
import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  // Transform generic errors into standardized ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, err.errors || [], err.stack);
  }

  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};
```

### E. Zod Request Body Validation Example
Validate all request schemas in `controllers` before executing operations:
```typescript
import { z } from "zod";
import { ApiError } from "../utils/ApiError.js";

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Inside controller:
const validationResult = loginSchema.safeParse(req.body);
if (!validationResult.success) {
  throw new ApiError(
    400, 
    validationResult.error.issues[0]?.message || "Validation Error"
  );
}
```

---

## 3. Frontend Architecture & Error Handling Standards

A clean frontend depends on state machines (Zustand), decoupled API calls, and automated HTTP interceptors to capture authentication issues or database crashes.

### A. Custom Axios Setup (`src/lib/axios.ts`)
Configure global options like credentials and add interceptors to show user-friendly notifications.
```typescript
import axios from "axios";
import toast from "react-hot-toast";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

// Global Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardized check for server errors
    const errorMessage = 
      error.response?.data?.message || 
      error.message || 
      "Network connection failure";

    // Handle session expirations globally
    if (error.response?.status === 401 && window.location.pathname !== "/login") {
      toast.error("Session expired. Please log in again.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } else {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);
```

### B. Standardized Store Action Pattern (Zustand)
Handle loading state, local state updating, and state persistence inside actions:
```typescript
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

interface AuthState {
  user: any | null;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/user/login", credentials);
      set({ user: res.data.data.user });
      toast.success("Welcome back!");
    } catch (error) {
      // toast is automatically displayed by Axios interceptors,
      // but we throw here if calling components need custom handling
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
```

---

## Summary of Coding Best Practices

1. **Separation of Concerns**: Never perform business logic (e.g. database transactions, cloud uploads) inside route declarations. Keep routes clean and delegate logic to Controllers.
2. **Standardized Responses**: The server must always return JSON following the `{ success: boolean, statusCode: number, data: any, message: string }` pattern.
3. **No Catch-All Console Logs**: Always use custom `ApiError` instances on the server instead of throwing raw strings or plain Errors, ensuring clients always receive a readable `message`.
4. **Environment Variables**: Use `.env` files for configuration. Never hardcode API keys, ports, connection strings, or third-party service credentials (like Cloudinary config) directly in code.
