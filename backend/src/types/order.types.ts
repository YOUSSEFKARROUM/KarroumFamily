export interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  city: string;
  notes?: string;
  items: OrderItemRequest[];
  deliveryDate?: string;
  deliveryTime?: string;
  userId?: string;
}

export interface OrderItemRequest {
  productId: string;
  quantity: number;
  price: number;
}

export interface OrderStatusUpdate {
  status: string;
  notes?: string;
}