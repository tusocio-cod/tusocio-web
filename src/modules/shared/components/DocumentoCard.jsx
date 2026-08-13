import React from 'react';
import { ChevronRight, File as FileIcon, AlertCircle } from 'lucide-react';
import { StatusBadge } from './SharedComponents';
import { Link } from 'react-router-dom';

export const DocumentoCard = ({ documento, baseUrl = '/portal/documentos' }) => {
  return (
    <Link to={`${baseUrl}/${documento.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="portal-card portal-flex portal-justify-between portal-items-center" style={{ padding: '1rem 1.5rem', cursor: 'pointer', borderLeft: documento.status === 'rejeitado' || documento.status === 'precisa_reenviar' || documento.status === 'pendente_envio' ? '4px solid var(--portal-warning)' : '4px solid transparent' }}>
        <div className="portal-flex portal-items-center portal-gap-4">
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--portal-bg)', borderRadius: '8px', color: 'var(--portal-text-muted)' }}>
            <FileIcon size={20} />
          </div>
          <div>
            <div className="portal-flex portal-items-center portal-gap-2">
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--portal-text-main)' }}>
                {documento.titulo}
              </h4>
              {documento.obrigatorio && (
                <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--portal-danger-light)', color: 'var(--portal-danger)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                  OBRIGATÓRIO
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>
              {documento.tipo} {documento.processoNome ? `• ${documento.processoNome}` : ''}
            </div>
            {documento.motivoRejeicao && (
              <div className="portal-flex portal-items-center portal-gap-2" style={{ fontSize: '0.75rem', color: 'var(--portal-danger)', marginTop: '0.25rem' }}>
                <AlertCircle size={12} /> Motivo: {documento.motivoRejeicao}
              </div>
            )}
          </div>
        </div>
        <div className="portal-flex portal-items-center portal-gap-4">
          <StatusBadge status={documento.status} />
          <ChevronRight size={18} style={{ color: 'var(--portal-text-muted)' }} />
        </div>
      </div>
    </Link>
  );
};
