import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './useAuthStore';
import toast from 'react-hot-toast';

export type ProgramType = 'puntos' | 'sellos';
export type TierType = 'BRONZE' | 'SILVER' | 'GOLD';

export const TIER_RANKS: Record<TierType, number> = {
  BRONZE: 1,
  SILVER: 2,
  GOLD: 3,
};

export const TIER_LABELS: Record<TierType, string> = {
  BRONZE: 'Bronze',
  SILVER: 'Plata',
  GOLD: 'Oro',
};

/**
 * Valida si un cliente con cierto nivel jerárquico puede canjear una recompensa.
 * Jerarquía acumulativa: Oro accede a Oro, Plata y Bronze; Plata a Plata y Bronze; Bronze a Bronze.
 */
export function canClaimReward(customerTier: TierType = 'BRONZE', rewardMinTier: TierType = 'BRONZE'): boolean {
  return TIER_RANKS[customerTier] >= TIER_RANKS[rewardMinTier];
}

export interface TierConfig {
  inactivityDaysDowngrade: number; // Días sin visitas/compras antes de degradar nivel (ej: 45)
  // Configuración de Tiers para Programa de Puntos
  silverVisitsThreshold: number; // Visitas para alcanzar Plata en puntos (ej: 10)
  goldVisitsThreshold: number; // Visitas para alcanzar Oro en puntos (ej: 25)
  doublePointsEnabled: boolean; // Si compras superiores a un monto duplican los puntos
  doublePointsMinSpend: number; // Monto mínimo para duplicar puntos (ej: AR$ 20.000)
  // Configuración de Tiers para Programa de Sellos
  silverCardsThreshold: number; // Tarjetas completadas para alcanzar Plata en sellos (ej: 1)
  goldCardsThreshold: number; // Tarjetas completadas para alcanzar Oro en sellos (ej: 2)
  doubleStampEnabled: boolean; // Si compras superiores a un monto otorgan 2 sellos
  doubleStampMinSpend: number; // Monto mínimo para ganar 2 sellos (ej: AR$ 15.000)
}

export interface Reward {
  id: string;
  name: string;
  costPoints: number;
  costStamps: number;
  minTier?: TierType;
}

export interface ProgramConfig {
  type: ProgramType;
  spendAmount: number;
  pointsAwarded: number;
  pointsPerArs?: number;
  pointsExpirationDays: number;
  stampsToReward: number;
  welcomeBonusEnabled?: boolean;
  welcomeBonusPoints?: number;
  rewards: Reward[];
  tierConfig: TierConfig;
}

export interface Customer {
  id: string;
  dni: string;
  name: string;
  email?: string;
  phone?: string;
  userId?: string;
  points: number;
  stamps: number;
  tier: TierType;
  manualTierOverride?: boolean;
  totalVisits: number;
  completedCards: number; // Cantidad de tarjetas completadas en sellos
  totalSpent: number;
  lastVisitDate: string;
  claimedRewards?: string[];
  isRegistered?: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  customerId: string;
  branchId?: string;
  employeeId?: string;
  rewardId?: string;
  type: 'COMPRA' | 'CANJE' | 'AJUSTE';
  amount: number;
  pointsChange: number;
  stampsChange: number;
  hash: string;
  motive?: string;
}

export interface ProcessPurchaseResult {
  pointsEarned: number;
  stampsEarned: number;
  previousTier: TierType;
  newTier: TierType;
  upgradedTier: boolean;
  isDoubleStamp?: boolean;
  isDoublePoints?: boolean;
}

/**
 * Calcula el nivel efectivo de un cliente evaluando:
 * 1. Override manual del comercio
 * 2. Umbral de visitas acumuladas
 * 3. Regla de degradación por inactividad
 */
/**
 * Calcula el nivel efectivo de un cliente evaluando:
 * 1. Override manual del comercio
 * 2. Mecánica según modalidad:
 *    - Puntos: Umbral de visitas acumuladas (visitas a Plata / Oro)
 *    - Sellos: Umbral de tarjetas completadas (tarjetas a Plata / Oro)
 * 3. Regla de degradación por inactividad
 */
