import { Order, OrderItem } from "../../../shared/types";

export interface OrderFormItem {
  product_id: number;
  quantity: number;
}

export interface OrderFormValues {
  customer_name: string;
  delivery_date: string;
  items: OrderFormItem[];
}

export interface OrderFormSubmitData {
  customer_name: string;
  delivery_date: string;
  items: OrderItem[];
  total_value: number;
  status: Order["status"];
}
