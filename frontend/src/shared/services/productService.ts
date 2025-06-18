import api from "../config/axios";
import { Product } from "../types";

export const productService = {
  getProducts: () => api.get<Product[]>("/products"),
  getProduct: (id: number) => api.get<Product>(`/products/${id}`),
  updateProduct: (id: number, product: Partial<Product>) =>
    api.put<Product>(`/products/${id}`, product),
};
