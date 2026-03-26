import { Order, Table, Waiter, DaySummary } from '../types';
import { INITIAL_TABLES, WAITERS } from '../constants';

const API_URL = 'https://restaurante-backend-ys2q.onrender.com';

// DEBUG: Log inicial para verificar configuración
console.log('[API] API_URL configurada:', API_URL);
console.log('[API] Ambiente:', typeof window !== 'undefined' ? 'browser' : 'node');

// Helper para logging detallado
const logRequest = (method: string, endpoint: string, status?: number, error?: unknown) => {
    const url = `${API_URL}${endpoint}`;
    const timestamp = new Date().toISOString();
    if (error) {
        console.error(`[API] ${timestamp} ${method} ${url} - ERROR:`, error);
    } else if (status) {
        console.log(`[API] ${timestamp} ${method} ${url} - Status: ${status}`);
    } else {
        console.log(`[API] ${timestamp} ${method} ${url} - En progreso...`);
    }
};

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
            logRequest('GET', '/orders?t=' + Date.now());
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 seg de espera
            const response = await fetch(`${API_URL}/orders?t=${Date.now()}`, { signal: controller.signal });
            clearTimeout(timeoutId);
            logRequest('GET', '/orders', response.status);
            return await response.json();
        } catch (error) {
            logRequest('GET', '/orders', undefined, error);
            return [];
        }
    },

    // --- 3. ADMINISTRACIÓN (Admin Dashboard) ---
    getTodaysOrders: async (): Promise<Order[]> => {
        try {
            logRequest('GET', '/orders/all');
            const response = await fetch(`${API_URL}/orders/all`);
            logRequest('GET', '/orders/all', response.status);
            return await response.json();
        } catch (error) {
            logRequest('GET', '/orders/all', undefined, error);
            return [];
        }
    },

    getHistory: async (): Promise<DaySummary[]> => {
        try {
            logRequest('GET', '/history');
            const response = await fetch(`${API_URL}/history`);
            logRequest('GET', '/history', response.status);
            return await response.json();
        } catch (error) {
            logRequest('GET', '/history', undefined, error);
            return [];
        }
    },

    // --- 4. ACCIONES (Escritura) ---
    createOrder: async (order: Order): Promise<void> => {
        try {
            logRequest('POST', '/orders');
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order),
            });
            logRequest('POST', '/orders', response.status);
        } catch (error) {
            logRequest('POST', '/orders', undefined, error);
        }
    },

    completeKitchenOrder: async (orderId: string): Promise<void> => {
        try {
            logRequest('POST', `/orders/${orderId}/complete`);
            const response = await fetch(`${API_URL}/orders/${orderId}/complete`, { method: 'POST' });
            logRequest('POST', `/orders/${orderId}/complete`, response.status);
        } catch (error) {
            logRequest('POST', `/orders/${orderId}/complete`, undefined, error);
        }
    },

    deleteOrder: async (orderId: string): Promise<void> => {
        try {
            logRequest('DELETE', `/orders/${orderId}`);
            const response = await fetch(`${API_URL}/orders/${orderId}`, { method: 'DELETE' });
            logRequest('DELETE', `/orders/${orderId}`, response.status);
        } catch (error) {
            logRequest('DELETE', `/orders/${orderId}`, undefined, error);
        }
    },

    closeDay: async (): Promise<void> => {
        try {
            logRequest('POST', '/close-day');
            const response = await fetch(`${API_URL}/close-day`, { method: 'POST' });
            logRequest('POST', '/close-day', response.status);
        } catch (error) {
            logRequest('POST', '/close-day', undefined, error);
        }
    },

    // --- COMPATIBILIDAD ---
    getOrderHistory: async (): Promise<Order[]> => api.getTodaysOrders(),
    setKitchenEstimate: async () => Promise.resolve(),
    saveActiveOrders: async () => Promise.resolve(),
    saveOrderHistory: async () => Promise.resolve()
};