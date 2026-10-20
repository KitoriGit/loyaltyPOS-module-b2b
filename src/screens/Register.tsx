import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Coffee,
  Lock,
  Mail,
  Loader2,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password || !confirmPassword) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    setIsSubmitting(true);

    const { error, data } = await signUp(trimmedEmail, password);

    if (error) {
      setErrorMsg(
        error.message === 'User already registered'
          ? 'Este correo ya se encuentra registrado. Intenta iniciar sesión.'
          : error.message || 'Error al crear la cuenta.'
      );
      setIsSubmitting(false);
      return;
    }

    // Si Supabase requiere confirmación por email (no devuelve sesión directa)
    if (data && !data.session) {
      setSuccessMsg(
        '¡Cuenta creada exitosamente! Hemos enviado un enlace de confirmación a tu correo. Revisa tu bandeja de entrada o la carpeta de spam para activar tu cuenta.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-outline-variant/30 overflow-hidden">
        {/* Header con branding */}
        <div className="p-8 bg-gradient-to-b from-amber-500/10 to-transparent border-b border-outline-variant/40 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-sm mb-4">
            <Coffee className="w-7 h-7 text-on-primary" />
          </div>
          <h1 className="font-display font-bold text-2xl text-on-surface">Crear Cuenta</h1>
          <p className="font-sans text-sm text-on-surface-variant mt-1">
            Empieza a fidelizar clientes con LoyaltyPOS
          </p>
          <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 font-mono text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
            Acceso para Dueños & Comercios
          </div>
        </div>

        {/* Formulario */}
        <div className="p-8 flex flex-col gap-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-error-container/40 border border-error/30 text-on-error-container text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-error mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg ? (
            <div className="p-5 rounded-2xl bg-secondary-container/30 border border-secondary/30 flex flex-col items-center text-center gap-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-on-surface">¡Registro Exitoso!</h3>
              <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                {successMsg}
              </p>
              <Link
                to="/login"
                className="mt-2 py-2.5 px-6 rounded-xl bg-primary text-on-primary font-sans font-semibold text-xs hover:opacity-95 transition-all shadow-sm"
              >
                Volver a Iniciar Sesión
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                    placeholder="comercio@ejemplo.com"
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
                    placeholder="Mínimo 6 caracteres"
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

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                    required
                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-surface-container-low/60 border border-outline-variant/50 focus:border-primary focus:bg-surface-container-lowest focus:outline-none transition-all text-sm font-sans text-on-surface"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors p-1"
                    title={showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
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
                    <span>Creando tu cuenta...</span>
                  </>
                ) : (
                  <>
                    <span>Registrar Comercio</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center font-sans text-xs text-on-surface-variant pt-3 border-t border-outline-variant/20">
                ¿Ya tienes una cuenta registrada?{' '}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Inicia sesión aquí
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
