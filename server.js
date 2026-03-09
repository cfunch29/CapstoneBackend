// imports 
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/conn.js"
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./middleware/authMiddleware.js";
import transactionRoutes from "./routes/transactionRoutes.js";

// data 
import { globalErr } from "./middleware/middlewares.js"
import logReq from "./middleware/logReq.js";

// setups 
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
connectDB();

// middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(logReq);

// routes 
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

// global err handling middleware 
app.use(globalErr);

// listener
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})