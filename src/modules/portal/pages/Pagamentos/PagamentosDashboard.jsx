import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Filter, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { getClientePagamentos } from '../../fakeServices';
import { useAuth } from '../../../auth/AuthContext';
import { DashboardMetricCard, PaymentCard, LoadingState, EmptyState } from '../../../shared/components/SharedComponents';

export default function PagamentosDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos'); // todos, pendentes, vencidos, em_analise, pagos

  useEffect(() => {
    const fetchPagamentos = async () => {
      try {
        const data = await getClientePagamentos(user.id);
        setPagamentos(data);
      } catch (error) {
        console.error("Erro ao buscar pagamentos", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchPagamentos();
  }, [user]);

  const pendentesCount = pagamentos.filter(p => p.status === 'pendente').length;
  const vencidosCount = pagamentos.filter(p => p.status === 'vencido').length;
  const emAnaliseCount = pagamentos.filter(p => p.status === 'em_analise').length;

  const filteredPagamentos = pagamentos.filter(p => {
    if (filter === 'todos') return true;
    if (filter === 'pendentes') return p.status === 'pendente';
    if (filter === 'vencidos') return p.status === 'vencido';
    if (filter === 'em_analise') return p.status === 'em_analise';
    if (filter === 'pagos') return p.status === 'pago';
    return true;
  });

  if (loading) {
    return <LoadingState message="Cargando tus pagos..." />;
  }

  return (
    <div className="portal-container">
      <div className="portal-header">
        <div>
          <h1 className="portal-title">Mis pagos</h1>
          <p className="portal-subtitle">Consulta tus pagos, comprobantes y recibos en un solo lugar.</p>
        </div>
      </div>

      <div className="portal-grid portal-grid-4 portal-mb-6">
        <DashboardMetricCard 
          title="Pendientes" 
          value={pendentesCount} 
          icon={<Clock size={24} />} 
          subtitle="Esperando pago"
        />
        <DashboardMetricCard 
          title="Vencidos" 
          value={vencidosCount} 
          icon={<AlertCircle size={24} style={{ color: 'var(--portal-danger)' }} />} 
          subtitle="Atención requerida"
        />
        <DashboardMetricCard 
          title="En revisión" 
          value={emAnaliseCount} 
          icon={<Clock size={24} style={{ color: 'var(--portal-warning)' }} />} 
          subtitle="Validando comprobante"
        />
        <DashboardMetricCard 
          title="Pagados" 
          value={pagamentos.filter(p => p.status === 'pago').length} 
          icon={<CheckCircle2 size={24} style={{ color: 'var(--portal-success)' }} />} 
          subtitle="Pagos confirmados"
        />
      </div>

      <div className="portal-card">
        <div className="portal-flex portal-justify-between portal-items-center portal-mb-4" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="portal-h3">Historial de Pagos</h2>
          
          <div className="portal-flex portal-gap-2 portal-items-center" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
            <Filter size={18} style={{ color: 'var(--portal-text-muted)', flexShrink: 0 }} />
            <div className="portal-tabs" style={{ marginBottom: 0 }}>
              <button className={`portal-tab ${filter === 'todos' ? 'active' : ''}`} onClick={() => setFilter('todos')}>Todos</button>
              <button className={`portal-tab ${filter === 'pendentes' ? 'active' : ''}`} onClick={() => setFilter('pendentes')}>Pendientes</button>
              <button className={`portal-tab ${filter === 'vencidos' ? 'active' : ''}`} onClick={() => setFilter('vencidos')}>Vencidos</button>
              <button className={`portal-tab ${filter === 'em_analise' ? 'active' : ''}`} onClick={() => setFilter('em_analise')}>En revisión</button>
              <button className={`portal-tab ${filter === 'pagos' ? 'active' : ''}`} onClick={() => setFilter('pagos')}>Pagados</button>
            </div>
          </div>
        </div>

        {filteredPagamentos.length === 0 ? (
          <EmptyState 
            title="No se encontraron pagos" 
            description={filter === 'todos' ? "No tienes pagos registrados en el sistema." : `No tienes pagos con estado '${filter}'.`} 
            icon={<CreditCard size={32} />}
          />
        ) : (
          <div className="portal-flex-col portal-gap-4">
            {filteredPagamentos.map(pagamento => (
              <Link 
                to={`/portal/pagamentos/${pagamento.id}`} 
                key={pagamento.id}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ transition: 'transform 0.2s', ':hover': { transform: 'translateY(-2px)' } }}>
                  <PaymentCard pagamento={pagamento} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
