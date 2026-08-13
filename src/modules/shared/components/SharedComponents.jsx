import React from 'react';
import { FileText, CreditCard, ChevronRight, CheckCircle2, Clock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { ProcessoCard } from './ProcessoCard';
import { PaymentProofMockUploader } from './PaymentProofMockUploader';
import '../portal.css';

export const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      // Processos, Documentos, Pagamentos, Notas
      case 'novo': return { label: 'Nuevo', className: 'portal-badge-neutral' };
      case 'rascunho': return { label: 'Borrador', className: 'portal-badge-neutral' };
      
      case 'em_execucao': return { label: 'En Ejecución', className: 'portal-badge-info' };
      case 'em_analise':
      case 'em_revisao': return { label: 'En revisión', className: 'portal-badge-info' };
      case 'aguardando_orgao_externo': return { label: 'Esperando órgano externo', className: 'portal-badge-info' };
      case 'pronta_para_emissao': return { label: 'Lista para emitir', className: 'portal-badge-info' };
      case 'reembolsado': return { label: 'Reembolsado', className: 'portal-badge-info' };
      
      case 'concluido': return { label: 'Concluido', className: 'portal-badge-success' };
      case 'aprovado': return { label: 'Aprobado', className: 'portal-badge-success' };
      case 'pago': return { label: 'Pagado', className: 'portal-badge-success' };
      case 'emitida': return { label: 'Emitida', className: 'portal-badge-success' };
      case 'enviado': return { label: 'Enviado', className: 'portal-badge-success' };
      
      case 'aguardando_cliente':
      case 'pendente_envio':
      case 'precisa_reenviar':
      case 'aguardando_dados': return { label: 'Acción Necesaria', className: 'portal-badge-warning' };
      
      case 'pendente': return { label: 'Pendiente', className: 'portal-badge-warning' };
      case 'aguardando_pagamento': return { label: 'Pago Pendiente', className: 'portal-badge-warning' };
      
      case 'vencido': return { label: 'Vencido', className: 'portal-badge-danger' };
      case 'rejeitado': return { label: 'Rechazado', className: 'portal-badge-danger' };
      case 'erro_emissao': return { label: 'Error de emisión', className: 'portal-badge-danger' };
      case 'cancelado': return { label: 'Cancelado', className: 'portal-badge-danger' };
      case 'cancelada': return { label: 'Cancelada', className: 'portal-badge-danger' };
      
      default: return { label: status, className: 'portal-badge-neutral' };
    }
  };

  const config = getStatusConfig();
  
  return (
    <span className={`portal-badge ${config.className}`}>
      {config.label}
    </span>
  );
};

export const DashboardMetricCard = ({ title, value, icon, subtitle }) => (
  <div className="portal-card portal-flex-col portal-justify-between">
    <div className="portal-flex portal-justify-between portal-items-center portal-mb-4">
      <h4 style={{ color: 'var(--portal-text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>{title}</h4>
      <div style={{ color: 'var(--portal-primary)' }}>{icon}</div>
    </div>
    <div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--portal-text-main)' }}>{value}</div>
      {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)', marginTop: '0.25rem' }}>{subtitle}</div>}
    </div>
  </div>
);

export const ProcessCard = ({ processo }) => (
  <div className="portal-card">
    <div className="portal-flex portal-justify-between portal-items-center portal-mb-4">
      <StatusBadge status={processo.status} />
      <span style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>
        Atualizado: {new Date(processo.dataAtualizacao).toLocaleDateString('es-ES')}
      </span>
    </div>
    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{processo.titulo}</h3>
    <p style={{ fontSize: '0.875rem', color: 'var(--portal-text-muted)', marginBottom: '1rem' }}>{processo.descricao}</p>
    
    <div>
      <div className="portal-flex portal-justify-between portal-items-center" style={{ marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Progreso</span>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--portal-primary)' }}>{processo.progresso}%</span>
      </div>
      <div className="portal-progress-bg">
        <div className="portal-progress-fill" style={{ width: `${processo.progresso}%` }}></div>
      </div>
    </div>
  </div>
);

export const DocumentCard = ({ documento }) => (
  <div className="portal-card portal-flex portal-justify-between portal-items-center" style={{ padding: '1rem 1.5rem' }}>
    <div className="portal-flex portal-items-center portal-gap-4">
      <div style={{ padding: '0.75rem', backgroundColor: 'var(--portal-bg)', borderRadius: '8px', color: 'var(--portal-text-muted)' }}>
        <FileText size={20} />
      </div>
      <div>
        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>{documento.titulo}</h4>
        <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>{documento.mensagem || 'Revisión en curso'}</div>
      </div>
    </div>
    <div className="portal-flex portal-items-center portal-gap-4">
      <StatusBadge status={documento.status} />
      <ChevronRight size={18} style={{ color: 'var(--portal-text-muted)' }} />
    </div>
  </div>
);

export const PaymentCard = ({ pagamento }) => (
  <div className="portal-card portal-flex portal-justify-between portal-items-center" style={{ padding: '1rem 1.5rem' }}>
    <div className="portal-flex portal-items-center portal-gap-4">
      <div style={{ padding: '0.75rem', backgroundColor: 'var(--portal-warning-light)', borderRadius: '8px', color: 'var(--portal-warning)' }}>
        <CreditCard size={20} />
      </div>
      <div>
        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>{pagamento.titulo}</h4>
        <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>
          Vence: {new Date(pagamento.dataVencimento).toLocaleDateString('es-ES')}
        </div>
      </div>
    </div>
    <div className="portal-flex portal-items-center portal-gap-4">
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '1rem', fontWeight: 700 }}>R$ {pagamento.valor.toFixed(2)}</div>
        <StatusBadge status={pagamento.status} />
      </div>
    </div>
  </div>
);