export function calculateCustomerTier(
  customer: Pick<Customer, 'totalVisits' | 'lastVisitDate' | 'manualTierOverride' | 'tier'> & { completedCards?: number },
  tierConfig: TierConfig,
  programType: ProgramType = 'puntos'
): {
  effectiveTier: TierType;
  baseTier: TierType;
  isDowngraded: boolean;
  isAtRisk: boolean;
  daysInactive: number;
} {
  let daysInactive = 0;
  if (customer.lastVisitDate) {
    const last = new Date(customer.lastVisitDate).getTime();
    daysInactive = Math.max(0, Math.floor((Date.now() - last) / (1000 * 60 * 60 * 24)));
  }

  if (customer.manualTierOverride) {
    return {
      effectiveTier: customer.tier,
      baseTier: customer.tier,
      isDowngraded: false,
      isAtRisk: false,
      daysInactive,
    };
  }

  let baseTier: TierType = 'BRONZE';
  if (programType === 'sellos') {
    const cards = customer.completedCards || 0;
    if (cards >= (tierConfig.goldCardsThreshold ?? 2)) {
      baseTier = 'GOLD';
    } else if (cards >= (tierConfig.silverCardsThreshold ?? 1)) {
      baseTier = 'SILVER';
    }
  } else {
    // Programa de puntos: basado en visitas acumuladas
    if (customer.totalVisits >= tierConfig.goldVisitsThreshold) {
      baseTier = 'GOLD';
    } else if (customer.totalVisits >= tierConfig.silverVisitsThreshold) {
      baseTier = 'SILVER';
    }
  }

  let effectiveTier = baseTier;
  let isDowngraded = false;

  if (daysInactive > tierConfig.inactivityDaysDowngrade) {
    if (baseTier === 'GOLD') {
      effectiveTier = daysInactive > tierConfig.inactivityDaysDowngrade * 2 ? 'BRONZE' : 'SILVER';
      isDowngraded = true;
    } else if (baseTier === 'SILVER') {
      effectiveTier = 'BRONZE';
      isDowngraded = true;
    }
  }

  const isAtRisk =
    !isDowngraded &&
    effectiveTier !== 'BRONZE' &&
    daysInactive >= Math.max(1, tierConfig.inactivityDaysDowngrade - 10);

  return {
    effectiveTier,
    baseTier,
    isDowngraded,
    isAtRisk,
    daysInactive,
  };
}

interface LoyaltyState {
  config: ProgramConfig;
  customers: Customer[];
  transactions: Transaction[];
  isLoadingData: boolean;

  // Acciones
  fetchInitialData: (workspaceId: string) => Promise<void>;
  saveConfigToDb: () => Promise<boolean>;
  setConfig: (config: Partial<ProgramConfig>) => void;
  setTierConfig: (tierConfig: Partial<TierConfig>) => void;
  addReward: (reward: Omit<Reward, 'id'>) => Promise<void>;
  updateReward: (id: string, reward: Partial<Reward>) => Promise<void>;
  deleteReward: (id: string) => Promise<void>;
  updateCustomerTier: (dni: string, tier: TierType, isManual?: boolean) => Promise<void>;
  processPurchase: (dni: string, ticketAmount: number) => ProcessPurchaseResult | null;
  redeemPoints: (dni: string, pointsToDeduct: number, rewardId?: string) => Promise<void>;
  redeemStamps: (dni: string, stampsToDeduct: number, rewardId?: string) => Promise<void>;
  addManualAdjustment: (dni: string, pointsChange: number, stampsChange?: number, motive?: string) => Promise<void>;
}

const DEFAULT_TIER_CONFIG: TierConfig = {
  silverVisitsThreshold: 10,
  goldVisitsThreshold: 25,
  doublePointsEnabled: true,
  doublePointsMinSpend: 20000,
  silverCardsThreshold: 1,
  goldCardsThreshold: 2,
  doubleStampEnabled: true,
  doubleStampMinSpend: 15000,
  inactivityDaysDowngrade: 45,
};

