import type { ReactNode } from 'react';
import { Lock, ArrowRight, LogOut, Store } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface ModuleGatekeeperProps {
  children: ReactNode;
}

export function ModuleGatekeeper({ children }: ModuleGatekeeperProps) {
  const { enabledModules, tenantName, user, signOut, isLoading } = useAuthStore();

  if (isLoading) {
    return <>{children}</>;
  }

  // Si tiene el módulo 'loyalty' habilitado, renderizar la app normalmente
  const hasAccess = enabledModules.includes('loyalty');

  if (hasAccess) {
    return <>{children}</>;
  }

  // Pantalla de bloqueo si el módulo no está contratado en la suscripción
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-on-surface">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/60 shadow-xl flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-5 border border-amber-500/20">
          <Lock className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-mono text-[11px] mb-3">
          <Store className="w-3.5 h-3.5" />
          <span>{tenantName || 'Tu Negocio'}</span>
        </div>

        <h2 className="font-display font-bold text-2xl text-on-surface mb-2">
          Módulo LoyaltyPOS no activo
        </h2>

        <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-6">
          Tu suscripción actual no incluye el módulo de <strong className="text-on-surface">Fidelización y Terminal POS</strong>. Puedes activarlo al instante desde el Portal Comercial de la Suite.
        </p>

        <div className="w-full flex flex-col gap-3">
          <a
            href="https://suite-portal-web.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:bg-primary-hover active:scale-[0.98] transition-all shadow-sm"
          >
            <span>Activar Módulo en el Portal</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={() => signOut()}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-outline-variant/60 text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-xs font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar sesión ({user?.email})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
