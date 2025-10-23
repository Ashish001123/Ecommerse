// import Coupon from "../models/cupon.model.js";
// import Stripe from "stripe";
// import Order from "../models/order.model.js";

// export const createCheckoutSession = async (req, res) => {
//   try {
//     const { products, cuponCode } = req.body;
//     if (!Array.isArray(products) || products.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "Products array is required and cannot be empty" });
//     }
//     let totalAmmount = 0;
//     const lineItems = products.map((product) => {
//       const amount = Math.round(product.price * 100);
//       totalAmmount += amount * product.quantity;
//       return {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: product.name,
//             image: product.image,
//           },
//           unit_amount: amount,
//         },
//         quantity: product.quantity || 1,
//       };
//     });
//     let cupon = null;
//     if (cuponCode) {
//       cupon = await Coupon.findOne({
//         code: cuponCode,
//         userId: req.user.id,
//         isActive: true,
//       });
//       if (cupon) {
//         totalAmmount -= Math.round((totalAmmount * cupon.discount) / 100);
//       }
//     }
//     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: lineItems,
//       mode: "payment",
//       success_url: `${process.env.CLIENT_URL}/purchase_success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/purchase_cancel`,
//       discounts: cupon
//         ? [
//             {
//               coupon: cupon.stripeCoupon(cupon.discountPercentage),
//             },
//           ]
//         : [],
//       metadata: {
//         userId: req.user.id,
//         cuponCode: cuponCode || ""
//       },
//     });
//       if (totalAmmount > 20000) {
//        await createNewCoupon(req.user.id);
//       }
//     return res.json({ id: session.id , totalAmmount : totalAmmount / 100 });
//   } catch (error) {
//     console.error("Error creating checkout session:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// async function createStripeCoupon(discountPercentage) {
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
//   const coupon = await stripe.coupons.create({
//     percent_off: discountPercentage,
//     duration: "once",
//   });
//   return coupon.id;
// }

// async function createNewCoupon(userId) {
//     const newCupon = new Coupon({
//         code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
//         discount: 10,
//         expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//         userId:userId
//     })
//     await newCupon.save();
//     return newCupon;
// }

// export const checkoutSuccess = async (req, res) => {
//     try {
//         const { session_id } = req.body;
//         const session = await Stripe.checkout.session.retrieve(session_id);
//       if (session.payment_status === "paid") {
//         if (session.metadata.cuponCode) {
//           await Coupon.findOneAndUpdate(
//             { code: session.metadata.cuponCode, userId: session.metadata.userId },
//             { isActive: false }
//           );
//         }
//         const products = JSON.parse(session.metadata.products);
//         const order = new Order({
//           user: session.metadata.userId,
//           products: products.map(product => ({
//             productId: product.id,
//             quantity: product.quantity,
//             price: product.price
//           })),
//           totalAmount: session.amount_total / 100,
//           stripeSessionId: session.id,
//         });

//         await order.save();
//         res.status(200).json({
//           success: true,
//           message: "Payment successful and order created",
//           orderId: order._id
//         });
//       }

//     } catch (error) {
//         console.error("Error in checkout success:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// }
import Coupon from "../models/coupons.model.js";
import Stripe from "stripe";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Product from "../models/products.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { products, couponCode } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products array is required" });
    }

    let totalAmount = 0;
    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100);
      totalAmount += amount * (product.quantity || 1);
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: product.image ? [product.image] : [],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });

    let discounts = [];
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode,
        userId,
        isActive: true,
      });
      if (coupon) {
        if (!coupon.stripeCouponId) {
          const stripeCoupon = await stripe.coupons.create({
            percent_off: coupon.discount,
            duration: "once",
          });
          coupon.stripeCouponId = stripeCoupon.id;
          await coupon.save();
        }
        discounts.push({ coupon: coupon.stripeCouponId });
        totalAmount -= Math.round((totalAmount * coupon.discount) / 100);
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase_success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase_cancel`,
      discounts,
      metadata: {
        userId,
        couponCode: couponCode || "",
      },
    });

    if (totalAmount > 20000) {
      await createNewCoupon(userId);
    }

    return res.json({ url: session.url, totalAmount: totalAmount / 100 });
  } catch (error) {
    console.error("Error in createCheckoutSession:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

async function createNewCoupon(userId) {
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discount: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId,
  });
  await newCoupon.save();
  return newCoupon;
}

export const checkoutSuccess = async (req, res) => {
  try {
    const { session_id } = req.body;
    if (!session_id)
      return res.status(400).json({ message: "session_id is required" });

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const userId = session.metadata.userId;
    const couponCode = session.metadata.couponCode;

    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode, userId },
        { isActive: false }
      );
    }

    const user = await User.findById(userId).populate("cartItems.productId");
    if (!user || !user.cartItems || user.cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Create order products with price information
    const orderProducts = user.cartItems.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    const order = new Order({
      user: userId,
      products: orderProducts,
      totalAmount: session.amount_total / 100,
      stripeSessionId: session.id,
    });

    await order.save();

    // Clear user's cart
    user.cartItems = [];
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Payment successful and order created",
      orderId: order._id,
    });
  } catch (error) {
    console.error("Error in checkoutSuccess:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId })
      .populate("products.productId", "name image price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
