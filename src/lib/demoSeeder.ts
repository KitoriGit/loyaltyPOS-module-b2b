import { supabase } from './supabase';
import { useLoyaltyStore } from '../store/useLoyaltyStore';

function daysAgoIso(days: number, hoursOffset = 0): string {
  const d = new Date(Date.now() - days * 24 * 60 * 60 * 1000 - hoursOffset * 60 * 60 * 1000);
  return d.toISOString();
}

export async function clearWorkspaceLoyaltyData(workspaceId: string): Promise<void> {
  if (!workspaceId) throw new Error('Workspace ID no disponible');

  // Eliminar tokens de canje, transacciones y clientes del workspace actual
  await supabase.from('loyalty_redemption_tokens').delete().eq('workspace_id', workspaceId);
  await supabase.from('loyalty_transactions').delete().eq('workspace_id', workspaceId);
  await supabase.from('loyalty_customers').delete().eq('workspace_id', workspaceId);

  await useLoyaltyStore.getState().fetchInitialData(workspaceId);
}

/**
 * DEMO 1: Barbería / Peluquería & Estética en MODO SELLOS (8 sellos)
 */
export async function seedBarberiaStampsDemo(workspaceId: string): Promise<void> {
  if (!workspaceId) throw new Error('Workspace ID no disponible');

  // 1. Limpiar datos previos
  await supabase.from('loyalty_redemption_tokens').delete().eq('workspace_id', workspaceId);
  await supabase.from('loyalty_transactions').delete().eq('workspace_id', workspaceId);
  await supabase.from('loyalty_customers').delete().eq('workspace_id', workspaceId);
  await supabase.from('loyalty_rewards').delete().eq('workspace_id', workspaceId);

  // 2. Configurar programa en modo Sellos (Meta: 8 sellos, consumo base $12000)
  await supabase.from('loyalty_configs').upsert(
    {
      workspace_id: workspaceId,
      program_type: 'sellos',
      spend_amount: 12000,
      points_awarded: 1,
      points_expiration_days: 365,
      stamps_to_reward: 8,
      silver_visits_threshold: 8,
      gold_visits_threshold: 16,
      double_points_enabled: false,
      double_points_min_spend: 25000,
      silver_cards_threshold: 1,
      gold_cards_threshold: 2,
      double_stamp_enabled: true,
      double_stamp_min_spend: 22000,
      inactivity_days_downgrade: 45,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'workspace_id' }
  );

  // 3. Insertar Recompensas de Barbería / Peluquería & Estética (en Sellos)
  const { data: insertedRewards, error: rwErr } = await supabase
    .from('loyalty_rewards')
    .insert([
      {
        workspace_id: workspaceId,
        name: 'Perfilado de Barba o Brushing Gratis',
        cost_points: 80,
        cost_stamps: 4,
        min_tier: 'BRONZE',
        is_active: true,
      },
      {
        workspace_id: workspaceId,
        name: 'Corte Clásico o Servicio Estético Gratis',
        cost_points: 160,
        cost_stamps: 8,
        min_tier: 'BRONZE',
        is_active: true,
      },
      {
        workspace_id: workspaceId,
        name: 'Combo Corte + Barba VIP sin cargo (Nivel Plata)',
        cost_points: 220,
        cost_stamps: 8,
        min_tier: 'SILVER',
        is_active: true,
      },
      {
        workspace_id: workspaceId,
        name: 'Servicio Completo VIP + Cera Modeladora (Oro)',
        cost_points: 300,
        cost_stamps: 8,
        min_tier: 'GOLD',
        is_active: true,
      },
    ])
    .select();

  if (rwErr) throw rwErr;

  const rwCorteGratis = insertedRewards?.find((r) => r.min_tier === 'BRONZE' && r.cost_stamps === 8);
  const rwPerfilado = insertedRewards?.find((r) => r.min_tier === 'BRONZE' && r.cost_stamps === 4);

  // 4. Insertar 6 Clientes con distintos sellos (incluyendo tarjetas con 8/8 sellos listas para canjear en vivo)
  const { data: insertedCustomers, error: custErr } = await supabase
    .from('loyalty_customers')
    .insert([
      {
        workspace_id: workspaceId,
        dni: '38451290',
        name: 'Martín Gómez',
        phone: '+54 9 11 4589-2310',
        points: 0,
        stamps: 8,
        tier: 'BRONZE',
        total_visits: 8,
        completed_cards: 0,
        total_spent: 118000,
        last_visit_date: daysAgoIso(0, 1),
        claimed_rewards: [],
        is_registered: true,
      },
      {
        workspace_id: workspaceId,
        dni: '39882104',
        name: 'Lucía Fernández',
        phone: '+54 9 11 6102-4490',
        points: 0,
        stamps: 8,
        tier: 'SILVER',
        total_visits: 16,
        completed_cards: 1,
        total_spent: 234000,
        last_visit_date: daysAgoIso(0, 4),
        claimed_rewards: [],
        is_registered: true,
      },
      {
        workspace_id: workspaceId,
        dni: '40129834',
        name: 'Nicolás Pereyra',
        phone: '+54 9 11 5623-8901',
        points: 0,
        stamps: 7,
        tier: 'BRONZE',
        total_visits: 7,
        completed_cards: 0,
        total_spent: 98000,
        last_visit_date: daysAgoIso(1),
        claimed_rewards: [],
        is_registered: true,
      },
      {
        workspace_id: workspaceId,
        dni: '42109384',
        name: 'Valentina Paz',
        phone: '+54 9 11 5019-7782',
        points: 0,
        stamps: 5,
        tier: 'GOLD',
        total_visits: 21,
        completed_cards: 2,
        total_spent: 312000,
        last_visit_date: daysAgoIso(2),
        claimed_rewards: [],
        is_registered: true,
      },
      {
        workspace_id: workspaceId,
        dni: '36771029',
        name: 'Facundo Díaz',
        phone: '+54 9 11 3390-1120',
        points: 0,
        stamps: 3,
        tier: 'BRONZE',
        total_visits: 3,
        completed_cards: 0,
        total_spent: 42000,
        last_visit_date: daysAgoIso(5),
        claimed_rewards: [],
        is_registered: false,
      },
      {
        workspace_id: workspaceId,
        dni: '35901283',
        name: 'Santiago Morales',
        phone: '+54 9 11 4892-6615',
        points: 0,
        stamps: 4,
        tier: 'BRONZE',
        total_visits: 4,
        completed_cards: 0,
        total_spent: 54000,
        last_visit_date: daysAgoIso(49),
        claimed_rewards: [],
        is_registered: false,
      },
    ])
    .select();

  if (custErr) throw custErr;

  const byDni = (dni: string) => insertedCustomers?.find((c) => c.dni === dni)?.id;

  // 5. Insertar Transacciones de COMPRA y CANJE para Barbería / Estética (Sellos)
  const txRows = [
    {
      workspace_id: workspaceId,
      customer_id: byDni('38451290'),
      type: 'COMPRA',
      amount: 17500,
      points_change: 0,
      stamps_change: 1,
      hash: '#s10a4',
      motive: 'Reserva Confirmada (Booking) - Combo Corte + Barba VIP',
      created_at: daysAgoIso(0, 1),
    },
    {
      workspace_id: workspaceId,
      customer_id: byDni('39882104'),
      type: 'COMPRA',
      amount: 28000,
      points_change: 0,
      stamps_change: 2,
      hash: '#s21b8',
      motive: 'Reserva Confirmada (Booking) - Colorimetría (Doble Sello)',
      created_at: daysAgoIso(0, 4),
    },
    {
      workspace_id: workspaceId,
      customer_id: byDni('40129834'),
      type: 'COMPRA',
      amount: 12000,
      points_change: 0,
      stamps_change: 1,
      hash: '#s32c9',
      motive: 'POS Mostrador - Corte Clásico & Moderno',
      created_at: daysAgoIso(1, 2),
    },
    {
      workspace_id: workspaceId,
      customer_id: byDni('42109384'),
      type: 'CANJE',
      reward_id: rwCorteGratis?.id || null,
      amount: 0,
      points_change: 0,
      stamps_change: 0,
      hash: '#s44d1',
      motive: 'Canje: Corte Clásico o Servicio Estético Gratis',
      created_at: daysAgoIso(2, 1),
    },
    {
      workspace_id: workspaceId,
      customer_id: byDni('42109384'),
      type: 'COMPRA',
      amount: 18000,
      points_change: 0,
      stamps_change: 1,
      hash: '#s55e2',
      motive: 'Reserva Confirmada (Booking)',
      created_at: daysAgoIso(2, 3),
    },
    {
      workspace_id: workspaceId,
      customer_id: byDni('39882104'),
      type: 'CANJE',
      reward_id: rwPerfilado?.id || null,
      amount: 0,
      points_change: 0,
      stamps_change: 0,
      hash: '#s66f3',
      motive: 'Canje: Perfilado de Barba o Brushing Gratis',
      created_at: daysAgoIso(4, 2),
    },
    {
      workspace_id: workspaceId,
      customer_id: byDni('36771029'),
      type: 'COMPRA',
      amount: 12000,
      points_change: 0,
      stamps_change: 1,
      hash: '#s77a4',
      motive: 'POS Mostrador - Corte Clásico',
      created_at: daysAgoIso(5, 3),
    },
    {
      workspace_id: workspaceId,
      customer_id: byDni('38451290'),
      type: 'COMPRA',
      amount: 24000,
      points_change: 0,
      stamps_change: 2,
      hash: '#s88b5',
      motive: 'POS Mostrador - Servicio VIP (Doble Sello)',
      created_at: daysAgoIso(7, 2),
    },
    {
      workspace_id: workspaceId,
      customer_id: byDni('42109384'),
      type: 'CANJE',
      reward_id: rwCorteGratis?.id || null,
      amount: 0,
      points_change: 0,
      stamps_change: 0,
      hash: '#s99c6',
      motive: 'Canje: Corte Clásico o Servicio Estético Gratis',
      created_at: daysAgoIso(12, 4),
    },
  ].filter((t) => Boolean(t.customer_id));

  await supabase.from('loyalty_transactions').insert(txRows);

  await useLoyaltyStore.getState().fetchInitialData(workspaceId);
}

