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

export function CRM() {
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
            <button className="group flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-surface-container-lowest shadow-sm hover:bg-surface-container-high transition-all text-on-surface-variant hover:text-on-surface" type="button">
              <Shield className="w-5 h-5 text-tertiary" />
              <span className="font-sans text-sm font-medium">Ajuste de Saldo Manual</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-mono text-[11px] shadow-sm">M</kbd>
            </button>
            <button className="flex items-center gap-2 px-space-md py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container shadow-sm transition-all active:scale-[0.99]" type="button">
              <Download className="w-5 h-5" />
              <span className="font-sans text-sm font-semibold">Exportar Reporte</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-on-primary font-mono text-[11px]">Ctrl+E</kbd>
            </button>
          </div>
        </div>

        {/* Sleek Inline Navigation Tabs */}
        <div className="flex items-center gap-space-md bg-surface-container-lowest rounded-xl px-space-md py-1 shadow-sm mt-space-xs overflow-x-auto">
          <button className="relative flex items-center gap-2 py-3 px-3 font-sans text-sm font-bold text-primary whitespace-nowrap" type="button">
            <ReceiptText className="w-5 h-5" />
            <span>Log de Movimientos</span>
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-mono text-[11px]">2,184</span>
            <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"></span>
          </button>
          <button className="group flex items-center gap-2 py-3 px-3 font-sans text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap" type="button">
            <Award className="w-5 h-5 text-outline group-hover:text-on-surface transition-colors" />
            <span>Listado de Clientes (VIPs)</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-mono text-[11px]">842</span>
          </button>
          <button className="group flex items-center gap-2 py-3 px-3 font-sans text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap" type="button">
            <ShieldCheck className="w-5 h-5 text-outline group-hover:text-on-surface transition-colors" />
            <span>Alertas de Auditoría</span>
            <span className="w-2 h-2 rounded-full bg-error ring-4 ring-error-container"></span>
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
                <span className="font-display text-4xl font-bold text-secondary tracking-tight">12,450</span>
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
                <span className="font-display text-4xl font-bold text-primary tracking-tight">8</span>
                <span className="font-mono text-[11px] text-outline">artículos</span>
              </div>
            </div>
            <div className="w-11 h-11 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <Gift className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-space-md pt-space-sm bg-surface-container-low/50 rounded-xl px-space-sm py-1.5">
            <span className="font-sans text-xs text-on-surface-variant font-medium">6 Gaseosas, 2 Descuentos 15%</span>
            <span className="font-mono text-[11px] text-primary font-semibold">100% stock OK</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-outline">Ajustes Manuales</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display text-4xl font-bold text-error tracking-tight">1</span>
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
              1 auditoría pendiente de firma
            </span>
            <span className="font-mono text-[11px] text-error font-bold underline cursor-pointer">REVISAR</span>
          </div>
        </div>
      </div>

      {/* Main Data Table Container */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Controls Toolbar */}
        <div className="p-space-md lg:p-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md bg-surface-container-lowest">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input className="w-full pl-10 pr-16 py-2.5 rounded-xl bg-surface-container-low text-sm font-sans text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest transition-all" placeholder="Buscar por DNI o Nombre... [Ctrl+K]" type="text" />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono text-[11px] shadow-sm">Ctrl+K</kbd>
          </div>
          
          {/* Filter Dropdowns */}
          <div className="flex items-center gap-space-sm w-full md:w-auto flex-wrap justify-end">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low text-on-surface-variant font-mono text-[11px]">
              <span className="text-outline">Rango:</span>
              <select className="bg-transparent text-on-surface font-semibold focus:outline-none cursor-pointer">
                <option>Hoy</option>
                <option>Últimas 24 hs</option>
                <option>Últimos 7 días</option>
                <option>Mes actual</option>
              </select>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low text-on-surface-variant font-mono text-[11px]">
              <span className="text-outline">Terminal:</span>
              <select className="bg-transparent text-on-surface font-semibold focus:outline-none cursor-pointer">
                <option>Todas las Cajas</option>
                <option>Caja 01 - Sarah J.</option>
                <option>Caja 02 - Marcos A.</option>
                <option>Admin / Backoffice</option>
              </select>
            </div>
            <button className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant transition-colors" title="Refrescar lista" type="button">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
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
              {/* Row 1 */}
              <tr className="hover:bg-surface-container-low/40 transition-colors group">
                <td className="py-4 px-6 font-mono text-[11px] text-on-surface-variant whitespace-nowrap">
                  <span className="text-on-surface font-medium">03 Oct 2026</span>
                  <span className="text-outline text-[10px] block mt-0.5">14:30:12</span>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary font-bold flex items-center justify-center font-mono text-[11px] shadow-sm">
                      JP
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans text-sm font-semibold text-on-surface">Juan Pérez</span>
                      <span className="font-mono text-[11px] text-outline">(34.567.890)</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container font-mono text-[11px] font-semibold">
                    <PlusCircle className="w-4 h-4" />
                    +300 Pts (Compra)
                  </span>
                </td>
                <td className="py-4 px-6 font-mono text-sm font-bold text-on-surface whitespace-nowrap">
                  AR$ 15,000
                </td>
                <td className="py-4 px-6 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-surface-container font-mono text-[11px] text-secondary font-semibold">Verificado ✓</span>
                    <span className="font-mono text-[11px] font-semibold text-outline">#9dfa2</span>
                  </div>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-surface-container-low/40 transition-colors group">
                <td className="py-4 px-6 font-mono text-[11px] text-on-surface-variant whitespace-nowrap">
                  <span className="text-on-surface font-medium">03 Oct 2026</span>
                  <span className="text-outline text-[10px] block mt-0.5">12:15:48</span>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-tertiary-container text-on-tertiary font-bold flex items-center justify-center font-mono text-[11px] shadow-sm">
                      LM
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans text-sm font-semibold text-on-surface">Laura Gómez</span>
                      <span className="font-mono text-[11px] text-outline">(29.111.222)</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-mono text-[11px] font-semibold">
                    <Gift className="w-4 h-4" />
                    -3,000 Pts (Canje)
                  </span>
                </td>
                <td className="py-4 px-6 font-mono text-sm font-medium text-outline whitespace-nowrap">
                  AR$ 0
                </td>
                <td className="py-4 px-6 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-surface-container font-mono text-[11px] text-primary font-semibold">Canje OK</span>
                    <span className="font-mono text-[11px] font-semibold text-outline">#4e21c</span>
                  </div>
                </td>
              </tr>

              {/* Row 3 (Ajuste) */}
              <tr className="bg-error-container/5 hover:bg-error-container/10 transition-colors group">
                <td className="py-4 px-6 font-mono text-[11px] text-on-surface-variant whitespace-nowrap">
                  <span className="text-on-surface font-medium">02 Oct 2026</span>
                  <span className="text-outline text-[10px] block mt-0.5">20:45:00</span>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface-container-high text-on-surface-variant font-bold flex items-center justify-center font-mono text-[11px]">
                      ?
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans text-sm font-semibold text-on-surface">Cliente Anónimo</span>
                      <span className="font-mono text-[11px] text-outline">(40.999.888)</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container font-mono text-[11px] font-semibold">
                    <FileEdit className="w-4 h-4" />
                    +150 Pts (Ajuste)
                  </span>
                </td>
                <td className="py-4 px-6 font-mono text-sm font-medium text-outline whitespace-nowrap">
                  AR$ 0
                </td>
                <td className="py-4 px-6 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-error-container text-on-error-container font-mono text-[11px] font-semibold">Manual</span>
                    <span className="font-mono text-[11px] font-semibold text-outline">#1a90e</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Table Footer & Pagination */}
        <div className="px-space-lg py-space-md bg-surface-container-lowest flex flex-col sm:flex-row items-center justify-between gap-space-md">
          <span className="font-sans text-xs text-on-surface-variant">
            Mostrando <strong className="text-on-surface font-semibold">1 a 3</strong> de <strong className="text-on-surface font-semibold">2,184</strong> movimientos registrados
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
    </div>
  );
}
