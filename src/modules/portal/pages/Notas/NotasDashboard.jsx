import React, { useEffect, useState } from 'react';
import { getClienteNotas } from '../../fakeServices';
import { useAuth } from '../../../auth/AuthContext';
import { LoadingState, EmptyState, PrimaryButton } from '../../../shared/components/SharedComponents';
import { NotaFiscalCard } from '../../../shared/components/NotaFiscalCard';
import { Plus, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotasDashboard = () => {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      getClienteNotas(user.id).then((res) => {
        setNotas(res);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) {
    return <LoadingState message="Cargando tus notas fiscales..." />;
  }

  return (
    <div>
      <div className="portal-flex portal-justify-between portal-items-center portal-mb-8">
        <div>
          <h1 className="portal-h1">Mis notas fiscales</h1>
          <p className="portal-subtitle" style={{ marginBottom: 0 }}>
            Solicita, acompaña y revisa el estado de tus notas en un solo lugar.
          </p>
        </div>
        <div id="desktop-actions" style={{ display: 'none' }}>
          <PrimaryButton onClick={() => navigate('/area-cliente/notas/nova')}>
            <Plus size={18} /> Solicitar nota fiscal
          </PrimaryButton>
        </div>
        <style>{`
          @media (min-width: 768px) {
            #desktop-actions { display: block !important; }
          }
        `}</style>
      </div>

      <div className="portal-flex-col portal-gap-4">
        {notas.length > 0 ? (
          notas.map(nota => <NotaFiscalCard key={nota.id} nota={nota} baseUrl="/portal/notas" />)
        ) : (
          <EmptyState 
            title="Aún no tienes notas" 
            description="No has solicitado ninguna nota fiscal hasta el momento. Haz clic en el botón abajo para comenzar." 
            icon={<FileText size={32} />}
          />
        )}
      </div>

      <div id="mobile-actions" className="portal-mt-6" style={{ display: 'block' }}>
        <PrimaryButton fullWidth onClick={() => navigate('/area-cliente/notas/nova')}>
          <Plus size={18} /> Solicitar nota fiscal
        </PrimaryButton>
      </div>
      <style>{`
        @media (min-width: 768px) {
          #mobile-actions { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default NotasDashboard;
