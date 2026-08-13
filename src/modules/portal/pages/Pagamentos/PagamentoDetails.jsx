import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Clock, FileText, Calendar, DollarSign, Download, Copy, CheckCircle2, MessageSquare, ExternalLink } from 'lucide-react';
import { getClientePagamentoById, mockEnviarComprovantePagamento } from '../../fakeServices';
import { StatusBadge, LoadingState, ErrorState, PrimaryButton, SecondaryButton } from '../../../shared/components/SharedComponents';
import { PaymentProofMockUploader } from '../../../shared/components/PaymentProofMockUploader';

export default function PagamentoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pagamento, setPagamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pixCopied, setPixCopied] = useState(false);

  useEffect(() => {
    const fetchPagamento = async () => {
      try {
        const data = await getClientePagamentoById(id);
        if (data) {
          setPagamento(data);
        } else {
          setError("Pagamento não encontrado");
        }
      } catch (err) {
        setError("Erro ao carregar detalhes");
      } finally {
        setLoading(false);
      }
    };

    fetchPagamento();
  }, [id]);

  const handleUploadSuccess = async (fileData) => {
    try {
      const updatedPagamento = await mockEnviarComprovantePagamento(pagamento.id, fileData);
      setPagamento(updatedPagamento);
    } catch (err) {
      console.error("Erro ao simular envio", err);
    }
  };

  const copyPix = () => {
    // Fake PIX Copy
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  };

  if (loading) return <LoadingState message="Cargando detalles del pago..." />;
  if (error) return <ErrorState message={error} onRetry={() => navigate('/area-cliente/pagamentos')} />;
  if (!pagamento) return <ErrorState message="Pago no encontrado." onRetry={() => navigate('/area-cliente/pagamentos')} />;

  const isPendente = pagamento.status === 'pendente';
  const isVencido = pagamento.status === 'vencido';
  const isEmAnalise = pagamento.status === 'em_analise';
  const isPago = pagamento.status === 'pago';

  return (
    <div className="portal-container">
      <button className="portal-btn portal-btn-ghost portal-mb-6" onClick={() => navigate('/area-cliente/pagamentos')}>
        <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Volver a mis pagos
      </button>

      {/* Destaque Conforme Status */}
      {isPendente && (
        <div className="portal-card portal-mb-6" style={{ borderLeft: '4px solid var(--portal-warning)', backgroundColor: 'var(--portal-warning-light)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--portal-text-main)', marginBottom: '0.5rem' }}>
            Pago pendiente
          </h2>
          <p style={{ color: 'var(--portal-text-main)', marginBottom: '1rem' }}>
            Realiza el pago antes del vencimiento y envía el comprobante para que nuestro equipo pueda validar.
          </p>
        </div>
      )}

      {isVencido && (
        <div className="portal-card portal-mb-6" style={{ borderLeft: '4px solid var(--portal-danger)', backgroundColor: 'var(--portal-danger-light)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--portal-text-main)', marginBottom: '0.5rem' }}>
            Pago vencido
          </h2>
          <p style={{ color: 'var(--portal-text-main)', marginBottom: '1rem' }}>
            Este pago está vencido. Si ya realizaste el pago, por favor envía el comprobante. De lo contrario, habla con un asesor.
          </p>
        </div>
      )}

      {isEmAnalise && (
        <div className="portal-card portal-mb-6" style={{ borderLeft: '4px solid var(--portal-info)', backgroundColor: 'var(--portal-info-light)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--portal-text-main)', marginBottom: '0.5rem' }}>
            Comprobante en revisión
          </h2>
          <p style={{ color: 'var(--portal-text-main)', marginBottom: '1rem' }}>
            Nuestro equipo está revisando el comprobante enviado. Te avisaremos cuando sea confirmado.
          </p>
        </div>
      )}

      {isPago && (
        <div className="portal-card portal-mb-6" style={{ borderLeft: '4px solid var(--portal-success)', backgroundColor: 'var(--portal-success-light)' }}>
          <div className="portal-flex portal-items-center portal-gap-3 portal-mb-2">
            <CheckCircle2 size={24} style={{ color: 'var(--portal-success)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--portal-success)', margin: 0 }}>
              Pago confirmado
            </h2>
          </div>
          <p style={{ color: 'var(--portal-text-main)', marginLeft: '2.5rem' }}>
            Tu pago fue identificado correctamente. ¡Gracias!
          </p>
        </div>
      )}

      <div className="portal-grid portal-grid-2 portal-mb-6">
        {/* Detalhes da Cobrança */}
        <div className="portal-card">
          <div className="portal-flex portal-justify-between portal-items-start portal-mb-6">
            <div>
              <h2 className="portal-h2" style={{ marginBottom: '0.5rem' }}>{pagamento.titulo}</h2>
              <div className="portal-flex portal-gap-2 portal-items-center">
                <StatusBadge status={pagamento.status} />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--portal-primary)' }}>
                R$ {pagamento.valor.toFixed(2)}
              </div>
            </div>
          </div>

          {pagamento.descricao && (
            <div className="portal-mb-6">
              <p style={{ fontSize: '0.875rem', color: 'var(--portal-text-muted)' }}>{pagamento.descricao}</p>
            </div>
          )}

          <div className="portal-grid portal-grid-2 portal-gap-4">
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)', marginBottom: '0.25rem' }}>Vencimiento</div>
              <div className="portal-flex portal-items-center portal-gap-2" style={{ fontWeight: 500 }}>
                <Calendar size={16} /> {new Date(pagamento.dataVencimento).toLocaleDateString('es-ES')}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)', marginBottom: '0.25rem' }}>Método sugerido</div>
              <div className="portal-flex portal-items-center portal-gap-2" style={{ fontWeight: 500 }}>
                <DollarSign size={16} /> {pagamento.metodoPagamento || 'A combinar'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)', marginBottom: '0.25rem' }}>Servicio</div>
              <div style={{ fontWeight: 500 }}>{pagamento.servicoRelacionado || '-'}</div>
            </div>
            {isPago && pagamento.dataPagamento && (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)', marginBottom: '0.25rem' }}>Fecha de pago</div>
                <div style={{ fontWeight: 500, color: 'var(--portal-success)' }}>
                  {new Date(pagamento.dataPagamento).toLocaleDateString('es-ES')}
                </div>
              </div>
            )}
          </div>

          {/* Vínculos */}
          {(pagamento.processoId || pagamento.notaFiscalId || pagamento.documentoId) && (
            <div className="portal-mt-6" style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--portal-border)' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--portal-text-muted)' }}>Vínculos</h3>
              
              {pagamento.processoId && (
                <Link to={`/portal/processos/${pagamento.processoId}`} style={{ textDecoration: 'none' }}>
                  <div className="portal-flex portal-items-center portal-justify-between portal-mb-2" style={{ padding: '0.75rem', backgroundColor: 'var(--portal-bg)', borderRadius: '6px' }}>
                    <div className="portal-flex portal-items-center portal-gap-2">
                      <FileText size={16} style={{ color: 'var(--portal-purple)' }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--portal-text-main)' }}>{pagamento.processoTitulo || 'Proceso vinculado'}</span>
                    </div>
                    <ExternalLink size={14} style={{ color: 'var(--portal-text-muted)' }} />
                  </div>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Área de Ação (Pix / Comprovante) */}
        <div>
          {/* Instruções de Pagamento */}
          {(isPendente || isVencido) && (
            <div className="portal-card portal-mb-4">
              <h3 className="portal-h3" style={{ fontSize: '1rem', marginBottom: '1rem' }}>Instrucciones de pago</h3>
              
              <div style={{ backgroundColor: 'var(--portal-bg)', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                <div className="portal-flex portal-justify-between portal-items-center portal-mb-2">
                  <span style={{ fontWeight: 600 }}>Clave Pix (Simulada)</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)', backgroundColor: 'var(--portal-surface)', padding: '2px 6px', borderRadius: '4px' }}>CNPJ</span>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '1rem', color: 'var(--portal-text-main)', marginBottom: '1rem', wordBreak: 'break-all' }}>
                  00.000.000/0001-00 (Tu Socio Ltda)
                </div>
                <PrimaryButton fullWidth onClick={copyPix} style={{ backgroundColor: pixCopied ? 'var(--portal-success)' : 'var(--portal-primary)' }}>
                  {pixCopied ? <><CheckCircle2 size={16} style={{ marginRight: '0.5rem' }} /> Clave copiada</> : <><Copy size={16} style={{ marginRight: '0.5rem' }} /> Copiar Clave Pix</>}
                </PrimaryButton>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)', textAlign: 'center' }}>
                Los pagos con tarjeta o boleto estarán disponibles cuando la integración esté activa.
              </div>
            </div>
          )}

          {/* Uploader de Comprovante */}
          {(isPendente || isVencido || (isEmAnalise && pagamento.comprovante?.statusAnalise === 'rejeitado')) && (
            <PaymentProofMockUploader onUploadSuccess={handleUploadSuccess} />
          )}

          {/* Comprovante em Análise */}
          {isEmAnalise && pagamento.comprovante?.statusAnalise !== 'rejeitado' && (
            <div className="portal-card">
              <h3 className="portal-h3" style={{ fontSize: '1rem', marginBottom: '1rem' }}>Comprobante enviado</h3>
              <div className="portal-flex portal-items-center portal-gap-3" style={{ backgroundColor: 'var(--portal-bg)', padding: '1rem', borderRadius: '8px' }}>
                <FileText size={24} style={{ color: 'var(--portal-text-muted)' }} />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{pagamento.comprovante.arquivoNome}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>
                    Enviado el {new Date(pagamento.comprovante.enviadoEm).toLocaleDateString('es-ES')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recibo */}
          {isPago && pagamento.recibo && (
            <div className="portal-card">
              <h3 className="portal-h3" style={{ fontSize: '1rem', marginBottom: '1rem' }}>Recibo</h3>
              <div style={{ backgroundColor: 'var(--portal-bg)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
                <FileText size={32} style={{ color: 'var(--portal-success)', margin: '0 auto 1rem' }} />
                <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{pagamento.recibo.numero}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--portal-text-muted)', marginBottom: '1.5rem' }}>
                  Emitido el {new Date(pagamento.recibo.emitidoEm).toLocaleDateString('es-ES')}
                </div>
                <SecondaryButton fullWidth onClick={() => alert('¡Descarga de recibo simulada con éxito!')}>
                  <Download size={16} style={{ marginRight: '0.5rem' }} /> Descargar recibo
                </SecondaryButton>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Observações e Histórico */}
      <div className="portal-card">
        <h3 className="portal-h3" style={{ marginBottom: '1.5rem' }}>Historial y Observaciones</h3>
        
        {pagamento.observacoesCliente && (
          <div className="portal-mb-6" style={{ backgroundColor: 'var(--portal-purple-light)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--portal-purple)' }}>
            <div className="portal-flex portal-items-center portal-gap-2 portal-mb-2">
              <MessageSquare size={16} style={{ color: 'var(--portal-purple)' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--portal-purple)' }}>Mensaje de Tu Socio</span>
            </div>
            <p style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap', color: 'var(--portal-text-main)' }}>
              {pagamento.observacoesCliente}
            </p>
          </div>
        )}

        <div className="portal-flex-col portal-gap-4">
          {pagamento.historico?.slice().reverse().map((item, index) => (
            <div key={index} className="portal-flex portal-gap-4">
              <div className="portal-flex-col portal-items-center">
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--portal-primary)', marginTop: '0.25rem' }}></div>
                {index !== pagamento.historico.length - 1 && <div style={{ width: '2px', flex: 1, backgroundColor: 'var(--portal-border)', margin: '0.25rem 0' }}></div>}
              </div>
              <div style={{ paddingBottom: index !== pagamento.historico.length - 1 ? '1.5rem' : '0' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--portal-text-main)' }}>{item.acao}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>
                  {new Date(item.data).toLocaleString('es-ES')} • {item.usuario}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
