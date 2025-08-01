import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./Lib/db.js";
import authRoutes from "./Routes/auth.route.js";
import messageRoutes from "./Routes/message.route.js";
import { app,server } from "./Lib/socket.js";

import path from "path";

import cookieParser from "cookie-parser";
import cors from "cors"

dotenv.config();


const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods: ["GET" , "POST" , "PUT" , "DELETE"],
    allowedHeaders : ["Content-Type","Authorization","Cache-Control","Expires","Pragma"]
}))


app.use ("/api/auth",authRoutes);
app.use ("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, ()=> {
    console.log(`server is running on a port:`+ PORT);
    connectDB()
})