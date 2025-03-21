
export interface OrderFormData {
  id: string;
  client_id: string;
  order_number: string;
  product_name: string;
  quantity: string;
  price: string;
  status: string;
}

export interface OrderFilters {
  status: string;
  dateFrom: Date | null;
  dateTo: Date | null;
}

export interface Order {
  id: string;
  client_id: string;
  order_number: string;
  product_name: string;
  quantity: number;
  price: number;
  status: string;
  created_at: string;
  client: {
    id: string;
    first_name: string;
    last_name: string;
    company: string | null;
  };
}

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  company: string | null;
}
