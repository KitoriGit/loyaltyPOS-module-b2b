import {
  Calendar,
  ChevronDown,
  FileText,
  Repeat,
  ArrowUp,
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

export function DashboardPuntos() {
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
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface font-sans text-sm font-semibold shadow-sm hover:bg-surface-container-high transition-colors" type="button">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Últimos 30 días</span>
              <ChevronDown className="w-4 h-4 text-on-surface-variant" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-container text-on-primary font-sans text-sm font-medium shadow-sm hover:opacity-95 active:scale-[0.99] transition-all" type="button">
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
            <span className="font-display text-4xl font-bold text-on-surface tracking-tight">68%</span>
            <span className="font-mono text-xs text-secondary font-semibold flex items-center">
              <ArrowUp className="w-4 h-4 mr-0.5" /> +4.2%
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container font-mono text-[11px] self-start font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Clientes con 2+ visitas en 30 días</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-wider uppercase font-semibold text-on-surface-variant">
              Ticket Promedio (Fidelizados)
            </span>
            <div className="w-9 h-9 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
          <div className="my-4 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-on-surface tracking-tight">AR$ 15,400</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-secondary font-semibold">
            <TrendingUp className="w-4 h-4" />
            <span>+12% vs clientes regulares</span>
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
            <span className="font-display text-4xl font-bold text-on-surface tracking-tight">142 Premios</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-primary font-semibold">
            <Gift className="w-4 h-4" />
            <span>+15% vs mes anterior</span>
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
                  <linearGradient id="purpleGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.22"></stop>
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.00"></stop>
                  </linearGradient>
                  <linearGradient id="mintGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#006c49" stopOpacity="0.15"></stop>
                    <stop offset="100%" stopColor="#006c49" stopOpacity="0.00"></stop>
                  </linearGradient>
                </defs>
                <line stroke="#d3e4fe" strokeDasharray="3 3" strokeOpacity="0.5" x1="0" x2="600" y1="40" y2="40"></line>
                <line stroke="#d3e4fe" strokeDasharray="3 3" strokeOpacity="0.5" x1="0" x2="600" y1="100" y2="100"></line>
                <line stroke="#d3e4fe" strokeDasharray="3 3" strokeOpacity="0.5" x1="0" x2="600" y1="160" y2="160"></line>
                <line stroke="#c7c4d8" strokeOpacity="0.4" x1="0" x2="600" y1="200" y2="200"></line>
                <path d="M 30,130 C 130,115 170,105 230,85 C 320,60 380,45 450,30 C 510,18 550,15 570,10 L 570,200 L 30,200 Z" fill="url(#purpleGradient)"></path>
                <path d="M 30,130 C 130,115 170,105 230,85 C 320,60 380,45 450,30 C 510,18 550,15 570,10" fill="none" stroke="#4f46e5" strokeLinecap="round" strokeWidth="3.5"></path>
                <path d="M 30,180 C 130,170 170,160 230,145 C 320,130 380,115 450,100 C 510,90 550,85 570,80 L 570,200 L 30,200 Z" fill="url(#mintGradient)"></path>
                <path d="M 30,180 C 130,170 170,160 230,145 C 320,130 380,115 450,100 C 510,90 550,85 570,80" fill="none" stroke="#006c49" strokeDasharray="4 2" strokeLinecap="round" strokeWidth="2.5"></path>
                <circle cx="30" cy="130" fill="#4f46e5" r="4.5" className="shadow-sm"></circle>
                <circle cx="230" cy="85" fill="#4f46e5" r="4.5"></circle>
                <circle cx="450" cy="30" fill="#4f46e5" r="4.5"></circle>
                <circle cx="570" cy="10" fill="#4f46e5" r="5"></circle>
                <circle cx="30" cy="180" fill="#006c49" r="3.5"></circle>
                <circle cx="230" cy="145" fill="#006c49" r="3.5"></circle>
                <circle cx="450" cy="100" fill="#006c49" r="3.5"></circle>
                <circle cx="570" cy="80" fill="#006c49" r="4"></circle>
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
                Ratio de Quema Saludable: 43.6%
              </span>
              <span className="font-sans text-xs text-on-surface-variant hidden md:inline">
                (Estándar del sector: 35-50%)
              </span>
            </div>
            <div className="font-mono text-[11px] font-semibold text-primary">
              Puntos Netos en Circulación: <span className="font-bold text-on-surface">+53,000 pts</span> este mes
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
                45 Clientes
              </div>
              <p className="font-sans text-xs text-on-surface-variant mt-2">
                Ya cruzaron el umbral para un beneficio pero no lo han reclamado. Impacto de inventario pendiente de reserva.
              </p>
            </div>
            
            <div className="flex flex-col gap-2.5 mt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="font-sans text-sm font-semibold text-on-surface">Postre Gratis</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[11px] font-bold text-on-surface block">28 clientes</span>
                  <span className="font-mono text-[11px] text-on-surface-variant block">~AR$ 14,000 coste</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  <span className="font-sans text-sm font-semibold text-on-surface">15% Descuento</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[11px] font-bold text-on-surface block">12 clientes</span>
                  <span className="font-mono text-[11px] text-on-surface-variant block">Margen protegido</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  <span className="font-sans text-sm font-semibold text-on-surface">Cena Completa</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[11px] font-bold text-on-surface block">5 clientes</span>
                  <span className="font-mono text-[11px] text-on-surface-variant block">Segmento VIP Gold</span>
                </div>
              </div>
            </div>
          </div>
          
          <button className="mt-6 w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-surface-container-lowest text-primary font-sans text-sm font-bold shadow-sm hover:bg-surface-bright active:scale-[0.99] transition-all" type="button">
            <Mail className="w-5 h-5" />
            <span>Enviar recordatorio de canje (WhatsApp / SMS)</span>
          </button>
        </div>
      </section>

      {/* 4. Bottom Section: VIP Customers & Rewards Distribution */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg items-stretch mt-space-md">
        {/* Left: Top 5 VIPs */}
        <div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-sans text-lg font-bold text-on-surface">Top 5 Clientes VIP</h2>
                <p className="font-sans text-xs text-on-surface-variant mt-0.5">Mayor valor histórico generado en compras acumuladas por membresía</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                <Award className="w-5 h-5" />
              </div>
            </div>
            
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary font-bold flex items-center justify-center font-mono text-[11px]">MG</div>
                  <div>
                    <span className="font-sans text-sm font-bold text-on-surface block">Martín Gómez</span>
                    <span className="font-mono text-[11px] text-on-surface-variant">18 visitas acumuladas</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[11px] font-semibold text-primary block uppercase">VIP Tier Gold</span>
                  <span className="font-sans text-sm font-extrabold text-on-surface">AR$ 450,000</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-tertiary-fixed text-tertiary font-bold flex items-center justify-center font-mono text-[11px]">CL</div>
                  <div>
                    <span className="font-sans text-sm font-bold text-on-surface block">Camila López</span>
                    <span className="font-mono text-[11px] text-on-surface-variant">15 visitas acumuladas</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[11px] font-semibold text-primary block uppercase">VIP Tier Gold</span>
                  <span className="font-sans text-sm font-extrabold text-on-surface">AR$ 380,000</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-highest text-primary font-bold flex items-center justify-center font-mono text-[11px]">FR</div>
                  <div>
                    <span className="font-sans text-sm font-bold text-on-surface block">Facundo Rossi</span>
                    <span className="font-mono text-[11px] text-on-surface-variant">12 visitas acumuladas</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[11px] font-semibold text-on-surface-variant block uppercase">Silver</span>
                  <span className="font-sans text-sm font-extrabold text-on-surface">AR$ 320,000</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-secondary font-bold flex items-center justify-center font-mono text-[11px]">SR</div>
                  <div>
                    <span className="font-sans text-sm font-bold text-on-surface block">Sofía Rodríguez</span>
                    <span className="font-mono text-[11px] text-on-surface-variant">11 visitas acumuladas</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[11px] font-semibold text-on-surface-variant block uppercase">Silver</span>
                  <span className="font-sans text-sm font-extrabold text-on-surface">AR$ 295,000</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-highest text-on-surface-variant font-bold flex items-center justify-center font-mono text-[11px]">DB</div>
                  <div>
                    <span className="font-sans text-sm font-bold text-on-surface block">Diego Benítez</span>
                    <span className="font-mono text-[11px] text-on-surface-variant">9 visitas acumuladas</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[11px] font-semibold text-on-surface-variant block uppercase">Bronze</span>
                  <span className="font-sans text-sm font-extrabold text-on-surface">AR$ 260,000</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 flex justify-between items-center text-on-surface-variant font-mono text-[11px]">
            <span>Actualizado hace 12 min</span>
            <button className="font-sans text-xs text-primary font-bold hover:underline flex items-center gap-1" type="button">
              Ver CRM de Fidelizados
              <ArrowRight className="w-4 h-4" />
            </button>
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
