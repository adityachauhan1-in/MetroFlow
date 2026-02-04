import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import {
  setFareConfig,
  getActiveFareConfig,
} from "../controllers/fareAdminController.js";
import {
  listStations,
  createStation, 
  updateStation,
} from "../controllers/stationAdminController.js";
import { getTicketStats } from "../controllers/adminDashboardController.js";

const router = express.Router();

// All routes below require authenticated admin
router.use(authMiddleware, adminMiddleware);

// Fare configuration management
router.post("/fare-config", setFareConfig);
router.get("/fare-config", getActiveFareConfig);

// Station management
router.get("/stations", listStations);
router.post("/stations", createStation);
router.put("/stations/:id", updateStation);

// Dashboard stats
router.get("/dashboard/tickets", getTicketStats);

export default router;

