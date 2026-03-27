import { useEffect, useRef, useCallback } from 'react';
import { api } from '../services/api';

/**
 * SINCRONIZACIÓN EN TIEMPO REAL para múltiples tablets
 * - Polling agresivo cada 2 segundos
 * - Funciona en APK (no necesita WebSockets)
 * - Mantiene datos sincronizados entre dispositivos
 */

export const useLiveSync = (
    onOrdersUpdated: (orders: any[]) => void,
    enabled: boolean = true
) => {
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastFetchRef = useRef<number>(0);

    const fetchOrders = useCallback(async () => {
        try {
            const now = Date.now();
            // No hacer fetch más de una vez cada 1.5 segundos
            if (now - lastFetchRef.current < 1500) return;
            
            lastFetchRef.current = now;
            const orders = await api.getActiveOrders();
            onOrdersUpdated(orders);
        } catch (error) {
            console.error('[useLiveSync] Error fetching orders:', error);
        }
    }, [onOrdersUpdated]);

    useEffect(() => {
        if (!enabled) return;

        console.log('[useLiveSync] Iniciando sincronización en tiempo real (2s interval)');

        // Fetch inmediato
        fetchOrders();

        // Polling cada 2 segundos
        pollIntervalRef.current = setInterval(fetchOrders, 2000);

        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                console.log('[useLiveSync] Sincronización detenida');
            }
        };
    }, [enabled, fetchOrders]);
};
