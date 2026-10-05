import { useState, useEffect, useRef } from 'react';
import { 
  Touchpad, Store, CheckCircle2, IdCard, Search, X, Star, Clock, Check, 
  Gift, CupSoda, ArrowUpCircle, Banknote, Coins
} from 'lucide-react';
import { useLoyaltyStore, type Reward } from '../store/useLoyaltyStore';

export function TerminalPOS() {
  const { config, customers, processPurchase, redeemPoints, redeemStamps } = useLoyaltyStore();
  const isPuntos = config.type === 'puntos';
  const isSellos = config.type === 'sellos';
  
  const [dniInput, setDniInput] = useState('');
  const [activeDni, setActiveDni] = useState('34567890'); // Cargamos un cliente por defecto para demo
  const [ticketAmount, setTicketAmount] = useState<number | ''>('');
  
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  
  const dniInputRef = useRef<HTMLInputElement>(null);

  const activeCustomer = customers.find(c => c.dni === activeDni);
  
  // Lógica de progreso dinámica según el catálogo
  const nextPuntosReward = config.rewards.slice().sort((a, b) => a.costPoints - b.costPoints).find(r => r.costPoints > (activeCustomer?.points || 0));
  const nextSellosReward = config.rewards.slice().sort((a, b) => a.costStamps - b.costStamps).find(r => r.costStamps > (activeCustomer?.stamps || 0));

  const targetPoints = nextPuntosReward ? nextPuntosReward.costPoints : (config.rewards.length > 0 ? Math.max(...config.rewards.map(r => r.costPoints)) : 5000);
  const targetStamps = nextSellosReward ? nextSellosReward.costStamps : (config.rewards.length > 0 ? Math.max(...config.rewards.map(r => r.costStamps)) : config.stampsToReward);
  const maxStampsReward = config.rewards.length > 0 ? Math.max(...config.rewards.map(r => r.costStamps)) : config.stampsToReward;

  const displayedStamps = activeCustomer?.stamps || 0;
  
  const getDaysSinceLastVisit = (dateString?: string) => {
    if (!dateString) return '-';
    
    const lastVisit = new Date(dateString);
    lastVisit.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - lastVisit.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'hoy';
    return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  };
  
  // Recompensas disponibles para este cliente
  const availableRewards = config.rewards
    .filter(r => isPuntos ? (activeCustomer?.points || 0) >= r.costPoints : (activeCustomer?.stamps || 0) >= r.costStamps)
    .filter(r => !(activeCustomer?.claimedRewards || []).includes(r.id))
    .sort((a, b) => isPuntos ? a.costPoints - b.costPoints : a.costStamps - b.costStamps);

  const isRewardReady = availableRewards.length > 0;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (dniInput.trim()) {
      setActiveDni(dniInput.trim());
      setDniInput('');
      dniInputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setActiveDni('');
    setDniInput('');
    setTicketAmount('');
    dniInputRef.current?.focus();
  };

  const handleProcess = () => {
    if (!activeCustomer) return;
    
    if (isPuntos) {
      if (!ticketAmount || ticketAmount <= 0) return;
      processPurchase(activeCustomer.dni, Number(ticketAmount));
    } else {
      processPurchase(activeCustomer.dni, config.stampsPerTicket);
    }
    
    handleClear();
  };

  const handleRedeemClick = (reward: Reward) => {
    setSelectedReward(reward);
    setIsRedeemModalOpen(true);
  };

  const handleConfirmRedeem = () => {
    if (!activeCustomer || !selectedReward) return;
    if (isPuntos) {
      redeemPoints(activeCustomer.dni, selectedReward.costPoints);
    }
    if (isSellos) {
      redeemStamps(activeCustomer.dni, selectedReward.costStamps, selectedReward.id);
    }
    setIsRedeemModalOpen(false);
    setSelectedReward(null);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Focus Input (tecla '/')
      if (e.key === '/' && document.activeElement !== dniInputRef.current) {
        e.preventDefault();
        dniInputRef.current?.focus();
        return;
      }

      // Cerrar modal con escape
      if (e.key === 'Escape' && isRedeemModalOpen) {
        setIsRedeemModalOpen(false);
        setSelectedReward(null);
        return;
      }

      // 3. Registrar Visita (tecla 'Enter')
      if (e.key === 'Enter') {
        if (isRedeemModalOpen) {
          e.preventDefault();
          handleConfirmRedeem();
          return;
        }

        if (document.activeElement === dniInputRef.current) return;
        
        if (activeCustomer && (!isPuntos || ticketAmount)) {
          e.preventDefault();
          handleProcess();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCustomer, isRewardReady, isPuntos, ticketAmount, dniInput, config, isRedeemModalOpen, availableRewards]);

  return (
    <div className="flex flex-col w-full items-center justify-start pb-space-xl">
      <div className="w-full max-w-3xl flex items-center justify-between px-space-xs mb-space-sm">
        <div className="flex items-center gap-space-xs text-on-surface-variant">
          <Touchpad className="w-4 h-4" />
          <span className="font-mono text-xs uppercase tracking-wider font-semibold">Terminal POS Express</span>
          <span className="text-outline-variant font-mono text-xs">•</span>
          <span className="font-mono text-xs text-secondary font-medium">
            Modo {isPuntos ? 'Puntos' : 'Sellos'} Activo
          </span>
        </div>
        <div className="flex items-center gap-space-xs text-on-surface-variant">
          <Store className="w-4 h-4" />
          <span className="font-mono text-xs font-medium">Sucursal Centro (P-04)</span>
        </div>
      </div>
      
      <div className="w-full max-w-3xl bg-surface-container-lowest rounded-2xl shadow-md p-6 md:p-8 flex flex-col gap-space-md">
        
        {/* 1. DNI / Identificación del Cliente */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs font-semibold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
              <IdCard className="w-4 h-4" />
              DNI / DOCUMENTO DEL CLIENTE
            </label>
            {activeCustomer && (
              <span className="inline-flex items-center gap-1 bg-secondary-container/40 text-on-secondary-container px-3 py-0.5 rounded-full font-mono text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Cliente identificado
              </span>
            )}
          </div>
          
          <form onSubmit={handleSearch} className="rounded-xl bg-surface-container-lowest p-3.5 md:p-4 flex items-center justify-between shadow-sm shadow-primary/10 border border-outline-variant/30 focus-within:border-primary transition-colors">
            <div className="flex items-center gap-space-md min-w-0 w-full">
              <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                <IdCard className="w-6 h-6" />
              </div>
              <input 
                ref={dniInputRef}
                type="text"
                className="w-full font-display text-3xl font-bold text-on-surface tracking-wider bg-transparent outline-none placeholder:text-on-surface-variant/30"
                placeholder="Ingresar DNI..."
                value={activeDni ? activeDni : dniInput}
                onChange={(e) => {
                  if (activeDni) setActiveDni('');
                  setDniInput(e.target.value);
                }}
              />
            </div>
            <div className="flex items-center gap-space-xs flex-shrink-0">
              <button type="submit" className="group flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors">
                <Search className="w-4.5 h-4.5 text-on-surface-variant group-hover:text-primary" />
                <kbd className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface-variant shadow-sm border border-outline-variant/30 font-semibold">/</kbd>
              </button>
              <button type="button" onClick={handleClear} aria-label="Limpiar campo" className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/50 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* 2. Tarjeta / Contenedor de Información del Cliente */}
        {activeCustomer ? (
          <div className="bg-surface-container-low/70 rounded-xl p-5 flex flex-col gap-space-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-display text-lg font-bold">
                  {activeCustomer.name.charAt(0)}
                </div>
                <h2 className="font-display text-2xl font-bold text-on-surface tracking-tight">{activeCustomer.name}</h2>
                <span className="inline-flex items-center gap-1 bg-surface-container-highest text-primary font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                  <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                  VIP {activeCustomer.tier}
                </span>
              </div>
              <div className="flex flex-col sm:items-end font-mono text-xs text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Última visita: <span className="text-on-surface font-semibold ml-1">{getDaysSinceLastVisit(activeCustomer.lastVisitDate)}</span>
                </span>
                <span className="font-medium text-on-surface/80 mt-0.5">Visitas históricas: <span className="text-on-surface font-semibold">{activeCustomer.totalVisits}</span></span>
              </div>
            </div>
            
            <div className="flex flex-col gap-space-md">
              
              {/* VISTA SELLOS */}
              {isSellos && (
                <>
                  <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/20 flex flex-col justify-between gap-space-md">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold tracking-wider text-on-surface-variant/80 uppercase">
                        Tarjeta de Sellos
                      </span>
                      <span className="font-mono text-xs bg-surface-container text-on-surface-variant px-2 py-0.5 rounded font-medium">
                        Meta: {maxStampsReward}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-4xl font-bold text-on-surface leading-none">
                        {displayedStamps}
                      </span>
                      <span className="font-display text-xl text-on-surface-variant font-medium">
                        / {maxStampsReward} Sellos
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-start pt-space-xs gap-2">
                      {Array.from({ length: maxStampsReward }).map((_, i) => {
                        const stampNumber = i + 1;
                        const isEarned = stampNumber <= displayedStamps;
                        const isNext = stampNumber === displayedStamps + 1;
                        const isRewardSlot = config.rewards.some(r => r.costStamps === stampNumber);
                        
                        return (
                          <div key={i} className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-sm font-semibold transition-all ${
                            isEarned ? 'bg-secondary text-on-secondary shadow-sm' : 
                            isNext ? 'bg-surface-container-high text-on-surface shadow-inner' : 
                            'bg-surface-container text-on-surface-variant/50'
                          }`}>
                            {isRewardSlot 
                              ? <Gift className="w-4.5 h-4.5" />
                              : (isEarned ? <Check className="w-4.5 h-4.5 stroke-[3]" /> : stampNumber)
                            }
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CupSoda className="text-primary w-5 h-5" />
                        <span className="font-sans text-sm font-semibold text-on-surface">Próximo Premio: {targetStamps} sellos</span>
                      </div>
                      <span className="font-mono text-sm font-bold text-primary">
                        {Math.min(100, Math.round((displayedStamps / targetStamps) * 100))}%
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-2 my-auto py-space-sm">
                      <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden p-0.5">
                        <div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all" style={{ width: `${Math.min(100, (displayedStamps / targetStamps) * 100)}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-on-surface-variant font-mono text-[11px] pt-space-xs">
                      <span className="flex items-center gap-1 text-secondary font-medium">
                        <ArrowUpCircle className="w-3.5 h-3.5" />
                        {nextSellosReward ? `Faltan ${targetStamps - displayedStamps} sellos` : 'Nivel Máximo'}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* VISTA PUNTOS */}
              {isPuntos && (
                <>
                  <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/20 flex flex-col justify-between gap-space-md">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold tracking-wider text-on-surface-variant/80 uppercase">
                        Billetera de Puntos
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-4xl font-bold text-on-surface leading-none text-primary">
                        {activeCustomer.points.toLocaleString()}
                      </span>
                      <span className="font-display text-xl text-on-surface-variant font-medium">pts</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-sans text-on-surface-variant">
                      <Coins className="w-4 h-4 text-outline" />
                      Equivale a aprox. AR$ {(activeCustomer.points * 0.1).toLocaleString()} en canjes
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Gift className="text-primary w-5 h-5" />
                        <span className="font-sans text-sm font-semibold text-on-surface truncate pr-2" title={nextPuntosReward?.name}>
                          Próximo Nivel: {targetPoints.toLocaleString()} pts
                        </span>
                      </div>
                      <span className="font-mono text-sm font-bold text-primary">
                        {Math.min(100, Math.round((activeCustomer.points / targetPoints) * 100))}%
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-2 my-auto py-space-sm">
                      <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden p-0.5">
                        <div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all" style={{ width: `${Math.min(100, (activeCustomer.points / targetPoints) * 100)}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-on-surface-variant font-mono text-[11px] pt-space-xs">
                      <span className="flex items-center gap-1 text-secondary font-medium">
                        <ArrowUpCircle className="w-3.5 h-3.5" />
                        {nextPuntosReward ? `Faltan ${Math.max(0, targetPoints - activeCustomer.points).toLocaleString()} pts` : 'Nivel Máximo Alcanzado'}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-lowest border border-outline-variant/30 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-2">
              <Search className="w-6 h-6" />
            </div>
            <p className="font-sans text-on-surface-variant max-w-sm">Ingresa el DNI del cliente en el campo superior o utiliza el atajo de búsqueda para comenzar.</p>
          </div>
        )}

        {activeCustomer && (
          <div className="flex flex-col gap-space-md">
            {isPuntos && (
              <div className="flex flex-col gap-2">
                <label className="font-sans text-sm font-semibold text-on-surface">Monto del Ticket de Compra (AR$)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-on-surface-variant font-bold">$</span>
                  <input 
                    type="number"
                    value={ticketAmount}
                    onChange={(e) => setTicketAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Ej. 15000"
                    className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl py-3.5 pl-9 pr-4 font-display text-lg font-bold text-on-surface outline-none focus:border-primary transition-colors"
                  />
                  {typeof ticketAmount === 'number' && ticketAmount > 0 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 bg-primary-container text-on-primary-container px-2 py-0.5 rounded-md font-mono text-[11px] font-bold">
                      <ArrowUpCircle className="w-3.5 h-3.5" />
                      +{Math.floor(Number(ticketAmount) / config.pointsPerArs)} pts
                    </div>
                  )}
                </div>
              </div>
            )}

            {isRewardReady && (
              <div className="bg-secondary-container/25 border border-secondary/20 rounded-xl p-4 md:p-5 flex flex-col gap-space-md shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary text-on-secondary flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-lg font-bold text-on-surface leading-snug">¡Premios Disponibles para Canjear!</span>
                    </div>
                    <p className="font-sans text-sm text-on-surface-variant mt-0.5">
                      El cliente tiene saldo suficiente para elegir cualquiera de estas recompensas.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {availableRewards.map((reward, i) => (
                    <button 
                      key={reward.id} 
                      type="button" 
                      onClick={() => handleRedeemClick(reward)} 
                      className="w-full bg-surface-container-lowest hover:bg-secondary/10 hover:border-secondary/50 border border-secondary/20 text-on-surface font-sans text-sm font-semibold px-4 py-3.5 rounded-xl shadow-sm flex items-center justify-between transition-colors active:scale-[0.99] group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Gift className="w-4.5 h-4.5 text-secondary shrink-0" />
                        <span className="truncate">{reward.name}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 pl-2">
                        <span className="font-mono text-secondary font-bold">
                          {isPuntos 
                            ? `-${reward.costPoints.toLocaleString()} pts` 
                            : `Requiere ${reward.costStamps} sellos`}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-space-sm pt-space-xs mt-auto">
          <button 
            type="button" 
            onClick={handleProcess}
            disabled={!activeCustomer || (isPuntos && !ticketAmount)}
            className={`w-full font-display text-lg font-bold py-3.5 px-6 rounded-xl shadow-sm flex items-center justify-center gap-3 transition-colors active:scale-[0.99] ${
              activeCustomer && (!isPuntos || ticketAmount) 
                ? 'bg-primary hover:bg-primary-container text-on-primary' 
                : 'bg-surface-container-high text-on-surface-variant/50 cursor-not-allowed'
            }`}
          >
            <Banknote className="w-5 h-5" />
            <span>
              {isPuntos ? 'Cargar Puntos' : 'Registrar Visita'} 
              {isSellos && activeCustomer && <span className="font-sans text-sm font-medium ml-1.5 opacity-90">(+1 sello)</span>}
            </span>
            <kbd className="font-mono text-xs px-2.5 py-1 rounded bg-surface-container-lowest/20 text-current font-semibold shadow-inner opacity-80 ml-auto">Enter ↵</kbd>
          </button>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN DE CANJE */}
      {isRedeemModalOpen && selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto mb-2 shadow-sm">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl font-bold text-on-surface text-center">Confirmar Canje</h3>
              <p className="font-sans text-on-surface-variant text-center">
                ¿Estás seguro que deseas canjear el premio <strong>{selectedReward.name}</strong> de <strong className="text-on-surface font-semibold">{activeCustomer?.name}</strong>?
                {isPuntos 
                  ? ` Se descontarán ${selectedReward.costPoints.toLocaleString()} pts de su billetera.` 
                  : (selectedReward.costStamps >= maxStampsReward 
                      ? ` Al ser la meta final, se consumirán ${maxStampsReward} sellos y la tarjeta se reiniciará.` 
                      : ` Por ser una meta intermedia, este premio NO consumirá los sellos acumulados.`)}
              </p>
            </div>
            <div className="bg-surface-container-low p-4 flex gap-3 justify-end border-t border-outline-variant/20">
              <button 
                type="button"
                onClick={() => {
                  setIsRedeemModalOpen(false);
                  setSelectedReward(null);
                }}
                className="px-5 py-2.5 rounded-xl font-sans font-semibold text-on-surface-variant hover:bg-surface-container transition-colors flex items-center"
              >
                Cancelar <kbd className="font-mono text-[10px] ml-2 px-1.5 py-0.5 bg-surface-container-highest rounded">Esc</kbd>
              </button>
              <button 
                type="button"
                onClick={handleConfirmRedeem}
                className="px-5 py-2.5 rounded-xl font-sans font-semibold bg-secondary text-on-secondary hover:bg-on-secondary-fixed-variant transition-colors shadow-sm flex items-center gap-2"
              >
                Confirmar <kbd className="font-mono text-[10px] ml-1 px-1.5 py-0.5 bg-on-secondary/20 rounded">Enter ↵</kbd>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
