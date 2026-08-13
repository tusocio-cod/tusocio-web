import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PortalShell from './components/PortalShell';
import PortalDashboard from './pages/PortalDashboard';
import NotasDashboard from './pages/Notas/NotasDashboard';
import NotaForm from './pages/Notas/NotaForm';
import NotaDetails from './pages/Notas/NotaDetails';
import DocumentosDashboard from './pages/Documentos/DocumentosDashboard';
import PagamentosDashboard from './pages/Pagamentos/PagamentosDashboard';
import PagamentoDetails from './pages/Pagamentos/PagamentoDetails';
import DocumentoDetails from './pages/Documentos/DocumentoDetails';
import ProcessosDashboard from './pages/Processos/ProcessosDashboard';
import ProcessoDetails from './pages/Processos/ProcessoDetails';
import { EmptyState } from '../shared/components/SharedComponents';

// Componentes temporários para sub-rotas preparadas
const Placeholder = ({ title }) => (
  <div>
    <h1 className="portal-h1">{title}</h1>
    <EmptyState 
      title="Próximamente" 
      description="Este módulo estará disponible próximamente."
    />
  </div>
);

export const PortalRoutes = () => {
  return (
    <Routes>
      <Route element={<PortalShell />}>
        <Route index element={<PortalDashboard />} />
        <Route path="processos" element={<ProcessosDashboard />} />
        <Route path="processos/:id" element={<ProcessoDetails />} />
        <Route path="documentos" element={<DocumentosDashboard />} />
        <Route path="documentos/:id" element={<DocumentoDetails />} />
        <Route path="pagamentos" element={<PagamentosDashboard />} />
        <Route path="pagamentos/:id" element={<PagamentoDetails />} />
        <Route path="notas" element={<NotasDashboard />} />
        <Route path="notas/nova" element={<NotaForm />} />
        <Route path="notas/:id" element={<NotaDetails />} />
        <Route path="marketplace" element={<Placeholder title="Marketplace" />} />
        <Route path="perfil" element={<Placeholder title="Mi Perfil" />} />
      </Route>
    </Routes>
  );
};

export default PortalRoutes;
