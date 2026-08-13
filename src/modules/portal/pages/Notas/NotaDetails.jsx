import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNotaFiscalById } from '../../fakeServices';
import { LoadingState, StatusBadge, PrimaryButton, SecondaryButton, ErrorState } from '../../../shared/components/SharedComponents';
import { ArrowLeft, MessageCircle, Download, FileText, CheckCircle2, Clock } from 'lucide-react';

export const NotaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nota, setNota] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotaFiscalById(id).then(res => {
      setNota(res);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <LoadingState message="Cargando detalles de la nota..." />;
  if (!nota) return <ErrorState message="Nota fiscal no encontrada." onRetry={() => navigate('/area-cliente/notas')} />;

  const sectionStyle = {
    backgroundColor: 'var(--portal-card)',
    padding: '1.5rem',
    borderRadius: 'var(--portal-radius)',
    border: '1px solid var(--portal-border)',
    marginBottom: '1.5rem',
  };

  const labelStyle = {
    fontSize: '0.75rem',
    color: 'var(--portal-text-muted)',
    marginBottom: '0.25rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const valueStyle = {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--portal-text-main)',
    marginBottom: '1rem'
  };

  return (
    <div>
      <div className="portal-flex portal-items-center portal-gap-4 portal-mb-6">
        <button onClick={() => navigate('/area-cliente/notas')} className="portal-btn portal-btn-ghost" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="portal-flex portal-items-center portal-gap-4">
            <h1 className="portal-h1" style={{ marginBottom: 0 }}>Detalles de la Factura</h1>
            <StatusBadge status={nota.status} />
          </div>
          <p className="portal-subtitle" style={{ marginBottom: 0 }}>ID de solicitud: {nota.id}</p>
        </div>
      </div>

      <div className="portal-grid portal-grid-2">
        <div>
          <div style={sectionStyle}>
            <h3 className="portal-h3 portal-flex portal-items-center portal-gap-2">
              <FileText size={20} className="portal-text-primary" /> Datos de la Factura
            </h3>
            
            <div className="portal-grid portal-grid-2">
              <div>
                <div style={labelStyle}>Tomador (Cliente Final)</div>
                <div style={valueStyle}>{nota.tomadorNome}</div>
              </div>
              <div>
                <div style={labelStyle}>Documento (CPF/CNPJ)</div>
                <div style={valueStyle}>{nota.tomadorDocumento}</div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={labelStyle}>Descripción</div>
                <div style={valueStyle}>{nota.descricao}</div>
              </div>
              <div>
                <div style={labelStyle}>Valor Total</div>
                <div style={{ ...valueStyle, color: 'var(--portal-primary)', fontSize: '1.125rem' }}>
                  R$ {nota.valorTotal.toFixed(2)}
                </div>
              </div>
              <div>
                <div style={labelStyle}>Competencia</div>
                <div style={valueStyle}>{new Date(nota.dataCompetencia).toLocaleDateString('es-ES')}</div>
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <h3 className="portal-h3">Acciones Requeridas</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--portal-text-muted)', marginBottom: '1.5rem' }}>
              {nota.status === 'aguardando_dados' ? 'Faltan datos en tu solicitud. Por favor, comunícate con nosotros para corregirlos.' :
               nota.status === 'aguardando_pagamento' ? 'Tienes un pago pendiente para liberar esta emisión.' :
               nota.status === 'em_revisao' ? 'Tu solicitud está siendo revisada por el equipo de Tu Socio. Te avisaremos cuando haya novedades.' :
               nota.status === 'emitida' ? 'Tu nota fiscal fue emitida con éxito.' :
               'Sin acciones adicionales por ahora.'}
            </p>

            <div className="portal-flex portal-gap-4">
              {nota.status === 'emitida' && (
                <PrimaryButton disabled style={{ flex: 1 }}>
                  <Download size={18} /> Descargar PDF (Mock)
                </PrimaryButton>
              )}
              {['aguardando_dados', 'em_revisao'].includes(nota.status) && (
                <PrimaryButton style={{ flex: 1 }}>
                  <MessageCircle size={18} /> Hablar con un asesor
                </PrimaryButton>
              )}
            </div>
          </div>
        </div>

        <div>
          <div style={sectionStyle}>
            <h3 className="portal-h3">Historial de la Solicitud</h3>
            <div className="portal-flex-col portal-gap-4">
              {nota.historico && nota.historico.length > 0 ? (
                nota.historico.map((hist, index) => (
                  <div key={index} className="portal-flex portal-gap-4">
                    <div style={{ marginTop: '0.25rem', color: index === nota.historico.length - 1 ? 'var(--portal-primary)' : 'var(--portal-text-muted)' }}>
                      {index === nota.historico.length - 1 ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{hist.acao}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>
                        {new Date(hist.data).toLocaleString('es-ES')} • {hist.usuario}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '0.875rem', color: 'var(--portal-text-muted)' }}>Sin historial disponible.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotaDetails;
