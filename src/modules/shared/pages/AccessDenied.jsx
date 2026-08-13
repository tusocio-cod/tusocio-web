import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { PrimaryButton } from '../components/SharedComponents';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export const AccessDenied = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  
  const isInternal = hasRole(['funcionario', 'contador', 'admin']);

  return (
    <div className="portal-layout portal-flex portal-items-center" style={{ justifyContent: 'center', backgroundColor: '#F8FAFC', padding: '1rem' }}>
      <div className="portal-card" style={{ width: '100%', maxWidth: '420px', textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ display: 'inline-flex', padding: '1.25rem', backgroundColor: 'var(--portal-danger-light)', color: 'var(--portal-danger)', borderRadius: '50%', marginBottom: '1.5rem' }}>
          <AlertTriangle size={32} />
        </div>
        
        <h1 className="portal-h1" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
          {isInternal ? 'Acesso Negado' : 'Acceso Denegado'}
        </h1>
        
        <p style={{ color: 'var(--portal-text-muted)', marginBottom: '2rem' }}>
          {isInternal 
            ? 'Você não tem permissão para acessar esta área.'
            : 'Esta área es solo para el equipo Tu Socio. Puedes volver a tu portal para consultar tus procesos.'
          }
        </p>
        
        <PrimaryButton 
          onClick={() => navigate(isInternal ? '/admin' : '/portal')}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <ArrowLeft size={18} /> {isInternal ? 'Voltar ao Painel' : 'Volver al portal'}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default AccessDenied;
