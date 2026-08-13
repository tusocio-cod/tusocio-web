import React, { useEffect, useState } from 'react';
import { getAdminNotas } from '../../../portal/fakeServices';
import { LoadingState, EmptyState } from '../../../shared/components/SharedComponents';
import { NotaFiscalCard } from '../../../shared/components/NotaFiscalCard';
import { FileText, Search } from 'lucide-react';

const COLUMNS = [
  { id: 'novas', title: 'Novas / Rascunhos', status: ['rascunho', 'aguardando_dados'] },
  { id: 'revisao', title: 'Em Revisão', status: ['em_revisao'] },
  { id: 'pagamento', title: 'Aguardando Pagamento', status: ['aguardando_pagamento'] },
  { id: 'prontas', title: 'Prontas / Emitidas', status: ['pronta_para_emissao', 'emitida'] },
  { id: 'problemas', title: 'Com Erro / Canceladas', status: ['erro_emissao', 'cancelada'] },
];

export const AdminNotasDashboard = () => {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAdminNotas().then((res) => {
      setNotas(res);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingState message="Carregando solicitações de notas fiscais..." />;

  const filteredNotas = notas.filter(nota => {
    if (filter !== 'todas' && !COLUMNS.find(c => c.id === filter)?.status.includes(nota.status)) return false;
    if (search) {
      const s = search.toLowerCase();
      return nota.tomadorNome.toLowerCase().includes(s) || nota.empresaNome?.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <div>
      <div className="portal-flex portal-justify-between portal-items-center portal-mb-6">
        <div>
          <h1 className="portal-h1">Solicitações de Nota Fiscal</h1>
          <p className="portal-subtitle" style={{ marginBottom: 0 }}>
            Revise, acompanhe e organize as solicitações enviadas pelos clientes.
          </p>
        </div>
      </div>

      <div className="portal-flex portal-gap-4 portal-mb-6" style={{ flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--portal-text-muted)' }} />
          <input 
            type="text" 
            placeholder="Buscar por cliente, empresa ou documento..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--portal-border)', fontSize: '0.875rem' }}
          />
        </div>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--portal-border)', fontSize: '0.875rem', backgroundColor: 'var(--portal-surface)' }}
        >
          <option value="todas">Todos os Status</option>
          {COLUMNS.map(col => <option key={col.id} value={col.id}>{col.title}</option>)}
        </select>
      </div>

      {/* Kanban View (Desktop) / List View (Mobile) */}
      <div id="admin-kanban" style={{ display: 'none', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        {COLUMNS.map(column => {
          const columnNotas = filteredNotas.filter(n => column.status.includes(n.status));
          return (
            <div key={column.id} style={{ minWidth: '300px', flex: 1, backgroundColor: 'var(--portal-bg)', borderRadius: 'var(--portal-radius)', padding: '1rem' }}>
              <div className="portal-flex portal-justify-between portal-items-center portal-mb-4">
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--portal-text-main)' }}>{column.title}</h3>
                <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--portal-border)', padding: '0.1rem 0.5rem', borderRadius: '99px', fontWeight: 600 }}>{columnNotas.length}</span>
              </div>
              <div className="portal-flex-col portal-gap-2">
                {columnNotas.map(nota => <NotaFiscalCard key={nota.id} nota={nota} baseUrl="/admin/notas" />)}
                {columnNotas.length === 0 && <p style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)', textAlign: 'center', padding: '1rem 0' }}>Vazio</p>}
              </div>
            </div>
          );
        })}
      </div>

      <div id="admin-list" style={{ display: 'block' }}>
        <div className="portal-flex-col portal-gap-4">
          {filteredNotas.length > 0 ? (
            filteredNotas.map(nota => <NotaFiscalCard key={nota.id} nota={nota} baseUrl="/admin/notas" />)
          ) : (
            <EmptyState title="Sem resultados" description="Nenhuma solicitação encontrada com os filtros atuais." icon={<FileText size={32} />} />
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          #admin-kanban { display: flex !important; }
          #admin-list { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminNotasDashboard;
