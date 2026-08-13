import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { PrimaryButton, SecondaryButton } from '../../shared/components/SharedComponents';
import { Lock, Mail, MessageCircle, AlertCircle } from 'lucide-react';
import '../../shared/portal.css';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  
  const { login, isAuthenticated, hasRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const WA_LINK = "https://wa.me/5511952170637?text=Hola%2C%20necesito%20ayuda%20para%20entrar%20al%20portal.";

  // Redirecionamento automático se já estiver logado
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (hasRole(['funcionario', 'contador', 'admin'])) {
        navigate('/admin');
      } else {
        navigate('/area-cliente');
      }
    }
  }, [isAuthenticated, authLoading, hasRole, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(email, password);
      // Redirecionamento baseado no papel mockado
      if (['funcionario', 'contador', 'admin'].includes(user.role)) {
        navigate('/admin');
      } else {
        navigate('/area-cliente');
      }
    } catch (err) {
      setError('Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) return <div className="portal-layout portal-flex portal-items-center" style={{ justifyContent: 'center' }}>Cargando...</div>;

  return (
    <div className="portal-layout portal-flex portal-items-center" style={{ 
      justifyContent: 'center', 
      backgroundColor: 'var(--color-bg-base)', 
      backgroundImage: "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.85)), url('/images/hero/hero-contabilidad.webp')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '1rem' 
    }}>
      <div className="portal-card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem 2rem', backgroundColor: 'rgba(10, 10, 10, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid var(--color-border-subtle)', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo.png" alt="Tu Socio" style={{ height: '60px', margin: '0 auto 1.5rem' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>Entra a tu portal Tu Socio</h1>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0' }}>
            Consulta tus procesos, documentos, pagos y solicitudes en un solo lugar.
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {showForgot ? (
          <div style={{ textAlign: 'center', padding: '1rem 0 2rem' }}>
            <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '50%', marginBottom: '1rem' }}>
              <Lock size={24} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem' }}>¿Olvidaste tu contraseña?</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Por ahora, habla con el equipo Tu Socio para recuperar tu acceso de forma segura.
            </p>
            <PrimaryButton type="button" onClick={() => window.open(WA_LINK, '_blank')} fullWidth style={{ marginBottom: '1rem' }}>
              <MessageCircle size={18} /> Hablar con un asesor
            </PrimaryButton>
            <button 
              onClick={() => setShowForgot(false)}
              style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', width: '100%', padding: '0.75rem', borderRadius: '8px', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Volver al login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'white', marginBottom: '0.5rem' }}>E-mail o teléfono</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-bg-elevated)', color: 'white', fontSize: '0.9rem', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-border-subtle)'}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'white', marginBottom: '0.5rem' }}>Contraseña</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-bg-elevated)', color: 'white', fontSize: '0.9rem', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--color-border-subtle)'}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={() => setShowForgot(true)}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}
              >
                Olvidé mi contraseña
              </button>
            </div>

            <PrimaryButton type="submit" fullWidth style={{ marginTop: '0.5rem' }} loading={isLoading}>
              Entrar al portal
            </PrimaryButton>
          </form>
        )}

        {!showForgot && (
          <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>
              ¿Necesitas ayuda para entrar?
            </p>
            <button 
              type="button" 
              onClick={() => window.open(WA_LINK, '_blank')} 
              style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'transparent', border: '1px solid var(--color-border-subtle)', color: 'white', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <MessageCircle size={18} /> Hablar con un asesor
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
