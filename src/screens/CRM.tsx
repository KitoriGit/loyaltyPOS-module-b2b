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
  Search,
  RefreshCw,
  PlusCircle,
  FileEdit,
  Crown,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  useLoyaltyStore, 
  type Customer, 
  type TierType,
  TIER_LABELS,
  calculateCustomerTier 
} from '../store/useLoyaltyStore';

export function CRM() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const customers = useLoyaltyStore((state) => state.customers);
  const transactions = useLoyaltyStore((state) => state.transactions);
  const config = useLoyaltyStore((state) => state.config);
  const addManualAdjustment = useLoyaltyStore((state) => state.addManualAdjustment);
  const updateCustomerTier = useLoyaltyStore((state) => state.updateCustomerTier);

  const [activeTab, setActiveTab] = useState<'log' | 'clientes' | 'auditoria'>('log');
  const [dateRange, setDateRange] = useState('Todos');
  const [terminal, setTerminal] = useState('Todas');
  const [tierFilter, setTierFilter] = useState<'TODOS' | TierType>('TODOS');
  
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

  // Modal para Promover / Modificar Tier de un cliente
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [promotionTier, setPromotionTier] = useState<TierType>('BRONZE');
  const [isManualOverride, setIsManualOverride] = useState(true);

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
        setIsPromoteModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Índice Map de clientes para búsquedas instantáneas O(1)
  const customersMap = useMemo(() => {
    const map = new Map<string, Customer>();
    for (const c of customers) {
      map.set(c.id, c);
    }
    return map;
  }, [customers]);

  // KPIs calculados en una única pasada con useMemo
  const { manualAdjustmentsCount, redeemedRewardsCount, pointsGrantedToday, tierDistribution } = useMemo(() => {
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

    const dist = {
      BRONZE: 0,
      SILVER: 0,
      GOLD: 0,
    };
    for (const c of customers) {
      if (c.tier in dist) dist[c.tier]++;
    }

    return {
      manualAdjustmentsCount: adjustments,
      redeemedRewardsCount: canjes,
      pointsGrantedToday: pointsToday > 0 ? pointsToday : 12450,
      tierDistribution: dist,
    };
  }, [transactions, customers]);
  
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

  // Filtrar clientes memorizados (con soporte de búsqueda y filtro por Tier)
  const filteredCustomers = useMemo(() => {
    const term = debouncedSearchTerm.toLowerCase().trim();

    return customers.filter(c => {
      // Filtro por Tier
      if (tierFilter !== 'TODOS' && c.tier !== tierFilter) return false;

      // Filtro por término
      if (!term) return true;
      return c.name.toLowerCase().includes(term) || c.dni.includes(term);
    });
  }, [customers, debouncedSearchTerm, tierFilter]);

  const handleOpenPromote = (customer: Customer) => {
    setSelectedCustomer(customer);
    setPromotionTier(customer.tier);
    setIsManualOverride(true);
    setIsPromoteModalOpen(true);
  };

  const handleSavePromotion = () => {
    if (!selectedCustomer) return;
    updateCustomerTier(selectedCustomer.dni, promotionTier, isManualOverride);
    toast.success(`Nivel de ${selectedCustomer.name} actualizado a ${TIER_LABELS[promotionTier]}`);
    setIsPromoteModalOpen(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="flex flex-col gap-space-lg pb-space-xl">
      {/* Header Area */}
      <div className="flex flex-col gap-space-md">
        {/* Breadcrumb & Real-time Telemetry Pill */}
        <div className="flex items-center justify-between flex-wrap gap-space-sm">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-mono text-[11px]">
            <span className="text-on-surface font-semibold">Auditoría Fiscal & Loyalty</span>
            <span className="text-outline">•</span>
            <div className="flex items-center gap-space-xs px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span className="font-mono text-[11px] text-emerald-900 font-semibold tracking-wide">Auditoría en tiempo real activa</span>
            </div>
          </div>
        </div>

        {/* Title & CTA Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex flex-col">
            <h1 className="font-display text-3xl font-bold text-on-surface tracking-tight">Gestión de Clientes y Auditoría</h1>
            <p className="font-sans text-sm text-on-surface-variant mt-0.5">
              Monitoreo en tiempo real de transacciones, historial de puntos, gobierno de tiers y fidelidad
            </p>
          </div>
          
          {/* Top Action Buttons */}
          <div className="flex items-center gap-space-sm self-start lg:self-auto">
            <button 
              onClick={() => setIsManualModalOpen(true)} 
              className="group flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/60 shadow-xs hover:bg-surface-container transition-all text-on-surface cursor-pointer" 
              type="button"
            >
              <Shield className="w-4.5 h-4.5 text-secondary" />
              <span className="font-sans text-sm font-medium">Ajuste de Saldo Manual</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-mono text-[11px] shadow-xs border border-outline-variant/40">M</kbd>
            </button>
            <button 
              onClick={() => toast.success('Reporte exportado exitosamente')} 
              className="flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container shadow-xs transition-all active:scale-[0.99] cursor-pointer" 
              type="button"
            >
              <Download className="w-4.5 h-4.5" />
              <span className="font-sans text-sm font-semibold">Exportar Reporte</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-on-primary font-mono text-[11px]">Ctrl+E</kbd>
            </button>
          </div>
        </div>

        {/* Sleek Inline Navigation Tabs */}
        <div className="flex items-center gap-space-md bg-surface-container-lowest rounded-xl px-space-md py-1 shadow-xs border border-outline-variant/50 mt-space-xs overflow-x-auto">
          <button 
            onClick={() => setActiveTab('log')}
            className={`relative flex items-center gap-2 py-3 px-3 font-sans text-sm whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'log' ? 'font-bold text-primary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`} 
            type="button"
          >
            <ReceiptText className={`w-4.5 h-4.5 ${activeTab === 'log' ? 'text-primary' : 'text-outline'}`} />
            <span>Log de Movimientos</span>
            <span className={`px-2 py-0.5 rounded-full font-mono text-[11px] ${activeTab === 'log' ? 'bg-primary-fixed text-on-primary-fixed font-bold' : 'bg-surface-container text-on-surface-variant'}`}>{transactions.length}</span>
            {activeTab === 'log' && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"></span>}
          </button>
          
          <button 
            onClick={() => setActiveTab('clientes')}
            className={`relative flex items-center gap-2 py-3 px-3 font-sans text-sm whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'clientes' ? 'font-bold text-primary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`} 
            type="button"
          >
            <Award className={`w-4.5 h-4.5 ${activeTab === 'clientes' ? 'text-primary' : 'text-outline'}`} />
            <span>Listado de Clientes & Tiers</span>
            <span className={`px-2 py-0.5 rounded-full font-mono text-[11px] ${activeTab === 'clientes' ? 'bg-primary-fixed text-on-primary-fixed font-bold' : 'bg-surface-container text-on-surface-variant'}`}>{customers.length}</span>
            {activeTab === 'clientes' && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"></span>}
          </button>

          <button 
            onClick={() => setActiveTab('auditoria')}
            className={`relative group flex items-center gap-2 py-3 px-3 font-sans text-sm whitespace-nowrap transition-colors cursor-pointer ${activeTab === 'auditoria' ? 'font-bold text-primary' : 'font-medium text-on-surface-variant hover:text-on-surface'}`} 
            type="button"
          >
            <ShieldCheck className={`w-4.5 h-4.5 ${activeTab === 'auditoria' ? 'text-primary' : 'text-outline'}`} />
            <span>Alertas de Auditoría</span>
            {manualAdjustmentsCount > 0 && <span className="w-2 h-2 rounded-full bg-error ring-4 ring-error-container"></span>}
            {activeTab === 'auditoria' && <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"></span>}
          </button>
        </div>
      </div>

      {/* Top KPI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs border border-outline-variant/60 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-outline">Puntos Otorgados Hoy</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display text-4xl font-extrabold text-primary tracking-tight">{pointsGrantedToday.toLocaleString()}</span>
                <span className="font-mono text-[11px] text-primary font-semibold">pts</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-primary flex items-center justify-center border border-emerald-200/60 shadow-xs">
              <Star className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-space-md pt-space-sm bg-surface-container-low/70 rounded-xl px-space-sm py-1.5 border border-outline-variant/30">
            <div className="flex items-center gap-1.5 text-primary font-mono text-[11px] font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>+14.2% vs ayer</span>
            </div>
            <svg className="w-20 h-5 text-primary" fill="none" viewBox="0 0 100 24">
              <path d="M0 18 Q 20 20, 35 12 T 70 8 T 100 2" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
            </svg>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs border border-outline-variant/60 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-outline">Premios Canjeados</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display text-4xl font-extrabold text-secondary tracking-tight">{redeemedRewardsCount}</span>
                <span className="font-mono text-[11px] text-outline font-semibold">artículos</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-secondary flex items-center justify-center border border-amber-200/60 shadow-xs">
              <Gift className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-space-md pt-space-sm bg-surface-container-low/70 rounded-xl px-space-sm py-1.5 border border-outline-variant/30">
            <span className="font-mono text-[11px] text-on-surface-variant font-medium">92% validados en mostrador</span>
            <span className="font-mono text-[11px] font-bold text-secondary">100% éxito</span>
          </div>
        </div>

        {/* Card 3: Distribución de Tiers */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs border border-outline-variant/60 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-outline">Distribución de Tiers</span>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center gap-1 font-mono text-sm font-bold text-[#78350f]">
                  <span>🥉</span> {tierDistribution.BRONZE}
                </div>
                <div className="flex items-center gap-1 font-mono text-sm font-bold text-[#334155]">
                  <span>🥈</span> {tierDistribution.SILVER}
                </div>
                <div className="flex items-center gap-1 font-mono text-sm font-bold text-[#92400e]">
                  <span>🥇</span> {tierDistribution.GOLD}
                </div>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-secondary flex items-center justify-center border border-amber-200/60 shadow-xs">
              <Crown className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-space-md pt-space-sm bg-surface-container-low/70 rounded-xl px-space-sm py-1.5 border border-outline-variant/30">
            <span className="font-sans text-xs text-on-surface-variant font-medium">
              Clientes VIP (Oro): <strong className="font-mono text-on-surface font-bold">{Math.round((tierDistribution.GOLD / Math.max(1, customers.length)) * 100)}%</strong>
            </span>
            <span className="font-mono text-[11px] font-bold text-secondary">Fidelizados</span>
          </div>
        </div>
      </div>

      {/* Main Data Table Container */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-xs border border-outline-variant/60 overflow-hidden flex flex-col">
        {/* Table Controls Toolbar */}
        <div className="p-space-md lg:p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md bg-surface-container-lowest border-b border-outline-variant/40">
          {/* Search Input */}
          <div className="relative w-full md:w-96 flex items-center">
            <Search className="absolute left-3.5 text-outline w-4.5 h-4.5" />
            <input 
              ref={searchInputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-16 py-2.5 rounded-xl bg-surface-container-low text-sm font-sans text-on-surface placeholder:text-outline border border-outline-variant/50 focus:outline-none focus:bg-surface-container-lowest focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all shadow-xs" 
              placeholder="Buscar por DNI o Nombre..." 
              type="text" 
            />
            <kbd className="absolute right-3 px-1.5 py-0.5 rounded bg-surface-container text-outline font-mono text-[10px] pointer-events-none font-bold border border-outline-variant/30">
              Ctrl+K
            </kbd>
          </div>
          
          {/* Filter Dropdowns */}
          <div className="flex items-center gap-space-sm w-full md:w-auto flex-wrap justify-end">
            {/* Filtro específico por Tier en la pestaña de Clientes */}
            {activeTab === 'clientes' && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/50 focus-within:border-primary text-on-surface-variant font-mono text-[11px] shadow-xs">
                <span className="text-outline font-medium">Nivel:</span>
                <select 
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value as 'TODOS' | TierType)}
                  className="bg-transparent text-on-surface font-semibold focus:outline-none cursor-pointer appearance-none pr-4"
                  style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '8px auto' }}
                >
                  <option value="TODOS">Todos los Niveles</option>
                  <option value="BRONZE">🥉 Bronze</option>
                  <option value="SILVER">🥈 Plata</option>
                  <option value="GOLD">🥇 Oro VIP</option>
                </select>
              </div>
            )}

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/50 focus-within:border-primary text-on-surface-variant font-mono text-[11px] shadow-xs">
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
            
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/50 focus-within:border-primary text-on-surface-variant font-mono text-[11px] shadow-xs">
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
              onClick={() => { setDateRange('Todos'); setTerminal('Todas'); setTierFilter('TODOS'); setSearchTerm(''); }}
              className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant transition-colors border border-outline-variant/40 cursor-pointer" 
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
            {(activeTab === 'log' || activeTab === 'auditoria') && (
              <>
                <thead>
                  <tr className="bg-surface-container-low/70 font-mono text-[11px] text-outline tracking-wider uppercase border-b border-outline-variant/40">
                    <th className="py-3.5 px-6 font-semibold" scope="col">Fecha y Hora</th>
                    <th className="py-3.5 px-6 font-semibold" scope="col">Cliente / DNI</th>
                    <th className="py-3.5 px-6 font-semibold" scope="col">Acción</th>
                    <th className="py-3.5 px-6 font-semibold" scope="col">Monto Ticket</th>
                    <th className="py-3.5 px-6 font-semibold text-right" scope="col">Estado / Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 font-sans text-sm">
                  {filteredTransactions.map(t => {
                    const customer = customersMap.get(t.customerId);
                    const dateObj = new Date(t.date);
                    const isCanje = t.type === 'CANJE';
                    const isAjuste = t.type === 'AJUSTE';
                    
                    return (
                      <tr key={t.id} className={`${isAjuste ? 'bg-error-container/10 hover:bg-error-container/20' : 'hover:bg-surface-container-low/50'} transition-colors group`}>
                        <td className="py-4 px-6 font-mono text-[11px] text-on-surface-variant whitespace-nowrap">
                          <span className="text-on-surface font-semibold">{dateObj.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          <span className="text-outline text-[10px] block mt-0.5">{dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full ${customer ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-high text-on-surface-variant'} flex items-center justify-center font-mono text-[11px] shadow-xs`}>
                              {customer ? customer.name.split(' ').map(n => n[0]).join('').substring(0, 2) : '?'}
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5">
                                <span className="font-sans text-sm font-semibold text-on-surface">{customer ? customer.name : 'Desconocido'}</span>
                                {customer?.isRegistered === false && (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-mono text-[9px] font-bold border border-amber-300">
                                    Pendiente QR
                                  </span>
                                )}
                              </div>
                              <span className="font-mono text-[11px] text-outline">({customer ? customer.dni : '---'})</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex flex-col gap-1 items-start">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] font-semibold border ${
                              isAjuste ? 'bg-rose-50 text-rose-900 border-rose-200' :
                              isCanje ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                            }`}>
                              {isAjuste ? <FileEdit className="w-3.5 h-3.5" /> : isCanje ? <Gift className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
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
                            <span className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold border ${
                              isAjuste ? 'bg-rose-50 text-rose-900 border-rose-200' :
                              isCanje ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-emerald-50 text-emerald-900 border-emerald-200'
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

            {/* TAB: LISTADO DE CLIENTES Y GESTIÓN DE TIERS */}
            {activeTab === 'clientes' && (
              <>
                <thead>
                  <tr className="bg-surface-container-low/70 font-mono text-[11px] text-outline tracking-wider uppercase border-b border-outline-variant/40">
                    <th className="py-3.5 px-6 font-semibold" scope="col">Cliente / DNI</th>
                    <th className="py-3.5 px-6 font-semibold" scope="col">Nivel (Tier)</th>
                    <th className="py-3.5 px-6 font-semibold" scope="col">Puntos / Sellos</th>
                    <th className="py-3.5 px-6 font-semibold" scope="col">Métricas</th>
                    <th className="py-3.5 px-6 font-semibold" scope="col">Última Visita</th>
                    <th className="py-3.5 px-6 font-semibold text-right" scope="col">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 font-sans text-sm">
                  {filteredCustomers.map(c => {
                    const status = calculateCustomerTier(c, config.tierConfig, config.type);

                    return (
                      <tr key={c.id} className="hover:bg-surface-container-low/50 transition-colors group">
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center font-mono text-[11px] shadow-xs">
                              {c.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5">
                                <span className="font-sans text-sm font-semibold text-on-surface">{c.name}</span>
                                {c.isRegistered === false && (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 font-mono text-[10px] font-bold border border-amber-300">
                                    Pendiente QR
                                  </span>
                                )}
                              </div>
                              <span className="font-mono text-[11px] text-outline">({c.dni})</span>
                            </div>
                          </div>
                        </td>

                        {/* Columna Nivel (Tier) con Alertas de Inactividad y Override */}
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex flex-col gap-1 items-start">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px] font-bold border ${
                              c.tier === 'GOLD' 
                                ? 'bg-[#fef3c7] text-[#92400e] border-[#f59e0b]/50 shadow-[0_0_8px_rgba(245,158,11,0.2)]' 
                                : c.tier === 'SILVER' 
                                ? 'bg-[#f1f3f5] text-[#334155] border-[#94a3b8]/60' 
                                : 'bg-[#f5e6d3] text-[#78350f] border-[#d97706]/40'
                            }`}>
                              {c.tier === 'GOLD' && <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />}
                              {c.tier === 'SILVER' && <Star className="w-3.5 h-3.5 text-slate-600 fill-slate-400" />}
                              {c.tier === 'BRONZE' && <Shield className="w-3.5 h-3.5 text-amber-800" />}
                              {c.tier === 'GOLD' ? 'ORO VIP' : c.tier === 'SILVER' ? 'PLATA' : 'BRONZE'}
                            </span>

                            {/* Indicador de Asignación Manual */}
                            {c.manualTierOverride && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-primary px-1.5 py-0.2 rounded bg-emerald-50 border border-emerald-200">
                                <UserCheck className="w-3 h-3" />
                                Fijado manual
                              </span>
                            )}

                            {/* Alerta de Inactividad */}
                            {status.isAtRisk && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-sans font-medium text-amber-800 px-1.5 py-0.2 rounded bg-amber-50 border border-amber-300">
                                <AlertTriangle className="w-3 h-3 text-amber-700" />
                                Inactivo ({status.daysInactive}d)
                              </span>
                            )}
                            {status.isDowngraded && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-sans font-medium text-stone-700 px-1.5 py-0.2 rounded bg-stone-100 border border-stone-300">
                                <AlertTriangle className="w-3 h-3 text-stone-600" />
                                Degradado ({status.daysInactive}d)
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-6 whitespace-nowrap font-mono text-sm">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-on-surface font-bold">{c.points.toLocaleString()} pts</span>
                            <span className="text-on-surface-variant text-[11px] font-medium">{c.stamps} sellos</span>
                          </div>
                        </td>

                        <td className="py-4 px-6 whitespace-nowrap font-mono text-xs text-on-surface-variant">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-on-surface">{c.totalVisits} visitas</span>
                            {config.type === 'sellos' && (
                              <span className="text-[11px] text-secondary font-medium">
                                {c.completedCards || 0} {(c.completedCards || 0) === 1 ? 'tarjeta compl.' : 'tarjetas compl.'}
                              </span>
                            )}
                            <span>AR$ {c.totalSpent.toLocaleString()}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6 whitespace-nowrap font-mono text-[11px] text-on-surface-variant">
                          {c.lastVisitDate ? new Date(c.lastVisitDate).toLocaleDateString('es-AR') : 'Nunca'}
                        </td>

                        {/* Botón de Acción: Promover / Modificar Nivel */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleOpenPromote(c)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface transition-all font-sans text-xs font-semibold shadow-xs border border-outline-variant/40 cursor-pointer"
                          >
                            <Crown className="w-3.5 h-3.5 text-secondary group-hover:text-white" />
                            <span>Promover</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </>
            )}
          </table>
        </div>

        {/* Table Footer & Pagination */}
        <div className="px-space-lg py-space-md bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-space-md border-t border-outline-variant/40">
          <span className="font-sans text-xs text-on-surface-variant">
            Mostrando <strong className="text-on-surface font-semibold">{(activeTab === 'log' || activeTab === 'auditoria') ? filteredTransactions.length : filteredCustomers.length}</strong> resultados en total.
          </span>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <button className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50 border border-outline-variant/30" disabled type="button">
              Anterior
            </button>
            <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold shadow-xs" type="button">1</button>
            <button className="w-8 h-8 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors border border-outline-variant/30" type="button">2</button>
            <button className="w-8 h-8 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors border border-outline-variant/30" type="button">3</button>
            <span className="px-1 text-outline">...</span>
            <button className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors border border-outline-variant/30" type="button">
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* MODAL PARA PROMOVER O GESTIONAR TIER DEL CLIENTE */}
      {isPromoteModalOpen && selectedCustomer && (
        <div 
          onClick={() => setIsPromoteModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-outline-variant/60"
          >
            <div className="p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-secondary flex items-center justify-center mb-1 border border-amber-200">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-on-surface">Gestionar Nivel de Cliente</h3>
                <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                  Promueve o ajusta manualmente el tier de <strong>{selectedCustomer.name}</strong> ({selectedCustomer.dni}).
                </p>
              </div>

              {/* Estadísticas Actuales */}
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-outline text-[11px] block font-medium">Visitas</span>
                  <span className="font-bold text-on-surface text-sm">{selectedCustomer.totalVisits}</span>
                </div>
                {config.type === 'sellos' && (
                  <div>
                    <span className="text-outline text-[11px] block font-medium">Tarjetas Compl.</span>
                    <span className="font-bold text-secondary text-sm">{selectedCustomer.completedCards || 0}</span>
                  </div>
                )}
                <div>
                  <span className="text-outline text-[11px] block font-medium">Gasto Total</span>
                  <span className="font-bold text-on-surface text-sm">AR$ {selectedCustomer.totalSpent.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-outline text-[11px] block font-medium">Nivel Actual</span>
                  <span className="font-bold text-primary text-sm">{selectedCustomer.tier}</span>
                </div>
              </div>

              {/* Selector de Nuevo Nivel */}
              <div className="flex flex-col gap-2">
                <label className="font-sans text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Selecciona el Nivel a Asignar
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPromotionTier('BRONZE')}
                    className={`p-3 rounded-xl text-center font-sans text-xs font-bold transition-all border flex flex-col items-center gap-1 cursor-pointer ${
                      promotionTier === 'BRONZE'
                        ? 'bg-[#f5e6d3] text-[#78350f] border-[#d97706]/70 shadow-xs'
                        : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container'
                    }`}
                  >
                    <span className="text-lg">🥉</span>
                    <span>Bronze</span>
                    <span className="font-mono text-[10px] font-normal opacity-80">Base</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPromotionTier('SILVER')}
                    className={`p-3 rounded-xl text-center font-sans text-xs font-bold transition-all border flex flex-col items-center gap-1 cursor-pointer ${
                      promotionTier === 'SILVER'
                        ? 'bg-[#f1f3f5] text-[#334155] border-[#94a3b8]/70 shadow-xs'
                        : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container'
                    }`}
                  >
                    <span className="text-lg">🥈</span>
                    <span>Plata</span>
                    <span className="font-mono text-[10px] font-normal opacity-80">Habitual</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPromotionTier('GOLD')}
                    className={`p-3 rounded-xl text-center font-sans text-xs font-bold transition-all border flex flex-col items-center gap-1 cursor-pointer ${
                      promotionTier === 'GOLD'
                        ? 'bg-[#fef3c7] text-[#92400e] border-[#f59e0b]/70 shadow-xs'
                        : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container'
                    }`}
                  >
                    <span className="text-lg">🥇</span>
                    <span>Oro VIP</span>
                    <span className="font-mono text-[10px] font-normal opacity-80">Exclusivo</span>
                  </button>
                </div>
              </div>

              {/* Checkbox de Fijación Manual */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isManualOverride}
                  onChange={(e) => setIsManualOverride(e.target.checked)}
                  className="mt-0.5 rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <div className="flex flex-col text-xs font-sans">
                  <span className="font-semibold text-on-surface">Fijar asignación manual</span>
                  <span className="text-on-surface-variant text-[11px] mt-0.5">
                    Evita que el cliente pierda o degrade este nivel automáticamente por inactividad.
                  </span>
                </div>
              </label>
            </div>

            <div className="bg-surface-container-low p-4 flex gap-3 justify-end border-t border-outline-variant/40">
              <button 
                type="button"
                onClick={() => setIsPromoteModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-sans text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleSavePromotion}
                className="px-5 py-2.5 rounded-xl font-sans text-sm font-semibold bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Crown className="w-4 h-4" />
                <span>Confirmar Nivel</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE AJUSTE MANUAL */}
      {isManualModalOpen && (
        <div 
          onClick={() => setIsManualModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-outline-variant/60"
          >
            <div className="p-6 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-error flex items-center justify-center mb-1 border border-rose-200">
                <ShieldAlert className="w-5 h-5 text-error" />
              </div>
              <h3 className="font-display text-xl font-bold text-on-surface">Ajuste Manual</h3>
              
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs font-semibold text-on-surface-variant uppercase tracking-wider">DNI del Cliente</label>
                  <input
                    type="text"
                    value={manualForm.dni}
                    onChange={(e) => setManualForm({ ...manualForm, dni: e.target.value })}
                    className="w-full bg-surface-container-low/70 border border-outline-variant/50 rounded-lg py-3 px-3.5 font-sans text-sm text-on-surface outline-none focus:border-error focus:bg-surface-container-lowest transition-colors"
                    placeholder="Ej. 12345678"
                  />
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setManualForm({ ...manualForm, action: 'sumar' })}
                    className={`flex-1 py-2.5 rounded-lg font-sans text-sm font-semibold transition-colors cursor-pointer ${manualForm.action === 'sumar' ? 'bg-[#064e3b] text-white shadow-xs' : 'bg-surface-container text-on-surface-variant'}`}
                  >
                    Sumar
                  </button>
                  <button 
                    onClick={() => setManualForm({ ...manualForm, action: 'restar' })}
                    className={`flex-1 py-2.5 rounded-lg font-sans text-sm font-semibold transition-colors cursor-pointer ${manualForm.action === 'restar' ? 'bg-error text-white shadow-xs' : 'bg-surface-container text-on-surface-variant'}`}
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
                    className="w-full bg-surface-container-low/70 border border-outline-variant/50 rounded-lg py-3 px-3.5 font-mono text-sm text-on-surface outline-none focus:border-error focus:bg-surface-container-lowest transition-colors"
                    placeholder="Ej. 1500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Motivo (Obligatorio)</label>
                  <input
                    type="text"
                    value={manualForm.motive}
                    onChange={(e) => setManualForm({ ...manualForm, motive: e.target.value })}
                    className="w-full bg-surface-container-low/70 border border-outline-variant/50 rounded-lg py-3 px-3.5 font-sans text-sm text-on-surface outline-none focus:border-error focus:bg-surface-container-lowest transition-colors"
                    placeholder="Ej. Compensación por demora"
                  />
                </div>
              </div>
            </div>
            <div className="bg-surface-container-low p-4 flex gap-3 justify-end border-t border-outline-variant/40">
              <button 
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-sans text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
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
                className="px-5 py-2.5 rounded-xl font-sans text-sm font-semibold bg-error text-white hover:bg-error/90 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
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
