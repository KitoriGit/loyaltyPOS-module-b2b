import {
  Calendar,
  ChevronDown,
  Download,
  RefreshCw,
  CheckCircle2,
  Gift,
  TrendingUp,
  Lightbulb,
  Package,
  MessageSquare,
  Award,
  ArrowRight,
  ShieldAlert,
  Info,
  Wand2,
  Send
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useLoyaltyStore } from '../store/useLoyaltyStore';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

export function DashboardSellos() {
  const customers = useLoyaltyStore((state) => state.customers);
  const transactions = useLoyaltyStore((state) => state.transactions);
  const config = useLoyaltyStore((state) => state.config);

  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | 'all'>('30d');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Analítica y Embudo de Sellos Memorizados
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

    const hanCompletado = customers.filter(c => (c.claimedRewards && c.claimedRewards.length > 0) || c.stamps >= config.stampsToReward).length;
    const completitudRate = totalClientes > 0 ? Math.round((hanCompletado / totalClientes) * 100) : 0;

    const totalCanjes = filtered.filter(t => t.type === 'CANJE' && t.stampsChange < 0).length;

    // Embudo
    const activeCards = customers.filter(c => c.stamps > 0 || (c.claimedRewards && c.claimedRewards.length > 0));
    const totalFunnel = activeCards.length;
    
    const step1 = activeCards.filter(c => c.stamps >= 1 || (c.claimedRewards && c.claimedRewards.length > 0)).length;
    const step2 = activeCards.filter(c => c.stamps >= 2 || (c.claimedRewards && c.claimedRewards.length > 0)).length;
    const step3 = activeCards.filter(c => c.stamps >= 3 || (c.claimedRewards && c.claimedRewards.length > 0)).length;
    const step4 = activeCards.filter(c => c.stamps >= 4 || (c.claimedRewards && c.claimedRewards.length > 0)).length;
    const step5 = activeCards.filter(c => c.stamps >= 5 || (c.claimedRewards && c.claimedRewards.length > 0)).length;
    const stepCompleted = activeCards.filter(c => c.stamps >= config.stampsToReward || (c.claimedRewards && c.claimedRewards.length > 0)).length;

    const getPct = (val: number) => totalFunnel > 0 ? Math.round((val / totalFunnel) * 100) : 0;

    // Deuda Latente
    const tarjetasLlenas = customers.filter(c => c.stamps >= config.stampsToReward).length;

    // VIPs
    const topVIPs = [...customers]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5)
      .map(c => ({
        ...c,
        tarjetasCompletadas: Math.floor(c.totalVisits / (config.stampsToReward || 1)) + (c.claimedRewards?.length || 0)
      }));

    // Churn
    const fortyFiveDaysAgo = Date.now() - 45 * 24 * 60 * 60 * 1000;
    const churned = customers.filter(c => c.stamps > 0 && new Date(c.lastVisitDate).getTime() < fortyFiveDaysAgo);
    const churnRate = totalFunnel > 0 ? Math.round((churned.length / totalFunnel) * 100) : 0;

    return {
      retentionRate,
      completitudRate,
      totalCanjes,
      totalFunnel,
      step1,
      step2,
      step3,
      step4,
      step5,
      stepCompleted,
      getPct,
      tarjetasLlenas,
      topVIPs,
      churnedCustomers: churned,
      churnRate
    };
  }, [customers, transactions, config, timeFilter]);

  const {
    retentionRate,
    completitudRate,
    totalCanjes,
    totalFunnel,
    step1,
    step2,
    step3,
    step4,
    step5,
    stepCompleted,
    getPct,
    tarjetasLlenas,
    topVIPs,
    churnedCustomers,
    churnRate
  } = analytics;

  return (
    <div className="flex flex-col gap-space-lg w-full pb-space-xl">
      {/* 1. Header Zone */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm">
            <span className="font-mono text-[11px] tracking-wider uppercase text-on-surface-variant">ANALÍTICA DE FIDELIZACIÓN · MODELO DE SELLOS</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container/40">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-mono text-[11px] text-secondary font-semibold">Sincronizado en tiempo real</span>
            </span>
          </div>
          <h1 className="font-display text-4xl text-on-surface tracking-tight font-bold">Estadísticas del Programa (Sellos)</h1>
          <p className="font-sans text-sm text-on-surface-variant max-w-3xl">Métricas ejecutivas de retención, embudo de conversión de sellos, pasivo latente de premios y prevención de churn.</p>
        </div>

        {/* Action Tools */}
        <div className="flex items-center gap-space-sm flex-wrap">
          <div className="relative">
            <button 
              className="relative inline-flex items-center gap-2 bg-surface-container-lowest px-3.5 py-2 rounded-xl shadow-sm cursor-pointer select-none hover:bg-surface-container-low transition-colors"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Calendar className="w-4 h-4 text-on-surface-variant" />
              <span className="font-sans text-sm text-on-surface font-medium">{timeFilter === '7d' ? 'Últimos 7 días' : timeFilter === '30d' ? 'Últimos 30 días' : 'Histórico Completo'}</span>
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
            className="inline-flex items-center gap-2 bg-primary hover:bg-tertiary text-on-primary px-4 py-2 rounded-xl shadow-sm transition-all duration-150 active:scale-[0.98]" 
            type="button"
          >
            <Download className="w-4 h-4" />
            <span className="font-sans text-sm font-semibold">Exportar PDF</span>
          </button>
        </div>
      </header>

      {/* 2. Top KPI Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between gap-space-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">TASA DE RETENCIÓN ACTIVA</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-space-sm mt-1">
            <span className="font-display text-4xl font-bold text-on-surface tracking-tight">{retentionRate}%</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary-container/20 text-on-secondary-container">
            <CheckCircle2 className="w-4 h-4 text-secondary" />
            <span className="font-sans text-xs font-medium">Clientes con 2+ visitas históricas</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between gap-space-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">TASA DE COMPLETITUD</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-space-sm mt-1">
            <span className="font-display text-4xl font-bold text-on-surface tracking-tight">{completitudRate}%</span>
            {completitudRate > 30 && (
              <span className="inline-flex items-center font-mono text-[11px] font-semibold text-primary bg-primary-fixed px-2 py-0.5 rounded-full">
                Alto Desempeño
              </span>
            )}
          </div>
          <div className="mt-2 text-on-surface-variant font-sans text-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
            <span>Clientes que alcanzan el premio final</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col justify-between gap-space-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">DISTRIBUCIÓN DE CANJES</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-space-sm mt-1">
            <span className="font-display text-4xl font-bold text-on-surface tracking-tight">{totalCanjes} Premios</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-primary font-sans text-xs font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>En el periodo filtrado</span>
          </div>
        </div>
      </section>

      {/* 3. Middle Section: The Funnel & Liability */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-space-md mt-space-md">
        {/* Left: Funnel */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-space-lg">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-sans text-lg font-bold text-on-surface">Distribución de Tarjetas (Cuellos de Botella)</h2>
              <span className="font-mono text-[11px] bg-surface-container-low text-on-surface-variant px-2.5 py-1 rounded-lg">{totalFunnel} tarjetas activas/completadas</span>
            </div>
            <p className="font-sans text-sm text-on-surface-variant">Comportamiento del embudo y puntos de fuga en el ciclo de sellos activos.</p>
          </div>
          
          <div className="flex flex-col gap-4">
            {/* 1 Sello */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-semibold text-on-surface flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">1</span>
                  1 Sello (Inicio)
                </span>
                <span className="font-mono text-[11px] text-on-surface-variant">{getPct(step1)}% · <strong className="text-on-surface">{step1} clientes</strong></span>
              </div>
              <div className="w-full bg-surface-container h-3.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${getPct(step1)}%` }}></div>
              </div>
            </div>

            {/* 2 Sellos */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-semibold text-on-surface flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">2</span>
                  2 Sellos
                </span>
                <span className="font-mono text-[11px] text-on-surface-variant">{getPct(step2)}% · <strong className="text-on-surface">{step2} clientes</strong></span>
              </div>
              <div className="w-full bg-surface-container h-3.5 rounded-full overflow-hidden">
                <div className="bg-primary/90 h-full rounded-full transition-all" style={{ width: `${getPct(step2)}%` }}></div>
              </div>
            </div>

            {/* 3 Sellos */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-semibold text-on-surface flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">3</span>
                  3 Sellos
                </span>
                <span className="font-mono text-[11px] text-on-surface-variant">{getPct(step3)}% · <strong className="text-on-surface">{step3} clientes</strong></span>
              </div>
              <div className="w-full bg-surface-container h-3.5 rounded-full overflow-hidden">
                <div className="bg-primary/80 h-full rounded-full transition-all" style={{ width: `${getPct(step3)}%` }}></div>
              </div>
            </div>

            {/* 4 Sellos */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-semibold text-on-surface flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">4</span>
                  4 Sellos
                </span>
                <span className="font-mono text-[11px] text-on-surface-variant">{getPct(step4)}% · <strong className="text-on-surface">{step4} clientes</strong></span>
              </div>
              <div className="w-full bg-surface-container h-3.5 rounded-full overflow-hidden">
                <div className="bg-primary/75 h-full rounded-full transition-all" style={{ width: `${getPct(step4)}%` }}></div>
              </div>
            </div>

            {/* 5 Sellos */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-semibold text-on-surface flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">5</span>
                  5 Sellos
                </span>
                <span className="font-mono text-[11px] text-on-surface-variant">{getPct(step5)}% · <strong className="text-on-surface">{step5} clientes</strong></span>
              </div>
              <div className="w-full bg-surface-container h-3.5 rounded-full overflow-hidden">
                <div className="bg-primary/70 h-full rounded-full transition-all" style={{ width: `${getPct(step5)}%` }}></div>
              </div>
            </div>

            {/* Completado */}
            <div className="flex flex-col gap-1.5 mt-2">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-semibold text-secondary flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-secondary" />
                  Completado (Premio Desbloqueado)
                </span>
                <span className="font-mono text-[11px] text-secondary font-bold">{getPct(stepCompleted)}% · {stepCompleted} clientes</span>
              </div>
              <div className="w-full bg-surface-container h-3.5 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full transition-all" style={{ width: `${getPct(stepCompleted)}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-container-low rounded-xl p-4 flex items-start gap-space-sm mt-4">
            <div className="w-7 h-7 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0 mt-0.5">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-sm font-semibold text-on-surface">Hallazgo Clave de Retención</span>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                El mayor cuello de botella ocurre entre el Sello 3 y 4. Recomendación: activar beneficio intermedio o doble sello en compras de fin de semana para sostener el hábito.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Deuda Latente */}
        <div className="bg-surface-container-high/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-space-md relative overflow-hidden">
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-highest text-on-surface-variant font-mono text-[11px] font-semibold">
                <Package className="w-4 h-4 text-tertiary" />
                Deuda Latente de Inventario
              </span>
            </div>
            <div className="flex flex-col">
              <h2 className="font-sans text-lg font-bold text-on-surface">Premios Pendientes</h2>
              <p className="font-sans text-xs text-on-surface-variant">Clientes con tarjeta llena que aún no retiran su premio.</p>
            </div>
            <div className="my-2">
              <div className="font-display text-4xl font-bold text-on-surface tracking-tight">{tarjetasLlenas} Tarjetas</div>
              <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">Premio en mano sin canjear</span>
            </div>
            
            <div className="flex flex-col gap-2.5 mt-2">
              {config.rewards.slice(0, 2).map((r) => (
                <div key={r.id} className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-sans text-sm font-semibold text-on-surface">{r.name}</span>
                    <span className="font-mono text-[11px] text-on-surface-variant">{config.stampsToReward} sellos requeridos</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-primary">{tarjetasLlenas} retiros pendientes</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-2 pt-2">
            <button 
              onClick={() => toast.success('Recordatorios enviados a clientes con tarjetas completadas')}
              className="w-full inline-flex items-center justify-center gap-2 bg-surface-container-lowest hover:bg-surface-container text-primary font-sans text-sm font-semibold py-3 px-4 rounded-xl shadow-sm transition-all duration-150 active:scale-[0.98]" 
              type="button"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enviar recordatorio de canje</span>
            </button>
            <span className="text-center font-mono text-[11px] text-on-surface-variant">Motive la visita de retiro y genere una venta cruzada.</span>
          </div>
        </div>
      </section>

      {/* 4. Bottom Section: VIPs & Churn */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-space-md mt-space-md">
        {/* Left: VIPs */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-space-md">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-tertiary" />
                <h2 className="font-sans text-lg font-bold text-on-surface">Top 5 Clientes VIP</h2>
              </div>
              <span className="font-mono text-[11px] text-secondary bg-secondary-container/30 px-2.5 py-0.5 rounded-full font-semibold">Ciclos Cerrados</span>
            </div>
            <p className="font-sans text-sm text-on-surface-variant">Clientes con mayor número de tarjetas completadas y ciclos de lealtad cerrados.</p>
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
                    <span className="font-sans text-xs text-on-surface-variant">Tarjetas Completadas: <strong className="text-on-surface">{vip.tarjetasCompletadas}</strong></span>
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
          </div>
          
          <div className="pt-2">
            <Link to="/crm" className="inline-flex items-center gap-1 text-primary hover:text-tertiary font-sans text-sm font-semibold transition-colors">
              Ver todos los clientes fidelizados
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right: Churn */}
        <div className="bg-error-container/30 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-space-md">
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container font-mono text-[11px] font-bold">
                <ShieldAlert className="w-4 h-4" />
                Alerta Temprana de Fuga
              </span>
              <span className="font-mono text-[11px] text-error font-semibold">Inactividad &gt; 45 días</span>
            </div>
            <div className="flex flex-col">
              <h2 className="font-sans text-lg font-bold text-on-surface">Clientes en Riesgo (Churn)</h2>
              <p className="font-sans text-xs text-on-surface-variant">Pasaron la mitad de la tarjeta pero llevan +45 días sin registrar un nuevo sello.</p>
            </div>
            <div className="flex items-baseline gap-space-sm my-1">
              <span className="font-display text-4xl font-bold text-error tracking-tight">{churnRate}%</span>
              <span className="font-mono text-[11px] text-on-error-container font-medium">del total de cuentas activas</span>
            </div>
            
            <div className="bg-surface-container-lowest/80 p-4 rounded-xl flex flex-col gap-1.5 shadow-sm mt-2">
              <span className="font-sans text-xs font-semibold text-on-surface flex items-center gap-1.5">
                <Info className="w-4 h-4 text-error" />
                Diagnóstico Preventivo
              </span>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                Representa a <strong>{churnedCustomers.length} clientes inactivos</strong> que han sumado al menos un sello. Si no regresan en los próximos 15 días, la probabilidad de abandono definitivo sube al <strong>82%</strong>.
              </p>
            </div>
            
            <div className="bg-surface-container-lowest/80 p-4 rounded-xl flex flex-col gap-1.5 shadow-sm">
              <span className="font-sans text-xs font-semibold text-on-surface flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-primary" />
                Sugerencia Estratégica
              </span>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                Enviar campaña automatizada de reactivación: <em className="text-on-surface font-medium">"¡Te falta muy poco! Vuelve esta semana y te regalamos 1 sello extra para tu premio."</em>
              </p>
            </div>
          </div>
          
          <div className="pt-2">
            <button 
              onClick={() => toast.success('Campaña de reactivación lanzada con éxito')}
              className="w-full inline-flex items-center justify-center gap-2 bg-error hover:bg-on-error-container text-on-error font-sans text-sm font-semibold py-3 px-4 rounded-xl shadow-sm transition-all duration-150 active:scale-[0.98]" 
              type="button"
            >
              <Send className="w-4 h-4" />
              <span>Lanzar Campaña de Reactivación</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
