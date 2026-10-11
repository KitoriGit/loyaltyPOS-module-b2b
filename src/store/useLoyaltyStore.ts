import { create } from 'zustand';

export type ProgramType = 'puntos' | 'sellos';

export interface Reward {
  id: string;
  name: string;
  costPoints: number;
  costStamps: number;
}

export interface ProgramConfig {
  type: ProgramType;
  // Configuración de Puntos
  pointsPerArs: number; // Ej: 1 punto cada AR$ 100
  pointsExpirationDays: number;
  // Configuración de Sellos
  stampsToReward: number; // Ej: 10 sellos para 1 premio
  rewards: Reward[];
}

export interface Customer {
  id: string;
  dni: string;
  name: string;
  points: number;
  stamps: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD';
  totalVisits: number;
  totalSpent: number;
  lastVisitDate: string;
  claimedRewards?: string[];
}

export interface Transaction {
  id: string;
  date: string;
  customerId: string;
  type: 'COMPRA' | 'CANJE' | 'AJUSTE';
  amount: number; // Dinero gastado
  pointsChange: number; // Puntos sumados o restados
  stampsChange: number; // Sellos sumados
  hash: string;
  motive?: string; // Motivo para ajustes manuales
}

interface LoyaltyState {
  config: ProgramConfig;
  customers: Customer[];
  transactions: Transaction[];
  
  // Acciones
  setConfig: (config: Partial<ProgramConfig>) => void;
  processPurchase: (dni: string, ticketAmount: number) => void;
  redeemPoints: (dni: string, pointsToDeduct: number) => void;
  redeemStamps: (dni: string, stampsToDeduct: number, rewardId?: string) => void;
  addManualAdjustment: (dni: string, pointsChange: number, stampsChange?: number, motive?: string) => void;
}

// Datos de prueba iniciales basados en los mockups
const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c1', dni: '34567890', name: 'Juan Pérez', points: 1500, stamps: 3, tier: 'BRONZE', totalVisits: 5, totalSpent: 45000, lastVisitDate: new Date().toISOString() },
  { id: 'c2', dni: '29111222', name: 'Laura Gómez', points: 450, stamps: 9, tier: 'SILVER', totalVisits: 12, totalSpent: 120000, lastVisitDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'c3', dni: '28450119', name: 'Carlos Rodríguez', points: 5200, stamps: 1, tier: 'GOLD', totalVisits: 25, totalSpent: 350000, lastVisitDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'c4', dni: '40123456', name: 'Sofía Martínez', points: 8500, stamps: 14, tier: 'GOLD', totalVisits: 42, totalSpent: 520000, lastVisitDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'c5', dni: '38765432', name: 'Diego Fernández', points: 120, stamps: 0, tier: 'BRONZE', totalVisits: 1, totalSpent: 12000, lastVisitDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'c6', dni: '35111222', name: 'Ana López', points: 3400, stamps: 5, tier: 'SILVER', totalVisits: 15, totalSpent: 185000, lastVisitDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'c7', dni: '42333444', name: 'Lucas Silva', points: 900, stamps: 2, tier: 'BRONZE', totalVisits: 3, totalSpent: 32000, lastVisitDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'c8', dni: '27555666', name: 'María Gonzalez', points: 16500, stamps: 15, tier: 'GOLD', totalVisits: 60, totalSpent: 850000, lastVisitDate: new Date().toISOString() },
  { id: 'c9', dni: '39888999', name: 'Julieta Romero', points: 4200, stamps: 7, tier: 'SILVER', totalVisits: 18, totalSpent: 210000, lastVisitDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'c10', dni: '31222333', name: 'Martín Torres', points: 0, stamps: 0, tier: 'BRONZE', totalVisits: 0, totalSpent: 0, lastVisitDate: '' },
];

const now = Date.now();
const day = 24 * 60 * 60 * 1000;

