import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from './SharedComponents';
import { FileText, ChevronRight, Briefcase, Calendar, AlertCircle } from 'lucide-react';

export const ProcessoCard = ({ processo, baseUrl = '/portal/processos' }) => {
  const isAguardando = ['aguardando_cliente', 'aguardando_pagamento'].includes(processo.status);

  return (
    <div className="portal-card" style={{ padding: '1.25rem', marginBottom: '1rem', borderLeft: isAguardando ? '4px solid var(--portal-warning)' : '4px solid transparent' }}>
      <div className="portal-flex portal-justify-between portal-items-center portal-mb-3" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
        <div className="portal-flex portal-items-center portal-gap-3">
          <div style={{ backgroundColor: 'var(--portal-bg)', padding: '0.5rem', borderRadius: '8px' }}>
            <Briefcase size={20} className="portal-text-primary" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--portal-text-main)' }}>
              {processo.titulo}
            </h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)', marginTop: '0.25rem' }}>
              {processo.protocolo || processo.id} • {processo.tipo}
            </div>
          </div>
        </div>
        <StatusBadge status={processo.status} />
      </div>

      {processo.empresaNome && (
        <div style={{ fontSize: '0.875rem', color: 'var(--portal-text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--portal-border)', display: 'inline-block' }}></span>
          {processo.empresaNome} {processo.empresaCnpj ? `(${processo.empresaCnpj})` : ''}
        </div>
      )}

      {processo.proximoPasso && (
        <div style={{ backgroundColor: isAguardando ? '#FFFBEB' : 'var(--portal-bg)', border: isAguardando ? '1px solid #FDE68A' : '1px solid var(--portal-border)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
          <div style={{ fontWeight: 600, color: isAguardando ? '#D97706' : 'var(--portal-text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            {isAguardando ? <AlertCircle size={14} /> : <ChevronRight size={14} />} Próximo paso:
          </div>
          <div style={{ color: 'var(--portal-text-main)' }}>{processo.proximoPasso}</div>
        </div>
      )}

      <div className="portal-flex portal-justify-between portal-items-center" style={{ borderTop: '1px solid var(--portal-border)', paddingTop: '1rem', marginTop: '0.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="portal-flex portal-gap-4">
          <div className="portal-flex portal-items-center portal-gap-2" style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>
            <Calendar size={14} />
            <span>Inicio: {new Date(processo.dataCriacao).toLocaleDateString('es-ES')}</span>
          </div>
          {processo.documentosIds && processo.documentosIds.length > 0 && (
            <div className="portal-flex portal-items-center portal-gap-2" style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>
              <FileText size={14} />
              <span>{processo.documentosIds.length} doc{processo.documentosIds.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        
        <Link to={`${baseUrl}/${processo.id}`} className="portal-btn portal-btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}>
          Ver detalles
        </Link>
      </div>
    </div>
  );
};

export default ProcessoCard;
