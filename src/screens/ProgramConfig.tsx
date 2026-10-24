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
  CalendarClock,
  Gift,
  Sparkles,
  Scissors,
  Loader2,
  RotateCcw
} from 'lucide-react';
import { useLoyaltyStore, type Reward, type TierType, getTierMaxStamps } from '../store/useLoyaltyStore';
import { useAuthStore } from '../store/useAuthStore';
import { seedBarberiaPointsDemo, seedCafeteriaStampsDemo, clearWorkspaceLoyaltyData } from '../lib/demoSeeder';
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
  const workspaceId = useAuthStore((state) => state.workspaceId);
  const [demoLoading, setDemoLoading] = useState<'barberia' | 'cafeteria' | 'clear' | null>(null);

  const handleLoadBarberiaDemo = async () => {
    if (!workspaceId) {
      toast.error('No se detectó un Workspace activo');
      return;
    }
    setDemoLoading('barberia');
    try {
      await seedBarberiaPointsDemo(workspaceId);
      toast.success('Demo Barbería / Estética (Puntos) cargada con éxito');
    } catch (err: any) {
      console.error(err);
      toast.error('Error al cargar demo: ' + (err.message || ''));
    } finally {
      setDemoLoading(null);
    }
  };

  const handleLoadCafeteriaDemo = async () => {
    if (!workspaceId) {
      toast.error('No se detectó un Workspace activo');
      return;
    }
    setDemoLoading('cafeteria');
    try {
      await seedCafeteriaStampsDemo(workspaceId);
      toast.success('Demo Cafetería / Gastronomía (Sellos) cargada con éxito');
    } catch (err: any) {
      console.error(err);
      toast.error('Error al cargar demo: ' + (err.message || ''));
    } finally {
      setDemoLoading(null);
    }
  };

  const handleClearDemoData = async () => {
    if (!workspaceId) {
      toast.error('No se detectó un Workspace activo');
      return;
    }
    setDemoLoading('clear');
    try {
      await clearWorkspaceLoyaltyData(workspaceId);
      toast.success('Datos de prueba vaciados. Sistema listo desde cero');
    } catch (err: any) {
      console.error(err);
      toast.error('Error al vaciar datos: ' + (err.message || ''));
    } finally {
      setDemoLoading(null);
    }
  };

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

  const currentTierMaxStamps = useMemo(() => {
    const tier = selectedTierFilter === 'ALL' ? 'BRONZE' : selectedTierFilter;
    return getTierMaxStamps(tier, config.rewards, config.stampsToReward);
  }, [selectedTierFilter, config.rewards, config.stampsToReward]);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-space-lg pb-space-xl">
      {/* Encabezado de Página */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-xs">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-sm">
            <h1 className="font-display text-3xl font-bold text-on-surface tracking-tight">Motor de Retención</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-mono text-xs font-bold dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700/50">v3.0 Craft</span>
          </div>
          <p className="font-sans text-sm text-on-surface-variant mt-1">Configura las reglas de fidelización, tiers de clientes y recompensas para tus terminales activas.</p>
        </div>
      </header>

      {/* CARD 1: Modalidad del Programa */}
      <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs border border-outline-variant/60 flex flex-col gap-space-md">
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
            className={`relative flex flex-col justify-between p-space-md rounded-xl transition-all duration-200 cursor-pointer shadow-xs group ${
              isPuntos 
                ? 'bg-surface-container-low border-2 border-primary' 
                : 'bg-surface-container-lowest hover:bg-surface-container-low opacity-75 border-2 border-outline-variant/40'
            }`}
          >
            <div className="flex items-start justify-between gap-space-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-xs ${
                isPuntos ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant group-hover:text-on-surface'
              }`}>
                <Star className="w-5 h-5" />
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                isPuntos ? 'bg-primary text-on-primary shadow-xs' : 'bg-surface-container text-outline'
              }`}>
                {isPuntos ? <Check className="w-4 h-4 stroke-[3]" /> : <span className="w-2 rounded-full bg-outline/30"></span>}
              </div>
            </div>
            
            <div className="mt-space-md">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-on-surface">Programa de Puntos</h3>
                <span className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold ${
                  isPuntos ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60' : 'bg-surface-container text-on-surface-variant'
                }`}>
                  {isPuntos ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <p className="font-sans text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                Calcula puntos automáticamente según el monto total de cada compra registrada (ej. AR$ 100 = 20 pts).
              </p>
            </div>
            
            <div className="mt-space-md pt-space-sm">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold ${
                isPuntos ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60' : 'bg-surface-container text-on-surface-variant'
              }`}>
                <ThumbsUp className="w-3.5 h-3.5 text-secondary" />
                Recomendado para retail y gastronomía
              </span>
            </div>
          </div>

          {/* Opción 2: Tarjeta de Sellos */}
          <div 
            onClick={() => setConfig({ type: 'sellos' })}
            className={`relative flex flex-col justify-between p-space-md rounded-xl transition-all duration-200 cursor-pointer shadow-xs group ${
              isSellos 
                ? 'bg-surface-container-low border-2 border-primary' 
                : 'bg-surface-container-lowest hover:bg-surface-container-low opacity-75 border-2 border-outline-variant/40'
            }`}
          >
            <div className="flex items-start justify-between gap-space-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-xs ${
                isSellos ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant group-hover:text-on-surface'
              }`}>
                <Coffee className="w-5 h-5" />
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                isSellos ? 'bg-primary text-on-primary shadow-xs' : 'bg-surface-container text-outline'
              }`}>
                {isSellos ? <Check className="w-4 h-4 stroke-[3]" /> : <span className="w-2 rounded-full bg-outline/30"></span>}
              </div>
            </div>
            
            <div className="mt-space-md">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-on-surface">Tarjeta de Sellos</h3>
                <span className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold ${
                  isSellos ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60' : 'bg-surface-container text-on-surface-variant'
                }`}>
                  {isSellos ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <p className="font-sans text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                Otorga sellos digitales con estética de tinta artesanal por visita o consumo fijado en caja.
              </p>
            </div>
            
            <div className="mt-space-md pt-space-sm">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold ${
                isSellos ? 'bg-amber-50 text-amber-900 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60' : 'bg-surface-container text-on-surface-variant'
              }`}>
                <Coffee className="w-3.5 h-3.5 text-secondary" />
                Ideal para cafeterías de especialidad y bakery
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CARD 2: Regla de Acumulación */}
      <section className={`bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs border border-outline-variant/60 flex flex-col gap-space-md transition-opacity ${!isPuntos ? 'opacity-50 pointer-events-none' : ''}`}>
        {!isPuntos && (
          <div className="flex items-center gap-space-sm px-space-md py-2.5 rounded-xl bg-surface-container text-on-surface-variant font-sans text-xs border border-outline-variant/50">
            <Lock className="w-4.5 h-4.5 text-outline" />
            <span>Esta configuración se habilita con la opción <strong>"Programa de Puntos"</strong>. En modo sellos se otorga 1 sello por cada visita registrada.</span>
          </div>
        )}
        
        <div>
          <div className="flex items-center gap-space-xs">
            <Coins className="w-5 h-5 text-secondary" />
            <h2 className="font-display text-lg font-bold text-on-surface">Regla de Acumulación</h2>
          </div>
          <p className="font-sans text-xs text-on-surface-variant mt-0.5">Define el ratio de conversión directa de gasto a puntos en caja.</p>
        </div>

        <div className="bg-surface-container-low rounded-xl p-space-md sm:p-space-lg flex flex-col gap-space-sm border border-outline-variant/40">
          <div className="flex flex-wrap items-center gap-2 font-sans text-sm text-on-surface">
            <span className="font-medium whitespace-nowrap">Por cada</span>
            <div className="relative inline-flex items-center">
              <span className="absolute left-2.5 font-mono text-xs text-on-surface-variant font-semibold">AR$</span>
              <input 
                className="w-24 pl-8 pr-2 py-1.5 rounded-lg font-mono text-base font-bold bg-surface-container-lowest border border-outline-variant/50 shadow-xs text-center outline-none focus:border-primary transition text-on-surface" 
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
                className="w-16 px-2 py-1.5 rounded-lg font-mono text-base font-bold bg-surface-container-lowest border border-outline-variant/50 shadow-xs text-center outline-none focus:border-primary transition text-on-surface" 
                type="number" 
                value={config.pointsAwarded === 0 ? '' : (config.pointsAwarded ?? 20)} 
                onChange={(e) => setConfig({ pointsAwarded: e.target.value === '' ? 0 : Number(e.target.value) })}
                disabled={!isPuntos} 
              />
            </div>
            <span className="font-medium whitespace-nowrap">puntos.</span>
          </div>

          <div className="flex items-center gap-space-sm p-space-sm px-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface-variant mt-1">
            <Lightbulb className="w-4.5 h-4.5 shrink-0 text-secondary" />
            <p className="font-sans text-xs leading-normal">
              <span className="font-semibold text-on-surface">Ejemplo en POS:</span> Un ticket de <span className="font-mono text-xs font-semibold text-on-surface">AR$ 15,000</span> acreditará automáticamente <span className="font-mono text-xs font-bold text-primary">+{Math.floor((15000 / ((config.spendAmount || config.pointsPerArs) || 100)) * (config.pointsAwarded ?? 20)).toLocaleString()} pts</span> en la billetera del cliente.
            </p>
          </div>
        </div>
      </section>

      {/* CARD 3: Tiers de Clientes (Bronze, Plata, Oro VIP) */}
      <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs border border-outline-variant/60 flex flex-col gap-space-md">
        <div className="flex items-center justify-between gap-space-xs">
          <div>
            <div className="flex items-center gap-space-xs">
              <Crown className="w-5 h-5 text-secondary" />
              <h2 className="font-display text-lg font-bold text-on-surface">Niveles de Clientes (Tiers)</h2>
            </div>
            <p className="font-sans text-xs text-on-surface-variant mt-0.5">
              {isPuntos
                ? 'Configura las visitas requeridas para subir de nivel y la retención por inactividad. Los niveles desbloquean premios exclusivos.'
                : 'Configura las tarjetas de sellos completadas para subir de nivel y el acelerador de doble sello.'}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 font-mono text-[11px] font-bold border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700/50">
            Bronze • Plata • Oro
          </span>
        </div>

        {/* 3.1 Umbrales de Ascenso */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {/* Nivel Plata */}
          <div className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between gap-3 border border-outline-variant/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#f1f3f5] text-[#334155] border border-[#94a3b8]/60 dark:bg-[#252a33] dark:text-[#cbd5e1] dark:border-[#475569]/60 flex items-center justify-center font-bold text-xs shadow-xs">
                  🥈
                </span>
                <div>
                  <h4 className="font-display text-sm font-bold text-on-surface">Nivel Plata</h4>
                  <span className="font-sans text-[11px] text-on-surface-variant">Cliente Habitual</span>
                </div>
              </div>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface-container text-[#334155] dark:text-[#cbd5e1] border border-outline-variant/40">
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
                  className="w-16 px-2 py-1 rounded-lg font-mono text-sm font-bold bg-surface-container-lowest border border-outline-variant/50 text-center shadow-xs outline-none focus:border-primary text-on-surface"
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
                  className="w-16 px-2 py-1 rounded-lg font-mono text-sm font-bold bg-surface-container-lowest border border-outline-variant/50 text-center shadow-xs outline-none focus:border-primary text-on-surface"
                />
                <span className="font-medium">{(config.tierConfig.silverCardsThreshold ?? 1) === 1 ? 'tarjeta de sellos.' : 'tarjetas de sellos.'}</span>
              </div>
            )}
          </div>

          {/* Nivel Oro */}
          <div className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between gap-3 border border-amber-300 dark:border-amber-800/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#fef3c7] text-[#92400e] border border-[#f59e0b]/50 dark:bg-[#3b2d18] dark:text-[#fde68a] dark:border-[#d97706]/40 flex items-center justify-center font-bold text-xs shadow-xs">
                  🥇
                </span>
                <div>
                  <h4 className="font-display text-sm font-bold text-on-surface">Nivel Oro (VIP)</h4>
                  <span className="font-sans text-[11px] text-on-surface-variant">Cliente Más Valioso</span>
                </div>
              </div>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-[#92400e] border border-amber-300 dark:bg-amber-950/50 dark:text-[#fde68a] dark:border-amber-800/60">
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
                  className="w-16 px-2 py-1 rounded-lg font-mono text-sm font-bold bg-surface-container-lowest border border-outline-variant/50 text-center shadow-xs outline-none focus:border-primary text-on-surface"
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
                  className="w-16 px-2 py-1 rounded-lg font-mono text-sm font-bold bg-surface-container-lowest border border-outline-variant/50 text-center shadow-xs outline-none focus:border-primary text-on-surface"
                />
                <span className="font-medium">tarjetas de sellos.</span>
              </div>
            )}
          </div>
        </div>

        {/* 3.2 Acelerador de Puntos (Doble Puntos por Consumo) */}
        {isPuntos && (
          <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-3 border border-outline-variant/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-primary flex items-center justify-center shrink-0 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/60">
                  <Zap className="w-5 h-5 text-secondary fill-secondary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-sm font-bold text-on-surface">Acelerador: Doble Puntos por Consumo</h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60">
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
                className={`w-12 h-7 rounded-full p-1 flex items-center transition-colors shrink-0 cursor-pointer ${
                  config.tierConfig.doublePointsEnabled ? 'bg-primary justify-end' : 'bg-surface-container justify-start'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-surface-container-lowest shadow-xs"></span>
              </button>
            </div>

            {config.tierConfig.doublePointsEnabled && (
              <div className="mt-1 pt-3 border-t border-outline-variant/40 flex flex-wrap items-center gap-2 font-sans text-xs text-on-surface animate-in fade-in duration-200">
                <span>Si el ticket de compra es igual o superior a</span>
                <div className="relative inline-flex items-center">
                  <span className="absolute left-2.5 font-mono text-xs text-on-surface-variant font-semibold">AR$</span>
                  <input
                    type="number"
                    step="500"
                    min="1000"
                    value={config.tierConfig.doublePointsMinSpend ?? 20000}
                    onChange={(e) => setTierConfig({ doublePointsMinSpend: Math.max(0, Number(e.target.value)) })}
                    className="w-28 pl-8 pr-2 py-1 rounded-lg font-mono text-sm font-bold bg-surface-container-lowest border border-outline-variant/50 text-center shadow-xs outline-none focus:border-primary text-on-surface"
                  />
                </div>
                <span className="font-semibold text-primary">duplica automáticamente los puntos otorgados en caja (2x).</span>
              </div>
            )}
          </div>
        )}

        {/* 3.3 Acelerador de Sellos (Doble Sello por Consumo) */}
        {isSellos && (
          <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-3 border border-outline-variant/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-secondary flex items-center justify-center shrink-0 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/60">
                  <Zap className="w-5 h-5 text-secondary fill-secondary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-sm font-bold text-on-surface">Acelerador: Doble Sello por Consumo</h4>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-[10px] font-bold border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60">
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
                className={`w-12 h-7 rounded-full p-1 flex items-center transition-colors shrink-0 cursor-pointer ${
                  config.tierConfig.doubleStampEnabled ? 'bg-secondary justify-end' : 'bg-surface-container justify-start'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-surface-container-lowest shadow-xs"></span>
              </button>
            </div>

            {config.tierConfig.doubleStampEnabled && (
              <div className="mt-1 pt-3 border-t border-outline-variant/40 flex flex-wrap items-center gap-2 font-sans text-xs text-on-surface animate-in fade-in duration-200">
                <span>Si el ticket de compra es igual o superior a</span>
                <div className="relative inline-flex items-center">
                  <span className="absolute left-2.5 font-mono text-xs text-on-surface-variant font-semibold">AR$</span>
                  <input
                    type="number"
                    step="500"
                    min="1000"
                    value={config.tierConfig.doubleStampMinSpend}
                    onChange={(e) => setTierConfig({ doubleStampMinSpend: Math.max(0, Number(e.target.value)) })}
                    className="w-28 pl-8 pr-2 py-1 rounded-lg font-mono text-sm font-bold bg-surface-container-lowest border border-outline-variant/50 text-center shadow-xs outline-none focus:border-secondary text-on-surface"
                  />
                </div>
                <span className="font-semibold text-secondary">otorga automáticamente 2 sellos en caja.</span>
              </div>
            )}
          </div>
        )}

        {/* 3.4 Regla de Inactividad (Pérdida de Nivel) */}
        <div className="p-4 rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-md border border-outline-variant/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0 border border-outline-variant/40">
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
              className="w-16 px-2 py-1 rounded-lg font-mono text-sm font-bold bg-surface-container-lowest border border-outline-variant/50 text-center shadow-xs outline-none focus:border-primary text-on-surface"
            />
            <span className="font-sans text-xs font-medium text-on-surface">días sin visita.</span>
          </div>
        </div>
      </section>

      {/* CARD 4: Catálogo de Recompensas Segmentadas por Tier */}
      <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xs border border-outline-variant/60 flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <Ticket className="w-5 h-5 text-secondary" />
            <h2 className="font-display text-lg font-bold text-on-surface">Catálogo de Recompensas por Nivel</h2>
          </div>
          <span className="font-mono text-[11px] text-on-surface-variant flex items-center gap-1">
            <Award className="w-4 h-4 text-secondary" /> 
            Recompensas jerárquicas configuradas para caja
          </span>
        </div>

        {/* Filtros de Pestaña por Tier */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-container-low border border-outline-variant/40 overflow-x-auto">
          {isPuntos && (
            <button
              type="button"
              onClick={() => setSelectedTierFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                selectedTierFilter === 'ALL'
                  ? 'bg-surface-container-lowest text-primary shadow-xs border border-outline-variant/40'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Todas ({config.rewards.length})
            </button>
          )}
          <button
            type="button"
            onClick={() => setSelectedTierFilter('BRONZE')}
            className={`px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
              selectedTierFilter === 'BRONZE'
                ? 'bg-[#f5e6d3] text-[#78350f] shadow-xs border border-[#d97706]/50 dark:bg-[#382618] dark:text-[#fdba74] dark:border-[#d97706]/60'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>🥉</span> {isSellos ? 'Tarjeta Bronce' : 'Bronze'} ({config.rewards.filter(r => (r.minTier || 'BRONZE') === 'BRONZE').length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedTierFilter('SILVER')}
            className={`px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
              selectedTierFilter === 'SILVER'
                ? 'bg-[#f1f3f5] text-[#334155] shadow-xs border border-[#94a3b8]/60 dark:bg-[#252a33] dark:text-[#cbd5e1] dark:border-[#475569]/70'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>🥈</span> {isSellos ? 'Tarjeta Plata' : 'Plata'} ({config.rewards.filter(r => r.minTier === 'SILVER').length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedTierFilter('GOLD')}
            className={`px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
              selectedTierFilter === 'GOLD'
                ? 'bg-[#fef3c7] text-[#92400e] shadow-xs border border-[#f59e0b]/50 dark:bg-[#3b2d18] dark:text-[#fde68a] dark:border-[#d97706]/60'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>🥇</span> {isSellos ? 'Tarjeta Oro VIP' : 'Oro VIP'} ({config.rewards.filter(r => r.minTier === 'GOLD').length})
          </button>
          {isSellos && (
            <button
              type="button"
              onClick={() => setSelectedTierFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                selectedTierFilter === 'ALL'
                  ? 'bg-surface-container-lowest text-primary shadow-xs border border-outline-variant/40'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Todas las tarjetas ({config.rewards.length})
            </button>
          )}
        </div>

        {/* Simulador Físico de Tarjeta para Programa de Sellos */}
        {isSellos && selectedTierFilter !== 'ALL' && (
          <div className="p-4 rounded-xl kraft-cardboard border-2 border-dashed border-[#cfbeaa] dark:border-[#4d3f33] dark:bg-[#1e1915] flex flex-col gap-3 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#dfd2be] dark:border-[#3d3126] pb-2">
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4 text-[#78350f] dark:text-[#f59e0b]" />
                <span className="font-mono text-xs font-bold text-[#78350f] dark:text-[#f59e0b] uppercase">
                  Simulación de Tarjeta Artesanal ({selectedTierFilter === 'GOLD' ? 'Oro VIP' : selectedTierFilter === 'SILVER' ? 'Plata' : 'Bronce'})
                </span>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#ebdcc8] text-[#5c3d2e] dark:bg-[#2e241c] dark:text-[#d4af37] font-bold border border-[#d8c5ad] dark:border-[#524032]">
                  {currentTierMaxStamps} Sellos
                </span>
              </div>
              <span className="font-sans text-[11px] text-[#786455] dark:text-[#a89a8c]">
                Longitud definida por el premio mayor ({currentTierMaxStamps} sellos)
              </span>
            </div>

            {/* Grid de sellos físico simulado */}
            <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-xl bg-[#faedd9]/60 dark:bg-[#16120e] border border-[#dfd2be] dark:border-[#3d3126] shadow-inner">
              {Array.from({ length: currentTierMaxStamps }).map((_, i) => {
                const slot = i + 1;
                const rewardInSlot = config.rewards.find(r => (r.minTier || 'BRONZE') === selectedTierFilter && r.costStamps === slot);
                return (
                  <div
                    key={slot}
                    className={`w-10 h-10 rounded-full flex flex-col items-center justify-center font-mono text-xs font-bold transition-all ${
                      rewardInSlot
                        ? 'bg-[#b45309] text-white border-2 border-amber-300 dark:border-amber-400 shadow-xs'
                        : 'bg-[#ede3cf] text-[#786455] border border-dashed border-[#d8c8b4] dark:bg-[#241d17] dark:text-[#8c7b6d] dark:border-[#4a392b]'
                    }`}
                    title={rewardInSlot ? `Premio: ${rewardInSlot.name} (${slot} sellos)` : `Sello ${slot}`}
                  >
                    {rewardInSlot ? (
                      <Gift className="w-4.5 h-4.5 text-amber-200" />
                    ) : (
                      <span>{slot}</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] font-sans text-[#786455] dark:text-[#a89a8c] flex items-center gap-1.5 px-1">
              <Lightbulb className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span>
                {selectedTierFilter === 'BRONZE' && 'Al acumular los sellos de Bronce, en la visita #11 el cliente asciende a Tarjeta Plata con 1 sello. Los premios no canjeados se conservan como guardados.'}
                {selectedTierFilter === 'SILVER' && 'Al acumular los sellos de Plata, en la siguiente visita asciende a Tarjeta Oro con 1 sello. Los premios previos siguen disponibles.'}
                {selectedTierFilter === 'GOLD' && 'Al completar la Tarjeta Oro, en la siguiente visita se reinicia el ciclo Oro con 1 sello.'}
              </span>
            </div>
          </div>
        )}

        {/* Lista de Recompensas */}
        <div className="flex flex-col gap-2.5">
          {filteredRewards.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-surface-container-low text-on-surface-variant font-sans text-xs border border-outline-variant/40">
              No hay recompensas registradas en este nivel.
            </div>
          ) : (
            filteredRewards.map((reward) => {
              const tier = reward.minTier || 'BRONZE';
              return (
                <div key={reward.id} className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm group border border-outline-variant/40">
                  <div className="flex items-center gap-space-md min-w-0 flex-1">
                    <span className="font-mono text-sm font-bold text-primary min-w-[90px] tracking-tight">
                      {isPuntos ? `${reward.costPoints.toLocaleString()} pts` : `${reward.costStamps} sellos`}
                    </span>
                    <ArrowRight className="w-4.5 h-4.5 text-outline-variant shrink-0" />
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full bg-secondary shrink-0"></span>
                      <span className="font-sans text-sm font-semibold text-on-surface truncate">
                        {reward.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-auto">
                    {/* Badge de Tier */}
                    <span className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold flex items-center gap-1 shadow-xs border ${
                      tier === 'GOLD' ? 'bg-[#fef3c7] text-[#92400e] border-[#f59e0b]/50 dark:bg-[#3b2d18] dark:text-[#fde68a] dark:border-[#d97706]/40' :
                      tier === 'SILVER' ? 'bg-[#f1f3f5] text-[#334155] border-[#94a3b8]/60 dark:bg-[#252a33] dark:text-[#cbd5e1] dark:border-[#475569]/60' :
                      'bg-[#f5e6d3] text-[#78350f] border-[#d97706]/40 dark:bg-[#382618] dark:text-[#fdba74] dark:border-[#d97706]/40'
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
                        className="p-1.5 text-outline hover:text-primary hover:bg-surface-container-highest rounded-lg transition-colors cursor-pointer"
                        title="Editar recompensa"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          deleteReward(reward.id);
                          toast.success('Recompensa eliminada');
                        }}
                        className="p-1.5 text-outline hover:text-error hover:bg-error-container/50 rounded-lg transition-colors cursor-pointer"
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
          className="w-full py-3.5 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-sans text-sm font-semibold transition-all flex items-center justify-center gap-2 group border border-outline-variant/50 cursor-pointer"
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
          className="w-full py-4 px-8 rounded-xl bg-[#064e3b] hover:bg-[#065f46] text-white font-display text-lg font-bold shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer ring-1 ring-emerald-500/20"
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

      {/* CARD 5: Modo Demo Comercial (Ventas en Vivo B2B) */}
      <section className="bg-surface-container-lowest rounded-2xl p-5 sm:p-space-lg shadow-xs border-2 border-dashed border-amber-400/70 dark:border-amber-600/60 flex flex-col gap-space-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              <h2 className="font-display text-lg font-bold text-on-surface">
                Modo Demo Comercial (Ventas en Vivo)
              </h2>
            </div>
            <p className="font-sans text-xs text-on-surface-variant mt-0.5">
              Prepara el sistema en 1 clic con clientes argentinos realistas, premios y transacciones para demostraciones comerciales en vivo.
            </p>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 font-mono text-[11px] font-bold border border-amber-300 dark:border-amber-700">
            Kit Demo B2B
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Botón 1: Barbería / Peluquería & Estética (Puntos) */}
          <button
            type="button"
            disabled={demoLoading !== null}
            onClick={handleLoadBarberiaDemo}
            className="p-4 rounded-xl bg-surface-container-low hover:bg-emerald-50/80 dark:hover:bg-emerald-950/30 border border-outline-variant/60 hover:border-primary transition-all flex flex-col justify-between gap-3 text-left group cursor-pointer disabled:opacity-60 shadow-2xs"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs">
                {demoLoading === 'barberia' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Scissors className="w-5 h-5" />
                )}
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 font-mono text-[10px] font-bold border border-emerald-300 dark:border-emerald-800">
                Modo Puntos
              </span>
            </div>
            <div>
              <span className="font-display text-sm font-bold text-on-surface block group-hover:text-primary transition-colors">
                Cargar Demo: Barbería / Peluquería & Estética (Puntos)
              </span>
              <span className="font-sans text-xs text-on-surface-variant mt-1 block leading-relaxed">
                Configura 1 pto cada $100, premios de corte/barba/estética, 6 clientes activos (ej. DNI 38451290) y 12 transacciones.
              </span>
            </div>
          </button>

          {/* Botón 2: Cafetería / Gastronomía (Sellos) */}
          <button
            type="button"
            disabled={demoLoading !== null}
            onClick={handleLoadCafeteriaDemo}
            className="p-4 rounded-xl bg-surface-container-low hover:bg-amber-50/80 dark:hover:bg-amber-950/30 border border-outline-variant/60 hover:border-secondary transition-all flex flex-col justify-between gap-3 text-left group cursor-pointer disabled:opacity-60 shadow-2xs"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-10 h-10 rounded-xl bg-secondary text-on-secondary flex items-center justify-center shadow-xs">
                {demoLoading === 'cafeteria' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Coffee className="w-5 h-5" />
                )}
              </div>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 font-mono text-[10px] font-bold border border-amber-300 dark:border-amber-800">
                Modo Sellos (8)
              </span>
            </div>
            <div>
              <span className="font-display text-sm font-bold text-on-surface block group-hover:text-secondary transition-colors">
                Cargar Demo: Cafetería / Gastronomía (Sellos)
              </span>
              <span className="font-sans text-xs text-on-surface-variant mt-1 block leading-relaxed">
                Tarjeta artesanal de 8 sellos, Café + Medialuna gratis, clientes con 8/8 sellos listos para canjear en vivo (DNI 38451290).
              </span>
            </div>
          </button>
        </div>

        {/* Botón 3: Vaciar Datos de Prueba */}
        <div className="pt-1 border-t border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="font-sans text-xs text-on-surface-variant">
            ¿El cliente quiere probar cargando su propio DNI desde cero?
          </span>
          <button
            type="button"
            disabled={demoLoading !== null}
            onClick={handleClearDemoData}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-surface-container hover:bg-error-container hover:text-on-error-container text-on-surface-variant font-sans text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60 border border-outline-variant/50"
          >
            {demoLoading === 'clear' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            <span>Vaciar Datos de Prueba (Dejar en Cero)</span>
          </button>
        </div>
      </section>

      {/* MODAL DE RECOMPENSA */}
      {isRewardModalOpen && (
        <div 
          onClick={() => setIsRewardModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-outline-variant/60"
          >
            <div className="p-6 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-secondary flex items-center justify-center mb-1 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/60">
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
                    className="w-full bg-surface-container-low/70 border border-outline-variant/50 rounded-lg py-3 px-3.5 font-sans text-sm text-on-surface outline-none focus:border-primary focus:bg-surface-container-lowest transition-colors"
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
                      className="w-full bg-surface-container-low/70 border border-outline-variant/50 rounded-lg py-3 pl-3.5 pr-14 font-mono text-sm text-on-surface outline-none focus:border-primary focus:bg-surface-container-lowest transition-colors"
                      placeholder="Ej. 5"
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
                      className={`p-2 rounded-lg text-center font-sans text-xs font-semibold transition-all border cursor-pointer ${
                        rewardForm.minTier === 'BRONZE'
                          ? 'bg-[#f5e6d3] text-[#78350f] border-[#d97706]/70 shadow-xs dark:bg-[#382618] dark:text-[#fdba74] dark:border-[#d97706]/60'
                          : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container'
                      }`}
                    >
                      <div className="text-base">🥉</div>
                      <span>Bronze</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRewardForm({ ...rewardForm, minTier: 'SILVER' })}
                      className={`p-2 rounded-lg text-center font-sans text-xs font-semibold transition-all border cursor-pointer ${
                        rewardForm.minTier === 'SILVER'
                          ? 'bg-[#f1f3f5] text-[#334155] border-[#94a3b8]/70 shadow-xs dark:bg-[#252a33] dark:text-[#cbd5e1] dark:border-[#475569]/70'
                          : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container'
                      }`}
                    >
                      <div className="text-base">🥈</div>
                      <span>Plata</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRewardForm({ ...rewardForm, minTier: 'GOLD' })}
                      className={`p-2 rounded-lg text-center font-sans text-xs font-semibold transition-all border cursor-pointer ${
                        rewardForm.minTier === 'GOLD'
                          ? 'bg-[#fef3c7] text-[#92400e] border-[#f59e0b]/70 shadow-xs dark:bg-[#3b2d18] dark:text-[#fde68a] dark:border-[#d97706]/60'
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
            <div className="bg-surface-container-low p-4 flex gap-3 justify-end border-t border-outline-variant/40">
              <button 
                type="button"
                onClick={() => setIsRewardModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-sans text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
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
                className="px-5 py-2.5 rounded-xl font-sans text-sm font-semibold bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-xs cursor-pointer"
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