export const useLoyaltyStore = create<LoyaltyState>((set, get) => ({
  config: {
    type: 'puntos',
    spendAmount: 100,
    pointsAwarded: 20,
    pointsPerArs: 100,
    pointsExpirationDays: 365,
    stampsToReward: 10,
    rewards: [],
    tierConfig: DEFAULT_TIER_CONFIG,
  },
  customers: [],
  transactions: [],
  isLoadingData: false,

  fetchInitialData: async (workspaceId: string) => {
    if (!workspaceId) return;
    set({ isLoadingData: true });

    try {
      // 1. Cargar Configuración del Programa
      const { data: dbConfig } = await supabase
        .from('loyalty_configs')
        .select('*')
        .eq('workspace_id', workspaceId)
        .maybeSingle();

      let activeConfig = get().config;

      if (dbConfig) {
        activeConfig = {
          type: (dbConfig.program_type as ProgramType) || 'puntos',
          spendAmount: Number(dbConfig.spend_amount) || 100,
          pointsAwarded: Number(dbConfig.points_awarded) || 20,
          pointsPerArs: Number(dbConfig.spend_amount) || 100,
          pointsExpirationDays: Number(dbConfig.points_expiration_days) || 365,
          stampsToReward: Number(dbConfig.stamps_to_reward) || 10,
          rewards: [],
          tierConfig: {
            silverVisitsThreshold: Number(dbConfig.silver_visits_threshold) || 10,
            goldVisitsThreshold: Number(dbConfig.gold_visits_threshold) || 25,
            doublePointsEnabled: dbConfig.double_points_enabled ?? true,
            doublePointsMinSpend: Number(dbConfig.double_points_min_spend) || 20000,
            silverCardsThreshold: Number(dbConfig.silver_cards_threshold) ?? 1,
            goldCardsThreshold: Number(dbConfig.gold_cards_threshold) ?? 2,
            doubleStampEnabled: dbConfig.double_stamp_enabled ?? true,
            doubleStampMinSpend: Number(dbConfig.double_stamp_min_spend) || 15000,
            inactivityDaysDowngrade: Number(dbConfig.inactivity_days_downgrade) || 45,
          },
        };
      } else {
        // Inicializar configuración inicial por defecto en la BD
        const { data: createdConfig } = await supabase
          .from('loyalty_configs')
          .insert({
            workspace_id: workspaceId,
            program_type: 'puntos',
            spend_amount: 100,
            points_awarded: 20,
            points_expiration_days: 365,
            stamps_to_reward: 10,
            welcome_bonus_enabled: true,
            welcome_bonus_points: 500,
            silver_visits_threshold: 10,
            gold_visits_threshold: 25,
            double_points_enabled: true,
            double_points_min_spend: 20000,
            silver_cards_threshold: 1,
            gold_cards_threshold: 2,
            double_stamp_enabled: true,
            double_stamp_min_spend: 15000,
            inactivity_days_downgrade: 45,
          })
          .select()
          .maybeSingle();

        if (createdConfig) {
          activeConfig = {
            ...activeConfig,
            spendAmount: Number(createdConfig.spend_amount),
            pointsAwarded: Number(createdConfig.points_awarded),
          };
        }
      }


      // 2. Cargar Recompensas (vacías por defecto si el negocio es nuevo)
      const { data: dbRewards } = await supabase
        .from('loyalty_rewards')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('is_active', true)
        .order('cost_points', { ascending: true });

      const rewardsList: Reward[] = (dbRewards || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        costPoints: Number(r.cost_points) || 0,
        costStamps: Number(r.cost_stamps) || 0,
        minTier: (r.min_tier as TierType) || 'BRONZE',
      }));

      activeConfig.rewards = rewardsList;

      // 3. Cargar Clientes
      const { data: dbCustomers } = await supabase
        .from('loyalty_customers')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false });

      const customersList: Customer[] = (dbCustomers || []).map((c: any) => ({
        id: c.id,
        dni: c.dni,
        name: c.name,
        points: Number(c.points) || 0,
        stamps: Number(c.stamps) || 0,
        tier: (c.tier as TierType) || 'BRONZE',
        manualTierOverride: c.manual_tier_override || false,
        totalVisits: Number(c.total_visits) || 0,
        completedCards: Number(c.completed_cards) || 0,
        totalSpent: Number(c.total_spent) || 0,
        lastVisitDate: c.last_visit_date || '',
        claimedRewards: Array.isArray(c.claimed_rewards) ? c.claimed_rewards : [],
        isRegistered: c.is_registered ?? false,
      }));

      // 4. Cargar Transacciones
      const { data: dbTransactions } = await supabase
        .from('loyalty_transactions')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })
        .limit(100);

      const transactionsList: Transaction[] = (dbTransactions || []).map((t: any) => ({
        id: t.id,
        date: t.created_at,
        customerId: t.customer_id,
        type: t.type,
        amount: Number(t.amount) || 0,
        pointsChange: Number(t.points_change) || 0,
        stampsChange: Number(t.stamps_change) || 0,
        hash: t.hash || '#00000',
        motive: t.motive || undefined,
      }));

      set({
        config: activeConfig,
        customers: customersList,
        transactions: transactionsList,
        isLoadingData: false,
      });
    } catch (err) {
      console.error('Error cargando datos de fidelidad desde Supabase:', err);
      set({ isLoadingData: false });
    }
  },

  saveConfigToDb: async () => {
    const wsId = useAuthStore.getState().workspaceId;
    if (!wsId) return false;

    const { config } = get();
    try {
      const { error } = await supabase
        .from('loyalty_configs')
        .upsert(
          {
            workspace_id: wsId,
            program_type: config.type,
            spend_amount: config.spendAmount,
            points_awarded: config.pointsAwarded,
            points_expiration_days: config.pointsExpirationDays,
            stamps_to_reward: config.stampsToReward,
            silver_visits_threshold: config.tierConfig.silverVisitsThreshold,
            gold_visits_threshold: config.tierConfig.goldVisitsThreshold,
            double_points_enabled: config.tierConfig.doublePointsEnabled,
            double_points_min_spend: config.tierConfig.doublePointsMinSpend,
            silver_cards_threshold: config.tierConfig.silverCardsThreshold,
            gold_cards_threshold: config.tierConfig.goldCardsThreshold,
            double_stamp_enabled: config.tierConfig.doubleStampEnabled,
            double_stamp_min_spend: config.tierConfig.doubleStampMinSpend,
            inactivity_days_downgrade: config.tierConfig.inactivityDaysDowngrade,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'workspace_id' }
        );

      if (error) throw error;
      toast.success('Configuración guardada en la base de datos');
      return true;
    } catch (err: any) {
      console.error('Error guardando configuración:', err);
      toast.error('Error al guardar configuración: ' + (err.message || ''));
      return false;
    }
  },

  setConfig: (newConfig) => {
    set((state) => ({
      config: { ...state.config, ...newConfig },
    }));
  },

  setTierConfig: (newTierConfig) => {
    set((state) => {
      const updatedTierConfig = { ...state.config.tierConfig, ...newTierConfig };
      const updatedCustomers = state.customers.map((c) => {
        if (c.manualTierOverride) return c;
        const { effectiveTier } = calculateCustomerTier(c, updatedTierConfig, state.config.type);
        return { ...c, tier: effectiveTier };
      });

      return {
        config: {
          ...state.config,
          tierConfig: updatedTierConfig,
        },
        customers: updatedCustomers,
      };
    });
  },

  addReward: async (rewardData) => {
    const wsId = useAuthStore.getState().workspaceId;
    const tempId = crypto.randomUUID();

    // Actualización optimista
    set((state) => ({
      config: {
        ...state.config,
        rewards: [
          ...state.config.rewards,
          {
            ...rewardData,
            id: tempId,
            minTier: rewardData.minTier || 'BRONZE',
          },
        ],
      },
    }));

    if (wsId) {
      try {
        const { data, error } = await supabase
          .from('loyalty_rewards')
          .insert({
            workspace_id: wsId,
            name: rewardData.name,
            cost_points: rewardData.costPoints,
            cost_stamps: rewardData.costStamps,
            min_tier: rewardData.minTier || 'BRONZE',
            is_active: true,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          // Reemplazar tempId por ID real
          set((state) => ({
            config: {
              ...state.config,
              rewards: state.config.rewards.map((r) => (r.id === tempId ? { ...r, id: data.id } : r)),
            },
          }));
        }
      } catch (err) {
        console.error('Error agregando recompensa en DB:', err);
      }
    }
  },

  updateReward: async (id, rewardData) => {
    set((state) => ({
      config: {
        ...state.config,
        rewards: state.config.rewards.map((r) => (r.id === id ? { ...r, ...rewardData } : r)),
      },
    }));

    try {
      const updatePayload: Record<string, any> = {};
      if (rewardData.name !== undefined) updatePayload.name = rewardData.name;
      if (rewardData.costPoints !== undefined) updatePayload.cost_points = rewardData.costPoints;
      if (rewardData.costStamps !== undefined) updatePayload.cost_stamps = rewardData.costStamps;
      if (rewardData.minTier !== undefined) updatePayload.min_tier = rewardData.minTier;

      await supabase.from('loyalty_rewards').update(updatePayload).eq('id', id);
    } catch (err) {
      console.error('Error actualizando recompensa en DB:', err);
    }
  },

  deleteReward: async (id) => {
    set((state) => ({
      config: {
        ...state.config,
        rewards: state.config.rewards.filter((r) => r.id !== id),
      },
    }));

    try {
      await supabase.from('loyalty_rewards').update({ is_active: false }).eq('id', id);
    } catch (err) {
      console.error('Error eliminando recompensa en DB:', err);
    }
  },

  updateCustomerTier: async (dni, newTier, isManual = true) => {
    const wsId = useAuthStore.getState().workspaceId;

    set((state) => ({
      customers: state.customers.map((c) =>
        c.dni === dni ? { ...c, tier: newTier, manualTierOverride: isManual } : c
      ),
    }));

    if (wsId) {
      try {
        await supabase
          .from('loyalty_customers')
          .update({
            tier: newTier,
            manual_tier_override: isManual,
          })
          .eq('workspace_id', wsId)
          .eq('dni', dni);
      } catch (err) {
        console.error('Error actualizando tier en DB:', err);
      }
    }
  },

  processPurchase: (dni, ticketAmount) => {
    const state = get();
    const wsId = useAuthStore.getState().workspaceId;
    const employeeId = useAuthStore.getState().employeeId;
    const branch = useAuthStore.getState().currentBranch;

    const customerIndex = state.customers.findIndex((c) => c.dni === dni);
    const existingCustomer = customerIndex !== -1 ? state.customers[customerIndex] : null;
    const currentTier = existingCustomer ? existingCustomer.tier : 'BRONZE';

    const spendBase = state.config.spendAmount || state.config.pointsPerArs || 100;
    const ptsAwarded = state.config.pointsAwarded ?? 1;
    const rawPoints =
      state.config.type === 'puntos' && spendBase > 0
        ? Math.floor((ticketAmount / spendBase) * ptsAwarded)
        : 0;

    // Acelerador de puntos: 2x puntos si el ticket supera el monto mínimo configurado
    const isDoublePoints =
      state.config.type === 'puntos' &&
      state.config.tierConfig.doublePointsEnabled &&
      ticketAmount >= state.config.tierConfig.doublePointsMinSpend;
    const pointsMultiplier = isDoublePoints ? 2 : 1;
    const pointsEarned = rawPoints * pointsMultiplier;

    // Acelerador de sellos: 2 sellos si el ticket supera el monto mínimo configurado
    const isDoubleStamp =
      state.config.type === 'sellos' &&
      state.config.tierConfig.doubleStampEnabled &&
      ticketAmount >= state.config.tierConfig.doubleStampMinSpend;
    const stampsEarned = state.config.type === 'sellos' ? (isDoubleStamp ? 2 : 1) : 0;

    const txHash = '#' + Math.random().toString(36).substring(2, 7);
    const newTxId = crypto.randomUUID();
    const txDate = new Date().toISOString();

    let result: ProcessPurchaseResult = {
      pointsEarned,
      stampsEarned,
      previousTier: currentTier,
      newTier: currentTier,
      upgradedTier: false,
      isDoubleStamp,
      isDoublePoints,
    };

    if (!existingCustomer) {
      const newCustomerId = crypto.randomUUID();
      const initialTier: TierType = 'BRONZE';

      const newCustomer: Customer = {
        id: newCustomerId,
        dni,
        name: `Cliente #${dni}`,
        points: pointsEarned,
        stamps: stampsEarned,
        tier: initialTier,
        totalVisits: 1,
        completedCards: 0,
        totalSpent: ticketAmount,
        lastVisitDate: txDate,
        isRegistered: false,
      };

      const newTransaction: Transaction = {
        id: newTxId,
        date: txDate,
        customerId: newCustomerId,
        type: 'COMPRA',
        amount: ticketAmount,
        pointsChange: pointsEarned,
        stampsChange: stampsEarned,
        hash: txHash,
      };

      result.newTier = initialTier;

      set({
        customers: [newCustomer, ...state.customers],
        transactions: [newTransaction, ...state.transactions],
      });

      // Persistir asíncronamente en Supabase
      if (wsId) {
        (async () => {
          try {
            const { data: insertedCust, error: custErr } = await supabase
              .from('loyalty_customers')
              .insert({
                workspace_id: wsId,
                dni,
                name: `Cliente #${dni}`,
                points: pointsEarned,
                stamps: stampsEarned,
                tier: initialTier,
                total_visits: 1,
                completed_cards: 0,
                total_spent: ticketAmount,
                last_visit_date: txDate,
                is_registered: false,
              })
              .select()
              .single();

            if (custErr) throw custErr;

            const finalCustId = insertedCust ? insertedCust.id : newCustomerId;
            await supabase.from('loyalty_transactions').insert({
              workspace_id: wsId,
              customer_id: finalCustId,
              branch_id: branch?.id || null,
              employee_id: employeeId || null,
              type: 'COMPRA',
              amount: ticketAmount,
              points_change: pointsEarned,
              stamps_change: stampsEarned,
              hash: txHash,
            });
          } catch (err) {
            console.error('Error sincronizando nueva compra en Supabase:', err);
          }
        })();
      }

      return result;
    }

    // Cliente existente
    const updatedVisits = existingCustomer.totalVisits + 1;
    const updatedSpent = existingCustomer.totalSpent + ticketAmount;
    const updatedVisitDate = txDate;

    const { effectiveTier } = calculateCustomerTier(
      {
        totalVisits: updatedVisits,
        completedCards: existingCustomer.completedCards,
        lastVisitDate: updatedVisitDate,
        manualTierOverride: existingCustomer.manualTierOverride,
        tier: existingCustomer.tier,
      },
      state.config.tierConfig,
      state.config.type
    );

    const upgradedTier = TIER_RANKS[effectiveTier] > TIER_RANKS[currentTier];

    result = {
      pointsEarned,
      stampsEarned,
      previousTier: currentTier,
      newTier: effectiveTier,
      upgradedTier,
      isDoubleStamp,
      isDoublePoints,
    };

    const newTransaction: Transaction = {
      id: newTxId,
      date: txDate,
      customerId: existingCustomer.id,
      type: 'COMPRA',
      amount: ticketAmount,
      pointsChange: pointsEarned,
      stampsChange: stampsEarned,
      hash: txHash,
    };

    const updatedCustomer: Customer = {
      ...existingCustomer,
      points: existingCustomer.points + pointsEarned,
      stamps: existingCustomer.stamps + stampsEarned,
      totalVisits: updatedVisits,
      totalSpent: updatedSpent,
      lastVisitDate: updatedVisitDate,
      tier: effectiveTier,
    };

    set({
      customers: state.customers.map((c) => (c.dni === dni ? updatedCustomer : c)),
      transactions: [newTransaction, ...state.transactions],
    });

    // Persistir asíncronamente en Supabase
    if (wsId) {
      (async () => {
        try {
          await supabase
            .from('loyalty_customers')
            .update({
              points: updatedCustomer.points,
              stamps: updatedCustomer.stamps,
              total_visits: updatedVisits,
              total_spent: updatedSpent,
              last_visit_date: updatedVisitDate,
              tier: effectiveTier,
            })
            .eq('id', existingCustomer.id);

          await supabase.from('loyalty_transactions').insert({
            workspace_id: wsId,
            customer_id: existingCustomer.id,
            branch_id: branch?.id || null,
            employee_id: employeeId || null,
            type: 'COMPRA',
            amount: ticketAmount,
            points_change: pointsEarned,
            stamps_change: stampsEarned,
            hash: txHash,
          });
        } catch (err) {
          console.error('Error sincronizando compra en Supabase:', err);
        }
      })();
    }

    return result;
  },

  redeemPoints: async (dni, pointsToDeduct, rewardId) => {
    const state = get();
    const wsId = useAuthStore.getState().workspaceId;
    const employeeId = useAuthStore.getState().employeeId;
    const branch = useAuthStore.getState().currentBranch;

    const customerIndex = state.customers.findIndex((c) => c.dni === dni);
    if (customerIndex === -1) return;

    const customer = state.customers[customerIndex];
    if (customer.points < pointsToDeduct) return;

    const txHash = '#' + Math.random().toString(36).substring(2, 7);
    const txDate = new Date().toISOString();

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      date: txDate,
      customerId: customer.id,
      branchId: branch?.id,
      employeeId: employeeId || undefined,
      rewardId: rewardId,
      type: 'CANJE',
      amount: 0,
      pointsChange: -pointsToDeduct,
      stampsChange: 0,
      hash: txHash,
    };

    const newPoints = customer.points - pointsToDeduct;

    set({
      customers: state.customers.map((c) => (c.dni === dni ? { ...customer, points: newPoints } : c)),
      transactions: [newTransaction, ...state.transactions],
    });

    if (wsId) {
      try {
        await supabase
          .from('loyalty_customers')
          .update({ points: newPoints })
          .eq('id', customer.id);

        await supabase.from('loyalty_transactions').insert({
          workspace_id: wsId,
          customer_id: customer.id,
          branch_id: branch?.id || null,
          employee_id: employeeId || null,
          reward_id: rewardId || null,
          type: 'CANJE',
          amount: 0,
          points_change: -pointsToDeduct,
          stamps_change: 0,
          hash: txHash,
        });
      } catch (err) {
        console.error('Error guardando canje de puntos en DB:', err);
      }
    }
  },

  redeemStamps: async (dni, stampsToDeduct, rewardId) => {
    const state = get();
    const wsId = useAuthStore.getState().workspaceId;
    const employeeId = useAuthStore.getState().employeeId;
    const branch = useAuthStore.getState().currentBranch;

    const customerIndex = state.customers.findIndex((c) => c.dni === dni);
    if (customerIndex === -1) return;

    const customer = state.customers[customerIndex];
    if (customer.stamps < stampsToDeduct) return;

    const maxStampsReward =
      state.config.rewards.length > 0
        ? Math.max(...state.config.rewards.map((r) => r.costStamps))
        : state.config.stampsToReward;

    const isMaxReward = stampsToDeduct >= maxStampsReward;
    const actualStampsToDeduct = isMaxReward ? maxStampsReward : 0;
    const newStamps = customer.stamps - actualStampsToDeduct;
    const newCompletedCards = isMaxReward
      ? (customer.completedCards || 0) + 1
      : (customer.completedCards || 0);

    const { effectiveTier } = calculateCustomerTier(
      {
        totalVisits: customer.totalVisits,
        completedCards: newCompletedCards,
        lastVisitDate: customer.lastVisitDate,
        manualTierOverride: customer.manualTierOverride,
        tier: customer.tier,
      },
      state.config.tierConfig,
      state.config.type
    );

    const txHash = '#' + Math.random().toString(36).substring(2, 7);
    const txDate = new Date().toISOString();

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      date: txDate,
      customerId: customer.id,
      branchId: branch?.id,
      employeeId: employeeId || undefined,
      rewardId: rewardId,
      type: 'CANJE',
      amount: 0,
      pointsChange: 0,
      stampsChange: -actualStampsToDeduct,
      hash: txHash,
    };

    const newClaimedRewards = isMaxReward
      ? []
      : rewardId
      ? [...(customer.claimedRewards || []), rewardId]
      : customer.claimedRewards || [];

    set({
      customers: state.customers.map((c) =>
        c.dni === dni
          ? {
              ...customer,
              stamps: newStamps,
              completedCards: newCompletedCards,
              tier: effectiveTier,
              claimedRewards: newClaimedRewards,
            }
          : c
      ),
      transactions: [newTransaction, ...state.transactions],
    });

    if (wsId) {
      try {
        await supabase
          .from('loyalty_customers')
          .update({
            stamps: newStamps,
            completed_cards: newCompletedCards,
            tier: effectiveTier,
            claimed_rewards: newClaimedRewards,
          })
          .eq('id', customer.id);

        await supabase.from('loyalty_transactions').insert({
          workspace_id: wsId,
          customer_id: customer.id,
          branch_id: branch?.id || null,
          employee_id: employeeId || null,
          reward_id: rewardId || null,
          type: 'CANJE',
          amount: 0,
          points_change: 0,
          stamps_change: -actualStampsToDeduct,
          hash: txHash,
        });
      } catch (err) {
        console.error('Error guardando canje de sellos en DB:', err);
      }
    }
  },

  addManualAdjustment: async (dni, pointsChange, stampsChange = 0, motive) => {
    const state = get();
    const wsId = useAuthStore.getState().workspaceId;
    const employeeId = useAuthStore.getState().employeeId;
    const branch = useAuthStore.getState().currentBranch;

    const customerIndex = state.customers.findIndex((c) => c.dni === dni);
    if (customerIndex === -1) return;

    const customer = state.customers[customerIndex];
    const newPoints = Math.max(0, customer.points + pointsChange);
    const newStamps = Math.max(0, customer.stamps + stampsChange);

    const txHash = '#' + Math.random().toString(36).substring(2, 7);
    const txDate = new Date().toISOString();

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      date: txDate,
      customerId: customer.id,
      type: 'AJUSTE',
      amount: 0,
      pointsChange,
      stampsChange,
      hash: txHash,
      motive,
    };

    set({
      customers: state.customers.map((c) =>
        c.dni === dni
          ? {
              ...customer,
              points: newPoints,
              stamps: newStamps,
            }
          : c
      ),
      transactions: [newTransaction, ...state.transactions],
    });

    if (wsId) {
      try {
        await supabase
          .from('loyalty_customers')
          .update({
            points: newPoints,
            stamps: newStamps,
          })
          .eq('id', customer.id);

        await supabase.from('loyalty_transactions').insert({
          workspace_id: wsId,
          customer_id: customer.id,
          branch_id: branch?.id || null,
          employee_id: employeeId || null,
          type: 'AJUSTE',
          amount: 0,
          points_change: pointsChange,
          stamps_change: stampsChange,
          hash: txHash,
          motive: motive || null,
        });
      } catch (err) {
        console.error('Error guardando ajuste manual en DB:', err);
      }
    }
  },
}));
