import dotenv from "dotenv"
import { app } from "./app.js";
import { createServer } from "http";
import { initializeSocket } from "./socket/socket.js";

dotenv.config({
    path: './.env'
})
const server = createServer(app);
initializeSocket(server);

server.listen(process.env.PORT || 8000, () => {
    console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
})