import "dotenv/config";
import { app } from "./app.js";
import { createServer } from "http";
import { initializeSocket } from "./socket/socket.js";

const server = createServer(app);
initializeSocket(server);

server.listen(process.env.PORT || 8000, () => {
    console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
})