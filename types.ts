export type Category = 'Hamburguesas' | 'Hotdogs' | 'Superburros' | 'Boneless' | 'Alitas' | 'Papas' | 'Salchichas' | 'Bebidas';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
}

export interface OrderItem extends Product {
  quantity: number;
  notes?: string;
  round?: number;    // <--- AGREGAR ESTO (Ronda de pedidor)
}
export interface Order {
  id: string; 
  type: 'DINE_IN' | 'TAKEAWAY';
  items: OrderItem[];
  total: number;
  status: 'OPEN' | 'COMPLETED' | 'KITCHEN_DONE';
  paymentStatus: 'PAID' | 'UNPAID';
  waiterName: string;
  customerName?: string; 
  tableId?: number; 
  createdAt: number;
  kitchenEstimate?: number; 
  // --- ESTOS DOS SON NUEVOS ---
  amountPaid?: number;
  change?: number;
  paidBalance?: number; // <--- NUEVO
}

export interface Table {
  id: number;
  label: string;
  status: 'AVAILABLE' | 'OCCUPIED';
  currentOrderId?: string | null;
  waiterName?: string; // Name of the waiter who opened the table
}

export interface Waiter {
    id: string;
    name: string;
    pin: string;
}

export enum ViewMode {
  LOGIN = 'LOGIN',
  EMPLOYEE_SELECT = 'EMPLOYEE_SELECT',
  TABLES = 'TABLES',
  TAKEAWAY = 'TAKEAWAY',
  ORDER_PAD = 'ORDER_PAD'
}

export interface DaySummary {
  id: string;
  startTime: number;
  endTime: number;
  totalOrders: number;
  totalSales: number;
}