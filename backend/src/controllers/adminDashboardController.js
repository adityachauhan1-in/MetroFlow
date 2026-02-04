import TicketModel from "../models/TicketModel.js";

// Admin dashboard: ticket statistics , revenueResult , ticket status accountability
export const getTicketStats = async (req, res) => {
  try {
    const [
      totalTickets,
      activeTickets,
      usedTickets,
      expiredTickets,
      revenueResult,
      todayTickets,
    ] = await Promise.all([ // for counting  of all the documents 
      TicketModel.countDocuments(),
      TicketModel.countDocuments({ status: "active" }),
      TicketModel.countDocuments({ status: "used" }),
      TicketModel.countDocuments({ status: "expire" }),
      TicketModel.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: "$fare" } } },
      ]),
      // today managibility
      (() => {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        return TicketModel.countDocuments({ createdAt: { $gte: startOfToday } });
      })(),
    ]);

    const totalRevenue =
      revenueResult && revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalTickets,
        activeTickets,
        usedTickets,
        expiredTickets,
        totalRevenue,
        todayTickets,
      },
    });
  } catch (error) {
    console.error("Admin ticket stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching ticket statistics",
      error: error.message,
    });
  }
};