/**
 * DEMO 2: Cafetería / Gastronomía en MODO PUNTOS (1 pto cada $100)
 */
export async function seedCafeteriaPointsDemo(workspaceId: string): Promise<void> {
  if (!workspaceId) throw new Error('Workspace ID no disponible');

  // 1. Limpiar datos previos
  await supabase.from('loyalty_redemption_tokens').delete().eq('workspace_id', workspaceId);
  await supabase.from('loyalty_transactions').delete().eq('workspace_id', workspaceId);
  await supabase.from('loyalty_customers').delete().eq('workspace_id', workspaceId);
  await supabase.from('loyalty_rewards').delete().eq('workspace_id', workspaceId);

  // 2. Configurar programa en modo Puntos (1 punto cada AR$ 100)
  await supabase.from('loyalty_configs').upsert(
    {
      workspace_id: workspaceId,
      program_type: 'puntos',
      spend_amount: 100,
      points_awarded: 1,
      points_expiration_days: 365,
      stamps_to_reward: 8,
      silver_visits_threshold: 5,
      gold_visits_threshold: 12,
      double_points_enabled: true,
      double_points_min_spend: 15000,
      silver_cards_threshold: 1,
      gold_cards_threshold: 2,
      double_stamp_enabled: true,
      double_stamp_min_spend: 12000,
      inactivity_days_downgrade: 45,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'workspace_id' }
  );

  // 3. Insertar Recompensas de Cafetería / Gastronomía (en Puntos)
  const { data: insertedRewards, error: rwErr } = await supabase
    .from('loyalty_rewards')
    .insert([
      {
        workspace_id: workspaceId,
        name: 'Cookie Artesanal o Medialuna de Manteca',
        cost_points: 80,
        cost_stamps: 4,
        min_tier: 'BRONZE',
        is_active: true,
      },
      {
        workspace_id: workspaceId,
        name: 'Café de Especialidad + Medialuna Gratis',
        cost_points: 150,
        cost_stamps: 6,
        min_tier: 'SILVER',
        is_active: true,
      },
      {
        workspace_id: workspaceId,
        name: 'Brunch Completo para 2 Personas sin cargo',
        cost_points: 250,
        cost_stamps: 8,
        min_tier: 'GOLD',
        is_active: true,
      },
    ])
    .select();

  if (rwErr) throw rwErr;

  const rwCookie = insertedRewards?.find((r) => r.cost_points === 80);
  const rwCafeMedialuna = insertedRewards?.find((r) => r.cost_points === 150);
  const rwBrunch = insertedRewards?.find((r) => r.cost_points === 250);

  // 4. Insertar 6 Clientes Realistas con saldo de Puntos
  const { data: insertedCustomers, error: custErr } = await supabase
    .from('loyalty_customers')
    .insert([
      {
        workspace_id: workspaceId,
        dni: '38451290',
        name: 'Martín Gómez',
        phone: '+54 9 11 4589-2310',
        points: 310,
        stamps: 0,
        tier: 'GOLD',
        total_visits: 14,
        completed_cards: 0,
        total_spent: 118000,
        last_visit_date: daysAgoIso(0, 1),
        claimed_rewards: [],
        is_registered: true,
      },
      {
        workspace_id: workspaceId,
        dni: '40129834',
        name: 'Nicolás Pereyra',
        phone: '+54 9 11 5623-8901',
        points: 165,
        stamps: 0,
        tier: 'SILVER',
        total_visits: 7,
        completed_cards: 0,
        total_spent: 65000,
        last_visit_date: daysAgoIso(0, 3),
        claimed_rewards: [],
        is_registered: true,
      },
      {
        workspace_id: workspaceId,
        dni: '39882104',
        name: 'Lucía Fernández',
        phone: '+54 9 11 6102-4490',
        points: 95,
        stamps: 0,
        tier: 'SILVER',
        total_visits: 5,
        completed_cards: 0,
        total_spent: 48000,
        last_visit_date: daysAgoIso(2),
        claimed_rewards: [],
        is_registered: true,
      },
      {
        workspace_id: workspaceId,
        dni: '36771029',
        name: 'Facundo Díaz',
        phone: '+54 9 11 3390-1120',
        points: 85,
        stamps: 0,
        tier: 'BRONZE',
        total_visits: 3,
        completed_cards: 0,
        total_spent: 28500,
        last_visit_date: daysAgoIso(4),
        claimed_rewards: [],
        is_registered: false,
      },
      {
        workspace_id: workspaceId,
        dni: '42109384',
        name: 'Valentina Paz',
        phone: '+54 9 11 5019-7782',
        points: 260,
        stamps: 0,
        tier: 'GOLD',
        total_visits: 12,
        completed_cards: 0,
        total_spent: 104000,
        last_visit_date: daysAgoIso(1),
        claimed_rewards: [],
        is_registered: true,
      },
      {
        workspace_id: workspaceId,
        dni: '35901283',
        name: 'Santiago Morales',
        phone: '+54 9 11 4892-6615',
        points: 45,
        stamps: 0,
        tier: 'BRONZE',
        total_visits: 2,
        completed_cards: 0,
        total_spent: 18000,
        last_visit_date: daysAgoIso(6),
        claimed_rewards: [],
        is_registered: false,
      },
    ])
    .select();

  if (custErr) throw custErr;

  const byDni = (dni: string) => insertedCustomers?.find((c) => c.dni === dni)?.id;

  // 5. Insertar 12 Transacciones Realistas de Cafetería / Gastronomía (Puntos)
  const txRows = [
    {
      workspace_id: workspaceId,
      customer_id: byDni('38451290'),
      type: 'COMPRA',
      amount: 12500,
      points_change: 125,
      stamps_change: 0,
      hash: '#b91a2',
      motive: 'POS Mostrador - Flat White + Tostón de Palta',
      created_at: daysAgoIso(0, 1),
    },
    {
      workspace_id: workspaceId,
      customer_id: byDni('40129834'),
      type: 'COMPRA',
      amount: 9500,
      points_change: 95,
      stamps_change: 0,
      hash: '#c48f1',
      motive: 'POS Mostrador - Cold Brew + Roll de Canela',
      created_at: daysAgoIso(0, 3),
    },
    {
      workspace_id: workspaceId,
      customer_id: byDni('42109384'),
      type: 'CANJE',
      reward_id: rwCookie?.id || null,
      amount: 0,
      points_change: -80,
      stamps_change: 0,
      hash: '#d02e9',
      motive: 'Canje: Cookie Artesanal o Medialuna de Manteca',
      created_at: daysAgoIso(1, 2),
    },
    {
      workspace_id: workspaceId,
      customer_id: byDni('42109384'),
      type: 'COMPRA',
      amount: 18000,
      points_change: 360,
      stamps_change: 0,
      hash: '#e73b4',
      motive: 'POS Mostrador - Merienda para 2 (Puntos Dobles)',
      created_at: daysAgoIso(1, 3),
    },
    {
      workspace_id: workspaceId,
      customer_id: byDni('39882104'),
      type: 'COMPRA',
      amount: 8500,
      points_change: 85,
      stamps_change: 0,
      hash: '#f19c8',
      motive: 'POS Mostrador - Cappuccino + Croissant',
      created_at: daysAgoIso(2, 4),
    },
    {
      workspace_id: workspaceId,
      customer_id: byDni('38451290'),
      type: 'CANJE',
      reward_id: rwCafeMedialuna?.id || null,
      amount: 0,
      points_change: -150,
      stamps_change: 0,
      hash: '#a54d2',
      motive: 'Canje: Café de Especialidad + Medialuna Gratis',
      created_at: daysAgoIso(4, 2),
    },
    {
      workspace_id: workspaceId,
      customer_id: byDni('36771029'),
      type: 'COMPRA',
      amount: 11000,
      points_change: 110,
      stamps_change: 0,
      hash: '#98bc1',
      motive: 'POS Mostrador',
      created_at: daysAgoIso(5, 1),
    },
    {
      workspace_id: workspaceId,
      customer_id: byDni('35901283'),
      type: 'COMPRA',
      amount: 9000,
      points_change: 90,
      stamps_change: 0,
      hash: '#72ef3',
      motive: 'POS Mostrador',
      created_at: daysAgoIso(8, 2),
    },
    {
      workspace_id: workspaceId,
      customer_id: byDni('40129834'),
      type: 'CANJE',
      reward_id: rwCookie?.id || null,
      amount: 0,
      points_change: -80,
      stamps_change: 0,
      hash: '#61da9',
      motive: 'Canje: Cookie Artesanal o Medialuna de Manteca',
      created_at: daysAgoIso(11, 5),
    },
    {
      workspace_id: workspaceId,
      customer_id: byDni('38451290'),
      type: 'COMPRA',
      amount: 21000,
      points_change: 420,
      stamps_change: 0,
      hash: '#55ca0',
      motive: 'POS Mostrador - Brunch Especial',
      created_at: daysAgoIso(14, 3),
    },
    {
      workspace_id: workspaceId,
      customer_id: byDni('39882104'),
      type: 'AJUSTE',
      amount: 0,
      points_change: 25,
      stamps_change: 0,
      hash: '#33ab7',
      motive: 'Bonificación de bienvenida por recomendación',
      created_at: daysAgoIso(18, 2),
    },
    {
      workspace_id: workspaceId,
      customer_id: byDni('42109384'),
      type: 'CANJE',
      reward_id: rwBrunch?.id || null,
      amount: 0,
      points_change: -250,
      stamps_change: 0,
      hash: '#19fe4',
      motive: 'Canje: Brunch Completo para 2 Personas sin cargo',
      created_at: daysAgoIso(21, 4),
    },
  ].filter((t) => Boolean(t.customer_id));

  await supabase.from('loyalty_transactions').insert(txRows);

  await useLoyaltyStore.getState().fetchInitialData(workspaceId);
}

// Aliases por compatibilidad
export const seedBarberiaPointsDemo = seedBarberiaStampsDemo;
export const seedCafeteriaStampsDemo = seedCafeteriaPointsDemo;
