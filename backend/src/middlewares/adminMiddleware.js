import User from "../models/UserModel.js";

// This middleware assumes authMiddleware has already run and set req.user
const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Extra safety: verify the user is still admin in DB
    const user = await User.findById(req.user.id).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({ message: "Server error verifying admin" });
  }
};

export default adminMiddleware;


