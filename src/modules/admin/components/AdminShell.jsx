import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { LayoutDashboard, Users, FileText, CreditCard, ShoppingBag, Settings, LogOut } from 'lucide-react';
import '../../shared/portal.css';

const adminNavItems = [
  { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} />, exact: true },
  { path: '/admin/clientes', label: 'Clientes', icon: <Users size={20} /> },
  { path: '/admin/processos', label: 'Processos', icon: <FileText size={20} /> },
  { path: '/admin/documentos', label: 'Documentos', icon: <FileText size={20} /> },
  { path: '/admin/pagamentos', label: 'Pagamentos', icon: <CreditCard size={20} /> },
  { path: '/admin/notas', label: 'Notas Fiscais', icon: <FileText size={20} /> },
  { path: '/admin/marketplace', label: 'Lojas & Integrações', icon: <ShoppingBag size={20} /> },
  { path: '/admin/configuracoes', label: 'Configurações', icon: <Settings size={20} /> },
];

export const AdminShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/area-cliente/login');
  };

  return (
    <div className="portal-layout">
      {/* Sidebar Admin */}
      <aside className="portal-sidebar" style={{ borderRightColor: 'var(--portal-purple-light)' }}>
        <div className="portal-sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/logo.png" alt="Tu Socio" style={{ height: '28px' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--portal-purple)', letterSpacing: '0.05em' }}>ADMIN</span>
        </div>
        
        <nav className="portal-sidebar-nav">
          <NavLink to="/admin" end className={({ isActive }) => `portal-nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Inicio
          </NavLink>
          <NavLink to="/admin/clientes" className={({ isActive }) => `portal-nav-item ${isActive ? 'active' : ''}`}>
            <Users size={20} /> Clientes
          </NavLink>
          <NavLink to="/admin/processos" className={({ isActive }) => `portal-nav-item ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Procesos
          </NavLink>
          <NavLink to="/admin/documentos" className={({ isActive }) => `portal-nav-item ${isActive ? 'active' : ''}`}>
            <FileText size={20} /> Documentos
          </NavLink>
          <NavLink to="/admin/pagamentos" className={({ isActive }) => `portal-nav-item ${isActive ? 'active' : ''}`}>
            <CreditCard size={20} /> Pagos
          </NavLink>
          <NavLink to="/admin/notas" className={({ isActive }) => `portal-nav-item ${isActive ? 'active' : ''}`}>
            <FileText size={20} /> Notas
          </NavLink>
          <NavLink to="/admin/marketplace" className={({ isActive }) => `portal-nav-item ${isActive ? 'active' : ''}`}>
            <ShoppingBag size={20} /> Marketplace
          </NavLink>
          <NavLink to="/admin/configuracoes" className={({ isActive }) => `portal-nav-item ${isActive ? 'active' : ''}`}>
            <Settings size={20} /> Configurações
          </NavLink>
        </nav>
        
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--portal-border)' }}>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--portal-purple)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user.nome ? user.nome.charAt(0).toUpperCase() : 'A'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.nome}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>{user.email}</div>
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="portal-btn portal-btn-ghost portal-btn-full" style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem' }}>
            <LogOut size={20} style={{ marginRight: '0.5rem' }} />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="portal-main" style={{ backgroundColor: '#F1F5F9' }}>
        {/* Mobile Header (Admin usually doesn't need bottom nav, so a top bar is better) */}
        <div className="admin-mobile-header" style={{ display: 'none', padding: '1rem', backgroundColor: 'var(--portal-surface)', borderBottom: '1px solid var(--portal-border)', marginBottom: '1.5rem' }}>
          <img src="/logo.png" alt="Tu Socio" style={{ height: '24px' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--portal-purple)', marginLeft: '0.5rem' }}>ADMIN</span>
        </div>
        <style>{`
          @media (max-width: 1023px) {
            .admin-mobile-header { display: flex !important; align-items: center; }
          }
        `}</style>
        
        <Outlet />
      </main>
    </div>
  );
};

export default AdminShell;
