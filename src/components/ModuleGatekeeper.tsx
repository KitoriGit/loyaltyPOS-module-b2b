import type { ReactNode } from 'react';
import { Lock, ArrowRight, LogOut, Store, AlertTriangle, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface ModuleGatekeeperProps {
  children: ReactNode;
}

export function ModuleGatekeeper({ children }: ModuleGatekeeperProps) {
  const {
    enabledModules,
    subscriptionStatus,
    subscriptionTier,
    trialEndsAt,
    tenantName,
    user,
    signOut,
    isLoading,
  } = useAuthStore();

  if (isLoading) {
    return <>{children}</>;
  }

  const hasAccess = enabledModules.includes('loyalty');
  const isSuspended = subscriptionStatus === 'paused' || subscriptionStatus === 'canceled';
  const isExpiredTrial =
    subscriptionTier === 'trial' && trialEndsAt
      ? new Date(trialEndsAt).getTime() <= Date.now()
      : false;
  const isGracePeriod = !isSuspended && (subscriptionStatus === 'past_due' || isExpiredTrial);

  const handleSendWhatsapp = () => {
    const text = encodeURIComponent(
      `Hola! Soy ${tenantName || 'Mi Comercio'} (${user?.email || ''}). Adjunto el comprobante de pago de la suscripción de Suite Negocio.`
    );
    window.open(`https://wa.me/5493512804390?text=${text}`, '_blank');
  };

  // 1. Bloqueo por suscripción pausada o cancelada
  if (isSuspended) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-on-surface">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/60 shadow-xl flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-5 border border-rose-500/20">
            <Lock className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-mono text-[11px] mb-3">
            <Store className="w-3.5 h-3.5" />
            <span>{tenantName || 'Tu Negocio'}</span>
          </div>

          <h2 className="font-display font-bold text-2xl text-on-surface mb-2">
            Suscripción pausada por falta de pago
          </h2>

          <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-4">
            Tu acceso a <strong className="text-on-surface">LoyaltyPOS</strong> se encuentra temporalmente suspendido. Para reactivar tu cuenta, realizá la transferencia al alias <strong className="text-on-surface">alejandro.greiff</strong> y enviá el comprobante al <strong className="text-on-surface">3512804390</strong>.
          </p>

          <p className="font-sans text-xs text-on-surface-variant bg-surface-container px-3.5 py-2 rounded-xl mb-6">
            El pago se validará en un plazo máximo de <strong className="text-on-surface">24 hs</strong>.
          </p>

          <div className="w-full flex flex-col gap-3">
            <button
              type="button"
              onClick={handleSendWhatsapp}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enviar Comprobante al 3512804390</span>
            </button>

            <a
              href="https://suiteportalweb.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-all"
            >
              <span>Ir al Portal Comercial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-outline-variant/60 text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar sesión ({user?.email})</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Bloqueo si el módulo no está contratado en la suscripción
  if (!hasAccess) {
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
            Tu suscripción actual no incluye el módulo de <strong className="text-on-surface">Fidelización y Terminal POS</strong>. Podés activarlo al instante desde el Portal Comercial de la Suite.
          </p>

          <div className="w-full flex flex-col gap-3">
            <a
              href="https://suiteportalweb.vercel.app"
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
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-outline-variant/60 text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar sesión ({user?.email})</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Acceso permitido (con aviso superior si está en período de gracia)
  return (
    <>
      {isGracePeriod && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 text-xs font-medium flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center z-50">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Período de gracia activo (Pago pendiente):</strong> Transferí al alias{' '}
              <strong>alejandro.greiff</strong> y enviá el comprobante al WhatsApp{' '}
              <strong>3512804390</strong> (validación en máx. 24 hs) para evitar la pausa del servicio.
            </span>
          </div>
          <button
            type="button"
            onClick={handleSendWhatsapp}
            className="shrink-0 px-3 py-1 rounded-lg bg-slate-950 text-white font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Enviar comprobante
          </button>
        </div>
      )}
      {children}
    </>
  );
}
