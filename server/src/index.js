import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "./db/dbConnect.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import postRouter from "./routes/post.js";
import notificationRouter from "./routes/notification.js";

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 8000;

app.use(
  express.json({
    limit: "6mb",
  })
);
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/notifications", notificationRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  dbConnect();
});
