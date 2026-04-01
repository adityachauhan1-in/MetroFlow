import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors";// cross origin resource sharing used for share the data b/w two different links(backend and frontendh)
import fareRoute from '../src/routes/fareRoute.js'
import protectedRoute from './routes/protectedRoute.js'
import ticketRoute from './routes/ticketRoute.js'
import userRoutes from './routes/userRoutes.js'
import adminRoute from './routes/adminRoute.js'
import adminConfigRoute from './routes/adminConfigRoute.js'
import { autoExpireTicket } from "./utils/ticketCleanup.js";

import qrScanRoute from "./routes/qrScanRoute.js";
import userFeedbackRoute from "./routes/userFeedbackRoute.js";
import adminFeedbackRoute from "./routes/adminFeedbackRoute.js";
// import { AuthProvider } from "../../frontend/src/context/AuthContext.jsx";
import path from "path"
import { fileURLToPath } from "url";
dotenv.config();//mongodb connection 

const app = express();
const __fileName = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__fileName)
// middleware
app.use(cors())
app.use(express.json()) 

// MongoDB connection 
mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err))

app.get("/" , (req,res) => {
    res.send("Meerut Metro API  is running ,  local development area  ")
})
// after every 10 minute ticket is check Active or mark it expire if time gone . and not used 
// Schedule cleanup every 10 minutes using setInterval
const CLEANUP_INTERVAL = 10 * 60 * 1000; 
setInterval(() => {
  console.log('Running ticket cleanup job...');
  autoExpireTicket();
}, CLEANUP_INTERVAL);

// Run once on server start
console.log('Running initial ticket cleanup...');
autoExpireTicket();

 app.use("/calculate",fareRoute);
 app.use("/",protectedRoute); // gatekeeper 
app.use("/ticket", ticketRoute);
app.use("/user", userRoutes);
app.use("/user", userFeedbackRoute);
app.use("/role",adminRoute);
app.use("/admin", qrScanRoute);
app.use("/admin", adminConfigRoute);
app.use("/admin", adminFeedbackRoute);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "../../frontend/dist/index.html"));
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`see this is mongo uri : ${process.env.MONGO_URI}`)

  console.log(` HII Server running on port ${PORT}`);



});