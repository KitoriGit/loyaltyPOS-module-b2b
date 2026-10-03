import {
  Calendar,
  ChevronDown,
  Download,
  RefreshCw,
  CheckCircle2,
  Gift,
  ArrowUp,
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

export function DashboardSellos() {
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
          <div className="relative inline-flex items-center gap-2 bg-surface-container-lowest px-3.5 py-2 rounded-xl shadow-sm cursor-pointer select-none hover:bg-surface-container-low transition-colors">
            <Calendar className="w-4 h-4 text-on-surface-variant" />
            <span className="font-sans text-sm text-on-surface font-medium">Últimos 30 días</span>
            <ChevronDown className="w-4 h-4 text-on-surface-variant" />
          </div>
          <button className="inline-flex items-center gap-2 bg-primary hover:bg-tertiary text-on-primary px-4 py-2 rounded-xl shadow-sm transition-all duration-150 active:scale-[0.98]" type="button">
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
            <span className="font-display text-4xl font-bold text-on-surface tracking-tight">62%</span>
            <span className="inline-flex items-center gap-0.5 font-mono text-[11px] font-semibold text-secondary bg-secondary-container/30 px-2 py-0.5 rounded-full">
              <ArrowUp className="w-3.5 h-3.5" />
              +3.8%
            </span>
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary-container/20 text-on-secondary-container">
            <CheckCircle2 className="w-4 h-4 text-secondary" />
            <span className="font-sans text-xs font-medium">Clientes con 2+ visitas en 30 días</span>
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
            <span className="font-display text-4xl font-bold text-on-surface tracking-tight">48%</span>
            <span className="inline-flex items-center font-mono text-[11px] font-semibold text-primary bg-primary-fixed px-2 py-0.5 rounded-full">
              Alto Desempeño
            </span>
          </div>
          <div className="mt-2 text-on-surface-variant font-sans text-xs flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
            <span>De los usuarios que inician, casi la mitad llega al premio final</span>
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
            <span className="font-display text-4xl font-bold text-on-surface tracking-tight">98 Premios</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-primary font-sans text-xs font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>+5% vs mes anterior</span>
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
              <span className="font-mono text-[11px] bg-surface-container-low text-on-surface-variant px-2.5 py-1 rounded-lg">850 tarjetas evaluadas</span>
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
                <span className="font-mono text-[11px] text-on-surface-variant">100% · <strong className="text-on-surface">850 clientes</strong></span>
              </div>
              <div className="w-full bg-surface-container h-3.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all" style={{ width: '100%' }}></div>
              </div>
            </div>

            {/* 2 Sellos */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-semibold text-on-surface flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">2</span>
                  2 Sellos
                </span>
                <span className="font-mono text-[11px] text-on-surface-variant">70% · <strong className="text-on-surface">595 clientes</strong></span>
              </div>
              <div className="w-full bg-surface-container h-3.5 rounded-full overflow-hidden">
                <div className="bg-primary/90 h-full rounded-full transition-all" style={{ width: '70%' }}></div>
              </div>
            </div>

            {/* 3 Sellos */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-semibold text-on-surface flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">3</span>
                  3 Sellos (Hábito Inicial)
                </span>
                <span className="font-mono text-[11px] text-on-surface-variant">65% · <strong className="text-on-surface">552 clientes</strong></span>
              </div>
              <div className="w-full bg-surface-container h-3.5 rounded-full overflow-hidden">
                <div className="bg-primary/80 h-full rounded-full transition-all" style={{ width: '65%' }}></div>
              </div>
            </div>

            {/* 4 Sellos */}
            <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-error-container/20 -mx-2">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-semibold text-error flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-error/20 text-error flex items-center justify-center font-bold text-[10px]">4</span>
                  4 Sellos (Cuello Crítico)
                  <span className="ml-2 font-mono text-[11px] bg-error-container text-on-error-container px-2 py-0.5 rounded-full font-bold">Punto de mayor fricción (-25%)</span>
                </span>
                <span className="font-mono text-[11px] text-error font-bold">40% · 340 clientes</span>
              </div>
              <div className="w-full bg-surface-container h-3.5 rounded-full overflow-hidden">
                <div className="bg-error h-full rounded-full transition-all" style={{ width: '40%' }}></div>
              </div>
            </div>

            {/* 5 Sellos */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-semibold text-on-surface flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">5</span>
                  5 Sellos (Momento Inercial)
                </span>
                <span className="font-mono text-[11px] text-on-surface-variant">38% · <strong className="text-on-surface">323 clientes</strong></span>
              </div>
              <div className="w-full bg-surface-container h-3.5 rounded-full overflow-hidden">
                <div className="bg-primary/70 h-full rounded-full transition-all" style={{ width: '38%' }}></div>
              </div>
            </div>

            {/* Completado */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-semibold text-secondary flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-secondary" />
                  Completado (Premio Desbloqueado)
                </span>
                <span className="font-mono text-[11px] text-secondary font-bold">35% · 297 clientes</span>
              </div>
              <div className="w-full bg-surface-container h-3.5 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full transition-all" style={{ width: '35%' }}></div>
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
              <div className="font-display text-4xl font-bold text-on-surface tracking-tight">32 Tarjetas</div>
              <span className="font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">Premio en mano sin canjear</span>
            </div>
            
            <div className="flex flex-col gap-2.5 mt-2">
              <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-semibold text-on-surface">Docena de Cookies / Recompensa Base</span>
                  <span className="font-mono text-[11px] text-on-surface-variant">22 tarjetas completadas</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-primary">~AR$ 19,800</span>
              </div>
              <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-semibold text-on-surface">Combo Almuerzo Especial</span>
                  <span className="font-mono text-[11px] text-on-surface-variant">10 tarjetas completadas</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-primary">~AR$ 25,000</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 pt-2">
            <button className="w-full inline-flex items-center justify-center gap-2 bg-surface-container-lowest hover:bg-surface-container text-primary font-sans text-sm font-semibold py-3 px-4 rounded-xl shadow-sm transition-all duration-150 active:scale-[0.98]" type="button">
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
            <div className="py-3 flex items-center justify-between hover:bg-surface-container-low px-2 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary font-mono text-[11px] font-bold flex items-center justify-center">MG</div>
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-bold text-on-surface">Martín Gómez</span>
                  <span className="font-sans text-xs text-on-surface-variant">Tarjetas Completadas: <strong className="text-on-surface">12</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-semibold">VIP Oro</span>
                <span className="font-mono text-[11px] font-bold text-on-surface min-w-[95px] text-right">AR$ 228,000</span>
              </div>
            </div>
            
            <div className="py-3 flex items-center justify-between hover:bg-surface-container-low px-2 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary font-mono text-[11px] font-bold flex items-center justify-center">CL</div>
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-bold text-on-surface">Camila López</span>
                  <span className="font-sans text-xs text-on-surface-variant">Tarjetas Completadas: <strong className="text-on-surface">10</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-semibold">VIP Oro</span>
                <span className="font-mono text-[11px] font-bold text-on-surface min-w-[95px] text-right">AR$ 195,000</span>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between hover:bg-surface-container-low px-2 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container text-on-surface font-mono text-[11px] font-bold flex items-center justify-center">FR</div>
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-bold text-on-surface">Facundo Rossi</span>
                  <span className="font-sans text-xs text-on-surface-variant">Tarjetas Completadas: <strong className="text-on-surface">9</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-semibold">VIP Plata</span>
                <span className="font-mono text-[11px] font-bold text-on-surface min-w-[95px] text-right">AR$ 170,000</span>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between hover:bg-surface-container-low px-2 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container text-on-surface font-mono text-[11px] font-bold flex items-center justify-center">SR</div>
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-bold text-on-surface">Sofía Rodríguez</span>
                  <span className="font-sans text-xs text-on-surface-variant">Tarjetas Completadas: <strong className="text-on-surface">8</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-semibold">VIP Plata</span>
                <span className="font-mono text-[11px] font-bold text-on-surface min-w-[95px] text-right">AR$ 152,000</span>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between hover:bg-surface-container-low px-2 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant font-mono text-[11px] font-bold flex items-center justify-center">DB</div>
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-bold text-on-surface">Diego Benítez</span>
                  <span className="font-sans text-xs text-on-surface-variant">Tarjetas Completadas: <strong className="text-on-surface">7</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-semibold">VIP Bronce</span>
                <span className="font-mono text-[11px] font-bold text-on-surface min-w-[95px] text-right">AR$ 138,000</span>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <button className="inline-flex items-center gap-1 text-primary hover:text-tertiary font-sans text-sm font-semibold transition-colors" type="button">
              Ver todos los clientes fidelizados
              <ArrowRight className="w-4 h-4" />
            </button>
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
              <span className="font-display text-4xl font-bold text-error tracking-tight">18%</span>
              <span className="font-mono text-[11px] text-on-error-container font-medium">del total de cuentas activas</span>
            </div>
            
            <div className="bg-surface-container-lowest/80 p-4 rounded-xl flex flex-col gap-1.5 shadow-sm mt-2">
              <span className="font-sans text-xs font-semibold text-on-surface flex items-center gap-1.5">
                <Info className="w-4 h-4 text-error" />
                Diagnóstico Preventivo
              </span>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                Representa a <strong>61 clientes inactivos</strong> con 3 o 4 sellos acumulados. Si no regresan en los próximos 15 días, la probabilidad de abandono definitivo sube al <strong>82%</strong>.
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
            <button className="w-full inline-flex items-center justify-center gap-2 bg-error hover:bg-on-error-container text-on-error font-sans text-sm font-semibold py-3 px-4 rounded-xl shadow-sm transition-all duration-150 active:scale-[0.98]" type="button">
              <Send className="w-4 h-4" />
              <span>Lanzar Campaña de Reactivación</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
