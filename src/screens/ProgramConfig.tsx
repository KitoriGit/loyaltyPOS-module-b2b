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
import { useLoyaltyStore, type Reward } from '../store/useLoyaltyStore';

import { useState } from 'react';

export function ProgramConfig() {
  const { config, setConfig } = useLoyaltyStore();
  const isPuntos = config.type === 'puntos';
  const isSellos = config.type === 'sellos';

  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [rewardForm, setRewardForm] = useState({ name: '', cost: '' });

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

        <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col gap-space-md">
          <div className="flex flex-wrap items-center gap-y-3 gap-x-2.5 font-sans text-base text-on-surface leading-loose">
            <span>Por cada</span>
            <div className="relative inline-flex items-center">
              <span className="absolute left-3 font-mono text-[11px] text-on-surface-variant">AR$</span>
              <input 
                className="w-36 pl-11 pr-3 py-2 rounded-lg font-display text-lg bg-surface-container-lowest shadow-sm text-center outline-none focus:bg-surface-bright transition text-on-surface" 
                type="number" 
                value={config.pointsPerArs === 0 ? '' : config.pointsPerArs} 
                onChange={(e) => setConfig({ pointsPerArs: e.target.value === '' ? 0 : Number(e.target.value) })}
                disabled={!isPuntos} 
              />
            </div>
            <span>gastados en el local, el sistema otorga 1 punto.</span>
          </div>

          <div className="flex items-center gap-space-sm p-space-sm px-space-md rounded-xl bg-surface-container-high/60 text-on-surface-variant">
            <Lightbulb className="w-5 h-5 shrink-0 text-outline" />
            <p className="font-sans text-xs">
              <span className="font-semibold text-on-surface">Ejemplo en POS:</span> Un ticket promedio de <span className="font-mono text-[11px] font-semibold text-on-surface">AR$ 15,000</span> acreditará automáticamente <span className="font-mono text-[11px] font-bold text-secondary">+{Math.floor(15000 / (config.pointsPerArs || 1))} pts</span> a la billetera del cliente.
            </p>
          </div>
        </div>
      </section>

      {/* CARD 3: Bono de Bienvenida */}
      <section className={`bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md transition-opacity ${!isPuntos ? 'opacity-50 pointer-events-none' : ''}`}>
        {!isPuntos && (
          <div className="flex items-center gap-space-sm px-space-md py-2.5 rounded-xl bg-surface-container-high/60 border border-outline-variant/40 text-on-surface-variant font-sans text-xs">
            <Lock className="w-4.5 h-4.5 text-outline" />
            <span>Esta configuración se habilita con la opción <strong>"Programa de Puntos"</strong></span>
          </div>
        )}
        
        <div className="flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-xs">
            <Gift className="w-5 h-5 text-outline" />
            <div>
              <h2 className="font-display text-lg font-bold text-on-surface">Bono de Bienvenida</h2>
              <p className="font-sans text-xs text-on-surface-variant mt-0.5">Incentiva el primer registro regalando puntos iniciales.</p>
            </div>
          </div>
          <button aria-pressed="false" className={`w-12 h-7 rounded-full p-1 flex items-center justify-start focus:outline-none transition-colors ${isPuntos ? 'bg-primary justify-end' : 'bg-surface-container-high justify-start'}`} disabled={!isPuntos} type="button">
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
                className="w-28 px-3 py-1.5 rounded-lg font-display text-lg text-on-surface bg-surface-container-lowest text-center shadow-sm outline-none" 
                type="number" 
                defaultValue="500" 
                disabled={!isPuntos} 
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
            Recompensas configuradas por {isPuntos ? 'puntos' : 'sellos'} para terminal POS
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {config.rewards.map(reward => (
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
              <div className="flex items-center gap-2 self-end sm:self-auto opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => {
                    setEditingReward(reward);
                    setRewardForm({ name: reward.name, cost: isPuntos ? reward.costPoints.toString() : reward.costStamps.toString() });
                    setIsRewardModalOpen(true);
                  }}
                  className="p-1.5 text-outline hover:text-primary hover:bg-primary-container/50 rounded-lg transition-colors"
                  title="Editar recompensa"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setConfig({ rewards: config.rewards.filter(r => r.id !== reward.id) })}
                  className="p-1.5 text-outline hover:text-error hover:bg-error-container/50 rounded-lg transition-colors"
                  title="Eliminar recompensa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button 
          type="button" 
          onClick={() => {
            setEditingReward(null);
            setRewardForm({ name: '', cost: '' });
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

      {/* MODAL DE RECOMPENSA */}
      {isRewardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
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
                    const newRewards = config.rewards.map(r => r.id === editingReward.id ? { 
                      ...r, 
                      name: rewardForm.name, 
                      ...(isPuntos ? { costPoints: costNum } : { costStamps: costNum }) 
                    } : r);
                    setConfig({ rewards: newRewards });
                  } else {
                    const newReward = {
                      id: Math.random().toString(36).substring(7),
                      name: rewardForm.name,
                      costPoints: isPuntos ? costNum : 1000,
                      costStamps: isSellos ? costNum : 5
                    };
                    setConfig({ rewards: [...config.rewards, newReward] });
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
