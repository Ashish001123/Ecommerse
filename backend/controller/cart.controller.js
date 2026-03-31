// import Product from "../models/products.model.js";

// export const getCartProducts = async (req, res) => {
//   try {
//     const user = req.user;
//     if (!user || !Array.isArray(user.cartItems) || user.cartItems.length === 0) {
//       return res.json([]);
//     }

//     const productIds = user.cartItems.map((item) => item.productId);
//     const products = await Product.find({ _id: { $in: productIds } });

//     const cartItems = products.map((product) => {
//       const item = user.cartItems.find(
//         (ci) => ci.productId.toString() === product._id.toString()
//       );
//       return {
//         ...product.toObject(),
//         quantity: item ? item.quantity : 0,
//       };
//     });

//     return res.json(cartItems);
//   } catch (error) {
//     console.error("Error fetching cart items:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const addToCart = async (req, res) => {
//   try {
//     const { productId } = req.body;
//     const user = req.user;

//     let cart = await prisma.cart.findUnique({
// export const addToCart = async (req, res) => {
//   try {
//     const { productId } = req.body;
//     const user = req.user;

//     if (!productId) {
//       return res.status(400).json({ message: "productId is required" });
//     }
//     if (!user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     if (!Array.isArray(user.cartItems)) {
//       user.cartItems = [];
//     }
//     user.cartItems = user.cartItems.filter((item) => item && item.productId);

//     const existingItem = user.cartItems.find(
//       (item) => item.productId.toString() === productId
//     );
//     if (existingItem) {
//       existingItem.quantity += 1;
//     } else {
//       user.cartItems.push({ productId, quantity: 1 });
//     }
//     await user.save();
//     res.json(user.cartItems);
//   } catch (error) {
//     console.error("Error adding to cart:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
//       user.cartItems = [];
//     } else {
//       user.cartItems = user.cartItems.filter(
//         (item) => item.productId.toString() !== productId
//       );
//     }
//     await user.save();
//     res.json(user.cartItems);
//   } catch (error) {
//     console.error("Error removing from cart:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const updateQuantity = async (req, res) => {
//   try {
//     const { id: productId } = req.params;
//     const { quantity } = req.body;
//     const user = req.user;
//     const existingItem = user.cartItems.find(
//       (item) => item.productId.toString() === productId
//     );
//     if (existingItem) {
//       if (quantity === 0) {
//         user.cartItems = user.cartItems.filter(
//           (item) => item.productId.toString() !== productId
//         );
//         await user.save();
//         return res.json(user.cartItems);
//       }
//       existingItem.quantity = quantity;
//       await user.save();
//       res.json(user.cartItems);
//     } else {
//       return res.status(404).json({ message: "Product not found in cart" });
//     }
//   } catch (error) {
//     console.error("Error updating cart item quantity:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };





import Product from "../models/products.model.js";

/**
 * 🛒 Get Cart Products
 */
export const getCartProducts = async (req, res) => {
  try {
    const user = req.user;

    if (!user || !Array.isArray(user.cartItems) || user.cartItems.length === 0) {
      return res.json([]);
    }

    const productIds = user.cartItems.map((item) => item.productId);

    const products = await Product.find({
      _id: { $in: productIds },
    });

    const cartItems = products.map((product) => {
      const item = user.cartItems.find(
        (ci) => ci.productId.toString() === product._id.toString()
      );

      return {
        ...product.toObject(),
        quantity: item ? item.quantity : 0,
      };
    });

    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ➕ Add to Cart
 */
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!Array.isArray(user.cartItems)) {
      user.cartItems = [];
    }

    // Clean invalid items
    user.cartItems = user.cartItems.filter(
      (item) => item && item.productId
    );

    const existingItem = user.cartItems.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push({ productId, quantity: 1 });
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ❌ Remove from Cart
 */
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!Array.isArray(user.cartItems)) {
      user.cartItems = [];
    }

    user.cartItems = user.cartItems.filter(
      (item) => item.productId.toString() !== productId
    );

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * 🔄 Update Quantity
 */
export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingItem = user.cartItems.find(
      (item) => item.productId.toString() === productId
    );

    if (!existingItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (quantity <= 0) {
      user.cartItems = user.cartItems.filter(
        (item) => item.productId.toString() !== productId
      );
    } else {
      existingItem.quantity = quantity;
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};