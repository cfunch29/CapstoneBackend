// imports 
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/conn.js"
import cors from "cors";

// data 
import { globalErr } from "./middleware/middlewares.js"
import logReq from "./middleware/logReq.js";

// setups 
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
connectDB();

// middleware
app.use(cors());
app.use(express.json());
app.use(logReq);

// routes 

// global err handling middleware 
app.use(globalErr);

// listener
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})