import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import { 
  Touchpad, Store, CheckCircle2, IdCard, Search, X, Star, Check, 
  Gift, CupSoda, ArrowUpCircle, Banknote, Coins, UserPlus, Sparkles, QrCode,
  Crown, Zap, Lock, AlertTriangle, ShieldCheck, Coffee, Stamp
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { 
  useLoyaltyStore, 
  type Reward, 
  canClaimReward, 
  TIER_LABELS, 
  TIER_RANKS,
  calculateCustomerTier,
  getTierMaxStamps,
  getNextTier
} from '../store/useLoyaltyStore';

export function TerminalPOS() {
  const config = useLoyaltyStore((state) => state.config);
  const customers = useLoyaltyStore((state) => state.customers);
  const processPurchase = useLoyaltyStore((state) => state.processPurchase);
  const redeemPoints = useLoyaltyStore((state) => state.redeemPoints);
  const redeemStamps = useLoyaltyStore((state) => state.redeemStamps);
  const validateRedemptionToken = useLoyaltyStore((state) => state.validateRedemptionToken);

  const isPuntos = config.type === 'puntos';
  const isSellos = config.type === 'sellos';
  
  const [dniInput, setDniInput] = useState('');
  const [activeDni, setActiveDni] = useState('');
  const [ticketAmount, setTicketAmount] = useState<number | ''>('');
  
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  // Estados para validación de tokens QR / OTP
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  const [activeCustomerPendingToken, setActiveCustomerPendingToken] = useState<any | null>(null);
  
  const dniInputRef = useRef<HTMLInputElement>(null);
  const ticketInputRef = useRef<HTMLInputElement>(null);

  const activeCustomer = useMemo(() => {
    return customers.find(c => c.dni === activeDni);
  }, [customers, activeDni]);

  const isNewCustomer = Boolean(activeDni && !activeCustomer);

  // Evaluación de estado de Tier del cliente (inactividad, alertas y progreso)
  const tierStatus = useMemo(() => {
    if (!activeCustomer) return null;
    return calculateCustomerTier(activeCustomer, config.tierConfig, config.type);
  }, [activeCustomer, config.tierConfig, config.type]);

  // Progreso hacia el siguiente nivel de cliente
  const nextTierProgress = useMemo(() => {
    if (!activeCustomer) return null;
    const currentTier = activeCustomer.tier;

    if (isSellos) {
      const { silverCardsThreshold = 1, goldCardsThreshold = 2 } = config.tierConfig;
      const cards = activeCustomer.completedCards || 0;

      if (currentTier === 'BRONZE') {
        const remaining = Math.max(0, silverCardsThreshold - cards);
        const percent = Math.min(100, Math.round((cards / silverCardsThreshold) * 100));
        return {
          nextTierLabel: 'Plata',
          remainingUnits: remaining,
          unitLabel: remaining === 1 ? 'tarjeta completa' : 'tarjetas completas',
          percent,
          isMax: false,
        };
      }

      if (currentTier === 'SILVER') {
        const remaining = Math.max(0, goldCardsThreshold - cards);
        const percent = Math.min(100, Math.round((cards / goldCardsThreshold) * 100));
        return {
          nextTierLabel: 'Oro VIP',
          remainingUnits: remaining,
          unitLabel: remaining === 1 ? 'tarjeta completa' : 'tarjetas completas',
          percent,
          isMax: false,
        };
      }

      return {
        nextTierLabel: 'Máximo',
        remainingUnits: 0,
        unitLabel: '',
        percent: 100,
        isMax: true,
      };
    }

    // Modo Puntos: basado en visitas acumuladas
    const { silverVisitsThreshold, goldVisitsThreshold } = config.tierConfig;
    const visits = activeCustomer.totalVisits;

    if (currentTier === 'BRONZE') {
      const remaining = Math.max(0, silverVisitsThreshold - visits);
      const percent = Math.min(100, Math.round((visits / silverVisitsThreshold) * 100));
      return {
        nextTierLabel: 'Plata',
        remainingUnits: remaining,
        unitLabel: remaining === 1 ? 'visita' : 'visitas',
        percent,
        isMax: false,
      };
    }

    if (currentTier === 'SILVER') {
      const remaining = Math.max(0, goldVisitsThreshold - visits);
      const percent = Math.min(100, Math.round((visits / goldVisitsThreshold) * 100));
      return {
        nextTierLabel: 'Oro VIP',
        remainingUnits: remaining,
        unitLabel: remaining === 1 ? 'visita' : 'visitas',
        percent,
        isMax: false,
      };
    }

    return {
      nextTierLabel: 'Máximo',
      remainingUnits: 0,
      unitLabel: '',
      percent: 100,
      isMax: true,
    };
  }, [activeCustomer, config.tierConfig, isSellos]);
  
  // Lógica de progreso dinámica memorizada según el catálogo
  const { nextPuntosReward, nextSellosReward, targetPoints, targetStamps, maxStampsReward } = useMemo(() => {
    const currentTier = activeCustomer?.tier || 'BRONZE';
    const tierMax = isSellos
      ? getTierMaxStamps(currentTier, config.rewards, config.stampsToReward)
      : (config.rewards.length > 0 ? Math.max(...config.rewards.map(r => r.costStamps)) : config.stampsToReward);

    const sortedPoints = [...config.rewards].sort((a, b) => a.costPoints - b.costPoints);
    const nextPts = sortedPoints.find(r => r.costPoints > (activeCustomer?.points || 0));

    // Próximo premio en sellos dentro del tier actual
    const sortedStampsCurrentTier = config.rewards
      .filter(r => (r.minTier || 'BRONZE') === currentTier && r.costStamps > 0)
      .sort((a, b) => a.costStamps - b.costStamps);
    const nextStp = sortedStampsCurrentTier.find(r => r.costStamps > (activeCustomer?.stamps || 0));

    const tPoints = nextPts ? nextPts.costPoints : (config.rewards.length > 0 ? Math.max(...config.rewards.map(r => r.costPoints)) : 5000);
    const tStamps = nextStp ? nextStp.costStamps : tierMax;

    return {
      nextPuntosReward: nextPts,
      nextSellosReward: nextStp,
      targetPoints: tPoints > 0 ? tPoints : 1,
      targetStamps: tStamps > 0 ? tStamps : 1,
      maxStampsReward: tierMax > 0 ? tierMax : 1
    };
  }, [config.rewards, config.stampsToReward, activeCustomer?.points, activeCustomer?.stamps, activeCustomer?.tier, isSellos]);

  const displayedStamps = activeCustomer?.stamps || 0;
  
  const getDaysSinceLastVisit = useCallback((dateString?: string) => {
    if (!dateString) return '-';
    
    const lastVisit = new Date(dateString);
    lastVisit.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - lastVisit.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'hoy';
    return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  }, []);
  
  // Recompensas disponibles para este cliente memorizadas
  const availableRewards = useMemo(() => {
    if (!activeCustomer) return [];
    if (isPuntos) {
      return config.rewards
        .filter(r => canClaimReward(activeCustomer.tier, r.minTier || 'BRONZE'))
        .filter(r => (activeCustomer.points || 0) >= r.costPoints)
        .sort((a, b) => a.costPoints - b.costPoints);
    }

    // Modo SELLOS:
    // Un premio está disponible si NO está en claimedRewards y además:
    // 1) Es de un tier anterior completado (premios guardados pendientes de canje)
    // 2) O es del tier actual y el cliente alcanzó los sellos requeridos
    const customerRank = TIER_RANKS[activeCustomer.tier || 'BRONZE'];
    return config.rewards
      .filter(r => {
        const rewardTier = r.minTier || 'BRONZE';
        const rewardRank = TIER_RANKS[rewardTier];
        const isClaimed = (activeCustomer.claimedRewards || []).includes(r.id);
        if (isClaimed) return false;

        if (rewardRank < customerRank) {
          // Tarjeta anterior ya superada: premio guardado disponible
          return true;
        } else if (rewardRank === customerRank) {
          // Tarjeta actual: sellos acumulados suficientes
          return (activeCustomer.stamps || 0) >= r.costStamps;
        }
        return false;
      })
      .sort((a, b) => {
        const rankDiff = TIER_RANKS[a.minTier || 'BRONZE'] - TIER_RANKS[b.minTier || 'BRONZE'];
        if (rankDiff !== 0) return rankDiff;
        return a.costStamps - b.costStamps;
      });
  }, [config.rewards, isPuntos, activeCustomer]);

  // Recompensas exclusivas de niveles superiores bloqueadas para incentivar retención en caja
  const lockedTierRewards = useMemo(() => {
    if (!activeCustomer) return [];
    return config.rewards
      .filter(r => !canClaimReward(activeCustomer.tier, r.minTier || 'BRONZE'))
      .sort((a, b) => (TIER_RANKS[a.minTier || 'BRONZE'] - TIER_RANKS[b.minTier || 'BRONZE']));
  }, [config.rewards, activeCustomer]);

  const isRewardReady = availableRewards.length > 0;

  // 1. Consulta y escucha dedicada para el cliente que está activo en pantalla
  useEffect(() => {
    if (!activeCustomer?.id) {
      setActiveCustomerPendingToken(null);
      return;
    }

    const fetchActiveToken = async () => {
      try {
        const nowIso = new Date().toISOString();
        const { data, error } = await supabase
          .from('loyalty_redemption_tokens')
          .select('*')
          .eq('customer_id', activeCustomer.id)
          .eq('status', 'PENDING')
          .gt('expires_at', nowIso)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error) {
          setActiveCustomerPendingToken(data || null);
        }
      } catch (err) {
        console.warn('[TerminalPOS] Error consultando token de cliente activo:', err);
      }
    };

    fetchActiveToken();

    // Polling agresivo cada 1.5s para detectar el canje apenas el cliente pulse en su app
    const interval = setInterval(fetchActiveToken, 1500);

    const channelName = `pos_active_token_${activeCustomer.id}_${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'loyalty_redemption_tokens',
          filter: `customer_id=eq.${activeCustomer.id}`,
        },
        () => {
          fetchActiveToken();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [activeCustomer?.id]);

  const handleValidateTokenSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tokenInput.trim()) return;

    setIsValidatingToken(true);
    const result = await validateRedemptionToken(tokenInput.trim());
    setIsValidatingToken(false);

    if (result.success) {
      toast.success(
        `🎉 ¡Canje exitoso para ${result.customerName}! Recompensa: ${result.rewardName}`,
        { duration: 6000 }
      );
      if (result.customerDni) {
        setActiveDni(result.customerDni);
      }
      setIsTokenModalOpen(false);
      setTokenInput('');
      setActiveCustomerPendingToken(null);

      // Foco automático en el monto del ticket para continuar el cobro
      setTimeout(() => {
        ticketInputRef.current?.focus();
        ticketInputRef.current?.select();
      }, 150);
    } else {
      toast.error(result.message);
    }
  }, [tokenInput, validateRedemptionToken]);

  const handleApproveToken = useCallback(async (token: any) => {
    if (!token) return;
    setIsValidatingToken(true);
    const result = await validateRedemptionToken(token.token_code);
    setIsValidatingToken(false);

    if (result.success) {
      toast.success(
        `🎉 ¡Canje exitoso! Se entregó "${result.rewardName}" a ${result.customerName}.`,
        { duration: 6000 }
      );
      if (result.customerDni) {
        setActiveDni(result.customerDni);
      }
      setActiveCustomerPendingToken(null);
      setIsTokenModalOpen(false);
      setTokenInput('');

      // Foco automático en el monto del ticket para continuar el cobro
      setTimeout(() => {
        ticketInputRef.current?.focus();
        ticketInputRef.current?.select();
      }, 150);
    } else {
      toast.error(result.message);
    }
  }, [validateRedemptionToken]);

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = dniInput.trim();
    if (!clean) return;

    const isExactDni = customers.some(c => c.dni === clean);
    const isTokenFormat = (clean.startsWith('{') && clean.includes('tokenCode')) || (/^\d{6}$/.test(clean) && !isExactDni);

    if (isTokenFormat) {
      setIsValidatingToken(true);
      const res = await validateRedemptionToken(clean);
      setIsValidatingToken(false);
      if (res.success) {
        toast.success(`🎉 ¡Canje validado! ${res.rewardName} para ${res.customerName}`, { duration: 6000 });
        if (res.customerDni) {
          setActiveDni(res.customerDni);
        }
        setDniInput('');
        return;
      }
    }

    setActiveDni(clean);
    setDniInput('');
    dniInputRef.current?.blur();
  }, [dniInput, customers, validateRedemptionToken]);

  const handleClear = useCallback(() => {
    setActiveDni('');
    setDniInput('');
    setTicketAmount('');
    setActiveCustomerPendingToken(null);
    dniInputRef.current?.focus();
  }, []);

  const handleProcess = useCallback(() => {
    const dniToProcess = activeCustomer ? activeCustomer.dni : activeDni;
    if (!dniToProcess) return;
    if (typeof ticketAmount !== 'number' || ticketAmount < 0) return;
    
    const result = processPurchase(dniToProcess, Number(ticketAmount));
    
    // Si subió de nivel, notificación destacada de celebración
    if (result?.upgradedTier) {
      toast.success(
        `🎉 ¡Felicitaciones! ${activeCustomer?.name || 'El cliente'} acaba de ascender a Nivel ${TIER_LABELS[result.newTier].toUpperCase()}!`,
        { duration: 6000 }
      );
    }

    if (isPuntos) {
      const doubleBonusText = result?.isDoublePoints
        ? ` (⚡ ¡Doble puntos por ticket mayor a AR$ ${(config.tierConfig.doublePointsMinSpend || 20000).toLocaleString()}!)`
        : '';
      if (isNewCustomer) {
        toast.success(`¡Cliente nuevo registrado! Se sumaron ${result?.pointsEarned.toLocaleString()} pts al DNI ${dniToProcess}${doubleBonusText}.`);
      } else {
        toast.success(`¡Compra procesada! Se sumaron +${result?.pointsEarned.toLocaleString()} pts${doubleBonusText}.`);
      }
    } else {
      const stampCount = result?.stampsEarned || 1;
      const doubleBonusText = result?.isDoubleStamp
        ? ` (⚡ ¡Doble sello por ticket mayor a AR$ ${(config.tierConfig.doubleStampMinSpend || 15000).toLocaleString()}!)`
        : '';
      if (isNewCustomer) {
        toast.success(`¡Primer visita registrada! Se sumaron ${stampCount} sello${stampCount > 1 ? 's' : ''} al DNI ${dniToProcess}${doubleBonusText}.`);
      } else {
        toast.success(`¡Visita registrada! Se sumaron +${stampCount} sello${stampCount > 1 ? 's' : ''} a la tarjeta${doubleBonusText}.`);
      }
    }
    handleClear();
  }, [activeCustomer, activeDni, isNewCustomer, ticketAmount, processPurchase, isPuntos, config.tierConfig.doubleStampMinSpend, config.tierConfig.doublePointsMinSpend, handleClear]);

  const handleRedeemClick = useCallback((reward: Reward) => {
    setSelectedReward(reward);
    setIsRedeemModalOpen(true);
  }, []);

  const handleConfirmRedeem = useCallback(() => {
    if (!activeCustomer || !selectedReward) return;
    if (isPuntos) {
      redeemPoints(activeCustomer.dni, selectedReward.costPoints, selectedReward.id);
      toast.success(`¡Canje exitoso! Se descontaron ${selectedReward.costPoints.toLocaleString()} pts.`);
    }
    if (isSellos) {
      redeemStamps(activeCustomer.dni, selectedReward.costStamps, selectedReward.id);
      toast.success(`¡Premio canjeado con éxito! (${selectedReward.name})`);
    }
    setIsRedeemModalOpen(false);
    setSelectedReward(null);
  }, [activeCustomer, selectedReward, isPuntos, isSellos, redeemPoints, redeemStamps]);

  // Keyboard Shortcuts (Enter, Alt+C, F2, /, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Focus Input DNI (tecla '/')
      if (e.key === '/' && document.activeElement !== dniInputRef.current && document.activeElement !== ticketInputRef.current) {
        e.preventDefault();
        dniInputRef.current?.focus();
        return;
      }

      // 2. Focus Input Monto Ticket (tecla 'F2')
      if (e.key === 'F2') {
        e.preventDefault();
        ticketInputRef.current?.focus();
        ticketInputRef.current?.select();
        return;
      }

      // 3. Atajo para Canjear Premio: Alt+C (o letra 'C' si no se está escribiendo en ningún input)
      const isTyping = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA';
      if ((e.altKey && e.key.toLowerCase() === 'c') || (!isTyping && e.key.toLowerCase() === 'c')) {
        if (activeCustomer) {
          e.preventDefault();
          setTokenInput(activeCustomerPendingToken?.token_code || '');
          setIsTokenModalOpen(true);
          return;
        }
      }

      // Cerrar modales con escape
      if (e.key === 'Escape') {
        if (isTokenModalOpen) {
          setIsTokenModalOpen(false);
          setTokenInput('');
          return;
        }
        if (isRedeemModalOpen) {
          setIsRedeemModalOpen(false);
          setSelectedReward(null);
          return;
        }
      }

      // 4. Registrar Visita / Compra (tecla 'Enter')
      if (e.key === 'Enter') {
        if (isTokenModalOpen) {
          return;
        }
        if (isRedeemModalOpen) {
          e.preventDefault();
          handleConfirmRedeem();
          return;
        }

        if (document.activeElement === dniInputRef.current) return;
        
        if ((activeCustomer || activeDni) && typeof ticketAmount === 'number' && ticketAmount >= 0) {
          e.preventDefault();
          handleProcess();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCustomer, activeDni, isRewardReady, isPuntos, ticketAmount, dniInput, config, isRedeemModalOpen, isTokenModalOpen, activeCustomerPendingToken, availableRewards, handleConfirmRedeem, handleProcess]);

  return (
    <div className="flex flex-col w-full items-center justify-start pb-space-xl">
      {/* Barra de Estado Superior Ergonómica */}
      <div className="w-full max-w-3xl flex items-center justify-between px-space-xs mb-space-sm">
        <div className="flex items-center gap-space-xs text-on-surface-variant">
          <Touchpad className="w-4 h-4 text-primary" />
          <span className="font-mono text-xs uppercase tracking-wider font-semibold text-on-surface">Terminal POS Craft</span>
          <span className="text-outline-variant font-mono text-xs">•</span>
          <span className="font-mono text-xs text-secondary font-bold">
            Modo {isPuntos ? 'Puntos' : 'Sellos'} Activo
          </span>
        </div>
        <div className="flex items-center gap-space-xs text-on-surface-variant bg-surface-container-low px-2.5 py-1 rounded-full border border-outline-variant/40">
          <Store className="w-3.5 h-3.5 text-secondary" />
          <span className="font-mono text-xs font-medium text-on-surface">Sucursal Mostrador Principal</span>
        </div>
      </div>
      
      {/* Contenedor Principal POS - Warm White con bordes sutiles */}
      <div className="w-full max-w-3xl bg-surface-container-lowest rounded-2xl shadow-[0_2px_12px_rgba(44,30,20,0.04)] border border-outline-variant/60 p-6 md:p-8 flex flex-col gap-space-md">
        
        {/* 1. DNI / Identificación del Cliente */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
              <IdCard className="w-4 h-4 text-primary" />
              DNI / DOCUMENTO DEL CLIENTE
            </label>
            {activeCustomer ? (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-900 border border-emerald-200/80 px-3 py-0.5 rounded-full font-mono text-xs font-semibold shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Cliente identificado
              </span>
            ) : isNewCustomer ? (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-300/80 px-3 py-0.5 rounded-full font-mono text-xs font-semibold shadow-xs">
                <UserPlus className="w-3.5 h-3.5 text-amber-700" />
                Nuevo en el programa
              </span>
            ) : null}
          </div>
          
          <form onSubmit={handleSearch} className="rounded-xl bg-surface-container-low/50 p-3 md:p-3.5 flex items-center justify-between border border-outline-variant/60 focus-within:border-primary focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <div className="flex items-center gap-space-md min-w-0 w-full">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary flex-shrink-0 shadow-xs">
                <IdCard className="w-5 h-5 text-primary" />
              </div>
              <input 
                ref={dniInputRef}
                type="text"
                className="w-full font-display text-2xl md:text-3xl font-bold text-on-surface tracking-wider bg-transparent outline-none placeholder:text-on-surface-variant/30"
                placeholder="Ingresar DNI..."
                value={activeDni ? activeDni : dniInput}
                onChange={(e) => {
                  if (activeDni) setActiveDni('');
                  setDniInput(e.target.value);
                }}
              />
            </div>
            <div className="flex items-center gap-space-xs flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsTokenModalOpen(true)}
                title="Validar código de canje o escanear QR"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-100/70 hover:bg-amber-100 text-amber-900 border border-amber-300/70 transition-colors font-mono text-xs font-semibold shadow-xs cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-secondary" />
                <span className="hidden sm:inline">Validar Canje</span>
              </button>
              <button type="submit" className="group flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors cursor-pointer border border-outline-variant/40">
                <Search className="w-4 h-4 text-on-surface-variant group-hover:text-primary" />
                <kbd className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface-variant shadow-xs border border-outline-variant/50 font-semibold">/</kbd>
              </button>
              <button type="button" onClick={handleClear} aria-label="Limpiar campo" className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/50 transition-colors cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </form>
        </div>

        {/* 2. Tarjeta / Contenedor de Información del Cliente */}
        {activeCustomer ? (
          <div className="bg-surface-container-low/70 rounded-xl p-5 flex flex-col gap-space-md border border-outline-variant/50 animate-in fade-in zoom-in-95 duration-200">
            {/* Cabecera del Cliente con Tier Badge, Visitas y Botón de Canje Alt+C */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-display text-lg font-bold shadow-xs">
                  {activeCustomer.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-2xl font-bold text-on-surface tracking-tight">{activeCustomer.name}</h2>
                    
                    {/* Badge de Nivel Destacado (Bronze, Silver, Gold VIP) */}
                    <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md border shadow-xs ${
                      activeCustomer.tier === 'GOLD' 
                        ? 'bg-[#fef3c7] text-[#92400e] border-[#f59e0b]/50 shadow-[0_0_8px_rgba(245,158,11,0.2)]' 
                        : activeCustomer.tier === 'SILVER'
                        ? 'bg-[#f1f3f5] text-[#334155] border-[#94a3b8]/60'
                        : 'bg-[#f5e6d3] text-[#78350f] border-[#d97706]/40'
                    }`}>
                      {activeCustomer.tier === 'GOLD' && <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />}
                      {activeCustomer.tier === 'SILVER' && <Star className="w-3.5 h-3.5 text-slate-600 fill-slate-400" />}
                      {activeCustomer.tier === 'BRONZE' && <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />}
                      {activeCustomer.tier === 'GOLD' ? 'ORO VIP' : activeCustomer.tier === 'SILVER' ? 'PLATA' : 'BRONZE'}
                    </span>

                    {/* Si es sellos, mostrar tarjetas completadas acumuladas */}
                    {isSellos && (
                      <span className="inline-flex items-center gap-1 bg-surface-container text-on-surface-variant font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-md border border-outline-variant/40">
                        <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                        {activeCustomer.completedCards || 0} {(activeCustomer.completedCards || 0) === 1 ? 'tarjeta completada' : 'tarjetas completadas'}
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs text-on-surface-variant font-medium mt-0.5">
                    DNI: <strong className="text-on-surface font-semibold">{activeCustomer.dni}</strong> • Última visita: <strong className="text-on-surface font-semibold">{getDaysSinceLastVisit(activeCustomer.lastVisitDate)}</strong>
                  </span>
                </div>
              </div>

              {/* Botón Principal para Canjear Premio con Glowing Cinnamon / Toasted Amber y Shortcut Alt+C */}
              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setTokenInput(activeCustomerPendingToken?.token_code || '');
                    setIsTokenModalOpen(true);
                  }}
                  title="Canjear premio o escanear QR (Alt+C)"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-sans text-xs font-bold transition-all cursor-pointer ${
                    activeCustomerPendingToken || isRewardReady
                      ? 'bg-[#b45309] hover:bg-[#92400e] text-white warm-pulse-reward ring-2 ring-amber-400/60 shadow-md'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/60 shadow-xs'
                  }`}
                >
                  <Gift className="w-4 h-4 shrink-0 text-amber-200" />
                  <span>Canjear Premio</span>
                  {(activeCustomerPendingToken || isRewardReady) && (
                    <span className="w-2 h-2 rounded-full bg-amber-200 animate-pulse inline-block" />
                  )}
                  <kbd className="ml-1 font-mono text-[10px] bg-black/25 text-white px-1.5 py-0.5 rounded font-semibold border border-white/10">
                    Alt+C
                  </kbd>
                </button>
              </div>
            </div>

            {activeCustomer.isRegistered === false && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3.5 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-sans">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-secondary shrink-0" />
                  <span><strong>Cuenta pendiente de activación:</strong> Este cliente suma con su DNI pero aún no activó su cuenta en la app.</span>
                </div>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 shrink-0 self-start sm:self-auto border border-amber-300">
                  Invitar a escanear QR
                </span>
              </div>
            )}

            {/* Alerta de Inactividad si está en riesgo o fue degradado */}
            {tierStatus?.isAtRisk && (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs font-sans">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>¡En riesgo de inactividad!</strong> No visita desde hace {tierStatus.daysInactive} días. Perderá su nivel si no registra compras antes de los {config.tierConfig.inactivityDaysDowngrade} días.
                </span>
              </div>
            )}

            {tierStatus?.isDowngraded && (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-stone-100 border border-stone-300 text-stone-800 text-xs font-sans">
                <AlertTriangle className="w-4 h-4 text-stone-600 shrink-0" />
                <span>
                  <strong>Nivel ajustado por inactividad:</strong> Inactivo por {tierStatus.daysInactive} días (&gt; {config.tierConfig.inactivityDaysDowngrade} días). Sumando visitas hoy recuperará su nivel.
                </span>
              </div>
            )}

            {/* Barra de Progreso hacia el Próximo Nivel */}
            {nextTierProgress && !nextTierProgress.isMax && (
              <div className="bg-surface-container-lowest rounded-xl p-3 flex flex-col gap-1.5 border border-outline-variant/40 shadow-xs">
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="text-on-surface font-medium flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-secondary" />
                    Rumbo a Nivel <strong>{nextTierProgress.nextTierLabel}</strong>:
                  </span>
                  <span className="font-mono text-xs font-bold text-secondary">
                    Faltan {nextTierProgress.remainingUnits} {nextTierProgress.unitLabel}
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-secondary to-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${nextTierProgress.percent}%` }}
                  />
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-space-md">
              {/* VISTA SELLOS - TACTILE KRAFT CARDBOARD STAMP CARD */}
              {isSellos && (
                <>
                  <div className="kraft-cardboard rounded-2xl p-5 md:p-6 shadow-[0_2px_10px_rgba(69,26,3,0.06)] border-2 border-dashed border-[#cfbeaa] flex flex-col gap-4 relative overflow-hidden">
                    {/* Alerta de Tarjeta Completa */}
                    {displayedStamps >= maxStampsReward && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-100/90 border border-emerald-300 text-emerald-950 font-sans text-xs shadow-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>
                          <strong>¡Tarjeta {TIER_LABELS[activeCustomer?.tier || 'BRONZE']} Completa!</strong> ({displayedStamps}/{maxStampsReward} sellos). 
                          {activeCustomer?.tier === 'GOLD' 
                            ? ' En la próxima visita reiniciará su ciclo Oro con 1 sello.' 
                            : ` En la próxima visita pasará a Tarjeta ${TIER_LABELS[getNextTier(activeCustomer?.tier || 'BRONZE')]} iniciando con 1 sello.`}
                        </span>
                      </div>
                    )}

                    {/* Cabecera Kraft Cardboard */}
                    <div className="flex items-center justify-between border-b border-[#dfd2be] pb-2.5">
                      <div className="flex items-center gap-2">
                        <Coffee className="w-4 h-4 text-[#78350f]" />
                        <span className="font-mono text-xs font-bold tracking-wider text-[#78350f] uppercase">
                          Tarjeta Artesanal • Nivel {TIER_LABELS[activeCustomer?.tier || 'BRONZE']}
                        </span>
                      </div>
                      <span className="font-mono text-xs bg-[#ebdcc8] text-[#5c3d2e] px-2.5 py-0.5 rounded-full font-bold border border-[#d8c5ad]">
                        Meta: {maxStampsReward} Sellos
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-4xl font-extrabold text-[#3a2010] leading-none">
                          {displayedStamps}
                        </span>
                        <span className="font-display text-lg text-[#786455] font-semibold">
                          / {maxStampsReward} sellos acumulados
                        </span>
                      </div>
                      {displayedStamps >= maxStampsReward && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300 font-mono text-xs font-bold animate-pulse">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          ¡Tarjeta Completa!
                        </span>
                      )}
                    </div>
                    
                    {/* Sellos Físicos de Estilo Artesanal / Hand-Stamped Ink Seals */}
                    <div className="flex flex-wrap items-center justify-start gap-3 py-2">
                      {Array.from({ length: maxStampsReward }).map((_, i) => {
                        const stampNumber = i + 1;
                        const isEarned = stampNumber <= displayedStamps;
                        const isNext = stampNumber === displayedStamps + 1;
                        const currentTier = activeCustomer?.tier || 'BRONZE';
                        const rewardAtSlot = config.rewards.find((r) => (r.minTier || 'BRONZE') === currentTier && r.costStamps === stampNumber);
                        const isRewardSlot = Boolean(rewardAtSlot);
                        const isClaimedAtSlot = Boolean(rewardAtSlot && (activeCustomer?.claimedRewards || []).includes(rewardAtSlot.id));
                        
                        if (isClaimedAtSlot) {
                          return (
                            <div 
                              key={i} 
                              title={`${rewardAtSlot?.name} (Canjeado en esta tarjeta)`}
                              className="w-11 h-11 rounded-full flex flex-col items-center justify-center font-mono text-xs font-bold bg-[#064e3b] text-[#a7f3d0] border-2 border-[#10b981] shadow-inner transform rotate-1 transition-all"
                            >
                              <Check className="w-5 h-5 stroke-[3]" />
                              <span className="text-[8px] leading-tight font-extrabold tracking-tighter">CANJ</span>
                            </div>
                          );
                        }

                        if (isEarned && isRewardSlot) {
                          return (
                            <div 
                              key={i} 
                              title={`${rewardAtSlot?.name} (Premio listo para canjear)`}
                              className="w-11 h-11 rounded-full flex flex-col items-center justify-center font-mono text-xs font-bold bg-[#b45309] text-white border-2 border-amber-300 shadow-md ring-2 ring-amber-400/50 transform -rotate-2 cursor-pointer transition-all hover:scale-105"
                              onClick={() => rewardAtSlot && handleRedeemClick(rewardAtSlot)}
                            >
                              <Gift className="w-5 h-5 text-amber-200" />
                              <span className="text-[8px] leading-tight font-extrabold tracking-tighter">PREMIO</span>
                            </div>
                          );
                        }

                        if (isEarned) {
                          return (
                            <div 
                              key={i} 
                              title={`Sello ${stampNumber} registrado`}
                              className="w-11 h-11 rounded-full flex flex-col items-center justify-center font-mono text-xs font-bold bg-[#3d2314] text-[#faedd9] border-2 border-[#5c3820] shadow-sm transform rotate-1 kraft-seal-stamped transition-all hover:rotate-0"
                            >
                              <Coffee className="w-5 h-5 text-[#f4d3ab]" />
                              <span className="text-[8px] leading-tight font-mono text-[#e5caa3]">#{stampNumber}</span>
                            </div>
                          );
                        }

                        if (isNext) {
                          return (
                            <div 
                              key={i} 
                              title={`Próximo sello a estampar (${stampNumber})`}
                              className="w-11 h-11 rounded-full flex flex-col items-center justify-center font-mono text-xs font-bold bg-[#fbf5eb] text-[#b45309] border-2 border-dashed border-[#b45309] shadow-inner animate-pulse transition-all"
                            >
                              {isRewardSlot ? <Gift className="w-4 h-4 text-[#b45309]" /> : <Stamp className="w-4 h-4 text-[#b45309]" />}
                              <span className="text-[8px] leading-tight font-bold">#{stampNumber}</span>
                            </div>
                          );
                        }

                        // Slot no alcanzado (marca de agua sobre kraft)
                        return (
                          <div 
                            key={i} 
                            title={isRewardSlot ? `Premio: ${rewardAtSlot?.name} (${stampNumber} sellos)` : `Sello ${stampNumber}`}
                            className={`w-11 h-11 rounded-full flex flex-col items-center justify-center font-mono text-xs font-medium transition-all ${
                              isRewardSlot
                                ? 'bg-[#f4e8d3] border-2 border-dashed border-[#cbbca7] text-[#9c826b]'
                                : 'bg-[#ede3cf] border border-dashed border-[#d8c8b4] text-[#a89782]'
                            }`}
                          >
                            {isRewardSlot ? <Gift className="w-4 h-4 opacity-70" /> : <Coffee className="w-3.5 h-3.5 opacity-40" />}
                            <span className="text-[8px] leading-tight opacity-75">#{stampNumber}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Gauge de Próximo Premio */}
                  <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-outline-variant/40 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CupSoda className="text-secondary w-5 h-5" />
                        <span className="font-sans text-sm font-semibold text-on-surface">Próximo Premio: {targetStamps} sellos</span>
                      </div>
                      <span className="font-mono text-sm font-bold text-secondary">
                        {Math.min(100, Math.round((displayedStamps / targetStamps) * 100))}%
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-2 my-auto py-space-sm">
                      <div className="h-2.5 w-full bg-surface-container rounded-full overflow-hidden p-0.5">
                        <div className="h-full bg-gradient-to-r from-secondary to-amber-500 rounded-full transition-all" style={{ width: `${Math.min(100, (displayedStamps / targetStamps) * 100)}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-on-surface-variant font-mono text-[11px] pt-space-xs">
                      <span className="flex items-center gap-1 text-primary font-semibold">
                        <ArrowUpCircle className="w-3.5 h-3.5" />
                        {nextSellosReward ? `Faltan ${targetStamps - displayedStamps} sellos para el siguiente canje` : 'Nivel Máximo'}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* VISTA PUNTOS */}
              {isPuntos && (
                <>
                  <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-outline-variant/40 flex flex-col justify-between gap-space-md">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold tracking-wider text-on-surface-variant/80 uppercase">
                        Billetera de Puntos
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-4xl font-extrabold text-primary leading-none">
                        {activeCustomer.points.toLocaleString()}
                      </span>
                      <span className="font-display text-xl text-on-surface-variant font-medium">pts</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-sans text-on-surface-variant">
                      <Coins className="w-4 h-4 text-secondary" />
                      Equivale a aprox. <strong className="text-on-surface font-semibold">AR$ {(activeCustomer.points * 0.1).toLocaleString()}</strong> en canjes
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-outline-variant/40 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Gift className="text-secondary w-5 h-5" />
                        <span className="font-sans text-sm font-semibold text-on-surface truncate pr-2" title={nextPuntosReward?.name}>
                          Próximo Nivel: {targetPoints.toLocaleString()} pts
                        </span>
                      </div>
                      <span className="font-mono text-sm font-bold text-secondary">
                        {Math.min(100, Math.round((activeCustomer.points / targetPoints) * 100))}%
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-2 my-auto py-space-sm">
                      <div className="h-2.5 w-full bg-surface-container rounded-full overflow-hidden p-0.5">
                        <div className="h-full bg-gradient-to-r from-secondary to-amber-500 rounded-full transition-all" style={{ width: `${Math.min(100, (activeCustomer.points / targetPoints) * 100)}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-on-surface-variant font-mono text-[11px] pt-space-xs">
                      <span className="flex items-center gap-1 text-primary font-semibold">
                        <ArrowUpCircle className="w-3.5 h-3.5" />
                        {nextPuntosReward ? `Faltan ${Math.max(0, targetPoints - activeCustomer.points).toLocaleString()} pts` : 'Nivel Máximo Alcanzado'}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : isNewCustomer ? (
          <div className="bg-surface-container-low border border-primary/20 rounded-xl p-5 md:p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary text-on-primary flex items-center justify-center font-display text-lg font-bold shadow-xs">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-2xl font-bold text-on-surface tracking-tight">Cliente Nuevo</h2>
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-300 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      <Sparkles className="w-3 h-3 text-secondary" />
                      Primer Visita (Nivel Bronze)
                    </span>
                  </div>
                  <span className="font-mono text-xs text-on-surface-variant font-medium mt-0.5">
                    DNI identificado: <strong className="text-on-surface font-bold">{activeDni}</strong>
                  </span>
                </div>
              </div>
              <div className="self-start sm:self-auto px-3 py-1 rounded-lg bg-surface-container-lowest font-mono text-xs font-semibold text-primary flex items-center gap-1.5 shadow-xs border border-outline-variant/40">
                <Check className="w-3.5 h-3.5 text-secondary" />
                Listo para sumar beneficios
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-outline-variant/40 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-primary flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <QrCode className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-xs font-bold text-on-surface uppercase tracking-wide">
                    Guion para mostrador:
                  </span>
                  <p className="font-sans text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                    "Al cobrar, se guardarán sus beneficios con su DNI. <strong className="text-on-surface font-semibold">Indícale que escanee el QR del mostrador</strong> para crear su cuenta y ver su tarjeta digital."
                  </p>
                </div>
              </div>
              <div className="shrink-0 font-mono text-[11px] px-2.5 py-1 rounded-md bg-secondary-container text-on-secondary-container font-semibold">
                {isPuntos ? 'Gana puntos hoy' : 'Inicia tarjeta con 1 sello'}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-low/50 border border-outline-variant/50 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-1">
              <Search className="w-6 h-6 text-outline" />
            </div>
            <p className="font-sans text-on-surface-variant text-sm max-w-sm">Ingresa el DNI del cliente en el campo superior o utiliza el atajo <kbd className="px-1.5 py-0.5 rounded bg-surface-container font-mono text-xs text-on-surface font-bold">/</kbd> para comenzar.</p>
          </div>
        )}

        {(activeCustomer || isNewCustomer) && (
          <div className="flex flex-col gap-space-md">
            {/* 3. Input Monto del Ticket (Con soporte total de $0 para servicios/visitas gratis) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="font-sans text-sm font-semibold text-on-surface flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-primary" />
                  Monto del Ticket de Compra (AR$)
                </label>
                <span className="font-mono text-[11px] text-on-surface-variant">
                  Atajo: <kbd className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-mono text-[10px] font-bold border border-outline-variant/40">F2</kbd>
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-on-surface-variant font-bold text-lg">$</span>
                <input 
                  ref={ticketInputRef}
                  type="number"
                  min="0"
                  value={ticketAmount}
                  onChange={(e) => setTicketAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Ej. 15000 (o 0 para visita gratis)"
                  className="w-full bg-surface-container-low/60 border border-outline-variant/60 rounded-xl py-3.5 pl-9 pr-4 font-display text-lg font-bold text-on-surface outline-none focus:border-primary focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/10 transition-all"
                />
                {typeof ticketAmount === 'number' && ticketAmount >= 0 && (
                  isPuntos ? (
                    <div className={`absolute right-4 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-mono text-[11px] font-bold ${
                      config.tierConfig.doublePointsEnabled && Number(ticketAmount) >= config.tierConfig.doublePointsMinSpend
                        ? 'bg-[#064e3b] text-white shadow-xs'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      {config.tierConfig.doublePointsEnabled && Number(ticketAmount) >= config.tierConfig.doublePointsMinSpend ? (
                        <>
                          <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                          <span>
                            +{((config.spendAmount || config.pointsPerArs || 100) > 0)
                              ? Math.floor((Number(ticketAmount) / (config.spendAmount || config.pointsPerArs || 100)) * (config.pointsAwarded ?? 1) * 2)
                              : 0} pts ⚡ (2x Puntos)
                          </span>
                        </>
                      ) : (
                        <>
                          <ArrowUpCircle className="w-3.5 h-3.5 text-emerald-700" />
                          <span>
                            +{((config.spendAmount || config.pointsPerArs || 100) > 0)
                              ? Math.floor((Number(ticketAmount) / (config.spendAmount || config.pointsPerArs || 100)) * (config.pointsAwarded ?? 1))
                              : 0} pts
                          </span>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className={`absolute right-4 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-mono text-[11px] font-bold ${
                      config.tierConfig.doubleStampEnabled && Number(ticketAmount) >= config.tierConfig.doubleStampMinSpend
                        ? 'bg-[#b45309] text-white shadow-xs'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {config.tierConfig.doubleStampEnabled && Number(ticketAmount) >= config.tierConfig.doubleStampMinSpend ? (
                        <>
                          <Zap className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
                          <span>+2 sellos ⚡ (Doble Sello)</span>
                        </>
                      ) : (
                        <>
                          <ArrowUpCircle className="w-3.5 h-3.5 text-amber-700" />
                          <span>+1 sello</span>
                        </>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* PREMIOS DISPONIBLES SEGÚN TIER */}
            {isRewardReady && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 md:p-5 flex flex-col gap-space-md shadow-xs animate-in fade-in slide-in-from-bottom-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary text-on-secondary flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Gift className="w-5 h-5 text-on-secondary" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-lg font-bold text-on-surface leading-snug">¡Premios Disponibles para Canjear!</span>
                    </div>
                    <p className="font-sans text-sm text-on-surface-variant mt-0.5">
                      Habilitados para su <strong>Nivel {activeCustomer?.tier}</strong> con saldo suficiente.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                  {availableRewards.map((reward) => {
                    const isFromPreviousTier = isSellos && TIER_RANKS[reward.minTier || 'BRONZE'] < TIER_RANKS[activeCustomer?.tier || 'BRONZE'];
                    return (
                      <button 
                        key={reward.id} 
                        type="button" 
                        onClick={() => handleRedeemClick(reward)} 
                        className={`w-full bg-surface-container-lowest hover:bg-amber-100/60 hover:border-amber-400 border text-on-surface font-sans text-sm font-semibold px-4 py-3.5 rounded-xl shadow-xs flex items-center justify-between transition-colors active:scale-[0.99] group cursor-pointer ${
                          isFromPreviousTier ? 'border-amber-400 bg-amber-50' : 'border-outline-variant/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Gift className={`w-4.5 h-4.5 shrink-0 ${isFromPreviousTier ? 'text-amber-700' : 'text-secondary'}`} />
                          <div className="flex flex-col text-left truncate">
                            <span className="truncate font-bold text-on-surface">{reward.name}</span>
                            {isFromPreviousTier && (
                              <span className="font-mono text-[10px] text-amber-800 font-bold">
                                Guardado de Tarjeta {TIER_LABELS[reward.minTier || 'BRONZE']}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 pl-2">
                          <span className="font-mono text-secondary font-bold text-xs">
                            {isPuntos 
                              ? `-${reward.costPoints.toLocaleString()} pts` 
                              : isFromPreviousTier
                              ? '¡Listo!'
                              : `Meta ${reward.costStamps} sellos`}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {isSellos && (activeCustomer?.claimedRewards || []).length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200/60 text-xs">
                    <span className="font-sans text-xs font-semibold text-on-surface-variant flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                      Ya canjeados en esta tarjeta:
                    </span>
                    {(activeCustomer?.claimedRewards || []).map((id) => {
                      const r = config.rewards.find((reward) => reward.id === id);
                      if (!r) return null;
                      return (
                        <span key={id} className="font-mono text-[11px] px-2 py-0.5 rounded bg-surface-container text-secondary font-bold border border-secondary/20">
                          {r.name} ✓
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* PREMIOS BLOQUEADOS POR NIVEL SUPERIOR (Incentivo de Retención) */}
            {lockedTierRewards.length > 0 && (
              <div className="bg-surface-container-low/60 border border-outline-variant/40 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-on-surface font-sans text-xs font-semibold">
                    <Lock className="w-4 h-4 text-outline" />
                    <span>Recompensas Exclusivas de Niveles Superiores</span>
                  </div>
                  <span className="font-mono text-[10px] text-outline font-medium">Desbloquea ascendiendo de nivel</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {lockedTierRewards.map((reward) => (
                    <div 
                      key={reward.id} 
                      className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant opacity-85"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Lock className="w-3.5 h-3.5 text-outline shrink-0" />
                        <span className="truncate">{reward.name}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-300 shrink-0">
                        {reward.minTier === 'GOLD' ? 'Exclusivo Oro' : 'Nivel Plata'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. BOTÓN DE CHECKOUT / COBRAR - Deep Forest Green / Espresso con Shortcut Enter ↵ */}
        <div className="flex flex-col sm:flex-row items-center gap-space-sm pt-space-xs mt-auto">
          <button 
            type="button" 
            onClick={handleProcess}
            disabled={(!activeCustomer && !isNewCustomer) || typeof ticketAmount !== 'number' || ticketAmount < 0}
            className={`w-full font-display text-lg font-bold py-4 px-6 rounded-xl shadow-md flex items-center justify-center gap-3 transition-all active:scale-[0.99] ${
              (activeCustomer || isNewCustomer) && typeof ticketAmount === 'number' && ticketAmount >= 0 
                ? 'bg-[#064e3b] hover:bg-[#065f46] text-white shadow-emerald-950/20 cursor-pointer ring-1 ring-emerald-500/30' 
                : 'bg-surface-container-high text-on-surface-variant/40 cursor-not-allowed shadow-none'
            }`}
          >
            <Banknote className="w-5 h-5" />
            <span>
              {isNewCustomer 
                ? (isPuntos ? 'Acreditar Puntos y Registrar' : 'Asignar Sello(s) y Registrar') 
                : (isPuntos ? 'Cargar Puntos / Cobrar' : 'Registrar Visita / Cobrar')}
              {isPuntos && typeof ticketAmount === 'number' && ticketAmount > 0 && config.tierConfig.doublePointsEnabled && Number(ticketAmount) >= config.tierConfig.doublePointsMinSpend && (
                <span className="font-sans text-sm font-medium ml-1.5 opacity-90">(Doble Puntos ⚡)</span>
              )}
              {isSellos && typeof ticketAmount === 'number' && ticketAmount >= 0 && (
                <span className="font-sans text-sm font-medium ml-1.5 opacity-90">
                  {config.tierConfig.doubleStampEnabled && Number(ticketAmount) >= config.tierConfig.doubleStampMinSpend ? '(+2 sellos ⚡)' : '(+1 sello)'}
                </span>
              )}
            </span>
            <kbd className="font-mono text-xs px-2.5 py-1 rounded bg-black/25 text-white font-bold shadow-inner opacity-90 ml-auto border border-white/10">
              Enter ↵
            </kbd>
          </button>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN DE CANJE */}
      {isRedeemModalOpen && selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-outline-variant/60">
            <div className="p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-secondary flex items-center justify-center mx-auto mb-1 shadow-xs border border-amber-300">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl font-bold text-on-surface text-center">Confirmar Canje</h3>
              <p className="font-sans text-on-surface-variant text-center leading-relaxed">
                ¿Estás seguro que deseas canjear el premio <strong className="text-on-surface">{selectedReward.name}</strong> para <strong className="text-on-surface">{activeCustomer?.name}</strong>?
                {isPuntos 
                  ? ` Se descontarán ${selectedReward.costPoints.toLocaleString()} pts de su billetera.` 
                  : ` Este premio quedará registrado como canjeado en la tarjeta y NO descontará los sellos acumulados.`}
              </p>
            </div>
            <div className="bg-surface-container-low p-4 flex gap-3 justify-end border-t border-outline-variant/40">
              <button 
                type="button"
                onClick={() => {
                  setIsRedeemModalOpen(false);
                  setSelectedReward(null);
                }}
                className="px-5 py-2.5 rounded-xl font-sans font-semibold text-on-surface-variant hover:bg-surface-container transition-colors flex items-center cursor-pointer"
              >
                Cancelar <kbd className="font-mono text-[10px] ml-2 px-1.5 py-0.5 bg-surface-container-highest rounded">Esc</kbd>
              </button>
              <button 
                type="button"
                onClick={handleConfirmRedeem}
                className="px-5 py-2.5 rounded-xl font-sans font-semibold bg-[#b45309] hover:bg-[#92400e] text-white transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
              >
                Confirmar <kbd className="font-mono text-[10px] ml-1 px-1.5 py-0.5 bg-black/25 rounded">Enter ↵</kbd>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA INGRESAR O ESCANEAR CÓDIGO QR / OTP */}
      {isTokenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-outline-variant/60">
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-secondary flex items-center justify-center border border-amber-200">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-on-surface">Validar Canje de App</h3>
                    <p className="font-sans text-xs text-on-surface-variant">Código temporal de 15 minutos</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTokenModalOpen(false)}
                  className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {activeCustomerPendingToken && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <Gift className="w-5 h-5 text-secondary shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-900">Canje detectado de la App</span>
                      <p className="text-xs font-bold text-on-surface">
                        {activeCustomerPendingToken.reward_name}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApproveToken(activeCustomerPendingToken)}
                    disabled={isValidatingToken}
                    className="px-3.5 py-1.5 rounded-lg bg-[#b45309] hover:bg-[#92400e] text-white font-sans text-xs font-bold shrink-0 cursor-pointer shadow-xs"
                  >
                    Aprobar ({activeCustomerPendingToken.token_code})
                  </button>
                </div>
              )}

              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                Ingresa el código numérico de 6 dígitos que el cliente tiene en su pantalla o escanea el QR generado con un lector:
              </p>

              <form onSubmit={handleValidateTokenSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  autoFocus
                  placeholder="Ej: 849201"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="w-full text-center font-mono text-3xl font-extrabold tracking-widest bg-surface-container-low/70 border border-outline-variant/60 rounded-xl py-3 px-4 text-on-surface outline-none focus:border-primary focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/10"
                />

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsTokenModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-on-surface-variant font-sans text-xs font-semibold hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!tokenInput.trim() || isValidatingToken}
                    className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-sans text-xs font-bold hover:bg-primary-container transition-colors disabled:opacity-50 flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{isValidatingToken ? 'Validando...' : 'Validar y Aplicar'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
