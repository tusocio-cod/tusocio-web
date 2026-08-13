import React from 'react';
import { ChevronRight, FileText } from 'lucide-react';
import { StatusBadge } from './SharedComponents';
import { Link } from 'react-router-dom';

export const NotaFiscalCard = ({ nota, baseUrl = '/portal/notas' }) => {
  return (
    <Link to={`${baseUrl}/${nota.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="portal-card portal-flex portal-justify-between portal-items-center" style={{ padding: '1rem 1.5rem', cursor: 'pointer' }}>
        <div className="portal-flex portal-items-center portal-gap-4">
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--portal-primary-light)', borderRadius: '8px', color: 'var(--portal-primary)' }}>
            <FileText size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--portal-text-main)' }}>
              {nota.tomadorNome}
            </h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>
              {nota.descricao} • R$ {nota.valorTotal.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)', marginTop: '0.25rem' }}>
              Solicitado en: {new Date(nota.criadoEm).toLocaleDateString('es-ES')}
            </div>
          </div>
        </div>
        <div className="portal-flex portal-items-center portal-gap-4">
          <StatusBadge status={nota.status} />
          <ChevronRight size={18} style={{ color: 'var(--portal-text-muted)' }} />
        </div>
      </div>
    </Link>
  );
};
