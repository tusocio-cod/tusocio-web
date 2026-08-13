import React, { useEffect, useState } from 'react';
import { getClienteDocumentos } from '../../fakeServices';
import { useAuth } from '../../../auth/AuthContext';
import { LoadingState, EmptyState, DashboardMetricCard, PrimaryButton } from '../../../shared/components/SharedComponents';
import { DocumentoCard } from '../../../shared/components/DocumentoCard';
import { FileText, AlertCircle, CheckCircle2, Clock, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DocumentosDashboard = () => {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      getClienteDocumentos(user.id).then((res) => {
        setDocumentos(res);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) return <LoadingState message="Cargando tus documentos..." />;

  const pendentes = documentos.filter(d => ['pendente_envio'].includes(d.status)).length;
  const emRevisao = documentos.filter(d => ['enviado', 'em_analise'].includes(d.status)).length;
  const aprovados = documentos.filter(d => ['aprovado'].includes(d.status)).length;
  const rejeitados = documentos.filter(d => ['rejeitado', 'precisa_reenviar', 'vencido'].includes(d.status)).length;

  const filteredDocs = documentos.filter(d => {
    if (filter === 'todos') return true;
    if (filter === 'pendentes') return ['pendente_envio'].includes(d.status);
    if (filter === 'revisao') return ['enviado', 'em_analise'].includes(d.status);
    if (filter === 'aprovados') return ['aprovado'].includes(d.status);
    if (filter === 'reenviar') return ['rejeitado', 'precisa_reenviar', 'vencido'].includes(d.status);
    return true;
  });

  return (
    <div>
      <div className="portal-flex portal-justify-between portal-items-center portal-mb-8">
        <div>
          <h1 className="portal-h1">Mis documentos</h1>
          <p className="portal-subtitle" style={{ marginBottom: 0 }}>
            Envía y acompaña los documentos que Tu Socio necesita para continuar tus procesos.
          </p>
        </div>
      </div>

      <div className="portal-grid portal-grid-4 portal-mb-8">
        <div style={{ cursor: 'pointer' }} onClick={() => setFilter('pendentes')}>
          <DashboardMetricCard title="Pendientes" value={pendentes} icon={<AlertCircle size={24} />} subtitle="Necesitan envío" />
        </div>
        <div style={{ cursor: 'pointer' }} onClick={() => setFilter('revisao')}>
          <DashboardMetricCard title="En revisión" value={emRevisao} icon={<Clock size={24} />} />
        </div>
        <div style={{ cursor: 'pointer' }} onClick={() => setFilter('aprovados')}>
          <DashboardMetricCard title="Aprobados" value={aprovados} icon={<CheckCircle2 size={24} />} />
        </div>
        <div style={{ cursor: 'pointer' }} onClick={() => setFilter('reenviar')}>
          <DashboardMetricCard title="Rechazados" value={rejeitados} icon={<AlertCircle size={24} style={{ color: 'var(--portal-danger)' }} />} subtitle="Necesitan reenvío" />
        </div>
      </div>

      <div className="portal-flex portal-gap-4 portal-mb-6" style={{ flexWrap: 'wrap' }}>
        <button className={`portal-btn ${filter === 'todos' ? 'portal-btn-primary' : 'portal-btn-ghost'}`} onClick={() => setFilter('todos')} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Todos</button>
        <button className={`portal-btn ${filter === 'pendentes' ? 'portal-btn-primary' : 'portal-btn-ghost'}`} onClick={() => setFilter('pendentes')} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Pendientes</button>
        <button className={`portal-btn ${filter === 'revisao' ? 'portal-btn-primary' : 'portal-btn-ghost'}`} onClick={() => setFilter('revisao')} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>En revisión</button>
        <button className={`portal-btn ${filter === 'aprovados' ? 'portal-btn-primary' : 'portal-btn-ghost'}`} onClick={() => setFilter('aprovados')} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Aprobados</button>
        <button className={`portal-btn ${filter === 'reenviar' ? 'portal-btn-primary' : 'portal-btn-ghost'}`} onClick={() => setFilter('reenviar')} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Reenviar</button>
      </div>

      <div className="portal-flex-col portal-gap-4">
        {filteredDocs.length > 0 ? (
          filteredDocs.map(doc => <DocumentoCard key={doc.id} documento={doc} baseUrl="/portal/documentos" />)
        ) : (
          <EmptyState 
            title="No tienes documentos" 
            description={filter === 'todos' ? "Cuando Tu Socio necesite algún documento, aparecerá aquí." : "No hay documentos con el filtro seleccionado."}
            icon={<FileText size={32} />}
            action={filter === 'todos' ? <PrimaryButton onClick={() => alert('Abriendo chat...')}>Hablar con un asesor</PrimaryButton> : null}
          />
        )}
      </div>
    </div>
  );
};

export default DocumentosDashboard;
