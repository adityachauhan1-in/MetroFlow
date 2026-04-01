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

// --- API: all REST routes under /api so they never clash with React Router (/user, /admin, …) ---
const api = express.Router();
api.use("/calculate", fareRoute);
api.use("/", protectedRoute); // GET /api/protected
api.use("/ticket", ticketRoute);
api.use("/user", userRoutes);
api.use("/user", userFeedbackRoute);
api.use("/role", adminRoute);
api.use("/admin", qrScanRoute);
api.use("/admin", adminConfigRoute);
api.use("/admin", adminFeedbackRoute);
api.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

app.get("/api/health", (req, res) => {
  res.type("text").send("Meerut Metro API is running");
});
app.use("/api", api);

// --- SPA: static assets, then index.html for client-side routes (refresh / deep links) ---
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// SPA fallback: avoid app.get("*") / "/*" — Express 5 path-to-regexp rejects * or only matches one segment
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return next();
  }
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"), (err) => {
    if (err) next(err);
  });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` HII Server running on port ${PORT}`);
});
