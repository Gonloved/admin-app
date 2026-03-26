export type Category = 'Hamburguesas' | 'Hotdogs' | 'Boneless' | 'Alitas' | 'Papas' | 'Salchichas' | 'Bebidas' | 'Tortas' | 'Extras';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
}
export interface Payment {
    method: 'CASH' | 'CARD' | 'TRANSFER';
    amount: number;
    reference?: string; // Para los 4 dígitos de la tarjeta
}

export interface OrderItem extends Product {
  quantity: number;
  notes?: string;
  round?: number;    // <--- AGREGAR ESTO (Ronda de pedidor)
}
export interface Order {
    id: string;
    type: 'DINE_IN' | 'TAKEAWAY';
    status: 'OPEN' | 'KITCHEN_DONE' | 'COMPLETED';
    items: OrderItem[];
    total: number;
    createdAt: number;
    tableId?: string;
    customerName?: string;
    waiterName: string;
    paidBalance?: number; 
    paymentMethod?: string; 
    payments?: Payment[]; // 🔥 NUEVO: La lista de pagos divididos
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
    // 🔥 NUEVOS CAMPOS QUE MANDARÁ PYTHON
    totalCash: number;      
    totalCard: number;      
    totalTransfer: number;  
    archivedOrders: Order[]; // El paquete con todos los pedidos de ese día
}