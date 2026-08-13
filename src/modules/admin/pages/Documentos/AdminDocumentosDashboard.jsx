import React, { useEffect, useState } from 'react';
import { getAdminDocumentos } from '../../../portal/fakeServices';
import { LoadingState, EmptyState, DashboardMetricCard, StatusBadge } from '../../../shared/components/SharedComponents';
import { FileText, Search, User, Filter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const AdminDocumentosDashboard = () => {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAdminDocumentos().then(res => {
      setDocumentos(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingState message="Carregando documentos..." />;

  const filteredDocs = documentos.filter(doc => {
    const matchesStatus = filterStatus === 'todos' || doc.status === filterStatus;
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      (doc.clienteNome && doc.clienteNome.toLowerCase().includes(searchLower)) ||
      (doc.titulo && doc.titulo.toLowerCase().includes(searchLower)) ||
      (doc.tipo && doc.tipo.toLowerCase().includes(searchLower));
    
    return matchesStatus && matchesSearch;
  });

  const pendentesAnalise = documentos.filter(d => ['enviado', 'em_analise'].includes(d.status)).length;
  const aguardandoCliente = documentos.filter(d => ['pendente_envio', 'precisa_reenviar', 'rejeitado', 'vencido'].includes(d.status)).length;
  const concluidos = documentos.filter(d => ['aprovado'].includes(d.status)).length;

  return (
    <div>
      <div className="portal-flex portal-justify-between portal-items-center portal-mb-6">
        <div>
          <h1 className="portal-h1" style={{ marginBottom: '0.25rem' }}>Análise de Documentos</h1>
          <p className="portal-subtitle" style={{ marginBottom: 0 }}>Gestão de uploads e solicitações de clientes</p>
        </div>
      </div>

      <div className="portal-grid portal-grid-4 portal-mb-6">
        <div style={{ cursor: 'pointer' }} onClick={() => setFilterStatus('enviado')}>
          <DashboardMetricCard title="Pendentes de Análise" value={pendentesAnalise} icon={<FileText size={24} style={{ color: 'var(--portal-warning)' }} />} subtitle="Aguardando a equipe" />
        </div>
        <div style={{ cursor: 'pointer' }} onClick={() => setFilterStatus('pendente_envio')}>
          <DashboardMetricCard title="Aguardando Cliente" value={aguardandoCliente} icon={<User size={24} />} subtitle="Pendências, rejeições e vencimentos" />
        </div>
        <div style={{ cursor: 'pointer' }} onClick={() => setFilterStatus('aprovado')}>
          <DashboardMetricCard title="Aprovados" value={concluidos} icon={<FileText size={24} />} subtitle="Tudo certo" />
        </div>
        <div style={{ cursor: 'pointer' }} onClick={() => setFilterStatus('todos')}>
          <DashboardMetricCard title="Total" value={documentos.length} icon={<Filter size={24} />} />
        </div>
      </div>

      <div className="portal-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="portal-flex portal-gap-4 portal-mb-6" style={{ flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--portal-text-muted)' }} />
            <input 
              type="text" 
              placeholder="Buscar por cliente, tipo ou nome do documento..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--portal-border)', backgroundColor: 'var(--portal-bg)' }}
            />
          </div>
          <select 
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--portal-border)', backgroundColor: 'var(--portal-bg)' }}
          >
            <option value="todos">Todos os Status</option>
            <option value="pendente_envio">Pendente de Envio</option>
            <option value="enviado">Enviado</option>
            <option value="em_analise">Em Análise</option>
            <option value="aprovado">Aprovado</option>
            <option value="rejeitado">Rejeitado</option>
            <option value="precisa_reenviar">Precisa Reenviar</option>
            <option value="vencido">Vencido</option>
          </select>
        </div>

        {filteredDocs.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--portal-border)' }}>
                  <th style={{ padding: '1rem', color: 'var(--portal-text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Cliente</th>
                  <th style={{ padding: '1rem', color: 'var(--portal-text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Documento</th>
                  <th style={{ padding: '1rem', color: 'var(--portal-text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Vínculo</th>
                  <th style={{ padding: '1rem', color: 'var(--portal-text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Status</th>
                  <th style={{ padding: '1rem', color: 'var(--portal-text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Data</th>
                  <th style={{ padding: '1rem', color: 'var(--portal-text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map(doc => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid var(--portal-border)', backgroundColor: ['enviado', 'em_analise'].includes(doc.status) ? 'var(--portal-bg)' : 'transparent' }}>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--portal-text-main)' }}>
                      {doc.clienteNome || 'Cliente'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--portal-text-main)' }}>{doc.titulo}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>{doc.tipo}</div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--portal-text-muted)' }}>
                      {doc.processoNome || doc.notaFiscalTitulo || 'Avulso'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <StatusBadge status={doc.status} />
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--portal-text-muted)' }}>
                      {new Date(doc.dataSolicitacao).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <Link to={`/admin/documentos/${doc.id}`} className="portal-btn portal-btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                        Ver Detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="Nenhum documento encontrado" description="Tente ajustar seus filtros de busca." />
        )}
      </div>
    </div>
  );
};

export default AdminDocumentosDashboard;
