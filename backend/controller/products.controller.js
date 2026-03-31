import Product from "../models/products.model.js";
import redis from "../config/redis.js";
import cloudinary from "../config/cloduinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.status(200).json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.status(200).json(JSON.parse(featuredProducts));
    }

    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    await redis.set(
      "featured_products",
      JSON.stringify(featuredProducts),
      "EX",
      3600
    );

    res.json(featuredProducts);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Product image is required" });
    }
    const upload = await cloudinary.uploader.upload(image, {
      folder: "products",
    });
    const imageUrl = upload.secure_url;

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      imageUrl,
      category,
    });
    await product.save();
    if (redis) {
      await redis.del("featured_products");
    }

    return res
      .status(201)
      .json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error creating product:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.imageUrl) {
      const publicId = product.imageUrl.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("");
      } catch (error) {}
    }
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).lean();
    return res.status(200).json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category }).lean();
    return res.status(200).json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};




export const toggleFeaturedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    if (redis) {
      await redis.del("featured_products");
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Toggle featured error:", error);
    return res.status(500).json({
      message: "Failed to toggle featured product",
    });
  }
}
