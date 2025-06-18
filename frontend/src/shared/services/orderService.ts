import api from "../config/axios";
import { Order } from "../types";
import { OrderFormSubmitData } from "../../features/orders/types/form";

export const orderService = {
  createOrder: (order: OrderFormSubmitData) =>
    api.post<Order>("/orders", order),
  updateOrder: (id: number, order: Partial<Order>) =>
    api.put<Order>(`/orders/${id}`, order),
  deleteOrder: (id: number) => api.delete(`/orders/${id}`),
};
