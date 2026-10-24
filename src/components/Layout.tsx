import { useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Coffee,
  Settings,
  Users,
  BarChart3,
  Moon,
  Sun,
  LogOut,
  Store,
  Building2,
  UserCheck,
  QrCode,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useLoyaltyStore } from '../store/useLoyaltyStore';
import { StorefrontQrModal } from './StorefrontQrModal';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { tenantName, currentBranch, branches, user, userType, workspaceId, signOut, setCurrentBranch } = useAuthStore();
  const isDarkMode = useLoyaltyStore((state) => state.isDarkMode);
  const toggleDarkMode = useLoyaltyStore((state) => state.toggleDarkMode);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const getNavClasses = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center justify-between px-space-md py-space-sm rounded-xl transition-all ${
      isActive
        ? 'bg-primary text-on-primary font-semibold shadow-sm'
        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
    }`;

  const getBottomNavClasses = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl transition-all flex-1 ${
      isActive
        ? 'text-primary bg-primary/10 font-bold'
        : 'text-on-surface-variant hover:text-on-surface font-medium'
    }`;

  const renderSidebarContent = (onNavigate?: () => void) => (
    <>
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
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">Online</span>
            </div>
            {onNavigate && (
              <button
                type="button"
                onClick={onNavigate}
                aria-label="Cerrar menú"
                className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Menú de Navegación */}
        <div className="px-space-md py-space-md">
          <nav className="flex flex-col gap-space-xs">
            <NavLink to="/" className={getNavClasses} onClick={onNavigate} end>
              <div className="flex items-center gap-space-md">
                <Coffee className="w-5 h-5 shrink-0" />
                <span className="font-sans text-sm">Terminal POS</span>
              </div>
            </NavLink>
            <NavLink to="/config" className={getNavClasses} onClick={onNavigate}>
              <div className="flex items-center gap-space-md">
                <Settings className="w-5 h-5 shrink-0" />
                <span className="font-sans text-sm">Configuración del Programa</span>
              </div>
            </NavLink>
            <NavLink to="/crm" className={getNavClasses} onClick={onNavigate}>
              <div className="flex items-center gap-space-md">
                <Users className="w-5 h-5 shrink-0" />
                <span className="font-sans text-sm">CRM de Clientes</span>
              </div>
            </NavLink>
            <NavLink to="/dashboard" className={getNavClasses} onClick={onNavigate}>
              <div className="flex items-center gap-space-md">
                <BarChart3 className="w-5 h-5 shrink-0" />
                <span className="font-sans text-sm">Dashboard de Estadísticas</span>
              </div>
            </NavLink>

            {/* Botón Destacado: Cartel QR Mostrador */}
            <div className="pt-2 mt-1 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => {
                  if (onNavigate) onNavigate();
                  setIsQrModalOpen(true);
                }}
                className="w-full flex items-center justify-between px-space-md py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 transition-all font-semibold text-xs cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>Cartel QR Mostrador</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-[10px] uppercase font-mono font-bold">
                  Imprimir
                </span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Footer del Sidebar con info de usuario, theme toggle y logout */}
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
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-space-md py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors cursor-pointer border border-outline-variant/40"
          >
            <div className="flex items-center gap-space-sm">
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              ) : (
                <Moon className="w-4 h-4 text-on-surface-variant" />
              )}
              <span className="font-sans text-xs font-medium">
                {isDarkMode ? 'Modo Día (Claro)' : 'Modo Noche (Oscuro)'}
              </span>
            </div>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container font-bold text-on-surface-variant">
              {isDarkMode ? 'ON' : 'OFF'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => signOut()}
            className="w-full flex items-center justify-between px-space-md py-2.5 rounded-xl text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-space-sm">
              <LogOut className="w-4 h-4 transition-colors group-hover:text-on-error-container" />
              <span className="font-sans text-xs font-semibold">Cerrar Sesión</span>
            </div>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="bg-surface font-sans text-on-surface antialiased min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar Fija en Desktop (lg:flex) */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex-col justify-between border-r border-outline-variant/60 shadow-[0_1px_8px_rgba(44,30,20,0.03)]">
        {renderSidebarContent()}
      </aside>

      {/* Drawer Lateral para Móvil y Tablet (< lg) */}
      {isMobileDrawerOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] h-full bg-surface-container-lowest z-10 flex flex-col justify-between border-r border-outline-variant/60 shadow-2xl animate-in slide-in-from-left duration-200">
            {renderSidebarContent(() => setIsMobileDrawerOpen(false))}
          </aside>
        </div>
      )}

      {/* Contenido Principal */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen min-w-0">
        <header className="sticky top-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-outline-variant/50 z-40 flex items-center justify-between px-4 md:px-8 shadow-[0_1px_4px_rgba(44,30,20,0.02)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              aria-label="Abrir menú de navegación"
              className="lg:hidden p-2 -ml-1 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline-variant/50 cursor-pointer active:scale-95 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <Building2 className="w-4 h-4 text-primary shrink-0 hidden sm:inline" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0">
                <span className="font-display font-bold text-sm text-on-surface lg:hidden leading-tight">
                  Loyalty<span className="text-secondary">POS</span>
                </span>
                <span className="font-sans text-[11px] sm:text-xs font-bold uppercase tracking-wider text-on-surface-variant truncate max-w-[140px] sm:max-w-[240px]">
                  {tenantName || 'Craft Specialty Terminal'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-space-md shrink-0">
            {/* Botón QR en Header para acceso rápido */}
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 text-xs font-semibold text-on-surface transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <QrCode className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">QR Clientes</span>
            </button>

            {/* Theme Toggle Sun / Moon Tactile Button in Header */}
            <button
              type="button"
              onClick={toggleDarkMode}
              title={isDarkMode ? 'Cambiar a Modo Día (Luz)' : 'Cambiar a Modo Noche (Espresso Vault)'}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 text-on-surface transition-all cursor-pointer shadow-xs active:scale-95"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 fill-amber-400/30" />
                  <span className="font-sans text-xs font-semibold hidden md:inline">Modo Día</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-secondary" />
                  <span className="font-sans text-xs font-semibold hidden md:inline">Modo Noche</span>
                </>
              )}
            </button>

            {branches.length > 1 ? (
              <div className="hidden sm:flex items-center gap-2">
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
              <div className="hidden md:flex items-center gap-space-sm text-on-surface-variant px-3 py-1 rounded-lg bg-surface-container-low/70 border border-outline-variant/40">
                <Store className="w-4 h-4 text-secondary" />
                <span className="font-mono text-xs text-on-surface font-semibold">
                  {currentBranch?.name || 'Sucursal Principal'} {currentBranch?.code ? `(${currentBranch.code})` : ''}
                </span>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 w-full p-4 md:p-8 pb-24 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Barra de Navegación Inferior Táctil para Móvil / Tablet (< lg) */}
      <nav
        aria-label="Navegación principal móvil"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-outline-variant/60 px-2 py-1.5 flex items-center justify-around gap-1 shadow-[0_-2px_12px_rgba(44,30,20,0.06)] print:hidden"
      >
        <NavLink to="/" className={getBottomNavClasses} end>
          <Coffee className="w-5 h-5" />
          <span className="font-sans text-[11px] leading-none">Caja POS</span>
        </NavLink>
        <NavLink to="/crm" className={getBottomNavClasses}>
          <Users className="w-5 h-5" />
          <span className="font-sans text-[11px] leading-none">Clientes</span>
        </NavLink>
        <NavLink to="/dashboard" className={getBottomNavClasses}>
          <BarChart3 className="w-5 h-5" />
          <span className="font-sans text-[11px] leading-none">Analíticas</span>
        </NavLink>
        <NavLink to="/config" className={getBottomNavClasses}>
          <Settings className="w-5 h-5" />
          <span className="font-sans text-[11px] leading-none">Config.</span>
        </NavLink>
      </nav>

      {/* Modal de Cartel QR de Mostrador */}
      <StorefrontQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        workspaceId={workspaceId || ''}
        tenantName={tenantName || 'Nuestro Comercio'}
      />
    </div>
  );
}
