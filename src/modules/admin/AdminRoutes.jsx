import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminShell from './components/AdminShell';
import AdminDashboard from './pages/AdminDashboard';
import AdminNotasDashboard from './pages/Notas/AdminNotasDashboard';
import AdminNotaDetails from './pages/Notas/AdminNotaDetails';
import AdminDocumentosDashboard from './pages/Documentos/AdminDocumentosDashboard';
import AdminDocumentoDetails from './pages/Documentos/AdminDocumentoDetails';
import AdminPagamentosDashboard from './pages/Pagamentos/AdminPagamentosDashboard';
import AdminPagamentoForm from './pages/Pagamentos/AdminPagamentoForm';
import AdminPagamentoDetails from './pages/Pagamentos/AdminPagamentoDetails';
import AdminProcessosDashboard from './pages/Processos/AdminProcessosDashboard';
import AdminProcessoDetails from './pages/Processos/AdminProcessoDetails';
import { EmptyState } from '../shared/components/SharedComponents';

// Componente temporário para sub-rotas preparadas
const AdminPlaceholder = ({ title }) => (
  <div>
    <h1 className="portal-h1">{title}</h1>
    <EmptyState 
      title="Em Breve" 
      description="Módulo em preparação para próximas etapas." 
    />
  </div>
);

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminShell />}>
        <Route index element={<AdminDashboard />} />
        <Route path="clientes" element={<AdminPlaceholder title="Gestão de Clientes" />} />
        <Route path="processos" element={<AdminProcessosDashboard />} />
        <Route path="processos/:id" element={<AdminProcessoDetails />} />
        <Route path="documentos" element={<AdminDocumentosDashboard />} />
        <Route path="documentos/:id" element={<AdminDocumentoDetails />} />
        <Route path="pagamentos" element={<AdminPagamentosDashboard />} />
        <Route path="pagamentos/nova" element={<AdminPagamentoForm />} />
        <Route path="pagamentos/:id" element={<AdminPagamentoDetails />} />
        <Route path="notas" element={<AdminNotasDashboard />} />
        <Route path="notas/:id" element={<AdminNotaDetails />} />
        <Route path="marketplace" element={<AdminPlaceholder title="Integrações de Lojas" />} />
        <Route path="configuracoes" element={<AdminPlaceholder title="Configurações do Sistema" />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
