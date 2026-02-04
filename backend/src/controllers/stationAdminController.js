import StationModel from "../models/StationModel.js";

// List all stations (for admin dashboard/forms)
export const listStations = async (req, res) => {
  try {
    const stations = await StationModel.find().sort({ distance: 1 });
    return res.status(200).json({ success: true, data: stations });
  } catch (error) {
    console.error("List stations error:", error);
    return res
      .status(500)
      .json({ message: "Error fetching stations", error: error.message });
  }
};
        
// Create a new station with distance
export const createStation = async (req, res) => { 
  try {
    const { name, distance } = req.body;

    if (!name || distance === undefined) {
      return res
        .status(400)
        .json({ message: "Name and distance are required" });
    }

    const existing = await StationModel.findOne({ name });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Station with this name already exists" });
    }

    const station = await StationModel.create({ name, distance });
    return res.status(201).json({ success: true, data: station });
  } catch (error) {
    console.error("Create station error:", error);
    return res
      .status(500)
      .json({ message: "Error creating station", error: error.message });
  }
};

// Update station name or distance
export const updateStation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, distance } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (distance !== undefined) updates.distance = distance;

    const updated = await StationModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Station not found" });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("Update station error:", error);
    return res
      .status(500)
      .json({ message: "Error updating station", error: error.message });
  }
};

