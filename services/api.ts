import { Order, Table, Waiter, DaySummary } from '../types';
import { INITIAL_TABLES, WAITERS } from '../constants';

const API_URL = 'https://restaurante-backend-ys2q.onrender.com';

export const api = {
    // --- 1. DATOS LOCALES (Fakes para velocidad en presentación) ---
    getWaiters: async (): Promise<Waiter[]> => Promise.resolve(WAITERS),
    
    getTables: async (): Promise<Table[]> => INITIAL_TABLES, // Siempre mesas locales para evitar lag
    
    saveTables: async (tables: Table[]): Promise<void> => {
        localStorage.setItem('pos_tables', JSON.stringify(tables));
        return Promise.resolve();
    },

    checkLicense: async (): Promise<boolean> => false, // Licencia siempre activa

    // --- 2. PEDIDOS ACTIVOS (Meseros y Cocina) ---
    getActiveOrders: async (): Promise<Order[]> => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 seg de espera
            const response = await fetch(`${API_URL}/orders?t=${Date.now()}`, { signal: controller.signal });
            clearTimeout(timeoutId);
            return await response.json();
        } catch (error) {
            return [];
        }
    },

    // --- 3. ADMINISTRACIÓN (Admin Dashboard) ---
    getTodaysOrders: async (): Promise<Order[]> => {
        try {
            const response = await fetch(`${API_URL}/orders/all`);
            return await response.json();
        } catch (error) {
            return [];
        }
    },

    getHistory: async (): Promise<DaySummary[]> => {
        try {
            const response = await fetch(`${API_URL}/history`);
            return await response.json();
        } catch (error) {
            return [];
        }
    },

    // --- 4. ACCIONES (Escritura) ---
    createOrder: async (order: Order): Promise<void> => {
        await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order),
        });
    },

    completeKitchenOrder: async (orderId: string): Promise<void> => {
        await fetch(`${API_URL}/orders/${orderId}/complete`, { method: 'POST' });
    },

    deleteOrder: async (orderId: string): Promise<void> => {
        await fetch(`${API_URL}/orders/${orderId}`, { method: 'DELETE' });
    },

    closeDay: async (): Promise<void> => {
        await fetch(`${API_URL}/close-day`, { method: 'POST' });
    },

    // --- COMPATIBILIDAD ---
    getOrderHistory: async (): Promise<Order[]> => api.getTodaysOrders(),
    setKitchenEstimate: async () => Promise.resolve(),
    saveActiveOrders: async () => Promise.resolve(),
    saveOrderHistory: async () => Promise.resolve()
};