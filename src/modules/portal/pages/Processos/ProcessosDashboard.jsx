import React, { useEffect, useState } from 'react';
import { getClienteProcessos } from '../../fakeServices';
import { useAuth } from '../../../auth/AuthContext';
import { LoadingState, EmptyState, DashboardMetricCard, PrimaryButton } from '../../../shared/components/SharedComponents';
import { ProcessoCard } from '../../../shared/components/ProcessoCard';
import { Briefcase, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProcessosDashboard = () => {
  const [processos, setProcessos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      getClienteProcessos(user.id).then((res) => {
        setProcessos(res);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) return <LoadingState message="Cargando tus procesos..." />;

  const ativos = processos.filter(p => !['concluido', 'cancelado'].includes(p.status)).length;
  const acaoNecessaria = processos.filter(p => ['aguardando_cliente', 'aguardando_pagamento'].includes(p.status)).length;
  const emRevisao = processos.filter(p => ['novo', 'em_analise', 'em_execucao', 'aguardando_orgao_externo'].includes(p.status)).length;
  const concluidos = processos.filter(p => ['concluido'].includes(p.status)).length;

  const filteredProcessos = processos.filter(p => {
    if (filter === 'todos') return true;
    if (filter === 'ativos') return !['concluido', 'cancelado'].includes(p.status);
    if (filter === 'acao_necessaria') return ['aguardando_cliente', 'aguardando_pagamento'].includes(p.status);
    if (filter === 'concluidos') return ['concluido'].includes(p.status);
    return true;
  });

  return (
    <div>
      <div className="portal-flex portal-justify-between portal-items-center portal-mb-8">
        <div>
          <h1 className="portal-h1">Mis procesos</h1>
          <p className="portal-subtitle" style={{ marginBottom: 0 }}>
            Acompaña el avance de tus trámites, documentos, pagos y solicitudes en un solo lugar.
          </p>
        </div>
        <PrimaryButton onClick={() => alert('Abriendo WhatsApp para hablar con un asesor...')}>Hablar con un asesor</PrimaryButton>
      </div>

      <div className="portal-grid portal-grid-4 portal-mb-8">
        <div style={{ cursor: 'pointer' }} onClick={() => setFilter('ativos')}>
          <DashboardMetricCard title="Procesos activos" value={ativos} icon={<Briefcase size={24} />} subtitle="En andamiento" />
        </div>
        <div style={{ cursor: 'pointer' }} onClick={() => setFilter('acao_necessaria')}>
          <DashboardMetricCard title="Esperando mi acción" value={acaoNecessaria} icon={<AlertCircle size={24} style={{ color: 'var(--portal-warning)' }} />} subtitle="Documentos o pagos" />
        </div>
        <div style={{ cursor: 'pointer' }} onClick={() => setFilter('todos')}>
          <DashboardMetricCard title="En revisión" value={emRevisao} icon={<Clock size={24} />} subtitle="Por Tu Socio" />
        </div>
        <div style={{ cursor: 'pointer' }} onClick={() => setFilter('concluidos')}>
          <DashboardMetricCard title="Concluidos" value={concluidos} icon={<CheckCircle2 size={24} />} />
        </div>
      </div>

      <div className="portal-flex portal-gap-4 portal-mb-6" style={{ flexWrap: 'wrap' }}>
        <button className={`portal-btn ${filter === 'todos' ? 'portal-btn-primary' : 'portal-btn-ghost'}`} onClick={() => setFilter('todos')} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Todos</button>
        <button className={`portal-btn ${filter === 'ativos' ? 'portal-btn-primary' : 'portal-btn-ghost'}`} onClick={() => setFilter('ativos')} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Activos</button>
        <button className={`portal-btn ${filter === 'acao_necessaria' ? 'portal-btn-primary' : 'portal-btn-ghost'}`} onClick={() => setFilter('acao_necessaria')} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Esperando mi acción</button>
        <button className={`portal-btn ${filter === 'concluidos' ? 'portal-btn-primary' : 'portal-btn-ghost'}`} onClick={() => setFilter('concluidos')} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Concluidos</button>
      </div>

      <div className="portal-flex-col portal-gap-4">
        {filteredProcessos.length > 0 ? (
          filteredProcessos.map(proc => <ProcessoCard key={proc.id} processo={proc} baseUrl="/portal/processos" />)
        ) : (
          <EmptyState 
            title="No tienes procesos" 
            description={filter === 'todos' ? "Aún no tienes trámites activos con Tu Socio." : "No hay procesos con el filtro seleccionado."}
            icon={<Briefcase size={32} />}
          />
        )}
      </div>
    </div>
  );
};

export default ProcessosDashboard;
