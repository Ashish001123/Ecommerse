import User from "../models/user.model.js";
import Product from "../models/products.model.js";
import Order from "../models/order.model.js";

export const getAnalyticsData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const salesAgg = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalSales: { $sum: 1 },
        },
      },
    ]);

    const { totalRevenue = 0, totalSales = 0 } = salesAgg[0] || {};

    res.json({
      users: totalUsers,
      products: totalProducts,
      totalRevenue,
      totalSales,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDailySalesData = async (startDate, endDate) => {
  try {
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Kolkata", // IMPORTANT
            },
          },
          sales: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dateRange = getDatesInRange(startDate, endDate);

    return dateRange.map((date) => {
      const dateStr = date.toISOString().split("T")[0];
      const found = salesData.find((d) => d._id === dateStr);

      return {
        name: dateStr,
        sales: found ? found.sales : 0,
        revenue: found ? found.revenue : 0,
      };
    });
  } catch (error) {
    console.error("Daily sales error:", error);
    throw new Error("Failed to fetch daily sales data");
  }
};

export const getSalesData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const salesAgg = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalSales: { $sum: 1 },
        },
      },
    ]);

    const { totalRevenue = 0, totalSales = 0 } = salesAgg[0] || {};

    const analyticsData = {
      users: totalUsers,
      products: totalProducts,
      totalRevenue,
      totalSales,
    };
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const dailySalesData = await getDailySalesData(startDate, endDate);

    res.json({
      analyticsData,
      dailySalesData,
    });
  } catch (error) {
    console.error("Sales analytics error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

function getDatesInRange(startDate, endDate) {
  const dates = [];
  let current = new Date(startDate);

  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}
