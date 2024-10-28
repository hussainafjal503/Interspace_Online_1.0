import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.routes.js";
import postRoute from "./routes/post.routes.js";
import messageRoute from "./routes/message.routes.js";
import { app, server } from "./socket/socket.js";
import path from "path";

dotenv.config({});

const PORT = process.env.PORT || 3000;
const __dirname=path.resolve();

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "i am comming from backend",
    success: true,
  });
});

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOption));

//api are used here
// "http://localhost:4000/api/v1/user/register"
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/message", messageRoute);


app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*",(req,res)=>{
  req.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
})

server.listen(PORT, () => {
  connectDB();
  console.log(`Server listen at port ${PORT}`);
});
