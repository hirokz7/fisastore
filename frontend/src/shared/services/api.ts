import axios from "axios";
import { Customer, Order, Product, PaginationResponse } from "../types";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

export const apiService = {
  // Customers
  getCustomers: () => api.get<Customer[]>("/customers"),
  createCustomer: (customer: Partial<Customer>) =>
    api.post<Customer>("/customers", customer),

  // Products
  getProducts: async (page: number = 1): Promise<PaginationResponse> => {
    const response = await api.get(`/products?page=${page}`);
    return response.data;
  },
  getProduct: (id: number) => api.get<Product>(`/products/${id}`),

  // Orders
  getOrders: () => api.get<Order[]>("/orders"),
  getOrder: (id: number) => api.get<Order>(`/orders/${id}`),
  createOrder: (order: Partial<Order>) => api.post<Order>("/orders", order),
  updateOrder: (id: number, order: Partial<Order>) =>
    api.put<Order>(`/orders/${id}`, order),
  deleteOrder: (id: number) => api.delete(`/orders/${id}`),
};

export default api;
