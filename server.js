// imports 
import express from "express";

// data 
import { globalErr } from "./middleware/middlewares.js"
import logReq from "./middleware/logReq.js";

// setups 
const app = express();
const PORT = 3000;

// middleware

// routes 

// global err handling middleware 
app.use(globalErr);

// listener
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})