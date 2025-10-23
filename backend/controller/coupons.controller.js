import Coupon from "../models/coupons.model.js";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
      expirationDate: { $gt: new Date() },
    });

    // Return 200 with null when no active coupon
    if (!coupon) return res.json(null);

    return res.json(coupon);
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "code is required" });

    const coupon = await Coupon.findOne({
      code,
      userId: req.user._id,
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ message: "No active coupon found" });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({ message: "Coupon has expired" });
    }

    return res.json({
      message: "Coupon is valid",
      code: coupon.code,
      discount: coupon.discount,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
