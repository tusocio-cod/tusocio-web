import React, { useEffect, useState } from 'react';
import { getAdminOverview } from '../../portal/fakeServices';
import { DashboardMetricCard, ActionCard, LoadingState } from '../../shared/components/SharedComponents';
import { FileText, CreditCard, Activity, Bell, FileSearch, CheckSquare } from 'lucide-react';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminOverview().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingState message="Cargando datos del panel..." />;
  }

  return (
    <div>
      <div className="portal-flex portal-justify-between portal-items-center portal-mb-8">
        <div>
          <h1 className="portal-h1">Visão Geral</h1>
          <p className="portal-subtitle" style={{ marginBottom: 0 }}>
            Resumo das atividades da plataforma.
          </p>
        </div>
      </div>

      <div className="portal-grid portal-grid-3 portal-mb-8">
        <DashboardMetricCard 
          title="Solicitações Novas" 
          value={data.solicitacoesNovas.length} 
          icon={<Bell size={24} />} 
          subtitle="Aguardando atendimento"
        />
        <DashboardMetricCard 
          title="Documentos em Análise" 
          value={data.documentosPendentesAnalise.length} 
          icon={<FileText size={24} />} 
          subtitle="Enviados pelos clientes"
        />
        <DashboardMetricCard 
          title="Notas em Revisão" 
          value={data.notasEmRevisao.length} 
          icon={<FileText size={24} />} 
          subtitle="Verificação fiscal"
        />
        <DashboardMetricCard 
          title="Processos em Andamento" 
          value={data.processosEmAndamento.length} 
          icon={<Activity size={24} />} 
        />
        <DashboardMetricCard 
          title="Pagamentos Pendentes" 
          value={data.pagamentosPendentes.length} 
          icon={<CreditCard size={24} />} 
        />
      </div>
      
      <div className="portal-grid portal-grid-2 portal-mt-4">
        <div>
          <h3 className="portal-h3">Prioridades de hoy</h3>
          <div className="portal-flex-col portal-gap-4">
            <ActionCard 
              title="Revisar solicitud de nota" 
              description="María López - Hace 2 horas" 
              icon={<FileSearch size={20} />} 
              onClick={() => {}} 
            />
            <ActionCard 
              title="Validar documento pendiente" 
              description="Empresa XYZ - CNH Socio" 
              icon={<CheckSquare size={20} />} 
              onClick={() => {}} 
            />
            <ActionCard 
              title="Confirmar pago en análisis" 
              description="Mensualidad Abril" 
              icon={<CreditCard size={20} />} 
              onClick={() => {}} 
            />
          </div>
        </div>
        
        <div>
          <h3 className="portal-h3">Alertas del Sistema</h3>
          <div className="portal-card" style={{ borderLeft: '4px solid var(--portal-info)', backgroundColor: 'var(--portal-surface)' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--portal-text-main)', marginBottom: '0.25rem' }}>Actualización de SEFAZ</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>Los servicios de emisión pueden presentar lentitud hoy entre las 14h y 16h.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
