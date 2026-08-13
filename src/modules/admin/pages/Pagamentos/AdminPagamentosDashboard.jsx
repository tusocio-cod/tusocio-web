import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Search, Filter, CreditCard, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { getAdminPagamentos } from '../../../portal/fakeServices';
import { DashboardMetricCard, StatusBadge, PrimaryButton, LoadingState, EmptyState } from '../../../shared/components/SharedComponents';

export default function AdminPagamentosDashboard() {
  const navigate = useNavigate();
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  useEffect(() => {
    const fetchPagamentos = async () => {
      try {
        const data = await getAdminPagamentos();
        setPagamentos(data);
      } catch (error) {
        console.error("Erro ao buscar pagamentos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPagamentos();
  }, []);

  const totalEmAberto = pagamentos
    .filter(p => p.status === 'pendente' || p.status === 'vencido')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const pendentesCount = pagamentos.filter(p => p.status === 'pendente').length;
  const vencidosCount = pagamentos.filter(p => p.status === 'vencido').length;
  const emAnaliseCount = pagamentos.filter(p => p.status === 'em_analise').length;

  const filteredPagamentos = pagamentos.filter(p => {
    const matchesSearch = (p.clienteNome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.titulo.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (statusFilter === 'todos') return matchesSearch;
    return matchesSearch && p.status === statusFilter;
  });

  if (loading) return <LoadingState message="Carregando pagamentos e cobranças..." />;

  return (
    <div className="portal-container">
      <div className="portal-header portal-flex portal-justify-between portal-items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="portal-title">Pagamentos e Cobranças</h1>
          <p className="portal-subtitle">Acompanhe cobranças, comprovantes e status financeiro dos clientes.</p>
        </div>
        <PrimaryButton onClick={() => navigate('/admin/pagamentos/nova')}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Nova Cobrança
        </PrimaryButton>
      </div>

      <div className="portal-grid portal-grid-4 portal-mb-6">
        <DashboardMetricCard 
          title="Total em Aberto" 
          value={`R$ ${totalEmAberto.toFixed(2)}`} 
          icon={<DollarSign size={24} style={{ color: 'var(--portal-primary)' }} />} 
        />
        <DashboardMetricCard 
          title="Pendentes" 
          value={pendentesCount} 
          icon={<Clock size={24} style={{ color: 'var(--portal-warning)' }} />} 
        />
        <DashboardMetricCard 
          title="Em Análise" 
          value={emAnaliseCount} 
          icon={<Clock size={24} style={{ color: 'var(--portal-info)' }} />} 
          subtitle="Aguardando validação"
        />
        <DashboardMetricCard 
          title="Vencidos" 
          value={vencidosCount} 
          icon={<AlertCircle size={24} style={{ color: 'var(--portal-danger)' }} />} 
        />
      </div>

      <div className="portal-card">
        <div className="portal-flex portal-justify-between portal-items-center portal-mb-6" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div className="portal-flex portal-gap-4 portal-items-center" style={{ flex: 1, minWidth: '250px' }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--portal-text-muted)' }} />
              <input 
                type="text" 
                placeholder="Buscar por cliente, título..." 
                className="portal-input"
                style={{ paddingLeft: '2.5rem', width: '100%', boxSizing: 'border-box' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="portal-flex portal-items-center portal-gap-2">
              <Filter size={18} style={{ color: 'var(--portal-text-muted)' }} />
              <select 
                className="portal-input" 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '0.5rem 1rem' }}
              >
                <option value="todos">Todos os Status</option>
                <option value="pendente">Pendentes</option>
                <option value="em_analise">Em Análise</option>
                <option value="pago">Pagos</option>
                <option value="vencido">Vencidos</option>
                <option value="cancelado">Cancelados</option>
              </select>
            </div>
          </div>
        </div>

        {filteredPagamentos.length === 0 ? (
          <EmptyState 
            title="Nenhum pagamento encontrado" 
            description="Não encontramos cobranças com os filtros atuais." 
            icon={<CreditCard size={32} />}
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="portal-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--portal-border)' }}>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--portal-text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Cobrança</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--portal-text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Cliente</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--portal-text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Valor</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--portal-text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Vencimento</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--portal-text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Status</th>
                  <th style={{ padding: '1rem 0.5rem', color: 'var(--portal-text-muted)', fontWeight: 600, fontSize: '0.875rem', textAlign: 'right' }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {filteredPagamentos.map(pagamento => (
                  <tr key={pagamento.id} style={{ borderBottom: '1px solid var(--portal-border)', ':hover': { backgroundColor: 'var(--portal-bg)' } }}>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div style={{ fontWeight: 600 }}>{pagamento.titulo}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>{pagamento.servicoRelacionado || pagamento.tipoCobranca}</div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div style={{ fontWeight: 500 }}>{pagamento.clienteNome}</div>
                      {pagamento.empresaNome && <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>{pagamento.empresaNome}</div>}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>
                      R$ {pagamento.valor.toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', fontSize: '0.875rem' }}>
                      {new Date(pagamento.dataVencimento).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <StatusBadge status={pagamento.status} />
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                      <Link to={`/admin/pagamentos/${pagamento.id}`} className="portal-btn portal-btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', textDecoration: 'none' }}>
                        Gerenciar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
