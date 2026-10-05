import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Monitor,
  Settings,
  Users,
  BarChart3,
  Moon,
  LogOut,
  Store
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const getNavClasses = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center justify-between px-space-md py-space-sm rounded-xl transition-colors ${isActive
      ? 'bg-primary-container text-on-primary shadow-[0_1px_8px_rgba(0,0,0,0.04)]'
      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
    }`;

  return (
    <div className="bg-surface font-sans text-on-surface antialiased min-h-screen flex">
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col">
          <div className="h-16 px-space-lg flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center">
                <Monitor className="text-on-primary w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-semibold text-lg text-on-surface leading-none">LoyaltyPOS</span>
                <span className="font-mono text-xs text-on-surface-variant leading-tight">Assistant Pro</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="font-mono text-xs text-secondary font-medium">Online</span>
            </div>
          </div>
          <div className="px-space-md py-space-sm">
            <nav className="flex flex-col gap-space-xs">
              <NavLink to="/" className={getNavClasses} end>
                <div className="flex items-center gap-space-md">
                  <Monitor className="w-5 h-5" />
                  <span className="font-sans text-sm font-medium">Terminal POS</span>
                </div>
              </NavLink>
              <NavLink to="/config" className={getNavClasses}>
                <div className="flex items-center gap-space-md">
                  <Settings className="w-5 h-5" />
                  <span className="font-sans text-sm font-medium">Configuración del Programa</span>
                </div>
              </NavLink>
              <NavLink to="/crm" className={getNavClasses}>
                <div className="flex items-center gap-space-md">
                  <Users className="w-5 h-5" />
                  <span className="font-sans text-sm font-medium">CRM de Clientes</span>
                </div>
              </NavLink>
              <NavLink to="/dashboard" className={getNavClasses}>
                <div className="flex items-center gap-space-md">
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-sans text-sm font-medium">Dashboard de Estadísticas</span>
                </div>
              </NavLink>
            </nav>
          </div>
        </div>
        <div className="p-space-md flex flex-col gap-space-sm">
          <div className="flex flex-col gap-space-xs">
            <button type="button" className="w-full flex items-center justify-between px-space-md py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-colors">
              <div className="flex items-center gap-space-sm">
                <Moon className="w-5 h-5 text-on-surface-variant" />
                <span className="font-sans text-sm">Modo Oscuro</span>
              </div>
            </button>
            <button type="button" className="w-full flex items-center justify-between px-space-md py-2.5 rounded-xl text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors group">
              <div className="flex items-center gap-space-sm">
                <LogOut className="w-5 h-5 transition-colors group-hover:text-on-error-container" />
                <span className="font-sans text-sm font-medium">Cerrar Sesión</span>
              </div>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 ml-72 flex flex-col min-h-screen">
        <header className="sticky top-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-lg">
          <div className="flex items-center gap-space-md"></div>
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-sm text-on-surface-variant">
              <Store className="w-4 h-4" />
              <span className="font-mono text-sm text-on-surface">Sucursal Centro (P-04)</span>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full p-space-lg">
          {children}
        </main>
      </div>
    </div>
  );
}
