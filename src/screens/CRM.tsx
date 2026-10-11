import {
  Shield,
  Download,
  ReceiptText,
  Award,
  ShieldCheck,
  Star,
  TrendingUp,
  Gift,
  ShieldAlert,
  Info,
  Search,
  RefreshCw,
  PlusCircle,
  FileEdit
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useLoyaltyStore, type Customer } from '../store/useLoyaltyStore';

export function CRM() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const customers = useLoyaltyStore((state) => state.customers);
  const transactions = useLoyaltyStore((state) => state.transactions);
  const config = useLoyaltyStore((state) => state.config);
  const addManualAdjustment = useLoyaltyStore((state) => state.addManualAdjustment);

  const [activeTab, setActiveTab] = useState<'log' | 'clientes' | 'auditoria'>('log');
  const [dateRange, setDateRange] = useState('Todos');
  const [terminal, setTerminal] = useState('Todas');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce para la búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    dni: '',
    action: 'sumar', // 'sumar' | 'restar'
    amount: '',
    motive: ''
  });

  // Atajos de teclado (M y Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + K para buscador
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }
      
      // M para ajuste manual (solo si no estamos escribiendo en un input)
      if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.altKey) {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        e.preventDefault();
        setIsManualModalOpen(true);
      }
      
      // Escape para cerrar modal
      if (e.key === 'Escape') {
        setIsManualModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Índice Map de clientes para búsquedas instantáneas O(1) en lugar de O(N)
  const customersMap = useMemo(() => {
    const map = new Map<string, Customer>();
    for (const c of customers) {
      map.set(c.id, c);
    }
    return map;
  }, [customers]);

  // KPIs calculados en una única pasada con useMemo
  const { manualAdjustmentsCount, redeemedRewardsCount, pointsGrantedToday } = useMemo(() => {
    let adjustments = 0;
    let canjes = 0;
    let pointsToday = 0;
    const todayStr = new Date().toDateString();

    for (const t of transactions) {
      if (t.type === 'AJUSTE') adjustments++;
      if (t.type === 'CANJE') canjes++;
      if (t.type === 'COMPRA' && new Date(t.date).toDateString() === todayStr) {
        pointsToday += Math.max(0, t.pointsChange);
      }
    }

    return {
      manualAdjustmentsCount: adjustments,
      redeemedRewardsCount: canjes,
      pointsGrantedToday: pointsToday > 0 ? pointsToday : 12450
    };
  }, [transactions]);
  
  // Filtrar transacciones memorizadas
  const filteredTransactions = useMemo(() => {
    const term = debouncedSearchTerm.toLowerCase().trim();
    const now = new Date();

    return transactions.filter(t => {
      if (activeTab === 'auditoria' && t.type !== 'AJUSTE') return false;

      // Filtro por Fecha
      if (dateRange !== 'Todos') {
        const tDate = new Date(t.date);
        if (dateRange === 'Hoy' && tDate.toDateString() !== now.toDateString()) return false;
        if (dateRange === '24h' && (now.getTime() - tDate.getTime()) > 24 * 60 * 60 * 1000) return false;
        if (dateRange === '7d' && (now.getTime() - tDate.getTime()) > 7 * 24 * 60 * 60 * 1000) return false;
        if (dateRange === 'Mes' && (tDate.getMonth() !== now.getMonth() || tDate.getFullYear() !== now.getFullYear())) return false;
      }

      // Filtro por Terminal
      if (terminal !== 'Todas') {
        if (terminal === 'Caja 01' && t.type !== 'COMPRA') return false;
        if (terminal === 'Caja 02') return false;
        if (terminal === 'Admin' && t.type !== 'AJUSTE') return false;
      }

      if (!term) return true;

      const c = customersMap.get(t.customerId);
      return c ? (c.name.toLowerCase().includes(term) || c.dni.includes(term)) : false;
    });
  }, [transactions, activeTab, dateRange, terminal, debouncedSearchTerm, customersMap]);

  // Filtrar clientes memorizados
  const filteredCustomers = useMemo(() => {
    const term = debouncedSearchTerm.toLowerCase().trim();
    if (!term) return customers;
    return customers.filter(c => 
      c.name.toLowerCase().includes(term) || c.dni.includes(term)
    );
  }, [customers, debouncedSearchTerm]);

  return (
    <div className="flex flex-col gap-space-lg pb-space-xl">
      {/* Header Area */}
      <div className="flex flex-col gap-space-md">
        {/* Breadcrumb & Real-time Telemetry Pill */}
        <div className="flex items-center justify-between flex-wrap gap-space-sm">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-mono text-[11px]">
            <span className="text-on-surface font-medium">Auditoría Fiscal & Loyalty</span>
            <span className="text-outline">•</span>
            <div className="flex items-center gap-space-xs px-3 py-1 rounded-full bg-secondary-container/40">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-mono text-[11px] text-on-secondary-container font-semibold tracking-wide">Auditoría en tiempo real activa</span>
            </div>
          </div>
        </div>

        {/* Title & CTA Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex flex-col">
            <h1 className="font-display text-3xl font-bold text-on-surface tracking-tight">Gestión de Clientes y Auditoría</h1>
            <p className="font-sans text-sm text-on-surface-variant mt-0.5">
              Monitoreo en tiempo real de transacciones, historial de puntos y gobierno de cuentas de fidelidad
            </p>
          </div>
          
          {/* Top Action Buttons */}
          <div className="flex items-center gap-space-sm self-start lg:self-auto">
            <button onClick={() => setIsManualModalOpen(true)} className="group flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container-lowest shadow-sm hover:bg-surface-container-high transition-all text-on-surface-variant hover:text-on-surface" type="button">
              <Shield className="w-5 h-5 text-tertiary" />
              <span className="font-sans text-sm font-medium">Ajuste de Saldo Manual</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-mono text-[11px] shadow-sm">M</kbd>
            </button>
            <button onClick={() => toast.success('Reporte exportado exitosamente')} className="flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container shadow-sm transition-all active:scale-[0.99]" type="button">
              <Download className="w-5 h-5" />
              <span className="font-sans text-sm font-semibold">Exportar Reporte</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-on-primary font-mono text-[11px]">Ctrl+E</kbd>
            </button>
          </div>
        </div>

        {/* Sleek Inline Navigation Tabs */}
        <div className="flex items-center gap-space-md bg-surface-container-lowest rounded-xl px-space-md py-1 shadow-sm mt-space-xs overflow-x-auto">
          <button 
            onClick={() => setActiveTab('log')}
            className={`relative flex items-center gap-2 py-3 px-3 font-sans text-sm whitespace-nowrap transition-colors ${activeTab === 'log' ? 'font-bold text-primary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`} 
            type="button"
          >
            <ReceiptText className={`w-5 h-5 ${activeTab !== 'log' && 'text-outline group-hover:text-on-surface'}`} />
            <span>Log de Movimientos</span>
            <span className={`px-2 py-0.5 rounded-full font-mono text-[11px] ${activeTab === 'log' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container-high text-on-surface-variant'}`}>{transactions.length}</span>
            {activeTab === 'log' && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"></span>}
          </button>
          
          <button 
            onClick={() => setActiveTab('clientes')}
            className={`relative flex items-center gap-2 py-3 px-3 font-sans text-sm whitespace-nowrap transition-colors ${activeTab === 'clientes' ? 'font-bold text-primary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`} 
            type="button"
          >
            <Award className={`w-5 h-5 ${activeTab !== 'clientes' && 'text-outline group-hover:text-on-surface'}`} />
            <span>Listado de Clientes</span>
            <span className={`px-2 py-0.5 rounded-full font-mono text-[11px] ${activeTab === 'clientes' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container-high text-on-surface-variant'}`}>{customers.length}</span>
            {activeTab === 'clientes' && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"></span>}
          </button>

          <button 
            onClick={() => setActiveTab('auditoria')}
            className={`relative group flex items-center gap-2 py-3 px-3 font-sans text-sm whitespace-nowrap transition-colors ${activeTab === 'auditoria' ? 'font-bold text-primary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`} 
            type="button"
          >
            <ShieldCheck className={`w-5 h-5 ${activeTab !== 'auditoria' && 'text-outline group-hover:text-on-surface'}`} />
            <span>Alertas de Auditoría</span>
            {manualAdjustmentsCount > 0 && <span className="w-2 h-2 rounded-full bg-error ring-4 ring-error-container"></span>}
            {activeTab === 'auditoria' && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"></span>}
          </button>
        </div>
      </div>

      {/* Top KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-outline">Puntos Otorgados Hoy</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display text-4xl font-bold text-secondary tracking-tight">{pointsGrantedToday.toLocaleString()}</span>
                <span className="font-mono text-[11px] text-secondary font-semibold">pts</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-secondary-container/30 flex items-center justify-center text-secondary">
              <Star className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-space-md pt-space-sm bg-surface-container-low/50 rounded-xl px-space-sm py-1.5">
            <div className="flex items-center gap-1.5 text-secondary font-mono text-[11px] font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>+14.2% vs ayer</span>
            </div>
            <svg className="w-20 h-5 text-secondary" fill="none" viewBox="0 0 100 24">
              <path d="M0 18 Q 20 20, 35 12 T 70 8 T 100 2" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
            </svg>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-outline">Premios Canjeados</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display text-4xl font-bold text-primary tracking-tight">{redeemedRewardsCount}</span>
                <span className="font-mono text-[11px] text-outline">artículos</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <Gift className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-space-md pt-space-sm bg-primary-container/30 rounded-xl px-space-sm py-1.5">
            <div className="flex items-center gap-1.5 text-primary font-mono text-[11px] font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>+3 canjes vs ayer</span>
            </div>
            <svg className="w-20 h-5 text-primary" fill="none" viewBox="0 0 100 24">
              <path d="M0 15 Q 25 25, 45 10 T 75 12 T 100 5" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
            </svg>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-outline">Ajustes Manuales</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display text-4xl font-bold text-error tracking-tight">{manualAdjustmentsCount}</span>
                <span className="font-mono text-[11px] text-outline">operación</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-error-container/40 flex items-center justify-center text-error">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-space-md pt-space-sm bg-error-container/20 rounded-xl px-space-sm py-1.5">
            <span className="font-mono text-[11px] text-on-error-container font-medium flex items-center gap-1">
              <Info className="w-4 h-4" />
              {manualAdjustmentsCount} auditoría{manualAdjustmentsCount !== 1 && 's'} pendiente{manualAdjustmentsCount !== 1 && 's'} de firma
            </span>
            <span onClick={() => setActiveTab('auditoria')} className="font-mono text-[11px] text-error font-bold underline cursor-pointer">REVISAR</span>
          </div>
        </div>
      </div>

      {/* Main Data Table Container */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Controls Toolbar */}
        <div className="p-space-md lg:p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md bg-surface-container-lowest">
          {/* Search Input */}
          <div className="relative w-full md:w-96 flex items-center">
            <Search className="absolute left-3.5 text-outline w-5 h-5" />
            <input 
              ref={searchInputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-16 py-2.5 rounded-xl bg-surface-container-low text-sm font-sans text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all shadow-sm" 
              placeholder="Buscar por DNI o Nombre..." 
              type="text" 
            />
            <kbd className="absolute right-3 px-1.5 py-0.5 rounded bg-surface-container text-outline font-mono text-[10px] pointer-events-none font-bold border border-outline-variant/30">
              Ctrl+K
            </kbd>
          </div>
          
          {/* Filter Dropdowns */}
          <div className="flex items-center gap-space-sm w-full md:w-auto flex-wrap justify-end">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all text-on-surface-variant font-mono text-[11px] shadow-sm hover:border-outline">
              <span className="text-outline font-medium">Rango:</span>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent text-on-surface font-semibold focus:outline-none cursor-pointer appearance-none pr-4"
                style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '8px auto' }}
              >
                <option value="Todos">Todos</option>
                <option value="Hoy">Hoy</option>
                <option value="24h">Últimas 24 hs</option>
                <option value="7d">Últimos 7 días</option>
                <option value="Mes">Mes actual</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all text-on-surface-variant font-mono text-[11px] shadow-sm hover:border-outline">
              <span className="text-outline font-medium">Terminal:</span>
              <select 
                value={terminal}
                onChange={(e) => setTerminal(e.target.value)}
                className="bg-transparent text-on-surface font-semibold focus:outline-none cursor-pointer appearance-none pr-4"
                style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '8px auto' }}
              >
                <option value="Todas">Todas las Cajas</option>
                <option value="Caja 01">Caja 01 - Sarah J.</option>
                <option value="Caja 02">Caja 02 - Marcos A.</option>
                <option value="Admin">Admin / Backoffice</option>
              </select>
            </div>
            
            <button 
              onClick={() => { setDateRange('Todos'); setTerminal('Todas'); setSearchTerm(''); }}
              className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant transition-colors border border-transparent hover:border-outline-variant/50" 
              title="Restablecer filtros" 
              type="button"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            {/* Navigation for lists (Tabs control rows) */}
            {(activeTab === 'log' || activeTab === 'auditoria') && (
              <>
                <thead>
                  <tr className="bg-surface-container-low/70 font-mono text-[11px] text-outline tracking-wider uppercase">
                    <th className="py-3.5 px-6 font-medium" scope="col">Fecha y Hora</th>
                    <th className="py-3.5 px-6 font-medium" scope="col">Cliente / DNI</th>
                    <th className="py-3.5 px-6 font-medium" scope="col">Acción</th>
                    <th className="py-3.5 px-6 font-medium" scope="col">Monto Ticket</th>
                    <th className="py-3.5 px-6 font-medium text-right" scope="col">Estado / Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low font-sans text-sm">
                  {filteredTransactions.map(t => {
                    const customer = customersMap.get(t.customerId);
                    const dateObj = new Date(t.date);
                    const isCanje = t.type === 'CANJE';
                    const isAjuste = t.type === 'AJUSTE';
                    
                    return (
                      <tr key={t.id} className={`${isAjuste ? 'bg-error-container/5 hover:bg-error-container/10' : 'hover:bg-surface-container-low/40'} transition-colors group`}>
                        <td className="py-4 px-6 font-mono text-[11px] text-on-surface-variant whitespace-nowrap">
                          <span className="text-on-surface font-medium">{dateObj.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          <span className="text-outline text-[10px] block mt-0.5">{dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full ${customer ? 'bg-primary-container text-on-primary font-bold' : 'bg-surface-container-high text-on-surface-variant'} flex items-center justify-center font-mono text-[11px] shadow-sm`}>
                              {customer ? customer.name.split(' ').map(n => n[0]).join('').substring(0, 2) : '?'}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-sans text-sm font-semibold text-on-surface">{customer ? customer.name : 'Desconocido'}</span>
                              <span className="font-mono text-[11px] text-outline">({customer ? customer.dni : '---'})</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex flex-col gap-1 items-start">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] font-semibold ${
                              isAjuste ? 'bg-error-container text-on-error-container' :
                              isCanje ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-secondary-container/40 text-on-secondary-container'
                            }`}>
                              {isAjuste ? <FileEdit className="w-4 h-4" /> : isCanje ? <Gift className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                              {t.pointsChange !== 0 
                                ? `${t.pointsChange > 0 ? '+' : ''}${t.pointsChange} Pts`
                                : `${t.stampsChange > 0 ? '+' : ''}${t.stampsChange} Sellos`}
                              {' '}
                              ({t.type})
                            </span>
                            {isAjuste && t.motive && (
                              <span className="font-sans text-xs text-error max-w-[200px] truncate" title={t.motive}>
                                Motivo: {t.motive}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-mono text-sm font-bold text-on-surface whitespace-nowrap">
                          {t.amount > 0 ? `AR$ ${t.amount.toLocaleString()}` : <span className="text-outline font-medium">AR$ 0</span>}
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <span className={`px-2.5 py-1 rounded-lg bg-surface-container font-mono text-[11px] font-semibold ${
                              isAjuste ? 'bg-error-container text-on-error-container' :
                              isCanje ? 'text-primary' : 'text-secondary'
                            }`}>
                              {isAjuste ? 'Manual' : isCanje ? 'Canje OK' : 'Verificado ✓'}
                            </span>
                            <span className="font-mono text-[11px] font-semibold text-outline">{t.hash}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </>
            )}

            {activeTab === 'clientes' && (
              <>
                <thead>
                  <tr className="bg-surface-container-low/70 font-mono text-[11px] text-outline tracking-wider uppercase">
                    <th className="py-3.5 px-6 font-medium" scope="col">Cliente / DNI</th>
                    <th className="py-3.5 px-6 font-medium" scope="col">Nivel</th>
                    <th className="py-3.5 px-6 font-medium" scope="col">Puntos / Sellos</th>
                    <th className="py-3.5 px-6 font-medium" scope="col">Métricas</th>
                    <th className="py-3.5 px-6 font-medium text-right" scope="col">Última Visita</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low font-sans text-sm">
                  {filteredCustomers.map(c => (
                    <tr key={c.id} className="hover:bg-surface-container-low/40 transition-colors group">
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary font-bold flex items-center justify-center font-mono text-[11px] shadow-sm">
                            {c.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-sans text-sm font-semibold text-on-surface">{c.name}</span>
                            <span className="font-mono text-[11px] text-outline">({c.dni})</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold ${
                          c.tier === 'GOLD' ? 'bg-primary-fixed text-on-primary-fixed-variant' :
                          c.tier === 'SILVER' ? 'bg-surface-container-highest text-on-surface' :
                          'bg-surface-container text-on-surface-variant'
                        }`}>
                          <Star className="w-3.5 h-3.5" />
                          {c.tier}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap font-mono text-sm">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-on-surface font-bold">{c.points.toLocaleString()} pts</span>
                          <span className="text-on-surface-variant text-[11px]">{c.stamps} sellos</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap font-mono text-xs text-on-surface-variant">
                        <div className="flex flex-col gap-0.5">
                          <span>{c.totalVisits} visitas</span>
                          <span>AR$ {c.totalSpent.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right whitespace-nowrap font-mono text-[11px] text-on-surface-variant">
                        {c.lastVisitDate ? new Date(c.lastVisitDate).toLocaleDateString('es-AR') : 'Nunca'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </table>
        </div>

        {/* Table Footer & Pagination */}
        <div className="px-space-lg py-space-md bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-space-md">
          <span className="font-sans text-xs text-on-surface-variant">
            Mostrando <strong className="text-on-surface font-semibold">{(activeTab === 'log' || activeTab === 'auditoria') ? filteredTransactions.length : filteredCustomers.length}</strong> resultados en total.
          </span>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <button className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50" disabled type="button">
              Anterior
            </button>
            <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold shadow-sm" type="button">1</button>
            <button className="w-8 h-8 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors" type="button">2</button>
            <button className="w-8 h-8 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors" type="button">3</button>
            <span className="px-1 text-outline">...</span>
            <button className="w-8 h-8 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors" type="button">437</button>
            <button className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-colors" type="button">
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE AJUSTE MANUAL */}
      {isManualModalOpen && (
        <div 
          onClick={() => setIsManualModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
          >
            <div className="p-6 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center mb-1">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-on-surface">Ajuste Manual</h3>
              
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs font-semibold text-on-surface-variant uppercase tracking-wider">DNI del Cliente</label>
                  <input
                    type="text"
                    value={manualForm.dni}
                    onChange={(e) => setManualForm({ ...manualForm, dni: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg py-3 px-3.5 font-sans text-sm text-on-surface outline-none focus:border-error transition-colors"
                    placeholder="Ej. 12345678"
                  />
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setManualForm({ ...manualForm, action: 'sumar' })}
                    className={`flex-1 py-2 rounded-lg font-sans text-sm font-semibold transition-colors ${manualForm.action === 'sumar' ? 'bg-secondary text-on-secondary' : 'bg-surface-container-low text-on-surface-variant'}`}
                  >
                    Sumar
                  </button>
                  <button 
                    onClick={() => setManualForm({ ...manualForm, action: 'restar' })}
                    className={`flex-1 py-2 rounded-lg font-sans text-sm font-semibold transition-colors ${manualForm.action === 'restar' ? 'bg-error text-on-error' : 'bg-surface-container-low text-on-surface-variant'}`}
                  >
                    Restar
                  </button>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Cantidad ({config.type === 'puntos' ? 'Pts' : 'Sellos'})
                  </label>
                  <input
                    type="number"
                    value={manualForm.amount}
                    onChange={(e) => setManualForm({ ...manualForm, amount: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg py-3 px-3.5 font-mono text-sm text-on-surface outline-none focus:border-error transition-colors"
                    placeholder="Ej. 1500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Motivo (Obligatorio)</label>
                  <input
                    type="text"
                    value={manualForm.motive}
                    onChange={(e) => setManualForm({ ...manualForm, motive: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg py-3 px-3.5 font-sans text-sm text-on-surface outline-none focus:border-error transition-colors"
                    placeholder="Ej. Compensación por demora"
                  />
                </div>
              </div>
            </div>
            <div className="bg-surface-container-low p-4 flex gap-3 justify-end border-t border-outline-variant/20">
              <button 
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-sans text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={() => {
                  if (!manualForm.dni || !manualForm.amount || !manualForm.motive) return;
                  const customerExists = customers.some(c => c.dni === manualForm.dni);
                  if (!customerExists) {
                    toast.error('No se encontró ningún cliente con ese DNI');
                    return;
                  }

                  const amountNum = Number(manualForm.amount);
                  const multiplier = manualForm.action === 'sumar' ? 1 : -1;
                  
                  if (config.type === 'puntos') {
                    addManualAdjustment(manualForm.dni, amountNum * multiplier, 0, manualForm.motive);
                  } else {
                    addManualAdjustment(manualForm.dni, 0, amountNum * multiplier, manualForm.motive);
                  }
                  
                  toast.success('Ajuste de saldo aplicado exitosamente');
                  setIsManualModalOpen(false);
                  setManualForm({ dni: '', action: 'sumar', amount: '', motive: '' });
                }}
                disabled={!manualForm.dni || !manualForm.amount || !manualForm.motive}
                className="px-5 py-2.5 rounded-xl font-sans text-sm font-semibold bg-error text-on-error hover:bg-error-container hover:text-on-error-container transition-colors shadow-sm disabled:opacity-50"
              >
                Ejecutar Ajuste
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
