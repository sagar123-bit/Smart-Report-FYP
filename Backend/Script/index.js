import express from 'express';
import cors from 'cors';
import http from "http";
import connectToDB from './connect/index.js';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv"
dotenv.config();
import authRouter from './routes/authRouter.js';
import authMiddleware from './middleware/authMiddleware.js';
import path from 'path';
import userRouter from './routes/userRouter.js';


const MONGO_URL=process.env.MONGODB_URL;
const PORT =process.env.PORT || 3000;
const FRONTEND_URL=process.env.FRONTEND_URL;

const runApp = async () => {
  try {
    await connectToDB(MONGO_URL);

    const app = express();
    const server = http.createServer(app);

    app.use(cors({
      origin: FRONTEND_URL,
      allowedHeaders:['Content-Type','Authorization'],
      methods:["POST","GET","DELETE","PUT","PATCH"],
      credentials: true
    }));
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(path.resolve("./Script/uploads/")));
    app.use(authMiddleware);
    
    app.use("/api/auth",authRouter);
    app.use("/api/user",userRouter);


    app.get("/userdata",(req,res)=>{
      return res.status(200).json({
        message:"User data fetched successfully",
        user:req.user
      });
    });

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

runApp();