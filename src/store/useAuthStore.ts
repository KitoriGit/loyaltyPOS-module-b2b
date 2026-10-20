import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

export interface Branch {
  id: string;
  name: string;
  code?: string;
  address?: string;
  is_active: boolean;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  userType: 'owner' | 'employee' | null;
  workspaceId: string | null;
  employeeId: string | null;
  tenantName: string | null;
  enabledModules: string[];
  branches: Branch[];
  currentBranch: Branch | null;
  isLoading: boolean;

  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null; data: any }>;
  signOut: () => Promise<void>;
  setCurrentBranch: (branch: Branch) => void;
}

let listenerRegistered = false;

export async function fetchSessionContext(user: User) {
  // 1. Verificar si es empleado
  const { data: employeeData } = await supabase
    .from('employees')
    .select('workspace_id, id')
    .eq('email', user.email)
    .maybeSingle();

  if (employeeData) {
    // Obtener nombre del workspace y modulos contratados
    const { data: ws } = await supabase
      .from('workspaces')
      .select('name, enabled_modules')
      .eq('id', employeeData.workspace_id)
      .maybeSingle();

    return {
      userType: 'employee' as const,
      workspaceId: employeeData.workspace_id,
      employeeId: employeeData.id,
      tenantName: ws?.name || 'Comercio',
      enabledModules: ws?.enabled_modules || ['loyalty', 'booking', 'shiftsync'],
    };
  }

  // 2. Verificar si es dueño (con reintentos por si el trigger de Supabase tarda)
  let attempts = 0;
  while (attempts < 5) {
    const { data: workspaces, error } = await supabase
      .from('workspaces')
      .select('id, name, enabled_modules')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching workspaces:', error);
    }

    if (workspaces && workspaces.length > 0) {
      return {
        userType: 'owner' as const,
        workspaceId: workspaces[0].id,
        employeeId: null,
        tenantName: workspaces[0].name,
        enabledModules: workspaces[0].enabled_modules || ['loyalty', 'booking', 'shiftsync'],
      };
    }
    await new Promise((res) => setTimeout(res, 500));
    attempts++;
  }

  // Fallback de rescate si el trigger no creó el workspace
  try {
    const { data: newWs } = await supabase
      .from('workspaces')
      .insert([{ user_id: user.id, name: 'Mi Comercio' }])
      .select('id, name')
      .maybeSingle();

    if (newWs) {
      return {
        userType: 'owner' as const,
        workspaceId: newWs.id,
        employeeId: null,
        tenantName: newWs.name,
        enabledModules: ['loyalty', 'booking', 'shiftsync'],
      };
    }
  } catch (err) {
    console.error('Error al crear workspace de emergencia:', err);
  }

  return {
    userType: null,
    workspaceId: null,
    employeeId: null,
    tenantName: null,
    enabledModules: [],
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  userType: null,
  workspaceId: null,
  employeeId: null,
  tenantName: null,
  enabledModules: [],
  branches: [],
  currentBranch: null,
  isLoading: true,

  setCurrentBranch: (branch) => set({ currentBranch: branch }),

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const ctx = await fetchSessionContext(session.user);
        
        let branches: Branch[] = [];
        if (ctx.workspaceId) {
          const { data: branchData } = await supabase
            .from('branches')
            .select('*')
            .eq('workspace_id', ctx.workspaceId)
            .eq('is_active', true);
          branches = branchData || [];
        }

        set({
          session,
          user: session.user,
          userType: ctx.userType,
          workspaceId: ctx.workspaceId,
          employeeId: ctx.employeeId,
          tenantName: ctx.tenantName,
          enabledModules: ctx.enabledModules,
          branches,
          currentBranch: branches.length > 0 ? branches[0] : null,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }

      if (!listenerRegistered) {
        listenerRegistered = true;
        supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (newSession?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
            const ctx = await fetchSessionContext(newSession.user);
            let branches: Branch[] = [];
            if (ctx.workspaceId) {
              const { data: branchData } = await supabase
                .from('branches')
                .select('*')
                .eq('workspace_id', ctx.workspaceId)
                .eq('is_active', true);
              branches = branchData || [];
            }
            set({
              session: newSession,
              user: newSession.user,
              userType: ctx.userType,
              workspaceId: ctx.workspaceId,
              employeeId: ctx.employeeId,
              tenantName: ctx.tenantName,
              enabledModules: ctx.enabledModules,
              branches,
              currentBranch: branches.length > 0 ? branches[0] : null,
              isLoading: false,
            });
          } else if (event === 'SIGNED_OUT') {
            set({
              session: null,
              user: null,
              userType: null,
              workspaceId: null,
              employeeId: null,
              tenantName: null,
              branches: [],
              currentBranch: null,
              isLoading: false,
            });
          }
        });
      }
    } catch (err) {
      console.error('Error inicializando autenticación:', err);
      set({ isLoading: false });
    }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error };

    if (data.user) {
      const ctx = await fetchSessionContext(data.user);
      let branches: Branch[] = [];
      if (ctx.workspaceId) {
        const { data: branchData } = await supabase
          .from('branches')
          .select('*')
          .eq('workspace_id', ctx.workspaceId)
          .eq('is_active', true);
        branches = branchData || [];
      }
      set({
        session: data.session,
        user: data.user,
        userType: ctx.userType,
        workspaceId: ctx.workspaceId,
        employeeId: ctx.employeeId,
        tenantName: ctx.tenantName,
        branches,
        currentBranch: branches.length > 0 ? branches[0] : null,
      });
    }

    return { error: null };
  },

  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return { error, data: null };

    if (data.session && data.user) {
      const ctx = await fetchSessionContext(data.user);
      let branches: Branch[] = [];
      if (ctx.workspaceId) {
        const { data: branchData } = await supabase
          .from('branches')
          .select('*')
          .eq('workspace_id', ctx.workspaceId)
          .eq('is_active', true);
        branches = branchData || [];
      }
      set({
        session: data.session,
        user: data.user,
        userType: ctx.userType,
        workspaceId: ctx.workspaceId,
        employeeId: ctx.employeeId,
        tenantName: ctx.tenantName,
        branches,
        currentBranch: branches.length > 0 ? branches[0] : null,
      });
    }

    return { error: null, data };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({
      session: null,
      user: null,
      userType: null,
      workspaceId: null,
      employeeId: null,
      tenantName: null,
      branches: [],
      currentBranch: null,
    });
  },
}));
