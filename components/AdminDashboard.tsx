import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Order, OrderItem, DaySummary } from '../types';
import { api } from '../services/api';
import { 
    DollarSign, 
    ShoppingBag, 
    Utensils, 
    Clock, 
    User, 
    ChevronDown, 
    Trash2, 
    ClipboardList,
    RefreshCw,
    Loader2,
    Power,
    Archive,
    CalendarDays
} from 'lucide-react';

const LiveClock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const dateStr = time.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' });
    const timeStr = time.toLocaleTimeString('es-MX', { hour12: true });

    return (
        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl text-gray-700 font-medium shadow-inner border border-gray-200">
            <Clock size={18} className="text-teal-600" />
            <span className="capitalize">{dateStr}</span>
            <span className="mx-1 text-gray-400">|</span>
            <span className="font-bold text-gray-900 tracking-wide">{timeStr}</span>
        </div>
    );
};

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; color: string }> = ({ icon, title, value, color }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-lg border-t-8 ${color} flex items-center gap-6 transform hover:scale-105 transition-transform`}>
        <div className="bg-gray-100 p-4 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-gray-500 font-semibold">{title}</p>
            <p className="text-4xl font-extrabold text-gray-800">{value}</p>
        </div>
    </div>
);

const OrderDetailRow: React.FC<{ item: OrderItem }> = ({ item }) => (
    <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
        <div>
            <p className="font-bold text-gray-800">{item.name} <span className="font-normal text-gray-500">x{item.quantity}</span></p>
            {item.notes && <p className="text-xs text-gray-500 italic">Notas: {item.notes}</p>}
        </div>
        <p className="font-semibold text-gray-700">${(item.price * item.quantity).toFixed(2)}</p>
    </div>
);

const OrderAdminCard: React.FC<{ order: Order; onDelete: (orderId: string) => void; }> = ({ order, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const orderTypeColor = order.type === 'DINE_IN' ? 'border-orange-500' : 'border-purple-500';
    const orderTypeBgColor = order.type === 'DINE_IN' ? 'bg-orange-50' : 'bg-purple-50';

    const paidBalance = order.paidBalance || 0;
    const owed = order.total - paidBalance;
    const isFullyPaid = owed <= 0 && order.total > 0;
    const hasPartialPayment = paidBalance > 0 && owed > 0;

    const getStatusChip = () => {
        if (order.status === 'COMPLETED') return <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">FINALIZADO</span>;
        if (isFullyPaid) return <span className="bg-green-100 border border-green-300 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">PAGADO</span>;
        if (hasPartialPayment) return <span className="bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">FALTA ${owed.toFixed(2)}</span>;
        if (order.status === 'KITCHEN_DONE') return <span className="bg-blue-100 border border-blue-300 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">LISTO EN COCINA</span>;
        return <span className="bg-gray-100 border border-gray-300 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">ABIERTO</span>;
    };

    return (
        <div className={`bg-white rounded-2xl shadow-md border-t-4 ${orderTypeColor} transition-shadow hover:shadow-xl`}>
            <div className="p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-2 sm:mb-0">
                        <h3 className="font-extrabold text-xl text-gray-900">
                            {order.type === 'DINE_IN' ? `Mesa ${order.tableId}` : order.customerName}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 gap-4 mt-1">
                            <span className="flex items-center gap-1"><Clock size={14} /> {new Date(order.createdAt).toLocaleTimeString()}</span>
                            <span className="flex items-center gap-1"><User size={14} /> {order.waiterName}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 justify-between">
                         <div className="text-right flex flex-col items-end gap-1">
                           {getStatusChip()}
                           <p className="font-bold text-2xl text-gray-800 mt-1">${order.total.toFixed(2)}</p>
                         </div>
                        <ChevronDown size={24} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className={`border-t-2 border-dashed ${orderTypeBgColor} p-4`}>
                    <h4 className="font-bold mb-2 text-gray-700">Desglose del Pedido:</h4>
                    <div className="space-y-2 mb-4">
                        {order.items.map((item, index) => <OrderDetailRow key={`${item.id}-${index}`} item={item} />)}
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                            <span>Total del Pedido:</span>
                            <span>${order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium text-green-600 mb-1">
                            <span>Abonado / Pagado:</span>
                            <span>-${paidBalance.toFixed(2)}</span>
                        </div>
                        <div className="w-full h-px bg-gray-200 my-2"></div>
                        <div className="flex justify-between font-bold text-gray-900 text-lg">
                            <span>Resta por pagar:</span>
                            <span className={owed > 0 ? 'text-red-600' : 'text-green-600'}>
                                ${Math.max(0, owed).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if(window.confirm('¿Seguro que quieres eliminar este pedido permanentemente?')) {
                                    onDelete(order.id);
                                }
                            }}
                            className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-sm py-2 px-3 rounded-lg transition-colors">
                            <Trash2 size={16} /> Eliminar Pedido
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminDashboard: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [historyLogs, setHistoryLogs] = useState<DaySummary[]>([]); // La bóveda del historial
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'sales' | 'inventory' | 'history'>('sales');

    const fetchOrders = useCallback(async () => {
        try {
            const fetchedOrders = await api.getTodaysOrders();
            setOrders(fetchedOrders.sort((a, b) => b.createdAt - a.createdAt));
            
            // Descargamos el historial
            const fetchedHistory = await api.getHistory();
            setHistoryLogs(fetchedHistory);
            
            setError(null);
        } catch (err) {
            setError("No se pudieron cargar los datos.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const manualFetch = () => {
        setIsLoading(true);
        fetchOrders();
    }

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000); 
        return () => clearInterval(interval);
    }, [fetchOrders]);
    
    const handleDeleteOrder = async (orderId: string) => {
        try {
            await api.deleteOrder(orderId);
            fetchOrders(); 
        } catch(e) {
            console.error("Failed to delete order", e);
            alert("Error al eliminar el pedido.");
        }
    };

    const handleCloseDay = async () => {
        if (window.confirm("¿Estás seguro de que quieres CERRAR EL DÍA? Los pedidos actuales se archivarán en el historial y la pantalla quedará limpia.")) {
            try {
                await api.closeDay();
                alert("El corte de caja se realizó correctamente. Los pedidos se han archivado.");
                fetchOrders(); // Esto recarga la pantalla y trae el nuevo historial
            } catch (e) {
                console.error("Failed to close day", e);
                alert("Error al cerrar el día.");
            }
        }
    };

    const stats = useMemo(() => {
        const totalSales = orders.reduce((sum, order) => sum + (order.paidBalance || 0), 0); 
        const dineInCount = orders.filter(o => o.type === 'DINE_IN').length;
        const takeawayCount = orders.filter(o => o.type === 'TAKEAWAY').length;
        return { totalSales, dineInCount, takeawayCount };
    }, [orders]);

    const renderSalesContent = () => (
        <>
            <div className="p-6 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    <StatCard icon={<DollarSign size={40} className="text-green-500"/>} title="Ingresos del Día" value={`$${stats.totalSales.toFixed(2)}`} color="border-green-500" />
                    <StatCard icon={<Utensils size={40} className="text-orange-500"/>} title="Pedidos Restaurante" value={stats.dineInCount} color="border-orange-500" />
                    <StatCard icon={<ShoppingBag size={40} className="text-purple-500"/>} title="Pedidos Para Llevar" value={stats.takeawayCount} color="border-purple-500" />
                </div>
            </div>

            <main className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-4">
                    {isLoading && orders.length === 0 && <p className="text-center text-gray-500">Cargando pedidos...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {!isLoading && orders.length === 0 && (
                        <div className="text-center text-gray-400 py-16">
                            <ClipboardList size={64} className="mx-auto mb-4" />
                            <h2 className="text-xl font-semibold">No hay pedidos registrados hoy.</h2>
                        </div>
                    )}
                    {orders.map(order => (
                        <OrderAdminCard key={order.id} order={order} onDelete={handleDeleteOrder} />
                    ))}
                </div>
            </main>
        </>
    );

    const renderInventoryContent = () => (
        <div className="flex-1 flex items-center justify-center text-center text-gray-400 p-6">
            <div>
                <Archive size={64} className="mx-auto mb-4 text-teal-300" />
                <h2 className="text-2xl font-bold text-gray-600">Módulo de Inventario</h2>
                <p className="max-w-md mx-auto mt-2 text-gray-500">Esta sección está en construcción. Aquí podrás gestionar las entradas y salidas de insumos de tu restaurante.</p>
            </div>
        </div>
    );

    // 🔥 EL NUEVO HISTORIAL YA CONECTADO 🔥
    const renderHistoryContent = () => (
        <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <CalendarDays size={32} className="text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-800">Historial de Cortes de Caja</h2>
                </div>

                {historyLogs.length === 0 ? (
                    <div className="text-center p-8 bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl mt-6">
                        <p className="text-blue-800 font-medium text-lg">
                            Aún no hay días archivados. 
                        </p>
                        <p className="text-blue-600 mt-2">
                            Asegúrate de tener ventas registradas en "Ventas del Día" y presiona "Cerrar Día" para que aparezcan aquí.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {historyLogs.map(log => {
                            const dateObj = new Date(log.endTime);
                            const dateStr = dateObj.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                            const startStr = new Date(log.startTime).toLocaleTimeString('es-MX', { hour12: true, hour: '2-digit', minute: '2-digit' });
                            const endStr = dateObj.toLocaleTimeString('es-MX', { hour12: true, hour: '2-digit', minute: '2-digit' });

                            return (
                                <div key={log.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 capitalize">Corte - {dateStr}</h3>
                                            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                                                <Clock size={14}/> Inicio: {startStr} - Cierre: {endStr}
                                            </p>
                                            <p className="text-gray-500 text-sm font-medium mt-1">Total Pedidos Completados: {log.totalOrders}</p>
                                        </div>
                                        <div className="text-right w-full sm:w-auto bg-green-50 px-4 py-3 rounded-xl border border-green-100">
                                            <p className="text-sm text-green-800 font-bold uppercase tracking-wider mb-1">Total Vendido</p>
                                            <p className="text-3xl font-extrabold text-green-600">${log.totalSales.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="h-screen bg-gray-100 flex flex-col">
            <header className="bg-white p-4 shadow-md z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <ClipboardList size={32} className="text-teal-600" />
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">Panel de Administración</h1>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <LiveClock />
                    
                    <div className="flex gap-2">
                        <button 
                            onClick={manualFetch} 
                            disabled={isLoading}
                            className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors disabled:opacity-50"
                            title="Actualizar Pedidos"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                        </button>
                        <button 
                            onClick={handleCloseDay}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition-colors shadow-md"
                        >
                            <Power size={18} />
                            <span className="hidden sm:inline">Cerrar Día</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="border-b border-gray-200 bg-white shadow-sm z-0 relative">
                <nav className="-mb-px flex gap-6 px-6 overflow-x-auto" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('sales')}
                        className={`shrink-0 border-b-4 px-2 py-4 text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'sales' ? 'border-teal-500 text-teal-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                        Ventas del Día
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`shrink-0 border-b-4 px-2 py-4 text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'history' ? 'border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                        Historial
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`shrink-0 border-b-4 px-2 py-4 text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'inventory' ? 'border-purple-500 text-purple-700' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                        Inventario
                    </button>
                </nav>
            </div>

            {activeTab === 'sales' && renderSalesContent()}
            {activeTab === 'history' && renderHistoryContent()}
            {activeTab === 'inventory' && renderInventoryContent()}
        </div>
    );
};

export default AdminDashboard;