import User from "../models/user.model.js";
import Product from "../models/products.model.js";
import Order from "../models/order.model.js";

export const getAnalyticsData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);
    const { totalRevenue, totalOrders } = salesData[0] || {
      totalRevenue: 0,
      totalOrders: 0,
    };
    res.json({
      users: totalUsers,
      products: totalProducts,
      totalRevenue,
      totalSales: totalOrders,
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDailySalesData = async (startDate, endDate) => {
  try {
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          sales: { $sum: 1 },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    const dateRange = getDatesInRange(startDate, endDate);
    return dateRange.map((date) => {
      const foundData = salesData.find(
        (data) => data._id === date.toISOString().split("T")[0]
      );
      return {
        name: date.toISOString().split("T")[0],
        date,
        sales: foundData ? foundData.sales : 0,
        revenue: foundData ? foundData.totalSales : 0,
      };
    });
  } catch (error) {
    console.error("Error fetching daily sales data:", error);
    throw new Error("Internal server error");
  }
};

export const getSalesData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);
    const { totalRevenue, totalOrders } = salesData[0] || {
      totalRevenue: 0,
      totalOrders: 0,
    };

    const analyticsData = {
      users: totalUsers,
      products: totalProducts,
      totalRevenue,
      totalSales: totalOrders,
    };

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailySalesData = await getDailySalesData(startDate, endDate);

    res.json({
      analyticsData,
      dailySalesData,
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
