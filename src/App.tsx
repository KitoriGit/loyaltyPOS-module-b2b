import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { Layout } from './components/Layout';
import { TerminalPOS } from './screens/TerminalPOS';
import { ProgramConfig } from './screens/ProgramConfig';
import { CRM } from './screens/CRM';
import { Dashboard } from './screens/Dashboard';
import { Login } from './screens/Login';
import { useAuthStore } from './store/useAuthStore';
import { useLoyaltyStore } from './store/useLoyaltyStore';

function App() {
  const { session, user, isLoading, initialize, workspaceId } = useAuthStore();
  const fetchInitialData = useLoyaltyStore((state) => state.fetchInitialData);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (workspaceId) {
      fetchInitialData(workspaceId);
    }
  }, [workspaceId, fetchInitialData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="font-sans text-sm text-on-surface-variant font-medium">
          Cargando entorno de LoyaltyPOS...
        </span>
      </div>
    );
  }

  if (!session || !user) {
    return (
      <>
        <Toaster position="bottom-right" />
        <Login />
      </>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="bottom-right" />
      <Layout>
        <Routes>
          <Route path="/" element={<TerminalPOS />} />
          <Route path="/config" element={<ProgramConfig />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
