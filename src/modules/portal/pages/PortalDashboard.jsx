import React, { useEffect, useState } from 'react';
import { getPortalDashboard } from '../fakeServices';
import { DashboardMetricCard, ProcessCard, DocumentCard, PrimaryButton, SecondaryButton, NextStepCard, EmptyState, LoadingState } from '../../shared/components/SharedComponents';
import { FileText, CreditCard, Activity, Upload, Plus } from 'lucide-react';

export const PortalDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortalDashboard().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingState message="Cargando tu información..." />;
  }

  return (
    <div>
      <div className="portal-flex portal-justify-between portal-items-center portal-mb-8">
        <div>
          <h1 className="portal-h1">Hola, {data.cliente.nome.split(' ')[0]}</h1>
          <p className="portal-subtitle" style={{ marginBottom: 0 }}>
            Acompaña tus procesos en un solo lugar.
          </p>
        </div>
        <div className="portal-flex portal-gap-4" style={{ display: 'none' }} id="desktop-actions">
          <SecondaryButton><Upload size={18} /> Enviar documento</SecondaryButton>
          <PrimaryButton><Plus size={18} /> Solicitar nota fiscal</PrimaryButton>
        </div>
        <style>{`
          @media (min-width: 768px) {
            #desktop-actions { display: flex !important; }
          }
        `}</style>
      </div>

      {data.proximaAcao && (
        <div className="portal-mb-8">
          <NextStepCard 
            title="Próximo paso"
            description={data.proximaAcao.mensagem}
            buttonText="Resolver ahora"
            onClick={() => {}}
          />
        </div>
      )}

      {/* Metrics Grid */}
      <div className="portal-grid portal-grid-3 portal-mb-8">
        <DashboardMetricCard 
          title="Procesos Activos" 
          value={data.processosAtivos.length} 
          icon={<Activity size={24} />} 
          subtitle="En andamento"
        />
        <DashboardMetricCard 
          title="Documentos Pendientes" 
          value={data.documentosPendentes.length} 
          icon={<FileText size={24} />} 
          subtitle="Acción necesaria"
        />
        <DashboardMetricCard 
          title="Pagos Pendientes" 
          value={data.pagamentosPendentes.length} 
          icon={<CreditCard size={24} />} 
          subtitle="Facturas abiertas"
        />
      </div>

      {/* Content Grid */}
      <div className="portal-grid portal-grid-2">
        <div>
          <div className="portal-flex portal-justify-between portal-items-center portal-mb-4">
            <h3 className="portal-h3" style={{ marginBottom: 0 }}>Procesos Recientes</h3>
            <a href="/portal/processos" style={{ fontSize: '0.875rem', color: 'var(--portal-primary)', textDecoration: 'none', fontWeight: 500 }}>Ver todos</a>
          </div>
          <div className="portal-flex-col portal-gap-4">
            {data.processosAtivos.length > 0 ? (
              data.processosAtivos.map(proc => <ProcessCard key={proc.id} processo={proc} />)
            ) : (
              <EmptyState title="Sin procesos" description="No tienes procesos activos en este momento." />
            )}
          </div>
        </div>

        <div>
          <div className="portal-flex portal-justify-between portal-items-center portal-mb-4">
            <h3 className="portal-h3" style={{ marginBottom: 0 }}>Documentos Pendientes</h3>
            <a href="/portal/documentos" style={{ fontSize: '0.875rem', color: 'var(--portal-primary)', textDecoration: 'none', fontWeight: 500 }}>Ver todos</a>
          </div>
          <div className="portal-flex-col portal-gap-4">
            {data.documentosPendentes.length > 0 ? (
              data.documentosPendentes.map(doc => <DocumentCard key={doc.id} documento={doc} />)
            ) : (
              <EmptyState title="Todo al día" description="No tienes documentos pendientes por enviar." />
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Actions (Visible only on mobile) */}
      <div className="portal-flex-col portal-gap-4 portal-mt-4" id="mobile-actions">
        <PrimaryButton style={{ width: '100%' }}><Plus size={18} /> Solicitar nota fiscal</PrimaryButton>
        <SecondaryButton style={{ width: '100%' }}><Upload size={18} /> Enviar documento</SecondaryButton>
      </div>
      <style>{`
        @media (min-width: 768px) {
          #mobile-actions { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default PortalDashboard;
