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
    Banknote, 
    CreditCard,
 ChevronUp,
  Receipt,
 Smartphone,
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
        <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-gray-700 font-medium shadow-inner border border-gray-200 text-xs sm:text-base">
            <Clock size={16} className="text-teal-600" />
            <span className="capitalize hidden sm:inline">{dateStr}</span>
            <span className="mx-1 text-gray-400 hidden sm:inline">|</span>
            <span className="font-bold text-gray-900 tracking-wide">{timeStr}</span>
        </div>
    );
};

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; color: string; className?: string }> = ({ icon, title, value, color, className = "" }) => (
    <div className={`bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm sm:shadow-lg border-t-4 sm:border-t-8 ${color} flex items-center gap-3 sm:gap-6 transform hover:scale-105 transition-transform ${className}`}>
        <div className="bg-gray-100 p-2 sm:p-4 rounded-full hidden sm:block">
            {icon}
        </div>
        <div>
            <p className="text-gray-400 sm:text-gray-500 text-xs sm:text-base font-semibold">{title}</p>
            <p className="text-xl sm:text-4xl font-extrabold text-gray-800">{value}</p>
        </div>
    </div>
);

const OrderDetailRow: React.FC<{ item: OrderItem }> = ({ item }) => (
    <div className="flex justify-between items-center bg-gray-50 sm:bg-white p-2 sm:p-3 rounded-lg sm:shadow-sm text-sm sm:text-base border border-gray-100">
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
        const baseClasses = "text-[10px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-sm whitespace-nowrap";
        if (order.status === 'COMPLETED') return <span className={`bg-gray-800 text-white ${baseClasses}`}>FINALIZADO</span>;
        if (isFullyPaid) return <span className={`bg-green-100 border border-green-300 text-green-800 ${baseClasses}`}>PAGADO</span>;
        if (hasPartialPayment) return <span className={`bg-yellow-100 border border-yellow-300 text-yellow-800 ${baseClasses}`}>FALTA ${owed.toFixed(2)}</span>;
        if (order.status === 'KITCHEN_DONE') return <span className={`bg-blue-100 border border-blue-300 text-blue-800 ${baseClasses}`}>LISTO EN COCINA</span>;
        return <span className={`bg-gray-100 border border-gray-300 text-gray-700 ${baseClasses}`}>ABIERTO</span>;
    };

    return (
        <div className={`bg-white rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md border-l-4 sm:border-l-0 sm:border-t-4 ${orderTypeColor} transition-shadow hover:shadow-lg overflow-hidden`}>
            <div className="p-3 sm:p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center justify-between gap-2">
                    {/* Lado Izquierdo: Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-extrabold text-base sm:text-xl text-gray-900 truncate">
                            {order.type === 'DINE_IN' ? `Mesa ${order.tableId}` : order.customerName}
                        </h3>
                        <div className="flex flex-wrap items-center text-[11px] sm:text-sm text-gray-500 gap-x-3 gap-y-1 mt-0.5 sm:mt-1">
                            <span className="flex items-center gap-1"><Clock size={12} className="sm:w-4 sm:h-4" /> {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <span className="flex items-center gap-1 truncate max-w-[100px] sm:max-w-none"><User size={12} className="sm:w-4 sm:h-4" /> {order.waiterName}</span>
                        </div>
                    </div>
                    
                    {/* Lado Derecho: Estado y Precio */}
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                         <div className="text-right flex flex-col items-end gap-0.5 sm:gap-1">
                           {getStatusChip()}
                           <p className="font-bold text-base sm:text-2xl text-gray-800">${order.total.toFixed(2)}</p>
                         </div>
                        <ChevronDown size={20} className={`text-gray-400 transition-transform sm:w-6 sm:h-6 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className={`border-t sm:border-t-2 sm:border-dashed border-gray-200 sm:${orderTypeBgColor} p-3 sm:p-4 bg-gray-50 sm:bg-transparent`}>
                    <h4 className="font-bold mb-2 text-gray-700 text-xs sm:text-base uppercase tracking-wider sm:normal-case sm:tracking-normal">Desglose del Pedido</h4>
                    <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                        {order.items.map((item, index) => <OrderDetailRow key={`${item.id}-${index}`} item={item} />)}
                    </div>

                    <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between text-xs sm:text-sm font-medium text-gray-600 mb-1">
                            <span>Total del Pedido:</span>
                            <span>${order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm font-medium text-green-600 mb-1">
                            <span>Abonado / Pagado:</span>
                            <span>-${paidBalance.toFixed(2)}</span>
                        </div>
                        <div className="w-full h-px bg-gray-200 my-2"></div>
                        <div className="flex justify-between font-bold text-gray-900 text-base sm:text-lg">
                            <span>Resta por pagar:</span>
                            <span className={owed > 0 ? 'text-red-600' : 'text-green-600'}>
                                ${Math.max(0, owed).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end mt-3 sm:mt-4">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if(window.confirm('¿Seguro que quieres eliminar este pedido permanentemente?')) {
                                    onDelete(order.id);
                                }
                            }}
                            className="flex items-center gap-1 sm:gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs sm:text-sm py-1.5 px-3 sm:py-2 sm:px-3 rounded-lg transition-colors">
                            <Trash2 size={14} className="sm:w-4 sm:h-4" /> Eliminar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminDashboard: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [historyLogs, setHistoryLogs] = useState<DaySummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'sales' | 'inventory' | 'history'>('sales');
const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
const [paymentFilter, setPaymentFilter] = useState<'CASH' | 'CARD' | 'TRANSFER' | null>(null);

    const fetchOrders = useCallback(async () => {
        try {
            const fetchedOrders = await api.getTodaysOrders();
            setOrders(fetchedOrders.sort((a, b) => b.createdAt - a.createdAt));
            
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
        const interval = setInterval(fetchOrders, 2000); // ⚡ Cambiad de 10000 a 2000 para sincronización en tiempo real
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
                fetchOrders(); 
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
            <div className="p-3 sm:p-6 bg-gray-50 border-b border-gray-200 shadow-inner">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 max-w-7xl mx-auto">
                    {/* En celular, las ventas totales ocupan ambas columnas para resaltar */}
                    <StatCard icon={<DollarSign size={32} className="text-green-500"/>} title="Ingresos del Día" value={`$${stats.totalSales.toFixed(2)}`} color="border-green-500" className="col-span-2 md:col-span-1" />
                    <StatCard icon={<Utensils size={32} className="text-orange-500"/>} title="Mesas" value={stats.dineInCount} color="border-orange-500" />
                    <StatCard icon={<ShoppingBag size={32} className="text-purple-500"/>} title="Llevar" value={stats.takeawayCount} color="border-purple-500" />
                </div>
            </div>

            <main className="flex-1 p-3 sm:p-6 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-2 sm:space-y-4">
                    {isLoading && orders.length === 0 && <p className="text-center text-gray-500 text-sm">Cargando pedidos...</p>}
                    {error && <p className="text-center text-red-500 text-sm">{error}</p>}
                    {!isLoading && orders.length === 0 && (
                        <div className="text-center text-gray-400 py-12 sm:py-16">
                            <ClipboardList size={48} className="mx-auto mb-3 sm:mb-4 opacity-50" />
                            <h2 className="text-lg sm:text-xl font-semibold">No hay pedidos registrados hoy.</h2>
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
                <Archive size={48} className="mx-auto mb-3 text-teal-300 sm:w-16 sm:h-16" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-600">Módulo de Inventario</h2>
                <p className="max-w-md mx-auto mt-2 text-sm sm:text-base text-gray-500">Esta sección está en construcción. Aquí podrás gestionar las entradas y salidas de insumos.</p>
            </div>
        </div>
    );

    const renderHistoryContent = () => (
    <div className="flex-1 p-3 sm:p-6 bg-gray-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8">
                <CalendarDays size={24} className="text-blue-600 sm:w-8 sm:h-8" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Historial de Cortes</h2>
            </div>

            {historyLogs.length === 0 ? (
                <div className="text-center p-6 sm:p-8 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl sm:rounded-2xl mt-4">
                    <p className="text-blue-800 font-medium text-sm sm:text-lg">Aún no hay días archivados.</p>
                    <p className="text-blue-600 mt-1 sm:mt-2 text-xs sm:text-base">Presiona "Cerrar Día" para que las ventas aparezcan aquí.</p>
                </div>
            ) : (
                <div className="space-y-3 sm:space-y-4">
                    {historyLogs.map(log => {
                        const dateObj = new Date(log.endTime);
                        const dateStr = dateObj.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' });
                        const startStr = new Date(log.startTime).toLocaleTimeString('es-MX', { hour12: true, hour: '2-digit', minute: '2-digit' });
                        const endStr = dateObj.toLocaleTimeString('es-MX', { hour12: true, hour: '2-digit', minute: '2-digit' });
                        
                        const isExpanded = expandedHistoryId === log.id;
                        
                        const tCash = log.totalCash || 0;
                        const tCard = log.totalCard || 0;
                        const tTrans = log.totalTransfer || 0;
                        const archived = log.archivedOrders || [];

                        // 🔥 LÓGICA DEL FILTRO: Comparamos cada pedido para ver si tiene el método seleccionado
                        const filteredArchived = paymentFilter 
                            ? archived.filter(order => {
                                if (order.payments && order.payments.length > 0) {
                                    return order.payments.some(p => p.method === paymentFilter);
                                }
                                // Por si son pedidos muy viejos (Compatibilidad)
                                const oldMethod = order.paymentMethod || 'CASH';
                                return oldMethod === paymentFilter;
                              })
                            : archived;

                        return (
                            <div key={log.id} className={`bg-white rounded-xl sm:rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 ${isExpanded ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-300'}`}>
                                {/* CABECERA CLICKEABLE */}
                                <div 
                                    onClick={() => {
                                        setExpandedHistoryId(isExpanded ? null : log.id);
                                        setPaymentFilter(null); // Reseteamos el filtro al cambiar de día
                                        setExpandedOrderId(null);
                                    }}
                                    className="p-4 sm:p-6 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 select-none"
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className={`p-3 rounded-full hidden sm:flex transition-colors ${isExpanded ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                            <CalendarDays size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 capitalize flex items-center gap-2">
                                                Corte - {dateStr}
                                                {isExpanded ? <ChevronUp size={20} className="text-gray-400 sm:hidden"/> : <ChevronDown size={20} className="text-gray-400 sm:hidden"/>}
                                            </h3>
                                            <p className="text-gray-500 text-xs sm:text-sm mt-1 flex items-center gap-1.5">
                                                <Clock size={12} className="sm:w-3.5 sm:h-3.5"/> {startStr} - {endStr}
                                            </p>
                                            <p className="text-gray-500 text-xs sm:text-sm font-medium mt-0.5 sm:mt-1">
                                                {log.totalOrders} Pedidos completados
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <div className="flex-1 text-right bg-green-50 px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-green-100 flex sm:block justify-between items-center">
                                            <p className="text-xs sm:text-sm text-green-800 font-bold uppercase tracking-wider sm:mb-1">Total Vendido</p>
                                            <p className="text-xl sm:text-3xl font-extrabold text-green-600">${log.totalSales.toFixed(2)}</p>
                                        </div>
                                        <div className="hidden sm:block text-gray-400">
                                            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                        </div>
                                    </div>
                                </div>

                                {/* CONTENIDO EXPANDIBLE DEL DÍA */}
                                {isExpanded && (
                                    <div className="border-t border-gray-100 bg-gray-50 p-4 sm:p-6 animate-fade-in">
                                        
                                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex justify-between items-center">
                                            <span>Desglose de Caja</span>
                                            {paymentFilter && <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full border border-blue-200">Filtro Activo</span>}
                                        </h4>
                                        
                                        {/* 🔥 BOTONES DE FILTRO CON ESTILO DINÁMICO */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                                            <div 
                                                onClick={() => setPaymentFilter(prev => prev === 'CASH' ? null : 'CASH')}
                                                className={`p-4 rounded-xl border shadow-sm flex items-center gap-3 cursor-pointer transition-all ${paymentFilter === 'CASH' ? 'border-green-500 ring-2 ring-green-200 bg-green-50' : 'bg-white border-gray-200 hover:border-green-300'}`}
                                            >
                                                <div className="bg-green-100 p-2.5 rounded-full text-green-600">
                                                    <Banknote size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase">Efectivo</p>
                                                    <p className="text-lg font-black text-gray-900">${tCash.toFixed(2)}</p>
                                                </div>
                                            </div>
                                            
                                            <div 
                                                onClick={() => setPaymentFilter(prev => prev === 'CARD' ? null : 'CARD')}
                                                className={`p-4 rounded-xl border shadow-sm flex items-center gap-3 cursor-pointer transition-all ${paymentFilter === 'CARD' ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' : 'bg-white border-gray-200 hover:border-blue-300'}`}
                                            >
                                                <div className="bg-blue-100 p-2.5 rounded-full text-blue-600">
                                                    <CreditCard size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase">Tarjeta</p>
                                                    <p className="text-lg font-black text-gray-900">${tCard.toFixed(2)}</p>
                                                </div>
                                            </div>
                                            
                                            <div 
                                                onClick={() => setPaymentFilter(prev => prev === 'TRANSFER' ? null : 'TRANSFER')}
                                                className={`p-4 rounded-xl border shadow-sm flex items-center gap-3 cursor-pointer transition-all ${paymentFilter === 'TRANSFER' ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50' : 'bg-white border-gray-200 hover:border-purple-300'}`}
                                            >
                                                <div className="bg-purple-100 p-2.5 rounded-full text-purple-600">
                                                    <Smartphone size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase">Transferencia</p>
                                                    <p className="text-lg font-black text-gray-900">${tTrans.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* LISTA DE PEDIDOS FILTRADOS */}
                                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                                            Tickets del Día ({filteredArchived.length})
                                        </h4>
                                        {filteredArchived.length === 0 ? (
                                            <p className="text-sm text-gray-500 italic bg-white p-4 rounded-xl border border-gray-200">
                                                {paymentFilter ? 'No hay tickets con este método de pago.' : 'No hay detalles de pedidos guardados para este día.'}
                                            </p>
                                        ) : (
                                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                                <div className="max-h-96 overflow-y-auto">
                                                    {filteredArchived.map((order, idx) => {
                                                        const orderTime = new Date(order.createdAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
                                                        const isTakeaway = order.type === 'TAKEAWAY';
                                                        const isOrderExpanded = expandedOrderId === order.id;
                                                        
                                                        return (
                                                            <div key={order.id} className={`flex flex-col transition-colors ${idx !== filteredArchived.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                                                
                                                                <div 
                                                                    onClick={() => setExpandedOrderId(isOrderExpanded ? null : order.id)}
                                                                    className="p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-gray-50 cursor-pointer select-none"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`p-2 rounded-lg ${isTakeaway ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                                                                            <Receipt size={18} />
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-bold text-gray-800 text-sm sm:text-base flex items-center gap-2">
                                                                                {isTakeaway ? `Llevar: ${order.customerName || 'Cliente'}` : `Mesa ${order.tableId}`}
                                                                                {isOrderExpanded ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
                                                                            </p>
                                                                            <p className="text-xs text-gray-500 flex gap-2">
                                                                                <span>{orderTime}</span>
                                                                                <span>•</span>
                                                                                <span>Mesero: {order.waiterName}</span>
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="w-full sm:w-auto flex justify-between sm:justify-end items-center sm:gap-4 pl-11 sm:pl-0">
                                                                        <p className="text-xs text-gray-500 font-medium">
                                                                            {order.items.length} prod{order.items.length !== 1 ? 's' : ''}
                                                                        </p>
                                                                        <p className="font-black text-gray-900 text-lg">
                                                                            ${order.total.toFixed(2)}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {isOrderExpanded && (
                                                                    <div className="bg-slate-50 px-4 py-3 sm:px-12 pb-4 text-sm animate-fade-in border-t border-gray-100">
                                                                        <div className="space-y-2">
                                                                            {order.items.map((item, i) => (
                                                                                <div key={i} className="flex justify-between items-start border-b border-gray-200/50 pb-2 last:border-0 last:pb-0">
                                                                                    <div>
                                                                                        <p className="font-bold text-gray-800">{item.quantity}x {item.name}</p>
                                                                                        {item.notes && <p className="text-xs text-gray-500 italic ml-4 mt-0.5">- {item.notes}</p>}
                                                                                    </div>
                                                                                    <p className="font-semibold text-gray-700">${(item.price * item.quantity).toFixed(2)}</p>
                                                                                </div>
                                                                            ))}
                                                                            
                                                                            {order.payments && order.payments.length > 0 && (
                                                                                <div className="mt-4 pt-3 border-t border-dashed border-gray-300">
                                                                                    <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wide">Registro de pagos</p>
                                                                                    {order.payments.map((p, pIdx) => (
                                                                                        <div key={pIdx} className="text-xs text-gray-600 flex justify-between mb-1.5">
                                                                                            <span className="flex items-center gap-1.5 font-medium">
                                                                                                {p.method === 'CASH' && <Banknote size={12} className="text-green-600"/>}
                                                                                                {p.method === 'CARD' && <CreditCard size={12} className="text-blue-600"/>}
                                                                                                {p.method === 'TRANSFER' && <Smartphone size={12} className="text-purple-600"/>}
                                                                                                {p.method === 'CASH' ? 'Efectivo' : p.method === 'CARD' ? 'Tarjeta' : 'Transferencia'} 
                                                                                                {p.reference && <span className="text-gray-400 ml-1">({p.reference})</span>}
                                                                                            </span>
                                                                                            <span className="font-bold text-gray-800">
                                                                                                ${p.amount.toFixed(2)} 
                                                                                            </span>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
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
            <header className="bg-white p-3 sm:p-4 shadow-sm sm:shadow-md z-10 flex flex-row items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                    <ClipboardList size={24} className="text-teal-600 sm:w-8 sm:h-8" />
                    <h1 className="text-lg sm:text-3xl font-extrabold text-gray-800 hidden xs:block">Admin</h1>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-4">
                    <LiveClock />
                    
                    <div className="flex gap-1.5 sm:gap-2">
                        <button 
                            onClick={manualFetch} 
                            disabled={isLoading}
                            className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin sm:w-5 sm:h-5" /> : <RefreshCw size={14} className="sm:w-5 sm:h-5" />}
                        </button>
                        <button 
                            onClick={handleCloseDay}
                            className="flex items-center gap-1 sm:gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-2 sm:py-2 sm:px-4 rounded-lg sm:rounded-xl transition-colors shadow-sm sm:shadow-md"
                        >
                            <Power size={14} className="sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline text-sm sm:text-base">Cerrar Día</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="border-b border-gray-200 bg-white shadow-sm z-0 relative">
                <nav className="-mb-px flex gap-2 sm:gap-6 px-3 sm:px-6 overflow-x-auto hide-scrollbar" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('sales')}
                        className={`shrink-0 border-b-2 sm:border-b-4 px-2 py-3 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'sales' ? 'border-teal-500 text-teal-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        Ventas
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`shrink-0 border-b-2 sm:border-b-4 px-2 py-3 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'history' ? 'border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                        Historial
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`shrink-0 border-b-2 sm:border-b-4 px-2 py-3 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === 'inventory' ? 'border-purple-500 text-purple-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
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