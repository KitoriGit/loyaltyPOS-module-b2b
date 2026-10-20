import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Coffee,
  Settings,
  Users,
  BarChart3,
  Moon,
  LogOut,
  Store,
  Building2,
  UserCheck
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { tenantName, currentBranch, branches, user, userType, signOut, setCurrentBranch } = useAuthStore();

  const getNavClasses = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center justify-between px-space-md py-space-sm rounded-xl transition-all ${isActive
      ? 'bg-primary text-on-primary font-semibold shadow-sm'
      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
    }`;

  return (
    <div className="bg-surface font-sans text-on-surface antialiased min-h-screen flex">
      {/* Sidebar Fija con estética Warm Specialty Craft */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex flex-col justify-between border-r border-outline-variant/60 shadow-[0_1px_8px_rgba(44,30,20,0.03)]">
        <div className="flex flex-col">
          {/* Logo y Branding */}
          <div className="h-16 px-space-lg flex items-center justify-between border-b border-outline-variant/50">
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs">
                <Coffee className="w-5 h-5 text-on-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg text-on-surface leading-tight tracking-tight">
                  Loyalty<span className="text-secondary">POS</span>
                </span>
                <span className="font-mono text-[11px] text-on-surface-variant leading-tight truncate max-w-[120px]">
                  {tenantName || 'Craft Specialty'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span className="font-mono text-[11px] text-emerald-800 font-semibold">Online</span>
            </div>
          </div>

          {/* Menú de Navegación */}
          <div className="px-space-md py-space-md">
            <nav className="flex flex-col gap-space-xs">
              <NavLink to="/" className={getNavClasses} end>
                <div className="flex items-center gap-space-md">
                  <Coffee className="w-5 h-5 shrink-0" />
                  <span className="font-sans text-sm">Terminal POS</span>
                </div>
              </NavLink>
              <NavLink to="/config" className={getNavClasses}>
                <div className="flex items-center gap-space-md">
                  <Settings className="w-5 h-5 shrink-0" />
                  <span className="font-sans text-sm">Configuración del Programa</span>
                </div>
              </NavLink>
              <NavLink to="/crm" className={getNavClasses}>
                <div className="flex items-center gap-space-md">
                  <Users className="w-5 h-5 shrink-0" />
                  <span className="font-sans text-sm">CRM de Clientes</span>
                </div>
              </NavLink>
              <NavLink to="/dashboard" className={getNavClasses}>
                <div className="flex items-center gap-space-md">
                  <BarChart3 className="w-5 h-5 shrink-0" />
                  <span className="font-sans text-sm">Dashboard de Estadísticas</span>
                </div>
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Footer del Sidebar con info de usuario y logout */}
        <div className="p-space-md flex flex-col gap-space-sm border-t border-outline-variant/50">
          {/* Card de Usuario Activo */}
          <div className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface shrink-0">
              <UserCheck className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-sans text-xs font-semibold text-on-surface truncate">
                {user?.email || 'Cajero en turno'}
              </span>
              <span className="font-mono text-[10px] text-on-surface-variant capitalize">
                {userType === 'owner' ? 'Dueño del Negocio' : 'Cajero / Mostrador'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-space-xs">
            <button
              type="button"
              className="w-full flex items-center justify-between px-space-md py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors"
            >
              <div className="flex items-center gap-space-sm">
                <Moon className="w-4 h-4 text-on-surface-variant" />
                <span className="font-sans text-xs font-medium">Modo Nocturno</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => signOut()}
              className="w-full flex items-center justify-between px-space-md py-2.5 rounded-xl text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors group"
            >
              <div className="flex items-center gap-space-sm">
                <LogOut className="w-4 h-4 transition-colors group-hover:text-on-error-container" />
                <span className="font-sans text-xs font-semibold">Cerrar Sesión</span>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 ml-72 flex flex-col min-h-screen">
        <header className="sticky top-0 h-16 bg-surface-container-lowest/85 backdrop-blur-xl border-b border-outline-variant/50 z-40 flex items-center justify-between px-space-lg shadow-[0_1px_4px_rgba(44,30,20,0.02)]">
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-on-surface-variant" />
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                {tenantName || 'Craft Specialty Terminal'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-md">
            {branches.length > 1 ? (
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-on-surface-variant" />
                <select
                  value={currentBranch?.id || ''}
                  onChange={(e) => {
                    const b = branches.find((item) => item.id === e.target.value);
                    if (b) setCurrentBranch(b);
                  }}
                  className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-2.5 py-1 text-xs font-mono text-on-surface focus:outline-none focus:border-primary"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} {b.code ? `(${b.code})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-space-sm text-on-surface-variant px-3 py-1 rounded-lg bg-surface-container-low/70 border border-outline-variant/40">
                <Store className="w-4 h-4 text-secondary" />
                <span className="font-mono text-xs text-on-surface font-semibold">
                  {currentBranch?.name || 'Sucursal Principal'} {currentBranch?.code ? `(${currentBranch.code})` : ''}
                </span>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 w-full p-space-lg">
          {children}
        </main>
      </div>
    </div>
  );
}
