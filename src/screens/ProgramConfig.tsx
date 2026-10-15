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
  Ticket,
  ArrowRight,
  Pencil,
  Trash2,
  PlusCircle,
  Save,
  RefreshCw,
  Crown,
  Zap,
  CalendarClock
} from 'lucide-react';
import { useLoyaltyStore, type Reward, type TierType } from '../store/useLoyaltyStore';
import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

export function ProgramConfig() {
  const config = useLoyaltyStore((state) => state.config);
  const setConfig = useLoyaltyStore((state) => state.setConfig);
  const setTierConfig = useLoyaltyStore((state) => state.setTierConfig);
  const addReward = useLoyaltyStore((state) => state.addReward);
  const updateReward = useLoyaltyStore((state) => state.updateReward);
  const deleteReward = useLoyaltyStore((state) => state.deleteReward);

  const isPuntos = config.type === 'puntos';
  const isSellos = config.type === 'sellos';

  // Filtro de recompensas por Tier
  const [selectedTierFilter, setSelectedTierFilter] = useState<'ALL' | TierType>('ALL');

  // Modal de Recompensas
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [rewardForm, setRewardForm] = useState<{
    name: string;
    cost: string;
    minTier: TierType;
  }>({
    name: '',
    cost: '',
    minTier: 'BRONZE',
  });

  const saveConfigToDb = useLoyaltyStore((state) => state.saveConfigToDb);

  const handleSaveNotification = useCallback(async () => {
    await saveConfigToDb();
  }, [saveConfigToDb]);

  // Atajo de teclado: Escape para cerrar modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isRewardModalOpen) {
        setIsRewardModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRewardModalOpen]);

  const filteredRewards = useMemo(() => {
    if (selectedTierFilter === 'ALL') return config.rewards;
    return config.rewards.filter(r => (r.minTier || 'BRONZE') === selectedTierFilter);
  }, [config.rewards, selectedTierFilter]);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-space-lg pb-space-xl">
      {/* Encabezado de Página */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-xs">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-sm">
            <h1 className="font-display text-3xl font-bold text-on-surface tracking-tight">Motor de Retención</h1>
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-mono text-xs font-semibold">v3.0</span>
          </div>
          <p className="font-sans text-sm text-on-surface-variant mt-1">Configura las reglas de fidelización, tiers de clientes y recompensas para tus terminales activas.</p>
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
          {/* Opción 1: Programa de Puntos */}
          <div 
            onClick={() => setConfig({ type: 'puntos' })}
            className={`relative flex flex-col justify-between p-space-md rounded-xl transition-all duration-200 cursor-pointer shadow-sm group ${
              isPuntos 
                ? 'bg-surface-container-low border-2 border-primary' 
                : 'bg-surface-container-lowest hover:bg-surface-container-low opacity-75 border-2 border-transparent'
            }`}
          >
            <div className="flex items-start justify-between gap-space-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                isPuntos ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-high text-on-surface-variant group-hover:text-on-surface'
              }`}>
                <Star className="w-5 h-5" />
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                isPuntos ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-high text-outline'
              }`}>
                {isPuntos ? <Check className="w-4 h-4" /> : <span className="w-2.5 h-2.5 rounded-full bg-surface-container-lowest"></span>}
              </div>
            </div>
            
            <div className="mt-space-md">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-on-surface">Programa de Puntos</h3>
                <span className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-medium ${
                  isPuntos ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  {isPuntos ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <p className="font-sans text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                Calcula puntos automáticamente según el monto total de cada compra registrada (ej. AR$ 100 = 20 pts).
              </p>
            </div>
            
            <div className="mt-space-md pt-space-sm">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px] ${
                isPuntos ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container text-on-surface-variant'
              }`}>
                <ThumbsUp className="w-3.5 h-3.5" />
                Recomendado para retail y gastronomía
              </span>
            </div>
          </div>

          {/* Opción 2: Tarjeta de Sellos */}
          <div 
            onClick={() => setConfig({ type: 'sellos' })}
            className={`relative flex flex-col justify-between p-space-md rounded-xl transition-all duration-200 cursor-pointer shadow-sm group ${
              isSellos 
                ? 'bg-surface-container-low border-2 border-primary' 
                : 'bg-surface-container-lowest hover:bg-surface-container-low opacity-75 border-2 border-transparent'
            }`}
          >
            <div className="flex items-start justify-between gap-space-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                isSellos ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-high text-on-surface-variant group-hover:text-on-surface'
              }`}>
                <Award className="w-5 h-5" />
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                isSellos ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-high text-outline'
              }`}>
                {isSellos ? <Check className="w-4 h-4" /> : <span className="w-2.5 h-2.5 rounded-full bg-surface-container-lowest"></span>}
              </div>
            </div>
            
            <div className="mt-space-md">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-on-surface">Tarjeta de Sellos</h3>
                <span className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-medium ${
                  isSellos ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  {isSellos ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <p className="font-sans text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                Otorga 1 sello digital por visita recurrente o por alcanzar un consumo mínimo fijado en caja.
              </p>
            </div>
            
            <div className="mt-space-md pt-space-sm">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px] ${
                isSellos ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container text-on-surface-variant'
              }`}>
                <Coffee className="w-3.5 h-3.5" />
                Ideal para cafeterías y servicios
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CARD 2: Regla de Acumulación */}
      <section className={`bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md transition-opacity ${!isPuntos ? 'opacity-50 pointer-events-none' : ''}`}>
        {!isPuntos && (
          <div className="flex items-center gap-space-sm px-space-md py-2.5 rounded-xl bg-surface-container-high/60 border border-outline-variant/40 text-on-surface-variant font-sans text-xs">
            <Lock className="w-4.5 h-4.5 text-outline" />
            <span>Esta configuración se habilita con la opción <strong>"Programa de Puntos"</strong>. En modo sellos se otorga 1 sello por cada compra registrada.</span>
          </div>
        )}
        
        <div>
          <div className="flex items-center gap-space-xs">
            <Coins className="w-5 h-5 text-outline" />
            <h2 className="font-display text-lg font-bold text-on-surface">Regla de Acumulación</h2>
          </div>
          <p className="font-sans text-xs text-on-surface-variant mt-0.5">Define el ratio de conversión directa de gasto a puntos en caja.</p>
        </div>

        <div className="bg-surface-container-low rounded-xl p-space-md sm:p-space-lg flex flex-col gap-space-sm">
          <div className="flex flex-wrap items-center gap-2 font-sans text-sm text-on-surface">
            <span className="font-medium whitespace-nowrap">Por cada</span>
            <div className="relative inline-flex items-center">
              <span className="absolute left-2.5 font-mono text-xs text-on-surface-variant font-semibold">AR$</span>
              <input 
                className="w-24 pl-8 pr-2 py-1.5 rounded-lg font-mono text-base font-bold bg-surface-container-lowest shadow-sm text-center outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition text-on-surface" 
                type="number" 
                value={(config.spendAmount ?? config.pointsPerArs) === 0 ? '' : (config.spendAmount ?? config.pointsPerArs ?? 100)} 
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : Number(e.target.value);
                  setConfig({ spendAmount: val, pointsPerArs: val });
                }}
                disabled={!isPuntos} 
              />
            </div>
            <span className="font-medium whitespace-nowrap">gastados en el local, el sistema otorga</span>
            <div className="relative inline-flex items-center">
              <input 
                className="w-16 px-2 py-1.5 rounded-lg font-mono text-base font-bold bg-surface-container-lowest shadow-sm text-center outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-bright transition text-on-surface" 
                type="number" 
                value={config.pointsAwarded === 0 ? '' : (config.pointsAwarded ?? 20)} 
                onChange={(e) => setConfig({ pointsAwarded: e.target.value === '' ? 0 : Number(e.target.value) })}
                disabled={!isPuntos} 
              />
            </div>
            <span className="font-medium whitespace-nowrap">puntos.</span>
          </div>

          <div className="flex items-center gap-space-sm p-space-sm px-space-md rounded-xl bg-surface-container-high/60 text-on-surface-variant mt-1">
            <Lightbulb className="w-4.5 h-4.5 shrink-0 text-outline" />
            <p className="font-sans text-xs leading-normal">
              <span className="font-semibold text-on-surface">Ejemplo en POS:</span> Un ticket de <span className="font-mono text-xs font-semibold text-on-surface">AR$ 15,000</span> acreditará automáticamente <span className="font-mono text-xs font-bold text-secondary">+{Math.floor((15000 / ((config.spendAmount || config.pointsPerArs) || 100)) * (config.pointsAwarded ?? 20)).toLocaleString()} pts</span> en la billetera del cliente.
            </p>
          </div>
        </div>
      </section>

      {/* CARD 3: Tiers de Clientes (Bronze, Plata, Oro) */}
      <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md border border-primary/10">
        <div className="flex items-center justify-between gap-space-xs">
          <div>
            <div className="flex items-center gap-space-xs">
              <Crown className="w-5 h-5 text-amber-500" />
              <h2 className="font-display text-lg font-bold text-on-surface">Niveles de Clientes (Tiers)</h2>
            </div>
            <p className="font-sans text-xs text-on-surface-variant mt-0.5">
              {isPuntos
                ? 'Configura las visitas requeridas para subir de nivel y la retención por inactividad. Los niveles desbloquean premios exclusivos.'
                : 'Configura las tarjetas de sellos completadas para subir de nivel y el acelerador de doble sello.'}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-800 font-mono text-[11px] font-bold border border-amber-500/20">
            Bronze • Plata • Oro
          </span>
        </div>

        {/* 3.1 Umbrales de Ascenso: Visitas para Puntos, Tarjetas completadas para Sellos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {/* Nivel Plata */}
          <div className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between gap-3 border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shadow-sm">
                  🥈
                </span>
                <div>
                  <h4 className="font-display text-sm font-bold text-on-surface">Nivel Plata</h4>
                  <span className="font-sans text-[11px] text-on-surface-variant">Cliente Habitual</span>
                </div>
              </div>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-300/60 text-slate-800">
                Tier 2
              </span>
            </div>

            {isPuntos ? (
              <div className="flex items-center gap-2 font-sans text-xs text-on-surface">
                <span>Alcanza el nivel tras</span>
                <input
                  type="number"
                  min="1"
                  value={config.tierConfig.silverVisitsThreshold}
                  onChange={(e) => setTierConfig({ silverVisitsThreshold: Math.max(1, Number(e.target.value)) })}
                  className="w-16 px-2 py-1 rounded-lg font-mono text-sm font-bold bg-surface-container-lowest text-center shadow-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                />
                <span className="font-medium">visitas registradas.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 font-sans text-xs text-on-surface">
                <span>Alcanza el nivel tras completar</span>
                <input
                  type="number"
                  min="1"
                  value={config.tierConfig.silverCardsThreshold ?? 1}
                  onChange={(e) => setTierConfig({ silverCardsThreshold: Math.max(1, Number(e.target.value)) })}
                  className="w-16 px-2 py-1 rounded-lg font-mono text-sm font-bold bg-surface-container-lowest text-center shadow-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                />
                <span className="font-medium">{(config.tierConfig.silverCardsThreshold ?? 1) === 1 ? 'tarjeta de sellos.' : 'tarjetas de sellos.'}</span>
              </div>
            )}
          </div>

          {/* Nivel Oro */}
          <div className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between gap-3 border border-amber-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs shadow-sm">
                  🥇
                </span>
                <div>
                  <h4 className="font-display text-sm font-bold text-on-surface">Nivel Oro (VIP)</h4>
                  <span className="font-sans text-[11px] text-on-surface-variant">Cliente Más Valioso</span>
                </div>
              </div>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-amber-300/60 text-amber-900">
                Tier 3 (VIP)
              </span>
            </div>

            {isPuntos ? (
              <div className="flex items-center gap-2 font-sans text-xs text-on-surface">
                <span>Alcanza el nivel tras</span>
                <input
                  type="number"
                  min="2"
                  value={config.tierConfig.goldVisitsThreshold}
                  onChange={(e) => setTierConfig({ goldVisitsThreshold: Math.max(2, Number(e.target.value)) })}
                  className="w-16 px-2 py-1 rounded-lg font-mono text-sm font-bold bg-surface-container-lowest text-center shadow-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                />
                <span className="font-medium">visitas registradas.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 font-sans text-xs text-on-surface">
                <span>Alcanza el nivel tras completar</span>
                <input
                  type="number"
                  min="2"
                  value={config.tierConfig.goldCardsThreshold ?? 2}
                  onChange={(e) => setTierConfig({ goldCardsThreshold: Math.max(2, Number(e.target.value)) })}
                  className="w-16 px-2 py-1 rounded-lg font-mono text-sm font-bold bg-surface-container-lowest text-center shadow-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                />
                <span className="font-medium">tarjetas de sellos.</span>
              </div>
            )}
          </div>
        </div>

        {/* 3.2 Acelerador de Puntos (Doble Puntos por Ticket de Compra) - Solo en modo Puntos */}
        {isPuntos && (
          <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-3 border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-primary fill-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-sm font-bold text-on-surface">Acelerador: Doble Puntos por Consumo</h4>
                    <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-mono text-[10px] font-bold">
                      2x Puntos
                    </span>
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant">
                    Incentiva compras de alto ticket otorgando el doble de puntos cuando el importe supere el mínimo establecido.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTierConfig({ doublePointsEnabled: !config.tierConfig.doublePointsEnabled })}
                className={`w-12 h-7 rounded-full p-1 flex items-center transition-colors shrink-0 ${
                  config.tierConfig.doublePointsEnabled ? 'bg-primary justify-end' : 'bg-surface-container-high justify-start'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-surface-container-lowest shadow-sm"></span>
              </button>
            </div>

            {config.tierConfig.doublePointsEnabled && (
              <div className="mt-1 pt-3 border-t border-outline-variant/30 flex flex-wrap items-center gap-2 font-sans text-xs text-on-surface animate-in fade-in duration-200">
                <span>Si el ticket de compra es igual o superior a</span>
                <div className="relative inline-flex items-center">
                  <span className="absolute left-2.5 font-mono text-xs text-on-surface-variant font-semibold">AR$</span>
                  <input
                    type="number"
                    step="500"
                    min="1000"
                    value={config.tierConfig.doublePointsMinSpend ?? 20000}
                    onChange={(e) => setTierConfig({ doublePointsMinSpend: Math.max(0, Number(e.target.value)) })}
                    className="w-28 pl-8 pr-2 py-1 rounded-lg font-mono text-sm font-bold bg-surface-container-lowest text-center shadow-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                  />
                </div>
                <span className="font-semibold text-primary">duplica automáticamente los puntos otorgados en caja (2x).</span>
              </div>
            )}
          </div>
        )}

        {/* 3.3 Acelerador de Sellos (Doble Sello por Ticket de Compra) - Solo en modo Sellos */}
        {isSellos && (
          <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-3 border border-secondary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-secondary fill-secondary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-sm font-bold text-on-surface">Acelerador: Doble Sello por Consumo</h4>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-mono text-[10px] font-bold">
                      2x Sellos
                    </span>
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant">
                    Premia tickets de alto consumo otorgando 2 sellos en lugar de 1 cuando el importe supere el mínimo establecido.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTierConfig({ doubleStampEnabled: !config.tierConfig.doubleStampEnabled })}
                className={`w-12 h-7 rounded-full p-1 flex items-center transition-colors shrink-0 ${
                  config.tierConfig.doubleStampEnabled ? 'bg-secondary justify-end' : 'bg-surface-container-high justify-start'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-surface-container-lowest shadow-sm"></span>
              </button>
            </div>

            {config.tierConfig.doubleStampEnabled && (
              <div className="mt-1 pt-3 border-t border-outline-variant/30 flex flex-wrap items-center gap-2 font-sans text-xs text-on-surface animate-in fade-in duration-200">
                <span>Si el ticket de compra es igual o superior a</span>
                <div className="relative inline-flex items-center">
                  <span className="absolute left-2.5 font-mono text-xs text-on-surface-variant font-semibold">AR$</span>
                  <input
                    type="number"
                    step="500"
                    min="1000"
                    value={config.tierConfig.doubleStampMinSpend}
                    onChange={(e) => setTierConfig({ doubleStampMinSpend: Math.max(0, Number(e.target.value)) })}
                    className="w-28 pl-8 pr-2 py-1 rounded-lg font-mono text-sm font-bold bg-surface-container-lowest text-center shadow-sm outline-none focus:ring-2 focus:ring-secondary/20 text-on-surface"
                  />
                </div>
                <span className="font-semibold text-secondary">otorga automáticamente 2 sellos en caja.</span>
              </div>
            )}
          </div>
        )}

        {/* 3.3 Regla de Inactividad (Pérdida de Nivel) */}
        <div className="p-4 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0">
              <CalendarClock className="w-5 h-5 text-outline" />
            </div>
            <div>
              <h4 className="font-display text-sm font-bold text-on-surface">Pérdida de Nivel por Inactividad</h4>
              <p className="font-sans text-xs text-on-surface-variant">
                Si un cliente pasa demasiado tiempo sin visitar el local, su nivel se degradará un escalón para incentivar su retorno.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="font-sans text-xs text-on-surface">Degradar tras</span>
            <input
              type="number"
              min="5"
              value={config.tierConfig.inactivityDaysDowngrade}
              onChange={(e) => setTierConfig({ inactivityDaysDowngrade: Math.max(5, Number(e.target.value)) })}
              className="w-16 px-2 py-1 rounded-lg font-mono text-sm font-bold bg-surface-container-lowest text-center shadow-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
            />
            <span className="font-sans text-xs font-medium text-on-surface">días sin visita.</span>
          </div>
        </div>
      </section>

      {/* CARD 4: Catálogo de Recompensas Segmentadas por Tier */}
      <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <Ticket className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-on-surface">Catálogo de Recompensas por Nivel</h2>
          </div>
          <span className="font-mono text-[11px] text-on-surface-variant flex items-center gap-1">
            <Award className="w-4 h-4" /> 
            Recompensas jerárquicas configuradas para caja
          </span>
        </div>

        {/* Filtros de Pestaña por Tier */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container-low overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedTierFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all shrink-0 ${
              selectedTierFilter === 'ALL'
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Todas ({config.rewards.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedTierFilter('BRONZE')}
            className={`px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all flex items-center gap-1 shrink-0 ${
              selectedTierFilter === 'BRONZE'
                ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>🥉</span> Bronze ({config.rewards.filter(r => (r.minTier || 'BRONZE') === 'BRONZE').length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedTierFilter('SILVER')}
            className={`px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all flex items-center gap-1 shrink-0 ${
              selectedTierFilter === 'SILVER'
                ? 'bg-slate-200 text-slate-800 shadow-sm border border-slate-300'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>🥈</span> Plata ({config.rewards.filter(r => r.minTier === 'SILVER').length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedTierFilter('GOLD')}
            className={`px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all flex items-center gap-1 shrink-0 ${
              selectedTierFilter === 'GOLD'
                ? 'bg-amber-200 text-amber-900 shadow-sm border border-amber-400'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>🥇</span> Oro VIP ({config.rewards.filter(r => r.minTier === 'GOLD').length})
          </button>
        </div>

        {/* Lista de Recompensas */}
        <div className="flex flex-col gap-2.5">
          {filteredRewards.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-surface-container-low text-on-surface-variant font-sans text-xs">
              No hay recompensas registradas en este nivel.
            </div>
          ) : (
            filteredRewards.map((reward) => {
              const tier = reward.minTier || 'BRONZE';
              return (
                <div key={reward.id} className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm group">
                  <div className="flex items-center gap-space-md min-w-0 flex-1">
                    <span className="font-mono text-sm font-bold text-primary min-w-[90px] tracking-tight">
                      {isPuntos ? `${reward.costPoints.toLocaleString()} pts` : `${reward.costStamps} sellos`}
                    </span>
                    <ArrowRight className="w-4.5 h-4.5 text-outline-variant shrink-0" />
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full bg-secondary shrink-0"></span>
                      <span className="font-sans text-sm font-medium text-on-surface truncate">
                        {reward.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-auto">
                    {/* Badge de Tier */}
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[11px] font-semibold flex items-center gap-1 shadow-xs ${
                      tier === 'GOLD' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      tier === 'SILVER' ? 'bg-slate-200 text-slate-800 border border-slate-300' :
                      'bg-amber-50 text-amber-900 border border-amber-200'
                    }`}>
                      {tier === 'GOLD' ? '🥇 Oro VIP' : tier === 'SILVER' ? '🥈 Plata' : '🥉 Bronze (Todos)'}
                    </span>

                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditingReward(reward);
                          setRewardForm({ 
                            name: reward.name, 
                            cost: isPuntos ? reward.costPoints.toString() : reward.costStamps.toString(),
                            minTier: reward.minTier || 'BRONZE'
                          });
                          setIsRewardModalOpen(true);
                        }}
                        className="p-1.5 text-outline hover:text-primary hover:bg-primary-container/50 rounded-lg transition-colors"
                        title="Editar recompensa"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          deleteReward(reward.id);
                          toast.success('Recompensa eliminada');
                        }}
                        className="p-1.5 text-outline hover:text-error hover:bg-error-container/50 rounded-lg transition-colors"
                        title="Eliminar recompensa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button 
          type="button" 
          onClick={() => {
            setEditingReward(null);
            setRewardForm({ 
              name: '', 
              cost: '', 
              minTier: selectedTierFilter === 'ALL' ? 'BRONZE' : selectedTierFilter 
            });
            setIsRewardModalOpen(true);
          }}
          className="w-full py-3.5 px-4 rounded-xl bg-primary-fixed/40 hover:bg-primary-fixed text-primary font-sans text-sm font-semibold transition-all flex items-center justify-center gap-2 group"
        >
          <PlusCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
          <span>Agregar nueva recompensa</span>
        </button>
      </section>

      {/* FOOTER ACTION */}
      <div className="flex flex-col gap-2 pt-space-xs">
        <button 
          type="button" 
          onClick={handleSaveNotification}
          className="w-full py-4 px-8 rounded-xl bg-primary hover:bg-tertiary-container text-on-primary font-display text-lg font-semibold shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-3"
        >
          <Save className="w-6 h-6" />
          <span>Guardar Configuración</span>
        </button>
        <div className="flex items-center justify-center gap-1.5 text-center">
          <RefreshCw className="w-4 h-4 text-secondary" />
          <p className="font-sans text-xs text-on-surface-variant">
            Los cambios se sincronizan en tiempo real con todas las terminales POS conectadas.
          </p>
        </div>
      </div>

      {/* MODAL DE RECOMPENSA */}
      {isRewardModalOpen && (
        <div 
          onClick={() => setIsRewardModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
          >
            <div className="p-6 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-1">
                <Ticket className="w-5 h-5" />
              </div>
              <h3 className="font-display text-xl font-bold text-on-surface">
                {editingReward ? 'Editar Recompensa' : 'Nueva Recompensa'}
              </h3>
              
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Nombre de la recompensa</label>
                  <input
                    type="text"
                    value={rewardForm.name}
                    onChange={(e) => setRewardForm({ ...rewardForm, name: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg py-3 px-3.5 font-sans text-sm text-on-surface outline-none focus:border-primary transition-colors"
                    placeholder="Ej. Café gratis"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Coste en {isPuntos ? 'Puntos' : 'Sellos'}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={rewardForm.cost}
                      onChange={(e) => setRewardForm({ ...rewardForm, cost: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg py-3 pl-3.5 pr-12 font-mono text-sm text-on-surface outline-none focus:border-primary transition-colors"
                      placeholder="Ej. 5000"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[11px] text-on-surface-variant font-medium">
                      {isPuntos ? 'pts' : 'sellos'}
                    </span>
                  </div>
                </div>

                {/* Selección de Tier Requerido */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Nivel mínimo requerido (Tier)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setRewardForm({ ...rewardForm, minTier: 'BRONZE' })}
                      className={`p-2 rounded-lg text-center font-sans text-xs font-semibold transition-all border ${
                        rewardForm.minTier === 'BRONZE'
                          ? 'bg-amber-100 text-amber-900 border-amber-400 shadow-sm'
                          : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container'
                      }`}
                    >
                      <div className="text-base">🥉</div>
                      <span>Bronze</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRewardForm({ ...rewardForm, minTier: 'SILVER' })}
                      className={`p-2 rounded-lg text-center font-sans text-xs font-semibold transition-all border ${
                        rewardForm.minTier === 'SILVER'
                          ? 'bg-slate-200 text-slate-800 border-slate-400 shadow-sm'
                          : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container'
                      }`}
                    >
                      <div className="text-base">🥈</div>
                      <span>Plata</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRewardForm({ ...rewardForm, minTier: 'GOLD' })}
                      className={`p-2 rounded-lg text-center font-sans text-xs font-semibold transition-all border ${
                        rewardForm.minTier === 'GOLD'
                          ? 'bg-amber-200 text-amber-900 border-amber-500 shadow-sm'
                          : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container'
                      }`}
                    >
                      <div className="text-base">🥇</div>
                      <span>Oro VIP</span>
                    </button>
                  </div>
                  <span className="font-sans text-[11px] text-on-surface-variant mt-0.5">
                    {rewardForm.minTier === 'GOLD'
                      ? 'Exclusivo para clientes con Nivel Oro.'
                      : rewardForm.minTier === 'SILVER'
                      ? 'Accesible para clientes con Nivel Plata u Oro.'
                      : 'Accesible para todos los clientes (Bronze, Plata y Oro).'}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-low p-4 flex gap-3 justify-end border-t border-outline-variant/20">
              <button 
                type="button"
                onClick={() => setIsRewardModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-sans text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={() => {
                  if (!rewardForm.name || !rewardForm.cost) return;
                  const costNum = Number(rewardForm.cost);
                  
                  if (editingReward) {
                    updateReward(editingReward.id, {
                      name: rewardForm.name,
                      minTier: rewardForm.minTier,
                      ...(isPuntos ? { costPoints: costNum } : { costStamps: costNum })
                    });
                    toast.success('Recompensa actualizada');
                  } else {
                    addReward({
                      name: rewardForm.name,
                      costPoints: isPuntos ? costNum : 1000,
                      costStamps: isSellos ? costNum : 5,
                      minTier: rewardForm.minTier,
                    });
                    toast.success('Recompensa creada con éxito');
                  }
                  setIsRewardModalOpen(false);
                }}
                className="px-5 py-2.5 rounded-xl font-sans text-sm font-semibold bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
