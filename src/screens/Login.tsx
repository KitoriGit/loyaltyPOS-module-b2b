import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Lock, Mail, Loader2, ArrowRight, AlertCircle, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg('Por favor completa tu correo y contraseña.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const { error } = await signIn(email.trim(), password);

    if (error) {
      setErrorMsg(
        error.message === 'Invalid login credentials'
          ? 'Credenciales incorrectas. Verifica tu email y contraseña.'
          : error.message
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/30 overflow-hidden">
        {/* Header con gradiente suave y branding */}
        <div className="p-8 bg-gradient-to-b from-primary-container/10 to-transparent border-b border-outline-variant/20 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary shadow-md mb-4">
            <Monitor className="w-7 h-7" />
          </div>
          <h1 className="font-display font-bold text-2xl text-on-surface">LoyaltyPOS</h1>
          <p className="font-sans text-sm text-on-surface-variant mt-1">
            Terminal de Puntos & Fidelización para Comercios
          </p>
          <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-secondary-container/30 text-on-secondary-container font-mono text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Ecosistema Conectado
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-error-container/40 border border-error/30 text-on-error-container text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-error mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@comercio.com"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-container-low/60 border border-outline-variant/50 focus:border-primary focus:bg-surface-container-lowest focus:outline-none transition-all text-sm font-sans text-on-surface"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-11 py-3 rounded-xl bg-surface-container-low/60 border border-outline-variant/50 focus:border-primary focus:bg-surface-container-lowest focus:outline-none transition-all text-sm font-sans text-on-surface"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors p-1"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4.5 h-4.5" />
                ) : (
                  <Eye className="w-4.5 h-4.5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-primary-container text-on-primary font-sans font-semibold text-sm hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Ingresando al sistema...</span>
              </>
            ) : (
              <>
                <span>Iniciar Turno en POS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Enlace para registrar nueva cuenta */}
          <div className="text-center font-sans text-xs text-on-surface-variant pt-3 border-t border-outline-variant/20 flex flex-col gap-1.5">
            <div>
              ¿No tienes una cuenta aún?{' '}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                Crear cuenta de comercio
              </Link>
            </div>
            <p className="text-[11px] text-on-surface-variant/70">
              Válido para dueños y usuarios de terminales del ecosistema.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