const MOCK_TRANSACTIONS: Transaction[] = [
  // Hoy
  { id: 't1', date: new Date(now - 1000 * 60 * 30).toISOString(), customerId: 'c1', type: 'COMPRA', amount: 125000, pointsChange: 1250, stampsChange: 1, hash: '#9dfa2' },
  { id: 't2', date: new Date(now - 1000 * 60 * 45).toISOString(), customerId: 'c8', type: 'CANJE', amount: 0, pointsChange: 0, stampsChange: -10, hash: '#4e21c', motive: 'Gaseosa 500ml' },
  // Hace 1 día
  { id: 't3', date: new Date(now - day - 1000 * 60 * 60).toISOString(), customerId: 'c4', type: 'COMPRA', amount: 180000, pointsChange: 1800, stampsChange: 1, hash: '#1a90e' },
  { id: 't8', date: new Date(now - day - 1000 * 60 * 90).toISOString(), customerId: 'c1', type: 'AJUSTE', amount: 0, pointsChange: 300, stampsChange: 0, hash: '#2x7m9', motive: 'Compensación por queja en pedido' },
  // Hace 2 días
  { id: 't4', date: new Date(now - 2 * day).toISOString(), customerId: 'c6', type: 'COMPRA', amount: 212000, pointsChange: 2120, stampsChange: 1, hash: '#7b3f1' },
  { id: 't5', date: new Date(now - 2.5 * day).toISOString(), customerId: 'c9', type: 'COMPRA', amount: 95000, pointsChange: 950, stampsChange: 1, hash: '#2c8d4' },
  // Hace 3 días
  { id: 't6', date: new Date(now - 3 * day).toISOString(), customerId: 'c2', type: 'CANJE', amount: 0, pointsChange: -5000, stampsChange: -10, hash: '#5f1e9', motive: 'Gaseosa 500ml' },
  { id: 't7', date: new Date(now - 3.2 * day).toISOString(), customerId: 'c3', type: 'COMPRA', amount: 450000, pointsChange: 4500, stampsChange: 1, hash: '#8a4c7' },
  // Hace 5 días
  { id: 't9', date: new Date(now - 5 * day).toISOString(), customerId: 'c8', type: 'COMPRA', amount: 155000, pointsChange: 1550, stampsChange: 1, hash: '#9c1d2' },
  // Hace 7 días (1 semana)
  { id: 't11', date: new Date(now - 7 * day).toISOString(), customerId: 'c1', type: 'COMPRA', amount: 280000, pointsChange: 2800, stampsChange: 1, hash: '#b2c3d' },
  { id: 't12', date: new Date(now - 7.1 * day).toISOString(), customerId: 'c6', type: 'CANJE', amount: 0, pointsChange: 0, stampsChange: -10, hash: '#c3d4e', motive: 'Gaseosa 500ml' },
  // Hace 10 días
  { id: 't13', date: new Date(now - 10 * day).toISOString(), customerId: 'c3', type: 'COMPRA', amount: 320000, pointsChange: 3200, stampsChange: 1, hash: '#d4e5f' },
  { id: 't14', date: new Date(now - 10.5 * day).toISOString(), customerId: 'c9', type: 'COMPRA', amount: 210000, pointsChange: 2100, stampsChange: 1, hash: '#e5f6a' },
  // Hace 14 días (2 semanas)
  { id: 't15', date: new Date(now - 14 * day).toISOString(), customerId: 'c8', type: 'CANJE', amount: 0, pointsChange: -8000, stampsChange: -10, hash: '#f6a7b', motive: 'Docena de Changuito Cookies' },
  { id: 't16', date: new Date(now - 14.5 * day).toISOString(), customerId: 'c2', type: 'COMPRA', amount: 150000, pointsChange: 1500, stampsChange: 1, hash: '#6a7b8' },
  // Hace 20 días
  { id: 't17', date: new Date(now - 20 * day).toISOString(), customerId: 'c4', type: 'COMPRA', amount: 480000, pointsChange: 4800, stampsChange: 1, hash: '#7b8c9' },
  // Hace 25 días
  { id: 't19', date: new Date(now - 25 * day).toISOString(), customerId: 'c8', type: 'COMPRA', amount: 620000, pointsChange: 6200, stampsChange: 1, hash: '#c9d0e' },
  { id: 't20', date: new Date(now - 25.5 * day).toISOString(), customerId: 'c6', type: 'COMPRA', amount: 190000, pointsChange: 1900, stampsChange: 1, hash: '#9d0e1' },
  // Hace 28 días
  { id: 't21', date: new Date(now - 28 * day).toISOString(), customerId: 'c3', type: 'COMPRA', amount: 150000, pointsChange: 1500, stampsChange: 0, hash: '#d0e1f' },
  { id: 't22', date: new Date(now - 28.5 * day).toISOString(), customerId: 'c9', type: 'COMPRA', amount: 280000, pointsChange: 2800, stampsChange: 1, hash: '#0e1f2' },
  // Hace 30 días
  { id: 't23', date: new Date(now - 30 * day).toISOString(), customerId: 'c4', type: 'COMPRA', amount: 350000, pointsChange: 3500, stampsChange: 1, hash: '#e1f2a' },
  { id: 't24', date: new Date(now - 30 * day).toISOString(), customerId: 'c2', type: 'AJUSTE', amount: 0, pointsChange: 500, stampsChange: 0, hash: '#1f2a3', motive: 'Bonificación bienvenida' },
];