export const PrimaryButton = ({ children, onClick, style, className = '', fullWidth = false, loading = false, disabled = false }) => (
  <button 
    onClick={onClick} 
    className={`portal-btn portal-btn-primary ${fullWidth ? 'portal-btn-full' : ''} ${className}`} 
    style={{ ...style, opacity: disabled || loading ? 0.7 : 1, cursor: disabled || loading ? 'not-allowed' : 'pointer' }}
    disabled={disabled || loading}
  >
    {loading && <Loader2 size={16} className="lucide-spin" />}
    {children}
  </button>
);

export const SecondaryButton = ({ children, onClick, style, className = '', fullWidth = false }) => (
  <button onClick={onClick} className={`portal-btn portal-btn-secondary ${fullWidth ? 'portal-btn-full' : ''} ${className}`} style={style}>
    {children}
  </button>
);

export const GhostButton = ({ children, onClick, style, className = '', fullWidth = false }) => (
  <button onClick={onClick} className={`portal-btn portal-btn-ghost ${fullWidth ? 'portal-btn-full' : ''} ${className}`} style={style}>
    {children}
  </button>
);

export const DangerButton = ({ children, onClick, style, className = '', fullWidth = false }) => (
  <button onClick={onClick} className={`portal-btn portal-btn-danger ${fullWidth ? 'portal-btn-full' : ''} ${className}`} style={style}>
    {children}
  </button>
);

export const EmptyState = ({ title, description, icon, action }) => (
  <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: 'var(--portal-surface)', borderRadius: 'var(--portal-radius)', border: '1px dashed var(--portal-border)' }}>
    <div style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--portal-bg)', color: 'var(--portal-text-muted)', marginBottom: '1.5rem' }}>
      {icon || <AlertCircle size={32} />}
    </div>
    <h3 className="portal-h3" style={{ marginBottom: '0.5rem' }}>{title}</h3>
    <p style={{ color: 'var(--portal-text-muted)', maxWidth: '400px', margin: '0 auto', marginBottom: action ? '1.5rem' : '0' }}>{description}</p>
    {action && <div>{action}</div>}
  </div>
);

export const LoadingState = ({ message = 'Cargando...' }) => (
  <div className="portal-flex-col portal-items-center portal-justify-center" style={{ padding: '3rem', color: 'var(--portal-text-muted)' }}>
    <Loader2 size={32} className="lucide-spin" style={{ marginBottom: '1rem', color: 'var(--portal-primary)' }} />
    <p>{message}</p>
  </div>
);

export const ErrorState = ({ message = 'Hubo un error al cargar los datos.', onRetry }) => (
  <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: 'var(--portal-danger-light)', borderRadius: 'var(--portal-radius)', color: 'var(--portal-danger)' }}>
    <AlertCircle size={32} style={{ margin: '0 auto 1rem' }} />
    <p style={{ marginBottom: onRetry ? '1.5rem' : '0' }}>{message}</p>
    {onRetry && (
      <button onClick={onRetry} style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--portal-danger)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
        Intentar de nuevo
      </button>
    )}
  </div>
);

export const NextStepCard = ({ title, description, buttonText, onClick }) => (
  <div className="portal-card" style={{ borderLeft: '4px solid var(--portal-primary)', backgroundColor: 'var(--portal-primary-light)' }}>
    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--portal-text-main)', marginBottom: '0.5rem' }}>{title}</h3>
    <p style={{ fontSize: '0.875rem', color: 'var(--portal-text-main)', marginBottom: '1.5rem' }}>{description}</p>
    <PrimaryButton onClick={onClick}>
      {buttonText} <ArrowRight size={16} />
    </PrimaryButton>
  </div>
);

export const ActionCard = ({ title, description, icon, onClick }) => (
  <div className="portal-card portal-flex portal-justify-between portal-items-center" style={{ cursor: 'pointer' }} onClick={onClick}>
    <div className="portal-flex portal-items-center portal-gap-4">
      <div style={{ padding: '0.75rem', backgroundColor: 'var(--portal-purple-light)', borderRadius: '8px', color: 'var(--portal-purple)' }}>
        {icon || <CheckCircle2 size={20} />}
      </div>
      <div>
        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>{title}</h4>
        <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>{description}</div>
      </div>
    </div>
    <ChevronRight size={18} style={{ color: 'var(--portal-text-muted)' }} />
  </div>
);

export { ProcessoCard, PaymentProofMockUploader };
