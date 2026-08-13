import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getClienteProcessoById, getProcessoDocumentos, getProcessoNotas, getProcessoPagamentos } from '../../fakeServices';
import { LoadingState, StatusBadge, ErrorState, DocumentCard, PaymentCard, PrimaryButton } from '../../../shared/components/SharedComponents';
import { ArrowLeft, Briefcase, ChevronRight, CheckCircle2, Clock, FileText, AlertCircle } from 'lucide-react';

export const ProcessoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [processo, setProcesso] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [notas, setNotas] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const proc = await getClienteProcessoById(id);
      if (proc) {
        setProcesso(proc);
        const docs = await getProcessoDocumentos(id);
        setDocumentos(docs);
        const nfs = await getProcessoNotas(id);
        setNotas(nfs);
        const pags = await getProcessoPagamentos(id);
        setPagamentos(pags);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <LoadingState message="Cargando detalles del proceso..." />;
  if (!processo) return <ErrorState message="Proceso no encontrado." onRetry={() => navigate('/area-cliente/processos')} />;

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

  const isAguardando = ['aguardando_cliente', 'aguardando_pagamento'].includes(processo.status);

  return (
    <div>
      <div className="portal-flex portal-items-center portal-gap-4 portal-mb-6">
        <button onClick={() => navigate('/area-cliente/processos')} className="portal-btn portal-btn-ghost" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="portal-flex portal-items-center portal-gap-4">
            <h1 className="portal-h1" style={{ marginBottom: 0 }}>Detalles del Proceso</h1>
            <StatusBadge status={processo.status} />
          </div>
          <p className="portal-subtitle" style={{ marginBottom: 0 }}>{processo.protocolo || processo.id}</p>
        </div>
      </div>

      <div className="portal-grid portal-grid-3">
        <div style={{ gridColumn: 'span 2' }}>
          
          {processo.proximoPasso && (
            <div style={{ ...sectionStyle, backgroundColor: isAguardando ? '#FFFBEB' : 'var(--portal-primary-light)', borderColor: isAguardando ? '#FDE68A' : 'var(--portal-primary)', borderLeft: `4px solid ${isAguardando ? '#D97706' : 'var(--portal-primary)'}` }}>
              <div className="portal-flex portal-items-center portal-gap-2 portal-mb-2">
                {isAguardando ? <AlertCircle size={20} style={{ color: '#D97706' }} /> : <CheckCircle2 size={20} style={{ color: 'var(--portal-primary)' }} />}
                <h3 className="portal-h3" style={{ marginBottom: 0, color: isAguardando ? '#D97706' : 'var(--portal-primary)' }}>Próximo Paso</h3>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--portal-text-main)', fontWeight: 500, margin: 0 }}>
                {processo.proximoPasso}
              </p>
            </div>
          )}

          <div style={sectionStyle}>
            <h3 className="portal-h3 portal-flex portal-items-center portal-gap-2">
              <Briefcase size={20} className="portal-text-primary" /> Información General
            </h3>
            
            <div className="portal-grid portal-grid-2">
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={labelStyle}>Trámite</div>
                <div style={{ ...valueStyle, fontSize: '1.125rem', color: 'var(--portal-primary)' }}>{processo.titulo}</div>
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={labelStyle}>Descripción</div>
                <div style={valueStyle}>{processo.descricao}</div>
              </div>

              {processo.empresaNome && (
                <div>
                  <div style={labelStyle}>Empresa</div>
                  <div style={valueStyle}>{processo.empresaNome}</div>
                </div>
              )}

              <div>
                <div style={labelStyle}>Tipo</div>
                <div style={valueStyle}>{processo.tipo}</div>
              </div>

              <div>
                <div style={labelStyle}>Fecha de Inicio</div>
                <div style={valueStyle}>{new Date(processo.dataCriacao).toLocaleDateString('es-ES')}</div>
              </div>

              {processo.previsaoConclusao && (
                <div>
                  <div style={labelStyle}>Previsión de Conclusión</div>
                  <div style={valueStyle}>{new Date(processo.previsaoConclusao).toLocaleDateString('es-ES')}</div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '1rem' }}>
              <div className="portal-flex portal-justify-between portal-items-center" style={{ marginBottom: '0.5rem' }}>
                <div style={labelStyle}>Progreso del Trámite</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--portal-primary)' }}>{processo.progresso}%</div>
              </div>
              <div className="portal-progress-bg" style={{ height: '8px' }}>
                <div className="portal-progress-fill" style={{ width: `${processo.progresso}%` }}></div>
              </div>
            </div>
          </div>

          {(documentos.length > 0 || notas.length > 0 || pagamentos.length > 0) && (
            <div style={sectionStyle}>
              <h3 className="portal-h3">Elementos Relacionados</h3>
              
              {documentos.length > 0 && (
                <div className="portal-mb-6">
                  <div style={labelStyle}>Documentos</div>
                  <div className="portal-flex-col portal-gap-3">
                    {documentos.map(doc => (
                      <Link key={doc.id} to={`/portal/documentos/${doc.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <DocumentCard documento={doc} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {notas.length > 0 && (
                <div className="portal-mb-6">
                  <div style={labelStyle}>Facturas / Notas Fiscales</div>
                  <div className="portal-flex-col portal-gap-3">
                    {notas.map(nota => (
                      <Link key={nota.id} to={`/portal/notas/${nota.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="portal-card portal-flex portal-justify-between portal-items-center" style={{ padding: '1rem 1.5rem' }}>
                          <div className="portal-flex portal-items-center portal-gap-4">
                            <div style={{ padding: '0.75rem', backgroundColor: 'var(--portal-bg)', borderRadius: '8px', color: 'var(--portal-text-muted)' }}>
                              <FileText size={20} />
                            </div>
                            <div>
                              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>{nota.descricao}</h4>
                              <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>R$ {nota.valorTotal.toFixed(2)}</div>
                            </div>
                          </div>
                          <div className="portal-flex portal-items-center portal-gap-4">
                            <StatusBadge status={nota.status} />
                            <ChevronRight size={18} style={{ color: 'var(--portal-text-muted)' }} />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {pagamentos.length > 0 && (
                <div>
                  <div style={labelStyle}>Pagos</div>
                  <div className="portal-flex-col portal-gap-3">
                    {pagamentos.map(pag => (
                      <PaymentCard key={pag.id} pagamento={pag} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <div style={sectionStyle}>
            <h3 className="portal-h3">Historial</h3>
            <div className="portal-flex-col portal-gap-4">
              {processo.historico && processo.historico.length > 0 ? (
                processo.historico.map((hist, index) => (
                  <div key={index} className="portal-flex portal-gap-4">
                    <div style={{ marginTop: '0.25rem', color: index === processo.historico.length - 1 ? 'var(--portal-primary)' : 'var(--portal-text-muted)' }}>
                      {index === processo.historico.length - 1 ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{hist.acao}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>
                        {new Date(hist.data).toLocaleString('es-ES')}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '0.875rem', color: 'var(--portal-text-muted)' }}>Sin historial disponible.</p>
              )}
            </div>
          </div>
          
          <PrimaryButton fullWidth onClick={() => alert('Abriendo WhatsApp...')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            Hablar con un asesor
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default ProcessoDetails;
