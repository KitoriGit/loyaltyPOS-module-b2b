import { 
  Touchpad, 
  Store,
  CheckCircle2, 
  IdCard, 
  Search, 
  X, 
  Star, 
  Clock, 
  Check, 
  Gift, 
  CupSoda, 
  ArrowUpCircle, 
  PlusCircle, 
  Banknote, 
  UserPlus
} from 'lucide-react';

export function TerminalPOS() {
  return (
    <div className="flex flex-col w-full items-center justify-start pb-space-xl">
      {/* Subtle Auxiliary Context Indicator */}
      <div className="w-full max-w-3xl flex items-center justify-between px-space-xs mb-space-sm">
        <div className="flex items-center gap-space-xs text-on-surface-variant">
          <Touchpad className="w-4 h-4" />
          <span className="font-mono text-xs uppercase tracking-wider font-semibold">Terminal POS Express</span>
          <span className="text-outline-variant font-mono text-xs">•</span>
          <span className="font-mono text-xs text-secondary font-medium">Modo Sello Digital Activo</span>
        </div>
        <div className="flex items-center gap-space-xs text-on-surface-variant">
          <Store className="w-4 h-4" />
          <span className="font-mono text-xs font-medium">Sucursal Centro (P-04)</span>
        </div>
      </div>
      
      {/* Main Elevated POS Card Container */}
      <div className="w-full max-w-3xl bg-surface-container-lowest rounded-2xl shadow-md p-6 md:p-8 flex flex-col gap-space-md">
        
        {/* 1. DNI / Identificación del Cliente */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs font-semibold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
              <IdCard className="w-4 h-4" />
              DNI / DOCUMENTO DEL CLIENTE
            </label>
            <span className="inline-flex items-center gap-1 bg-secondary-container/40 text-on-secondary-container px-3 py-0.5 rounded-full font-mono text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Cliente identificado
            </span>
          </div>
          
          {/* Massive Input Block */}
          <div className="rounded-xl bg-surface-container-lowest p-3.5 md:p-4 flex items-center justify-between shadow-sm shadow-primary/10 border border-outline-variant/30">
            <div className="flex items-center gap-space-md min-w-0">
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                <IdCard className="w-6 h-6" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold text-on-surface tracking-wider">34.567.890</span>
                <span className="inline-block w-0.5 h-6 bg-primary animate-pulse ml-0.5 align-middle"></span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs flex-shrink-0">
              <button type="button" className="group flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors">
                <Search className="w-4.5 h-4.5 text-on-surface-variant group-hover:text-primary" />
                <kbd className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface-variant shadow-sm border border-outline-variant/30 font-semibold">Tab</kbd>
              </button>
              <button type="button" aria-label="Limpiar campo" className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/50 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Tarjeta / Contenedor de Información del Cliente */}
        <div className="bg-surface-container-low/70 rounded-xl p-5 flex flex-col gap-space-md">
          {/* Fila Superior: Perfil + Métricas de Visita */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-display text-lg font-bold">
                J
              </div>
              <h2 className="font-display text-2xl font-bold text-on-surface tracking-tight">Juan Pérez</h2>
              <span className="inline-flex items-center gap-1 bg-surface-container-highest text-primary font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                Cliente Frecuente
              </span>
            </div>
            <div className="flex flex-col sm:items-end font-mono text-xs text-on-surface-variant">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Última visita: hace 12 días
              </span>
              <span className="font-medium text-on-surface/80">38 visitas históricas</span>
            </div>
          </div>
          
          {/* 2-Column Inner Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {/* Columna Izquierda: Tarjeta de Sellos Interactiva */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/20 flex flex-col justify-between gap-space-md">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold tracking-wider text-on-surface-variant/80 uppercase">
                  Tarjeta de Sellos
                </span>
                <span className="font-mono text-xs bg-surface-container text-on-surface-variant px-2 py-0.5 rounded font-medium">
                  Vence 30 Nov
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-on-surface leading-none">4</span>
                <span className="font-display text-xl text-on-surface-variant font-medium">/ 6 Sellos</span>
              </div>
              
              {/* Sellos (6 Círculos) */}
              <div className="flex items-center justify-between pt-space-xs">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-sm" title={`Sello ${i}`}>
                    <Check className="w-5 h-5 stroke-[3]" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant/50 flex items-center justify-center font-mono text-sm font-semibold" title="Pendiente">
                  5
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant/50 flex items-center justify-center" title="Meta Final">
                  <Gift className="w-4.5 h-4.5" />
                </div>
              </div>
            </div>
            
            {/* Columna Derecha: Meta y Progreso */}
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CupSoda className="text-primary w-5 h-5" />
                  <span className="font-sans text-sm font-semibold text-on-surface">Meta Actual: Gaseosa</span>
                </div>
                <span className="font-mono text-sm font-bold text-primary">66.6%</span>
              </div>
              
              {/* Barra de Progreso y Datos Intermedios */}
              <div className="flex flex-col gap-2 my-auto py-space-sm">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-on-surface-variant">Completado</span>
                  <span className="font-bold text-on-surface">(4 / 6)</span>
                </div>
                <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full" style={{ width: '66.6%' }}></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-on-surface-variant font-mono text-[11px] pt-space-xs">
                <span className="flex items-center gap-1 text-secondary font-medium">
                  <ArrowUpCircle className="w-3.5 h-3.5" />
                  Faltan 2 para el próximo canje
                </span>
                <span className="font-semibold text-on-surface">Meta: 6 Sellos</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Barra de Acción Directa: Sumar 1 Sello */}
        <button type="button" className="group w-full bg-surface-container-high/60 hover:bg-surface-container-high text-primary py-3.5 px-4 rounded-xl flex items-center justify-between transition-all">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-primary group-hover:rotate-90 transition-transform" />
            <span className="font-sans text-sm font-bold text-on-surface">Sumar 1 Sello directo a la orden</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs text-on-surface-variant mr-1">Atajo rápido</span>
            <kbd className="font-mono text-[11px] px-2 py-1 rounded bg-surface-container-lowest text-primary font-bold shadow-sm border border-outline-variant/30">S</kbd>
          </div>
        </button>

        {/* 4. Bloque de Alerta de Canje / Premio Disponible */}
        <div className="bg-secondary-container/25 border border-secondary/20 rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-space-md shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary text-on-secondary flex items-center justify-center flex-shrink-0 shadow-sm">
              <Gift className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold text-on-surface leading-snug">¡Premio Disponible para Canjear!</span>
                <span className="bg-secondary text-on-secondary font-mono text-[10px] px-2 py-0.5 rounded-full font-bold">1 LISTO</span>
              </div>
              <p className="font-sans text-sm text-on-surface-variant mt-0.5">
                Canjear Combo Gaseosa 500ml + Snack por 6 Sellos acumulados
              </p>
            </div>
          </div>
          <button type="button" className="w-full md:w-auto bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary font-sans text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 whitespace-nowrap transition-colors">
            <Gift className="w-4.5 h-4.5" />
            <span>Canjear Premio</span>
            <kbd className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-on-secondary/20 text-on-secondary font-semibold ml-1">C</kbd>
          </button>
        </div>

        {/* 5. Botones de Acción Primaria Inferior */}
        <div className="flex flex-col sm:flex-row items-center gap-space-sm pt-space-xs">
          <button type="button" className="w-full sm:flex-[7] bg-primary hover:bg-primary-container text-on-primary font-display text-lg font-bold py-3.5 px-6 rounded-xl shadow-sm flex items-center justify-center gap-3 transition-colors">
            <Banknote className="w-5 h-5" />
            <span>Cargar Puntos</span>
            <kbd className="font-mono text-xs px-2.5 py-1 rounded bg-surface-container-lowest/20 text-on-primary font-semibold shadow-inner">Enter ↵</kbd>
          </button>
          
          <button type="button" className="w-full sm:flex-[3] bg-surface-container-low hover:bg-surface-container text-on-surface font-sans text-sm font-semibold py-3.5 px-4 rounded-xl border border-outline-variant/30 flex items-center justify-center gap-2 transition-colors">
            <UserPlus className="w-4.5 h-4.5 text-on-surface-variant" />
            <span>Nuevo Cliente</span>
            <kbd className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface-variant shadow-sm border border-outline-variant/30 font-semibold">Esc</kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
