import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Home, FileText, CreditCard, LayoutList, MoreHorizontal, LogOut, MessageCircle, User, Box } from 'lucide-react';
import '../../shared/portal.css';

const navItems = [
  { path: '/area-cliente', label: 'Inicio', icon: <Home size={20} />, exact: true },
  { path: '/area-cliente/processos', label: 'Procesos', icon: <FileText size={20} /> },
  { path: '/area-cliente/documentos', label: 'Documentos', icon: <FileText size={20} /> },
  { path: '/area-cliente/pagamentos', label: 'Pagos', icon: <CreditCard size={20} /> },
  { path: '/area-cliente/notas', label: 'Notas Fiscales', icon: <FileText size={20} /> },
  { path: '/area-cliente/marketplace', label: 'Marketplace', icon: <Box size={20} /> },
  { path: '/area-cliente/perfil', label: 'Perfil', icon: <User size={20} /> },
];

export const PortalShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/area-cliente/login');
  };

  return (
    <div className="portal-layout">
      {/* Sidebar (Desktop) */}
      <aside className="portal-sidebar">
        <div className="portal-sidebar-header">
          <img src="/logo.png" alt="Tu Socio" style={{ height: '32px' }} />
        </div>
        
        <nav className="portal-sidebar-nav">
          <NavLink to="/area-cliente" end className={({ isActive }) => `portal-nav-item ${isActive ? 'active' : ''}`}>
            <Home size={20} /> Inicio
          </NavLink>
          <NavLink to="/area-cliente/processos" className={({ isActive }) => `portal-nav-item ${isActive ? 'active' : ''}`}>
            <LayoutList size={20} /> Procesos
          </NavLink>
          <NavLink to="/area-cliente/documentos" className={({ isActive }) => `portal-nav-item ${isActive ? 'active' : ''}`}>
            <FileText size={20} /> Documentos
          </NavLink>
          <NavLink to="/area-cliente/pagamentos" className={({ isActive }) => `portal-nav-item ${isActive ? 'active' : ''}`}>
            <CreditCard size={20} /> Pagos
          </NavLink>
        </nav>
        
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--portal-border)' }}>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--portal-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.nome}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)', textTransform: 'capitalize' }}>{user.role}</div>
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="portal-btn portal-btn-ghost portal-btn-full" style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem' }}>
            <LogOut size={20} style={{ marginRight: '0.5rem' }} />
            Salir
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="portal-main">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="portal-mobile-nav">
        <NavLink to="/area-cliente" end className={({ isActive }) => `portal-mobile-item ${isActive ? 'active' : ''}`}>
          <Home size={24} />
          <span>Inicio</span>
        </NavLink>
        <NavLink to="/area-cliente/processos" className={({ isActive }) => `portal-mobile-item ${isActive ? 'active' : ''}`}>
          <LayoutList size={24} />
          <span>Procesos</span>
        </NavLink>
        <NavLink to="/area-cliente/documentos" className={({ isActive }) => `portal-mobile-item ${isActive ? 'active' : ''}`}>
          <FileText size={24} />
          <span>Documentos</span>
        </NavLink>
        <NavLink to="/area-cliente/pagamentos" className={({ isActive }) => `portal-mobile-item ${isActive ? 'active' : ''}`}>
          <CreditCard size={24} />
          <span>Pagos</span>
        </NavLink>
        <div onClick={handleLogout} className="portal-mobile-item" style={{ cursor: 'pointer' }}>
          <MoreHorizontal size={24} />
          <span>Más</span>
        </div>
      </nav>
      
      {/* Floating Support Button for Desktop */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', display: 'none', zIndex: 100 }} className="desktop-support-btn">
        <button className="portal-btn portal-btn-primary" style={{ borderRadius: '99px', padding: '1rem' }}>
          <MessageCircle size={24} />
        </button>
      </div>
      <style>{`
        @media (min-width: 1024px) {
          .desktop-support-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
};

export default PortalShell;
