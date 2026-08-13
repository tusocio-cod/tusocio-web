import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Download, AlertCircle, FileText, ExternalLink, Calendar, CreditCard, DollarSign, Send, Save, CheckCircle2, XCircle } from 'lucide-react';
import { getAdminPagamentoById, updatePagamentoStatus, solicitarNovoComprovante, addPagamentoInternalNote, addPagamentoClientMessage } from '../../../portal/fakeServices';
import { StatusBadge, LoadingState, ErrorState, PrimaryButton, SecondaryButton, DangerButton } from '../../../shared/components/SharedComponents';

export default function AdminPagamentoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pagamento, setPagamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [internalNote, setInternalNote] = useState('');
  const [clientMessage, setClientMessage] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    const fetchPagamento = async () => {
      try {
        const data = await getAdminPagamentoById(id);
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

  const handleUpdateStatus = async (status, motivo = null) => {
    try {
      setLoading(true);
      const updated = await updatePagamentoStatus(pagamento.id, status, motivo, 'Analista Financeiro');
      setPagamento(updated);
      setIsCancelling(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectProof = async () => {
    if (!rejectionReason.trim()) {
      alert("Informe o motivo da rejeição do comprovante.");
      return;
    }
    try {
      setLoading(true);
      const updated = await solicitarNovoComprovante(pagamento.id, rejectionReason, 'Analista Financeiro');
      setPagamento(updated);
      setIsRejecting(false);
      setRejectionReason('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInternalNote = async () => {
    if (!internalNote.trim()) return;
    try {
      const updated = await addPagamentoInternalNote(pagamento.id, internalNote, 'Analista Financeiro');
      setPagamento(updated);
      setInternalNote('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendClientMessage = async () => {
    if (!clientMessage.trim()) return;
    try {
      const updated = await addPagamentoClientMessage(pagamento.id, clientMessage, 'Analista Financeiro');
      setPagamento(updated);
      setClientMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && !pagamento) return <LoadingState message="Carregando detalhes..." />;
  if (error) return <ErrorState message={error} onRetry={() => navigate('/admin/pagamentos')} />;
  if (!pagamento) return null;

  return (
    <div className="portal-container">
      <button className="portal-btn portal-btn-ghost portal-mb-6" onClick={() => navigate('/admin/pagamentos')}>
        <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Voltar para Pagamentos
      </button>

      <div className="portal-grid portal-grid-3 portal-gap-6">
        {/* Coluna Principal */}
        <div style={{ gridColumn: 'span 2' }}>
          <div className="portal-card portal-mb-6">
            <div className="portal-flex portal-justify-between portal-items-start portal-mb-6">
              <div>
                <div className="portal-flex portal-gap-2 portal-items-center portal-mb-2">
                  <h1 className="portal-h2" style={{ margin: 0 }}>{pagamento.titulo}</h1>
                  <StatusBadge status={pagamento.status} />
                </div>
                <p style={{ color: 'var(--portal-text-muted)', fontSize: '0.875rem' }}>ID: {pagamento.id}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--portal-primary)' }}>
                  R$ {pagamento.valor.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="portal-grid portal-grid-2 portal-gap-6 portal-mb-6" style={{ padding: '1.5rem', backgroundColor: 'var(--portal-bg)', borderRadius: '8px' }}>
              <div>
                <h3 style={{ fontSize: '0.875rem', color: 'var(--portal-text-muted)', marginBottom: '0.25rem' }}>Cliente</h3>
                <div style={{ fontWeight: 600 }}>{pagamento.clienteNome}</div>
                {pagamento.empresaNome && <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>{pagamento.empresaNome} ({pagamento.empresaCnpj})</div>}
              </div>
              <div>
                <h3 style={{ fontSize: '0.875rem', color: 'var(--portal-text-muted)', marginBottom: '0.25rem' }}>Vencimento</h3>
                <div className="portal-flex portal-items-center portal-gap-2" style={{ fontWeight: 600 }}>
                  <Calendar size={16} /> {new Date(pagamento.dataVencimento).toLocaleDateString('pt-BR')}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '0.875rem', color: 'var(--portal-text-muted)', marginBottom: '0.25rem' }}>Serviço</h3>
                <div style={{ fontWeight: 500 }}>{pagamento.servicoRelacionado || pagamento.tipoCobranca}</div>
              </div>
              <div>
                <h3 style={{ fontSize: '0.875rem', color: 'var(--portal-text-muted)', marginBottom: '0.25rem' }}>Forma Sugerida</h3>
                <div className="portal-flex portal-items-center portal-gap-2" style={{ fontWeight: 500 }}>
                  <DollarSign size={16} /> {pagamento.metodoPagamento || 'PIX'}
                </div>
              </div>
            </div>

            {pagamento.descricao && (
              <div className="portal-mb-6">
                <h3 style={{ fontSize: '0.875rem', color: 'var(--portal-text-muted)', marginBottom: '0.5rem' }}>Descrição para o Cliente</h3>
                <p style={{ fontSize: '0.875rem', backgroundColor: 'var(--portal-surface)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--portal-border)' }}>
                  {pagamento.descricao}
                </p>
              </div>
            )}

            {/* Vínculos */}
            {(pagamento.processoId || pagamento.notaFiscalId || pagamento.documentoId) && (
              <div className="portal-mb-6">
                <h3 style={{ fontSize: '0.875rem', color: 'var(--portal-text-muted)', marginBottom: '0.5rem' }}>Vínculos</h3>
                {pagamento.processoId && (
                  <Link to={`/admin/processos/${pagamento.processoId}`} style={{ textDecoration: 'none' }}>
                    <div className="portal-flex portal-items-center portal-justify-between" style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--portal-surface)', border: '1px solid var(--portal-border)', borderRadius: '6px' }}>
                      <div className="portal-flex portal-items-center portal-gap-3">
                        <FileText size={18} style={{ color: 'var(--portal-purple)' }} />
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--portal-text-main)' }}>{pagamento.processoTitulo || 'Processo Vinculado'}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>ID: {pagamento.processoId}</div>
                        </div>
                      </div>
                      <ExternalLink size={16} style={{ color: 'var(--portal-text-muted)' }} />
                    </div>
                  </Link>
                )}
              </div>
            )}

            {/* Comprovante */}
            {pagamento.comprovante && (
              <div className="portal-mb-6">
                <h3 style={{ fontSize: '0.875rem', color: 'var(--portal-text-muted)', marginBottom: '0.5rem' }}>Comprovante Anexado pelo Cliente</h3>
                <div className="portal-flex portal-justify-between portal-items-center" style={{ padding: '1rem', border: '1px solid var(--portal-border)', borderRadius: '8px', backgroundColor: 'var(--portal-bg)' }}>
                  <div className="portal-flex portal-items-center portal-gap-3">
                    <FileText size={24} style={{ color: 'var(--portal-primary)' }} />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--portal-text-main)' }}>{pagamento.comprovante.arquivoNome}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>
                        {pagamento.comprovante.arquivoTamanho} • Enviado em {new Date(pagamento.comprovante.enviadoEm).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                  <SecondaryButton onClick={() => alert('Download do mock')}>
                    <Download size={16} style={{ marginRight: '0.5rem' }} /> Visualizar
                  </SecondaryButton>
                </div>

                {pagamento.status === 'em_analise' && !isRejecting && (
                  <div className="portal-flex portal-gap-4 portal-mt-4">
                    <PrimaryButton fullWidth onClick={() => handleUpdateStatus('pago')} style={{ backgroundColor: 'var(--portal-success)' }}>
                      <CheckCircle2 size={18} style={{ marginRight: '0.5rem' }} /> Validar e Marcar como Pago
                    </PrimaryButton>
                    <DangerButton fullWidth onClick={() => setIsRejecting(true)}>
                      <XCircle size={18} style={{ marginRight: '0.5rem' }} /> Rejeitar Comprovante
                    </DangerButton>
                  </div>
                )}

                {isRejecting && (
                  <div className="portal-mt-4" style={{ backgroundColor: 'var(--portal-danger-light)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--portal-danger)' }}>
                    <label className="portal-label" style={{ color: 'var(--portal-danger)' }}>Motivo da Rejeição * (Aparecerá para o cliente em espanhol)</label>
                    <textarea 
                      className="portal-input portal-mb-4"
                      value={rejectionReason}
                      onChange={e => setRejectionReason(e.target.value)}
                      placeholder="Ex: La imagen está muy borrosa, por favor envía nuevamente."
                      rows={2}
                    />
                    <div className="portal-flex portal-gap-4">
                      <SecondaryButton onClick={() => setIsRejecting(false)}>Cancelar</SecondaryButton>
                      <DangerButton onClick={handleRejectProof}>Confirmar Rejeição</DangerButton>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Anotações Internas */}
          <div className="portal-card portal-mb-6">
            <h2 className="portal-h3 portal-mb-4">Anotações Internas</h2>
            {pagamento.observacoesInternas && (
              <div className="portal-mb-4" style={{ backgroundColor: 'var(--portal-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--portal-border)' }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.875rem' }}>
                  {pagamento.observacoesInternas}
                </pre>
              </div>
            )}
            <div>
              <textarea 
                className="portal-input portal-mb-2" 
                rows="2" 
                placeholder="Adicionar nota para a equipe..."
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
              ></textarea>
              <SecondaryButton onClick={handleSaveInternalNote} disabled={!internalNote.trim()}>
                <Save size={16} style={{ marginRight: '0.5rem' }} /> Salvar Nota
              </SecondaryButton>
            </div>
          </div>
        </div>

        {/* Coluna Lateral: Ações e Mensagens */}
        <div style={{ gridColumn: 'span 1' }}>
          
          <div className="portal-card portal-mb-6">
            <h2 className="portal-h3 portal-mb-4">Ações do Status</h2>
            <div className="portal-flex-col portal-gap-3">
              {pagamento.status !== 'pago' && (
                <PrimaryButton fullWidth onClick={() => handleUpdateStatus('pago')} style={{ backgroundColor: 'var(--portal-success)' }}>
                  Marcar como Pago
                </PrimaryButton>
              )}
              {pagamento.status !== 'vencido' && pagamento.status !== 'pago' && (
                <SecondaryButton fullWidth onClick={() => handleUpdateStatus('vencido')}>
                  Marcar como Vencido
                </SecondaryButton>
              )}
              {pagamento.status !== 'pendente' && pagamento.status !== 'pago' && (
                <SecondaryButton fullWidth onClick={() => handleUpdateStatus('pendente')}>
                  Voltar para Pendente
                </SecondaryButton>
              )}
              {pagamento.status !== 'cancelado' && !isCancelling && (
                <DangerButton fullWidth onClick={() => setIsCancelling(true)}>
                  Cancelar Cobrança
                </DangerButton>
              )}

              {isCancelling && (
                <div style={{ marginTop: '0.5rem' }}>
                  <input 
                    type="text" 
                    className="portal-input portal-mb-2"
                    placeholder="Motivo do cancelamento"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                  <div className="portal-flex portal-gap-2">
                    <DangerButton fullWidth onClick={() => handleUpdateStatus('cancelado', cancelReason)}>
                      Confirmar
                    </DangerButton>
                    <SecondaryButton fullWidth onClick={() => setIsCancelling(false)}>
                      Sair
                    </SecondaryButton>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="portal-card portal-mb-6">
            <h2 className="portal-h3 portal-mb-4">Mensagem para o Cliente</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)', marginBottom: '1rem' }}>
              Escreva em espanhol. O cliente verá isso em destaque no card dele.
            </p>
            {pagamento.observacoesCliente && (
              <div className="portal-mb-4" style={{ backgroundColor: 'var(--portal-purple-light)', padding: '0.75rem', borderRadius: '6px', borderLeft: '4px solid var(--portal-purple)' }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.75rem', color: 'var(--portal-text-main)' }}>
                  {pagamento.observacoesCliente}
                </pre>
              </div>
            )}
            <textarea 
              className="portal-input portal-mb-2" 
              rows="3" 
              placeholder="Ex: Tu pago está en revisión. Te avisaremos cuando sea confirmado."
              value={clientMessage}
              onChange={(e) => setClientMessage(e.target.value)}
            ></textarea>
            <PrimaryButton fullWidth onClick={handleSendClientMessage} disabled={!clientMessage.trim()} style={{ backgroundColor: 'var(--portal-purple)' }}>
              <Send size={16} style={{ marginRight: '0.5rem' }} /> Enviar Mensaje
            </PrimaryButton>
          </div>

          {/* Histórico Simplificado */}
          <div className="portal-card">
            <h2 className="portal-h3 portal-mb-4">Histórico</h2>
            <div className="portal-flex-col portal-gap-4">
              {pagamento.historico?.slice().reverse().map((item, index) => (
                <div key={index} className="portal-flex portal-gap-3">
                  <div style={{ marginTop: '0.25rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--portal-primary)' }}></div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--portal-text-main)' }}>{item.acao}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>
                      {new Date(item.data).toLocaleDateString('pt-BR')} • {item.usuario}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
