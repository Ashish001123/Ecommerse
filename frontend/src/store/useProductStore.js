import { create } from "zustand";
import axiosInstance from "../config/axios";
import { toast } from "react-hot-toast";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/products");
      set({ products: res.data, loading: false });
    } catch (error) {
      console.log("Failed to fetch products:", error);
      set({ loading: false });
    }
  },

  CreateProducts: async (productData) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/products", productData);
      set((state) => ({
        products: [...state.products, res.data],
        loading: false,
      }));
      toast.success("Product created successfully");
    } catch (error) {
      console.log("Failed to create product:", error);
      toast.error("Error creating product");
      set({ loading: false });
    }
  },

  getFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/products/featured");
      set({ products: res.data, loading: false });
    } catch (error) {
      console.log("Failed to fetch featured products:", error);
      set({ loading: false });
    }
  },

  fetchProductsbyCategory: async (category) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/products/category/${category}`);
      set({ products: res.data, loading: false });
    } catch (error) {
      console.log("Failed to fetch products by category:", error);
      set({ loading: false });
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/products/${productId}`);
      set((state) => ({
        products: state.products.filter((product) => product._id !== productId),
        loading: false,
      }));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log("Failed to delete product:", error);
      toast.error("Error deleting product");
      set({ loading: false });
    }
  },
  toggleFeaturedProducts: async (productId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.patch(`/products/${productId}`);
      set((state) => ({
        products: state.products.map((product) =>
          product._id === productId ? res.data.product : product
        ),
        loading: false,
      }));
      try {
        await axiosInstance.get("/products/featured");
        console.log("Featured products cache rebuilt");
      } catch (cacheError) {
        console.log("Cache rebuild failed:", cacheError);
      }

      toast.success("Featured status updated successfully");
    } catch (error) {
      console.log("Failed to toggle featured status:", error);
      toast.error("Error toggling featured status");
      set({ loading: false });
    }
  },
}));