export const useLoyaltyStore = create<LoyaltyState>((set) => ({
  config: {
    type: 'puntos',
    pointsPerArs: 100, // 1 punto cada $100
    pointsExpirationDays: 365,
    stampsToReward: 10,
    rewards: [
      { id: 'r1', name: 'Gaseosa 500ml', costPoints: 5000, costStamps: 6 },
      { id: 'r2', name: 'Docena de Changuito Cookies', costPoints: 8000, costStamps: 10 },
      { id: 'r3', name: 'Cena para dos personas', costPoints: 15000, costStamps: 15 }
    ]
  },
  customers: MOCK_CUSTOMERS,
  transactions: MOCK_TRANSACTIONS,

  setConfig: (newConfig) => set((state) => ({
    config: { ...state.config, ...newConfig }
  })),

  processPurchase: (dni, ticketAmount) => set((state) => {
    // 1. Buscar al cliente
    const customerIndex = state.customers.findIndex(c => c.dni === dni);
    if (customerIndex === -1) return state; // En producción, aquí crearíamos el cliente

    const customer = state.customers[customerIndex];
    
    // 2. Calcular recompensas según la configuración activa (exclusivas: puntos O sellos)
    const pointsEarned = state.config.type === 'puntos' 
      ? Math.floor(ticketAmount / state.config.pointsPerArs)
      : 0;
      
    const stampsEarned = state.config.type === 'sellos'
      ? 1 
      : 0;

    // 3. Crear transacción
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      customerId: customer.id,
      type: 'COMPRA',
      amount: ticketAmount,
      pointsChange: pointsEarned,
      stampsChange: stampsEarned,
      hash: '#' + crypto.randomUUID().substring(0, 5)
    };

    // 4. Actualizar cliente
    const updatedCustomer = {
      ...customer,
      points: customer.points + pointsEarned,
      stamps: customer.stamps + stampsEarned,
      totalVisits: customer.totalVisits + 1,
      totalSpent: customer.totalSpent + ticketAmount,
      lastVisitDate: new Date().toISOString()
    };

    const updatedCustomers = state.customers.map(c => 
      c.dni === dni ? updatedCustomer : c
    );

    return {
      customers: updatedCustomers,
      transactions: [newTransaction, ...state.transactions]
    };
  }),

  redeemPoints: (dni, pointsToDeduct) => set((state) => {
    const customerIndex = state.customers.findIndex(c => c.dni === dni);
    if (customerIndex === -1) return state;
    
    const customer = state.customers[customerIndex];
    if (customer.points < pointsToDeduct) return state;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      customerId: customer.id,
      type: 'CANJE',
      amount: 0,
      pointsChange: -pointsToDeduct,
      stampsChange: 0,
      hash: '#' + crypto.randomUUID().substring(0, 5)
    };

    const updatedCustomers = state.customers.map(c => 
      c.dni === dni ? { ...customer, points: customer.points - pointsToDeduct } : c
    );

    return {
      customers: updatedCustomers,
      transactions: [newTransaction, ...state.transactions]
    };
  }),

  redeemStamps: (dni, stampsToDeduct, rewardId) => set((state) => {
    const customerIndex = state.customers.findIndex(c => c.dni === dni);
    if (customerIndex === -1) return state;
    
    const customer = state.customers[customerIndex];
    if (customer.stamps < stampsToDeduct) return state;

    // Determinar cuál es la recompensa máxima (el límite de la tarjeta)
    const maxStampsReward = state.config.rewards.length > 0 
      ? Math.max(...state.config.rewards.map(r => r.costStamps))
      : state.config.stampsToReward;

    // Solo se restan los sellos si se está canjeando la recompensa máxima
    const isMaxReward = stampsToDeduct >= maxStampsReward;
    const actualStampsToDeduct = isMaxReward ? maxStampsReward : 0;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      customerId: customer.id,
      type: 'CANJE',
      amount: 0,
      pointsChange: 0,
      stampsChange: -actualStampsToDeduct,
      hash: '#' + crypto.randomUUID().substring(0, 5)
    };

    const newClaimedRewards = isMaxReward 
      ? [] 
      : (rewardId ? [...(customer.claimedRewards || []), rewardId] : customer.claimedRewards || []);

    const updatedCustomers = state.customers.map(c => 
      c.dni === dni ? { 
        ...customer, 
        stamps: customer.stamps - actualStampsToDeduct,
        claimedRewards: newClaimedRewards
      } : c
    );

    return {
      customers: updatedCustomers,
      transactions: [newTransaction, ...state.transactions]
    };
  }),

  addManualAdjustment: (dni, pointsChange, stampsChange = 0, motive?: string) => set((state) => {
    const customerIndex = state.customers.findIndex(c => c.dni === dni);
    if (customerIndex === -1) return state;
    
    const customer = state.customers[customerIndex];
    
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      customerId: customer.id,
      type: 'AJUSTE',
      amount: 0,
      pointsChange,
      stampsChange,
      hash: '#' + crypto.randomUUID().substring(0, 5),
      motive
    };

    const updatedCustomers = state.customers.map(c => 
      c.dni === dni ? { 
        ...customer, 
        points: Math.max(0, customer.points + pointsChange),
        stamps: Math.max(0, customer.stamps + stampsChange)
      } : c
    );

    return {
      customers: updatedCustomers,
      transactions: [newTransaction, ...state.transactions]
    };
  })
}));
