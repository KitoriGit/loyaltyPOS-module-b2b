import {
  Calendar,
  ChevronDown,
  FileText,
  Repeat,
  CheckCircle2,
  Banknote,
  TrendingUp,
  Gift,
  Leaf,
  AlertCircle,
  Mail,
  Award,
  PieChart,
  Lightbulb,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useLoyaltyStore } from '../store/useLoyaltyStore';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export function DashboardPuntos() {
  const customers = useLoyaltyStore((state) => state.customers);
  const transactions = useLoyaltyStore((state) => state.transactions);
  const config = useLoyaltyStore((state) => state.config);

  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | 'all'>('30d');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Cálculos analíticos memorizados para evitar re-cálculos al abrir el menú de filtro
  const analytics = useMemo(() => {
    const now = Date.now();
    const days = timeFilter === '7d' ? 7 : 30;
    
    const filtered = transactions.filter(t => {
      if (timeFilter === 'all') return true;
      const tDate = new Date(t.date).getTime();
      return (now - tDate) <= days * 24 * 60 * 60 * 1000;
    });

    const totalClientes = customers.length;
    const fidelizados = customers.filter(c => c.totalVisits >= 2).length;
    const retentionRate = totalClientes > 0 ? Math.round((fidelizados / totalClientes) * 100) : 0;

    const compras = filtered.filter(t => t.type === 'COMPRA');
    const ticketPromedio = compras.length > 0 ? Math.round(compras.reduce((acc, t) => acc + t.amount, 0) / compras.length) : 0;

    const canjes = filtered.filter(t => t.type === 'CANJE');
    const totalCanjes = canjes.length;

    let daysDivisor = 30;
    if (timeFilter === '7d') daysDivisor = 7;
    else if (timeFilter === 'all') {
      if (transactions.length > 0) {
        const dates = transactions.map(t => new Date(t.date).getTime());
        const oldest = Math.min(...dates);
        const newest = Math.max(...dates);
        daysDivisor = Math.max(1, Math.ceil((newest - oldest) / (1000 * 60 * 60 * 24)));
      } else {
        daysDivisor = 1;
      }
    }
    const canjesPromedio = (totalCanjes / daysDivisor).toFixed(1);

    const puntosEmitidos = filtered.filter(t => (t.type === 'COMPRA' || t.type === 'AJUSTE') && t.pointsChange > 0).reduce((acc, t) => acc + t.pointsChange, 0);
    const puntosCanjeados = filtered.filter(t => (t.type === 'CANJE' || t.type === 'AJUSTE') && t.pointsChange < 0).reduce((acc, t) => acc + Math.abs(t.pointsChange), 0);
    const burnRate = puntosEmitidos > 0 ? ((puntosCanjeados / puntosEmitidos) * 100).toFixed(1) : '0.0';
    const puntosNetos = puntosEmitidos - puntosCanjeados;

    const topVIPs = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

    const pasivoPremios = config.rewards.map(reward => {
      const count = customers.filter(c => c.points >= reward.costPoints).length;
      return { ...reward, count, latenteAR: count * Math.round(reward.costPoints * 1.5) };
    }).sort((a, b) => b.count - a.count).slice(0, 3);

    const totalLatentes = pasivoPremios.reduce((acc, r) => acc + r.count, 0);

    return {
      retentionRate,
      comprasCount: compras.length,
      ticketPromedio,
      totalCanjes,
      canjesPromedio,
      burnRate,
      puntosNetos,
      topVIPs,
      pasivoPremios,
      totalLatentes
    };
  }, [customers, transactions, config.rewards, timeFilter]);

  const {
    retentionRate,
    comprasCount,
    ticketPromedio,
    totalCanjes,
    canjesPromedio,
    burnRate,
    puntosNetos,
    topVIPs,
    pasivoPremios,
    totalLatentes
  } = analytics;
  return (
    <div className="flex flex-col gap-space-lg w-full pb-space-xl">
      {/* 1. Header Zone */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-space-sm">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container font-mono text-[11px] text-primary font-semibold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              <span>Analítica de Fidelización · Modelo de Puntos</span>
            </div>
            <span className="font-mono text-[11px] text-secondary font-medium hidden sm:inline-flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" />
              Sincronizado en tiempo real
            </span>
          </div>
          <h1 className="font-display text-4xl text-on-surface font-extrabold tracking-tight">
            Estadísticas del Programa (Puntos)
          </h1>
          <p className="font-sans text-sm text-on-surface-variant max-w-2xl">
            Métricas ejecutivas de retención, flujo de economía de puntos y pasivo latente de beneficios calculados sobre la sucursal activa.
          </p>
        </div>

        {/* Action Tools */}
        <div className="flex items-center gap-space-sm self-start lg:self-center relative">
          <div className="relative">
            <button 
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-sans text-sm font-semibold shadow-sm hover:bg-surface-container-high transition-colors" 
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Calendar className="w-4 h-4 text-primary" />
              <span>{timeFilter === '7d' ? 'Últimos 7 días' : timeFilter === '30d' ? 'Últimos 30 días' : 'Histórico Completo'}</span>
              <ChevronDown className="w-4 h-4 text-on-surface-variant" />
            </button>
            {isFilterOpen && (
              <div className="absolute top-full mt-2 right-0 w-48 bg-surface-container-lowest rounded-xl shadow-lg border border-surface-container z-10 overflow-hidden flex flex-col">
                <button 
                  className={`px-4 py-2 text-left font-sans text-sm hover:bg-surface-container-low transition-colors ${timeFilter === '7d' ? 'bg-primary/10 text-primary font-semibold' : 'text-on-surface'}`}
                  onClick={() => { setTimeFilter('7d'); setIsFilterOpen(false); }}
                >Últimos 7 días</button>
                <button 
                  className={`px-4 py-2 text-left font-sans text-sm hover:bg-surface-container-low transition-colors ${timeFilter === '30d' ? 'bg-primary/10 text-primary font-semibold' : 'text-on-surface'}`}
                  onClick={() => { setTimeFilter('30d'); setIsFilterOpen(false); }}
                >Últimos 30 días</button>
                <button 
                  className={`px-4 py-2 text-left font-sans text-sm hover:bg-surface-container-low transition-colors ${timeFilter === 'all' ? 'bg-primary/10 text-primary font-semibold' : 'text-on-surface'}`}
                  onClick={() => { setTimeFilter('all'); setIsFilterOpen(false); }}
                >Histórico Completo</button>
              </div>
            )}
          </div>
          <button 
            onClick={() => toast.success('Reporte PDF exportado exitosamente')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-container text-on-primary font-sans text-sm font-medium shadow-sm hover:opacity-95 active:scale-[0.99] transition-all" 
            type="button"
          >
            <FileText className="w-4 h-4" />
            <span>Exportar PDF</span>
          </button>
        </div>
      </header>

      {/* 2. Top KPI Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
        {/* Card 1 */}
        <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-wider uppercase font-semibold text-on-surface-variant">
              Tasa de Retención Activa
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <Repeat className="w-5 h-5" />
            </div>
          </div>
          <div className="my-4 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-on-surface tracking-tight">{retentionRate}%</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container font-mono text-[11px] self-start font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Clientes con 2+ visitas históricas</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-wider uppercase font-semibold text-on-surface-variant">
              Ticket Promedio
            </span>
            <div className="w-9 h-9 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
          <div className="my-4 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-on-surface tracking-tight">AR$ {ticketPromedio.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-secondary font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>Calculado sobre {comprasCount} compras</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-wider uppercase font-semibold text-on-surface-variant">
              Distribución de Canjes
            </span>
            <div className="w-9 h-9 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
              <Gift className="w-5 h-5" />
            </div>
          </div>
          <div className="my-4 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-on-surface tracking-tight">{totalCanjes} Premios</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-primary font-semibold">
            <Gift className="w-4 h-4" />
            <span>~{canjesPromedio} canjes por día en promedio</span>
          </div>
        </div>
      </section>

      {/* 3. Middle Section: Economy & Liability Matrix */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
        {/* Left: Flujo de Puntos Chart */}
        <div className="lg:col-span-8 p-6 lg:p-7 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-4">
              <div>
                <h2 className="font-sans text-lg font-bold text-on-surface">
                  Flujo de Puntos (Emisión vs Canje)
                </h2>
                <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                  Comportamiento semanal de puntos inyectados en compras vs. puntos destruidos en canjes
                </p>
              </div>
              <div className="flex items-center gap-4 self-start sm:self-center font-mono text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-primary-container"></span>
                  <span className="text-on-surface font-semibold">Puntos Emitidos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1.5 rounded-full bg-secondary"></span>
                  <span className="text-on-surface font-semibold">Puntos Canjeados</span>
                </div>
              </div>
            </div>

            {/* SVG Chart Placeholder */}
            <div className="w-full h-64 my-2 relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 220">
                <defs>
                  <linearGradient id="forestGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#064e3b" stopOpacity="0.20"></stop>
                    <stop offset="100%" stopColor="#064e3b" stopOpacity="0.00"></stop>
                  </linearGradient>
                  <linearGradient id="amberGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#b45309" stopOpacity="0.18"></stop>
                    <stop offset="100%" stopColor="#b45309" stopOpacity="0.00"></stop>
                  </linearGradient>
                </defs>
                <line stroke="#e8e2da" strokeDasharray="3 3" strokeOpacity="0.8" x1="0" x2="600" y1="40" y2="40"></line>
                <line stroke="#e8e2da" strokeDasharray="3 3" strokeOpacity="0.8" x1="0" x2="600" y1="100" y2="100"></line>
                <line stroke="#e8e2da" strokeDasharray="3 3" strokeOpacity="0.8" x1="0" x2="600" y1="160" y2="160"></line>
                <line stroke="#e8e2da" strokeOpacity="0.8" x1="0" x2="600" y1="200" y2="200"></line>
                <path d="M 30,130 C 130,115 170,105 230,85 C 320,60 380,45 450,30 C 510,18 550,15 570,10 L 570,200 L 30,200 Z" fill="url(#forestGradient)"></path>
                <path d="M 30,130 C 130,115 170,105 230,85 C 320,60 380,45 450,30 C 510,18 550,15 570,10" fill="none" stroke="#064e3b" strokeLinecap="round" strokeWidth="3.5"></path>
                <path d="M 30,180 C 130,170 170,160 230,145 C 320,130 380,115 450,100 C 510,90 550,85 570,80 L 570,200 L 30,200 Z" fill="url(#amberGradient)"></path>
                <path d="M 30,180 C 130,170 170,160 230,145 C 320,130 380,115 450,100 C 510,90 550,85 570,80" fill="none" stroke="#b45309" strokeDasharray="4 2" strokeLinecap="round" strokeWidth="2.5"></path>
                <circle cx="30" cy="130" fill="#064e3b" r="4.5" className="shadow-xs"></circle>
                <circle cx="230" cy="85" fill="#064e3b" r="4.5"></circle>
                <circle cx="450" cy="30" fill="#064e3b" r="4.5"></circle>
                <circle cx="570" cy="10" fill="#064e3b" r="5"></circle>
                <circle cx="30" cy="180" fill="#b45309" r="3.5"></circle>
                <circle cx="230" cy="145" fill="#b45309" r="3.5"></circle>
                <circle cx="450" cy="100" fill="#b45309" r="3.5"></circle>
                <circle cx="570" cy="80" fill="#b45309" r="4"></circle>
              </svg>
            </div>
            
            <div className="flex justify-between px-4 pt-1 font-mono text-[11px] text-on-surface-variant font-medium">
              <span>Semana 1 (65k / 22k)</span>
              <span>Semana 2 (72k / 28k)</span>
              <span>Semana 3 (85k / 35k)</span>
              <span>Semana 4 (94k / 41k)</span>
            </div>
          </div>

          <div className="mt-6 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container-low rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-mono text-[11px] font-bold flex items-center gap-1">
                <Leaf className="w-4 h-4" />
                Ratio de Quema (Burn): {burnRate}%
              </span>
              <span className="font-sans text-xs text-on-surface-variant hidden md:inline">
                (Estándar del sector: 35-50%)
              </span>
            </div>
            <div className="font-mono text-[11px] font-semibold text-primary">
              Puntos Netos en Circulación: <span className={`font-bold ${puntosNetos >= 0 ? 'text-secondary' : 'text-error'}`}>{puntosNetos > 0 ? '+' : ''}{puntosNetos.toLocaleString()} pts</span>
            </div>
          </div>
        </div>

        {/* Right: Pasivo de Premios */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-surface-container shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-error-container text-on-error-container flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h2 className="font-sans text-lg font-bold text-on-surface">Pasivo de Premios</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant font-mono text-[11px] font-semibold">
                Latente
              </span>
            </div>
            <div>
              <div className="font-display text-4xl font-extrabold text-on-surface leading-none mt-1">
                {totalLatentes} Clientes
              </div>
              <p className="font-sans text-xs text-on-surface-variant mt-2">
                Tienen saldo suficiente para reclamar premios al instante. Impacto de inventario pendiente de reserva.
              </p>
            </div>
            
            <div className="flex flex-col gap-2.5 mt-2">
              {pasivoPremios.map((premio, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-tertiary' : 'bg-secondary'}`}></span>
                    <span className="font-sans text-sm font-semibold text-on-surface">{premio.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[11px] font-bold text-on-surface block">{premio.count} clientes</span>
                    <span className="font-mono text-[11px] text-on-surface-variant block">Latente</span>
                  </div>
                </div>
              ))}
              {pasivoPremios.length === 0 && (
                <div className="p-3 text-center text-on-surface-variant font-mono text-xs bg-surface-container-lowest rounded-xl">
                  No hay pasivo pendiente
                </div>
              )}
            </div>
          </div>
          
          <button 
            onClick={() => toast.success('Recordatorios enviados por WhatsApp a clientes elegibles')}
            className="mt-6 w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-surface-container-lowest text-primary font-sans text-sm font-bold shadow-sm hover:bg-surface-bright active:scale-[0.99] transition-all" 
            type="button"
          >
            <Mail className="w-5 h-5" />
            <span>Enviar recordatorio de canje (WhatsApp / SMS)</span>
          </button>
        </div>
      </section>

      {/* 4. Bottom Section: VIP Customers & Rewards Distribution */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg items-stretch mt-space-md">
        {/* Left: VIPs */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-space-md">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-tertiary" />
                <h2 className="font-sans text-lg font-bold text-on-surface">Top 5 Clientes VIP</h2>
              </div>
              <span className="font-mono text-[11px] text-secondary bg-secondary-container/30 px-2.5 py-0.5 rounded-full font-semibold">Mayor Valor Histórico</span>
            </div>
            <p className="font-sans text-sm text-on-surface-variant">Clientes con mayor gasto acumulado y puntos activos en la billetera.</p>
          </div>
          
          <div className="flex flex-col divide-y divide-surface-container">
            {topVIPs.map((vip, i) => (
              <div key={vip.id} className="py-3 flex items-center justify-between hover:bg-surface-container-low px-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full font-mono text-[11px] font-bold flex items-center justify-center ${i < 2 ? 'bg-primary-fixed text-primary' : 'bg-surface-container text-on-surface'}`}>
                    {vip.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans text-sm font-bold text-on-surface">{vip.name}</span>
                    <span className="font-sans text-xs text-on-surface-variant">Puntos Actuales: <strong className="text-on-surface">{vip.points.toLocaleString()}</strong></span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                    i === 0 ? 'bg-surface-container-highest text-on-surface' :
                    i === 1 ? 'bg-surface-container-highest text-on-surface' :
                    'bg-surface-container text-on-surface-variant'
                  }`}>
                    {i === 0 ? 'VIP Oro' : i === 1 ? 'VIP Plata' : 'VIP Bronce'}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-on-surface min-w-[95px] text-right">
                    AR$ {vip.totalSpent.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
            {topVIPs.length === 0 && (
              <div className="py-8 text-center text-on-surface-variant font-mono text-xs">
                Sin clientes registrados aún.
              </div>
            )}
          </div>
          
          <div className="pt-2">
            <Link to="/crm" className="inline-flex items-center gap-1 text-primary hover:text-tertiary font-sans text-sm font-semibold transition-colors">
              Ver todos los clientes fidelizados
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right: Ranking de Recompensas */}
        <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-sans text-lg font-bold text-on-surface">Ranking de Recompensas</h2>
                <p className="font-sans text-xs text-on-surface-variant mt-0.5">Premios preferidos y concentración porcentual de redenciones</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
                <PieChart className="w-5 h-5" />
              </div>
            </div>
            
            <div className="flex flex-col gap-5 mt-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-sm font-bold text-on-surface flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                    Postre Gratis
                  </span>
                  <span className="font-mono text-[11px] font-bold text-primary">85% <span className="font-normal text-on-surface-variant">(121 canjes)</span></span>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-container-high overflow-hidden">
                  <div className="h-full rounded-full bg-primary-container transition-all" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-sm font-bold text-on-surface flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                    15% Descuento
                  </span>
                  <span className="font-mono text-[11px] font-bold text-tertiary">10% <span className="font-normal text-on-surface-variant">(14 canjes)</span></span>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-container-high overflow-hidden">
                  <div className="h-full rounded-full bg-tertiary transition-all" style={{ width: '10%' }}></div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-sm font-bold text-on-surface flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    Bebida de Cortesía
                  </span>
                  <span className="font-mono text-[11px] font-bold text-secondary">5% <span className="font-normal text-on-surface-variant">(7 canjes)</span></span>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-container-high overflow-hidden">
                  <div className="h-full rounded-full bg-secondary transition-all" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 rounded-xl bg-surface-container-low flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <span className="font-sans text-xs font-bold text-on-surface block">Insight Estratégico de Menú</span>
              <p className="font-sans text-xs text-on-surface-variant mt-0.5">
                El <strong>'Postre Gratis'</strong> concentra el 85% del incentivo de compra. Presenta un margen operativo de coste protegido (&lt;AR$ 500 por plato) y la mayor tasa de satisfacción percibida en checkout.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
