export interface Customer {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  qty_stock: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  id?: number;
  order_id?: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  product?: Product;
}

export interface Order {
  id?: number;
  customer_id: number;
  delivery_date: string;
  total_value: number;
  status: "pending" | "delivered" | "cancelled";
  created_at?: string;
  updated_at?: string;
  customer?: Customer;
  items?: OrderItem[];
}

export interface PaginationResponse {
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
