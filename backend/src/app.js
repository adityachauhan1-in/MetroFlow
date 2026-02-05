import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors";
import fareRoute from '../src/routes/fareRoute.js'
import protectedRoute from './routes/protectedRoute.js'
import ticketRoute from './routes/ticketRoute.js'
import userRoutes from './routes/userRoutes.js'
import adminRoute from './routes/adminRoute.js'
import adminConfigRoute from './routes/adminConfigRoute.js'
import cron from 'cron'
import { autoExpireTicket } from "./utils/ticketCleanup.js";
// import { getMyTicket } from "./controllers/tickHistoryController.js";
// import authMiddleware from "./middlewares/authMiddleware.js";
import qrScanRoute from "./routes/qrScanRoute.js"
dotenv.config();

const app = express();
app.use(cors())
app.use(express.json()) 

// MongoDB connection 
mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err))

app.get("/" , (req,res) => {
    res.send("Meerut Metro API  is running ,  Alright  ")
})

// Schedule cleanup every 5 minutes using setInterval
const CLEANUP_INTERVAL = 5 * 60 * 1000; 
setInterval(() => {
  console.log('Running ticket cleanup job...');
  autoExpireTicket();
}, CLEANUP_INTERVAL);

// Run once on server start
console.log('Running initial ticket cleanup...');
autoExpireTicket();

 app.use("/calculate",fareRoute);
 app.use("/",protectedRoute); 
app.use("/ticket",ticketRoute);
app.use("/user",userRoutes);
app.use("/role",adminRoute);
// app.use("/api/getmy/history",authMiddleware,getMyTicket)
app.use("/admin",qrScanRoute);
app.use("/admin",adminConfigRoute);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` HII Server running on port ${PORT}`);

});