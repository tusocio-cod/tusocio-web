import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClienteDocumentoById, mockUploadDocumento } from '../../fakeServices';
import { LoadingState, StatusBadge, ErrorState } from '../../../shared/components/SharedComponents';
import { DocumentMockUploader } from '../../../shared/components/DocumentMockUploader';
import { ArrowLeft, FileText, CheckCircle2, Clock, AlertCircle, Info } from 'lucide-react';

export const DocumentoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [documento, setDocumento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocumento();
  }, [id]);

  const fetchDocumento = () => {
    setLoading(true);
    getClienteDocumentoById(id).then(res => {
      setDocumento(res);
      setLoading(false);
    });
  };

  const handleUploadSuccess = async (fileData) => {
    const isReenvio = ['rejeitado', 'precisa_reenviar', 'vencido'].includes(documento.status);
    await mockUploadDocumento(id, fileData, isReenvio);
    fetchDocumento(); // Recarrega os dados para ver o novo status
  };

  if (loading) return <LoadingState message="Cargando detalles del documento..." />;
  if (!documento) return <ErrorState message="Documento no encontrado." onRetry={() => navigate('/area-cliente/documentos')} />;

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

  const isPending = ['pendente_envio', 'rejeitado', 'precisa_reenviar', 'vencido'].includes(documento.status);

  return (
    <div>
      <div className="portal-flex portal-items-center portal-gap-4 portal-mb-6">
        <button onClick={() => navigate('/area-cliente/documentos')} className="portal-btn portal-btn-ghost" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="portal-flex portal-items-center portal-gap-4">
            <h1 className="portal-h1" style={{ marginBottom: 0 }}>Detalles del Documento</h1>
            <StatusBadge status={documento.status} />
          </div>
        </div>
      </div>

      <div className="portal-grid portal-grid-2">
        <div>
          <div style={sectionStyle}>
            <h3 className="portal-h3 portal-flex portal-items-center portal-gap-2">
              <FileText size={20} className="portal-text-primary" /> Información
            </h3>
            
            <div className="portal-grid portal-grid-2">
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={labelStyle}>Documento Solicitado</div>
                <div style={{ ...valueStyle, fontSize: '1.125rem', color: 'var(--portal-primary)' }}>{documento.titulo}</div>
              </div>
              
              {documento.processoNome && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={labelStyle}>Vínculo</div>
                  <div style={valueStyle}>{documento.processoNome}</div>
                </div>
              )}

              <div>
                <div style={labelStyle}>Tipo</div>
                <div style={valueStyle}>{documento.tipo}</div>
              </div>

              <div>
                <div style={labelStyle}>Fecha Solicitud</div>
                <div style={valueStyle}>{new Date(documento.dataSolicitacao).toLocaleDateString('es-ES')}</div>
              </div>

              {documento.descricao && (
                <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem', backgroundColor: 'var(--portal-bg)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--portal-info)' }}>
                  <div className="portal-flex portal-items-center portal-gap-2" style={{ color: 'var(--portal-info)', marginBottom: '0.25rem', fontWeight: 600, fontSize: '0.875rem' }}>
                    <Info size={16} /> Instrucciones
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--portal-text-main)', margin: 0 }}>{documento.descricao}</p>
                </div>
              )}
            </div>
          </div>

          {documento.motivoRejeicao && (
            <div style={{ ...sectionStyle, backgroundColor: 'var(--portal-danger-light)', borderColor: 'var(--portal-danger)', borderLeft: '4px solid var(--portal-danger)' }}>
              <div className="portal-flex portal-items-center portal-gap-2 portal-mb-2">
                <AlertCircle size={20} style={{ color: 'var(--portal-danger)' }} />
                <h3 className="portal-h3" style={{ marginBottom: 0, color: 'var(--portal-danger)' }}>Documento Rechazado</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--portal-text-main)' }}>
                <strong>Motivo: </strong> {documento.motivoRejeicao}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--portal-text-main)', marginTop: '0.5rem' }}>
                Por favor, revisa el motivo y reenvía el documento usando el formulario a continuación.
              </p>
            </div>
          )}

          <div style={sectionStyle}>
            <h3 className="portal-h3">Archivo</h3>
            
            {isPending ? (
              <DocumentMockUploader 
                onUploadSuccess={handleUploadSuccess} 
                isReenvio={['rejeitado', 'precisa_reenviar', 'vencido'].includes(documento.status)} 
              />
            ) : (
              <div className="portal-flex portal-items-center portal-justify-between" style={{ padding: '1rem', border: '1px solid var(--portal-border)', borderRadius: '8px', backgroundColor: 'var(--portal-bg)' }}>
                <div className="portal-flex portal-items-center portal-gap-3">
                  <div style={{ padding: '0.5rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid var(--portal-border)' }}>
                    <FileText size={20} style={{ color: 'var(--portal-text-muted)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--portal-text-main)' }}>{documento.arquivoNome || 'documento_enviado.pdf'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>{documento.arquivoTamanho || 'Enviado'}</div>
                  </div>
                </div>
                {documento.status === 'em_analise' && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--portal-warning)', fontWeight: 600 }}>En revisión</span>
                )}
                {documento.status === 'aprovado' && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--portal-success)', fontWeight: 600 }} className="portal-flex portal-items-center portal-gap-1">
                    <CheckCircle2 size={14} /> Aprobado
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <div style={sectionStyle}>
            <h3 className="portal-h3">Historial</h3>
            <div className="portal-flex-col portal-gap-4">
              {documento.historico && documento.historico.length > 0 ? (
                documento.historico.map((hist, index) => (
                  <div key={index} className="portal-flex portal-gap-4">
                    <div style={{ marginTop: '0.25rem', color: index === documento.historico.length - 1 ? 'var(--portal-primary)' : 'var(--portal-text-muted)' }}>
                      {index === documento.historico.length - 1 ? <CheckCircle2 size={20} /> : <Clock size={20} />}
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

export default DocumentoDetails;
