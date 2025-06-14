import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const server = http.createServer(app); // Converts Express app into an HTTP server that also works with WebSockets.

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

let onlineUsers = {};

io.on("connection", (socket) => { // socket mein object aaega
  socket.on("user-connected", (email) => { // email mein jo frontend se jo bheja hain vo jaiga
    if (!email) return;
    onlineUsers[email] = socket.id;
    io.emit("no_of_online", onlineUsers)
  });

  socket.on("disconnect", () => {
    const disconnectedEmail = Object.keys(onlineUsers).find(
      (email) => onlineUsers[email] === socket.id
    );
    if (disconnectedEmail) {
      delete onlineUsers[disconnectedEmail];
      io.emit("no_of_online", onlineUsers);
    }
  });

  socket.on('message-sent', ( roomId ) => {
    io.emit("triggerPreviousMess")
  })

  const letter = "Sitanshu"
  socket.on('isTyping', (name) => {  
    const fullName = letter+name;
    io.emit('User is Typing', fullName)
  })
});

// socket.on('function name') yeh frontend se call hoga aur perform hoga
// io.emit se sabhi servers ko info de sakte hain

server.listen(8000, () => {
  console.log("Server is running on port :", process.env.CORS_ORIGIN);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/user", userRouter);

import roomRouter from "./routes/room.routes.js";
app.use("/api/v1/room", roomRouter);

import messageRouter from './routes/message.routes.js'
app.use('/api/v1/message', messageRouter);

export { app };
