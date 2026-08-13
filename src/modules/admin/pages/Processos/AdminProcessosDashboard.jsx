import React, { useEffect, useState } from 'react';
import { getAdminProcessos } from '../../../portal/fakeServices';
import { LoadingState, EmptyState, DashboardMetricCard, StatusBadge } from '../../../shared/components/SharedComponents';
import { Briefcase, Search, Filter, AlertCircle, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const AdminProcessosDashboard = () => {
  const [processos, setProcessos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTipo, setFilterTipo] = useState('todos');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' ou 'lista'
  const navigate = useNavigate();

  useEffect(() => {
    getAdminProcessos().then(res => {
      setProcessos(res);
      setLoading(false);
    });
  }, []);

  // Força view mode = lista em mobile (aproximado)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setViewMode('lista');
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) return <LoadingState message="Carregando processos..." />;

  const filteredDocs = processos.filter(doc => {
    const matchesTipo = filterTipo === 'todos' || doc.tipo === filterTipo;
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      (doc.clienteNome && doc.clienteNome.toLowerCase().includes(searchLower)) ||
      (doc.empresaNome && doc.empresaNome.toLowerCase().includes(searchLower)) ||
      (doc.titulo && doc.titulo.toLowerCase().includes(searchLower)) ||
      (doc.protocolo && doc.protocolo.toLowerCase().includes(searchLower));
    
    return matchesTipo && matchesSearch;
  });

  const getColunasKanban = () => {
    const colunas = [
      { id: 'novo', titulo: 'Novos', status: ['novo'] },
      { id: 'em_analise', titulo: 'Em Análise', status: ['em_analise'] },
      { id: 'pendencias', titulo: 'Aguardando Cliente/Pag.', status: ['aguardando_cliente', 'aguardando_pagamento'] },
      { id: 'em_execucao', titulo: 'Em Execução', status: ['em_execucao'] },
      { id: 'orgao_externo', titulo: 'Órgão Externo', status: ['aguardando_orgao_externo'] },
      { id: 'concluido', titulo: 'Concluído', status: ['concluido'] },
    ];

    return colunas.map(col => ({
      ...col,
      items: filteredDocs.filter(p => col.status.includes(p.status))
    }));
  };

  const ativos = processos.filter(p => !['concluido', 'cancelado'].includes(p.status)).length;
  const pendencias = processos.filter(p => ['aguardando_cliente', 'aguardando_pagamento'].includes(p.status)).length;
  const orgaoExterno = processos.filter(p => ['aguardando_orgao_externo'].includes(p.status)).length;

  // Componente interno para o card do Kanban
  const KanbanCard = ({ processo }) => (
    <Link to={`/admin/processos/${processo.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: '1rem' }}>
      <div className="portal-card" style={{ padding: '1rem', borderLeft: processo.prioridade === 'urgente' ? '4px solid var(--portal-danger)' : processo.prioridade === 'alta' ? '4px solid var(--portal-warning)' : '4px solid transparent' }}>
        <div className="portal-flex portal-justify-between portal-items-start portal-mb-2">
          <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--portal-text-muted)', backgroundColor: 'var(--portal-bg)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
            {processo.protocolo}
          </span>
          {processo.prioridade === 'urgente' && <span style={{ fontSize: '0.65rem', color: 'var(--portal-danger)', fontWeight: 600 }}>URGENTE</span>}
        </div>
        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--portal-text-main)', lineHeight: 1.2 }}>
          {processo.titulo}
        </h4>
        <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)', marginBottom: '0.75rem' }}>
          {processo.clienteNome} {processo.empresaNome && `• ${processo.empresaNome}`}
        </div>
        <div className="portal-flex portal-justify-between portal-items-center" style={{ borderTop: '1px solid var(--portal-border)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--portal-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Briefcase size={12} /> {processo.responsavel || 'Sem resp.'}
          </div>
          {processo.previsaoConclusao && (
            <div style={{ fontSize: '0.7rem', color: new Date(processo.previsaoConclusao) < new Date() ? 'var(--portal-danger)' : 'var(--portal-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={12} /> {new Date(processo.previsaoConclusao).toLocaleDateString('pt-BR')}
            </div>
          )}
        </div>
      </div>
    </Link>
  );

  return (
    <div>
      <div className="portal-flex portal-justify-between portal-items-center portal-mb-6">
        <div>
          <h1 className="portal-h1" style={{ marginBottom: '0.25rem' }}>Processos e Protocolos</h1>
          <p className="portal-subtitle" style={{ marginBottom: 0 }}>Acompanhe o andamento dos serviços, pendências e responsáveis</p>
        </div>
        <div className="portal-flex portal-gap-2">
          {window.innerWidth >= 1024 && (
            <>
              <button className={`portal-btn ${viewMode === 'lista' ? 'portal-btn-primary' : 'portal-btn-ghost'}`} onClick={() => setViewMode('lista')} style={{ padding: '0.5rem' }}>Lista</button>
              <button className={`portal-btn ${viewMode === 'kanban' ? 'portal-btn-primary' : 'portal-btn-ghost'}`} onClick={() => setViewMode('kanban')} style={{ padding: '0.5rem' }}>Kanban</button>
            </>
          )}
        </div>
      </div>

      <div className="portal-grid portal-grid-4 portal-mb-6">
        <div>
          <DashboardMetricCard title="Processos Ativos" value={ativos} icon={<Briefcase size={24} />} subtitle="Em andamento geral" />
        </div>
        <div>
          <DashboardMetricCard title="Aguardando Cliente" value={pendencias} icon={<AlertCircle size={24} style={{ color: 'var(--portal-warning)' }} />} subtitle="Ações pendentes" />
        </div>
        <div>
          <DashboardMetricCard title="Em Órgão Externo" value={orgaoExterno} icon={<Clock size={24} />} subtitle="Receita, Junta, Prefeituras" />
        </div>
        <div>
          <DashboardMetricCard title="Concluídos (Total)" value={processos.length - ativos} icon={<CheckCircle2 size={24} />} />
        </div>
      </div>

      <div className="portal-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="portal-flex portal-gap-4" style={{ flexWrap: 'wrap', marginBottom: viewMode === 'lista' ? '1.5rem' : '0' }}>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--portal-text-muted)' }} />
            <input 
              type="text" 
              placeholder="Buscar por protocolo, cliente, título ou CNPJ..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--portal-border)', backgroundColor: 'var(--portal-bg)' }}
            />
          </div>
          <select 
            value={filterTipo}
            onChange={e => setFilterTipo(e.target.value)}
            style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--portal-border)', backgroundColor: 'var(--portal-bg)' }}
          >
            <option value="todos">Todos os Tipos</option>
            <option value="Abertura de Empresa">Abertura de Empresa</option>
            <option value="Alteração Contratual">Alteração Contratual</option>
            <option value="Emissão de Nota Fiscal">Emissão de Nota Fiscal</option>
            <option value="RNM">RNM</option>
            <option value="Imposto de Renda">Imposto de Renda</option>
            <option value="Marketplace">Marketplace</option>
          </select>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', minHeight: '600px' }}>
          {getColunasKanban().map(coluna => (
            <div key={coluna.id} style={{ minWidth: '300px', width: '300px', backgroundColor: 'var(--portal-surface)', borderRadius: 'var(--portal-radius)', border: '1px solid var(--portal-border)', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
              <div className="portal-flex portal-justify-between portal-items-center portal-mb-4" style={{ paddingBottom: '0.5rem', borderBottom: '2px solid var(--portal-border)' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0, color: 'var(--portal-text-main)' }}>{coluna.titulo}</h3>
                <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--portal-bg)', padding: '0.1rem 0.5rem', borderRadius: '12px', fontWeight: 600 }}>{coluna.items.length}</span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {coluna.items.map(proc => <KanbanCard key={proc.id} processo={proc} />)}
                {coluna.items.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--portal-text-muted)', fontSize: '0.875rem' }}>
                    Nenhum processo
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="portal-card" style={{ padding: '1.5rem' }}>
          {filteredDocs.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--portal-border)' }}>
                    <th style={{ padding: '1rem', color: 'var(--portal-text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Protocolo</th>
                    <th style={{ padding: '1rem', color: 'var(--portal-text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Processo / Cliente</th>
                    <th style={{ padding: '1rem', color: 'var(--portal-text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Status</th>
                    <th style={{ padding: '1rem', color: 'var(--portal-text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Responsável</th>
                    <th style={{ padding: '1rem', color: 'var(--portal-text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Previsão</th>
                    <th style={{ padding: '1rem', color: 'var(--portal-text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map(doc => (
                    <tr key={doc.id} style={{ borderBottom: '1px solid var(--portal-border)', borderLeft: doc.prioridade === 'urgente' ? '4px solid var(--portal-danger)' : '4px solid transparent' }}>
                      <td style={{ padding: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--portal-text-muted)' }}>
                        {doc.protocolo}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--portal-text-main)' }}>{doc.titulo}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>{doc.clienteNome} {doc.empresaNome ? `(${doc.empresaNome})` : ''}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <StatusBadge status={doc.status} />
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--portal-text-muted)' }}>
                        {doc.responsavel || '-'}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--portal-text-muted)' }}>
                        {doc.previsaoConclusao ? new Date(doc.previsaoConclusao).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <Link to={`/admin/processos/${doc.id}`} className="portal-btn portal-btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                          Ver Detalhes
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="Nenhum processo encontrado" description="Tente ajustar seus filtros de busca." />
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProcessosDashboard;
