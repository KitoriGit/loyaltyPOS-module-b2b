import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { TerminalPOS } from './screens/TerminalPOS';
import { ProgramConfig } from './screens/ProgramConfig';
import { CRM } from './screens/CRM';
import { Dashboard } from './screens/Dashboard';

function App() {
  return (
    <BrowserRouter>
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
