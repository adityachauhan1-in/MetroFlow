import FareConfigModel from "../models/FareConfigModel.js";

// Admin can create a new fare configuration. Any previous active config is deactivated.
export const setFareConfig = async (req, res) => {
  try {
    const {
      baseFare,
      perKmFare,
      peakMultiplier,
      peakStartTime,
      peakEndTime,
      isActive = true,
    } = req.body;
// if any of them are missing 
    if (
      baseFare === undefined ||
      perKmFare === undefined ||
      peakMultiplier === undefined ||
      !peakStartTime ||
      !peakEndTime
    ) {
      return res.status(400).json({ message: "All fare fields are required" });
    }

    // Deactivate any previous active config if this one should be active
    if (isActive) {
      await FareConfigModel.updateMany({ isActive: true }, { isActive: false });
    }

    const fareConfig = await FareConfigModel.create({
      baseFare,
      perKmFare,
      peakMultiplier,
      peakStartTime,
      peakEndTime,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Fare configuration saved successfully",
      data: fareConfig,
    });
  } catch (error) {
    console.error("Set fare config error:", error);
    return res.status(500).json({
      message: "Error saving fare configuration",
      error: error.message,
    });
  }
};

// Get the currently active fare configuration
export const getActiveFareConfig = async (req, res) => {
  try {
    const activeConfig = await FareConfigModel.findOne({ isActive: true }).sort(
      { createdAt: -1 }// latest appear at the top 
    );

    if (!activeConfig) {
      return res
        .status(404)
        .json({ message: "No active fare configuration found" });
    }

    return res.status(200).json({
      success: true, 
      data: activeConfig,
    });
  } catch (error) {
    console.error("Get active fare config error:", error);
    return res.status(500).json({
      message: "Error fetching fare configuration",
      error: error.message,
    });
  }
};

