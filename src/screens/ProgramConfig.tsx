import {
  SlidersHorizontal,
  Star,
  Check,
  ThumbsUp,
  Award,
  Coffee,
  Lock,
  Coins,
  Lightbulb,
  Gift,
  Ticket,
  ArrowRight,
  Pencil,
  Trash2,
  PlusCircle,
  Save,
  RefreshCw
} from 'lucide-react';

export function ProgramConfig() {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-space-lg pb-space-xl">
      {/* Encabezado de Página */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-xs">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-sm">
            <h1 className="font-display text-3xl font-bold text-on-surface tracking-tight">Motor de Retención</h1>
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-mono text-xs font-semibold">v2.4</span>
          </div>
          <p className="font-sans text-sm text-on-surface-variant mt-1">Configura las reglas de fidelización para tus clientes y terminales activas.</p>
        </div>
      </header>

      {/* CARD 1: Modalidad del Programa */}
      <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs">
            <SlidersHorizontal className="text-primary w-5 h-5" />
            <h2 className="font-display text-lg font-bold text-on-surface">Modalidad del Programa</h2>
          </div>
          <p className="font-sans text-xs text-on-surface-variant mt-0.5">Elige cómo tus clientes acumulan y redimen beneficios en cada compra.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {/* Opción 1: Inactiva (Programa de Puntos) */}
          <div className="relative flex flex-col justify-between p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all duration-200 cursor-pointer opacity-75 group shadow-sm">
            <div className="flex items-start justify-between gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-on-surface transition-colors">
                <Star className="w-5 h-5" />
              </div>
              <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-outline">
                <span className="w-2.5 h-2.5 rounded-full bg-surface-container-lowest"></span>
              </div>
            </div>
            
            <div className="mt-space-md">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-on-surface">Programa de Puntos</h3>
                <span className="px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant font-mono text-[11px]">Inactivo</span>
              </div>
              <p className="font-sans text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                Calcula puntos automáticamente según el monto total de cada compra registrada (ej. AR$ 100 = 20 pts).
              </p>
            </div>
            
            <div className="mt-space-md pt-space-sm">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-mono text-[11px]">
                <ThumbsUp className="w-3.5 h-3.5" />
                Recomendado para retail y gastronomía
              </span>
            </div>
          </div>

          {/* Opción 2: Activa (Tarjeta de Sellos) */}
          <div className="relative flex flex-col justify-between p-space-md rounded-xl bg-surface-container-low shadow-sm cursor-pointer transition-all duration-200 group">
            <div className="flex items-start justify-between gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm">
                <Check className="w-4 h-4" />
              </div>
            </div>
            
            <div className="mt-space-md">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-on-surface">Tarjeta de Sellos</h3>
                <span className="px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-mono text-[11px] font-medium">Activo</span>
              </div>
              <p className="font-sans text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                Otorga 1 sello digital por visita recurrente o por alcanzar un consumo mínimo fijado en caja.
              </p>
            </div>
            
            <div className="mt-space-md pt-space-sm">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-mono text-[11px]">
                <Coffee className="w-3.5 h-3.5" />
                Ideal para cafeterías y servicios
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CARD 2: Regla de Acumulación (Disabled for Sellos) */}
      <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md opacity-75">
        <div className="flex items-center gap-space-sm px-space-md py-2.5 rounded-xl bg-surface-container-high/60 border border-outline-variant/40 text-on-surface-variant font-sans text-xs">
          <Lock className="w-4.5 h-4.5 text-outline" />
          <span>Esta configuración se habilita con la opción <strong>"Programa de Puntos"</strong></span>
        </div>
        
        <div>
          <div className="flex items-center gap-space-xs">
            <Coins className="w-5 h-5 text-outline" />
            <h2 className="font-display text-lg font-bold text-on-surface">Regla de Acumulación</h2>
          </div>
          <p className="font-sans text-xs text-on-surface-variant mt-0.5">Define el ratio de conversión directa de gasto a puntos en caja.</p>
        </div>

        {/* Bloque Desactivado */}
        <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col gap-space-md">
          <div className="flex flex-wrap items-center gap-y-3 gap-x-2.5 font-sans text-base text-on-surface leading-loose">
            <span>Por cada</span>
            <div className="relative inline-flex items-center">
              <span className="absolute left-3 font-mono text-[11px] text-on-surface-variant">AR$</span>
              <input 
                className="w-36 pl-11 pr-3 py-2 rounded-lg font-display text-lg bg-surface-container-lowest shadow-sm text-center outline-none focus:bg-surface-bright transition text-outline" 
                type="number" 
                defaultValue="100" 
                disabled 
              />
            </div>
            <span>gastados en el local, el sistema otorga</span>
            <div className="relative inline-flex items-center">
              <input 
                className="w-24 px-3 py-2 rounded-lg font-display text-lg bg-surface-container-lowest shadow-sm text-center outline-none focus:bg-surface-bright transition text-outline" 
                type="number" 
                defaultValue="20" 
                disabled 
              />
            </div>
            <span>puntos.</span>
          </div>

          <div className="flex items-center gap-space-sm p-space-sm px-space-md rounded-xl bg-surface-container-high/60 text-on-surface-variant">
            <Lightbulb className="w-5 h-5 shrink-0 text-outline" />
            <p className="font-sans text-xs">
              <span className="font-semibold text-on-surface">Ejemplo en POS:</span> Un ticket promedio de <span className="font-mono text-[11px] font-semibold text-on-surface">AR$ 15,000</span> acreditará automáticamente <span className="font-mono text-[11px] font-bold text-secondary">+3,000 pts</span> a la billetera del cliente.
            </p>
          </div>
        </div>
      </section>

      {/* CARD 3: Bono de Bienvenida */}
      <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md opacity-60 pointer-events-none select-none">
        <div className="flex items-center gap-space-sm px-space-md py-2.5 rounded-xl bg-surface-container-high/60 border border-outline-variant/40 text-on-surface-variant font-sans text-xs">
          <Lock className="w-4.5 h-4.5 text-outline" />
          <span>Esta configuración se habilita con la opción <strong>"Programa de Puntos"</strong></span>
        </div>
        
        <div className="flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-xs">
            <Gift className="w-5 h-5 text-outline" />
            <div>
              <h2 className="font-display text-lg font-bold text-on-surface">Bono de Bienvenida</h2>
              <p className="font-sans text-xs text-on-surface-variant mt-0.5">Incentiva el primer registro regalando puntos iniciales.</p>
            </div>
          </div>
          <button aria-pressed="false" className="w-12 h-7 rounded-full bg-surface-container-high p-1 flex items-center justify-start focus:outline-none cursor-not-allowed" disabled type="button">
            <span className="w-5 h-5 rounded-full bg-surface-container-lowest shadow-sm"></span>
          </button>
        </div>

        <div className="rounded-xl p-space-md bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-md transition-all">
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-outline shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div className="flex flex-wrap items-center gap-2 font-sans text-sm text-on-surface-variant">
              <span>Otorgar</span>
              <input 
                className="w-28 px-3 py-1.5 rounded-lg font-display text-lg text-outline bg-surface-container-lowest text-center shadow-sm outline-none cursor-not-allowed" 
                type="number" 
                defaultValue="500" 
                disabled 
              />
              <span>puntos automáticamente al crear el perfil del cliente.</span>
            </div>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-mono text-[11px] font-semibold whitespace-nowrap shadow-sm">
            Primer ingreso
          </span>
        </div>
      </section>

      {/* CARD 4: Catálogo de Recompensas */}
      <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <Ticket className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-on-surface">Niveles de Canje</h2>
          </div>
          <span className="font-mono text-[11px] text-on-surface-variant flex items-center gap-1">
            <Award className="w-4 h-4" /> 
            Recompensas configuradas por sellos para terminal POS
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Fila 1 */}
          <div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between gap-space-sm group">
            <div className="flex items-center gap-space-md min-w-0">
              <span className="font-mono text-sm font-bold text-primary min-w-[90px] tracking-tight">6 sellos</span>
              <ArrowRight className="w-4.5 h-4.5 text-outline-variant" />
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-secondary shrink-0"></span>
                <span className="font-sans text-sm font-medium text-on-surface truncate">Gaseosa 500ml</span>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" title="Editar" type="button">
                <Pencil className="w-4.5 h-4.5" />
              </button>
              <button className="p-1.5 rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors" title="Eliminar" type="button">
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Fila 2 */}
          <div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between gap-space-sm group">
            <div className="flex items-center gap-space-md min-w-0">
              <span className="font-mono text-sm font-bold text-primary min-w-[90px] tracking-tight">10 sellos</span>
              <ArrowRight className="w-4.5 h-4.5 text-outline-variant" />
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-secondary shrink-0"></span>
                <span className="font-sans text-sm font-medium text-on-surface truncate">Docena de Changuito Cookies</span>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" title="Editar" type="button">
                <Pencil className="w-4.5 h-4.5" />
              </button>
              <button className="p-1.5 rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors" title="Eliminar" type="button">
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Fila 3 */}
          <div className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between gap-space-sm group">
            <div className="flex items-center gap-space-md min-w-0">
              <span className="font-mono text-sm font-bold text-primary min-w-[90px] tracking-tight">15 sellos</span>
              <ArrowRight className="w-4.5 h-4.5 text-outline-variant" />
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-secondary shrink-0"></span>
                <span className="font-sans text-sm font-medium text-on-surface truncate">Cena para dos personas</span>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors" title="Editar" type="button">
                <Pencil className="w-4.5 h-4.5" />
              </button>
              <button className="p-1.5 rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors" title="Eliminar" type="button">
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Botón Agregar Recompensa */}
        <button type="button" className="w-full py-3.5 px-4 rounded-xl bg-primary-fixed/40 hover:bg-primary-fixed text-primary font-sans text-sm font-semibold transition-all flex items-center justify-center gap-2 group">
          <PlusCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span>Agregar nueva recompensa</span>
        </button>
      </section>

      {/* FOOTER ACTION */}
      <div className="flex flex-col gap-2 pt-space-xs">
        <button type="button" className="w-full py-4 px-8 rounded-xl bg-primary hover:bg-tertiary-container text-on-primary font-display text-lg font-semibold shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-3">
          <Save className="w-6 h-6" />
          <span>Guardar Configuración</span>
          <kbd className="ml-2 px-2 py-0.5 rounded bg-surface-container-lowest/20 text-on-primary font-mono text-[11px]">Ctrl + S</kbd>
        </button>
        <div className="flex items-center justify-center gap-1.5 text-center">
          <RefreshCw className="w-4 h-4 text-secondary" />
          <p className="font-sans text-xs text-on-surface-variant">
            Los cambios se sincronizan en tiempo real con todas las terminales POS conectadas.
          </p>
        </div>
      </div>
    </div>
  );
}
