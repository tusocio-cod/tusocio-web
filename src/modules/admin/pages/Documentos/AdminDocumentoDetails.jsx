import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminDocumentoById, updateDocumentoStatus, addDocumentoInternalNote } from '../../../portal/fakeServices';
import { useAuth } from '../../../auth/AuthContext';
import { LoadingState, StatusBadge, PrimaryButton, SecondaryButton, ErrorState } from '../../../shared/components/SharedComponents';
import { ArrowLeft, Send, CheckCircle2, AlertCircle, FileText, Download } from 'lucide-react';

export const AdminDocumentoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDoc();
  }, [id]);

  const fetchDoc = () => {
    setLoading(true);
    getAdminDocumentoById(id).then(res => {
      setDoc(res);
      setLoading(false);
    });
  };

  const handleApprove = async () => {
    setUpdating(true);
    try {
      await updateDocumentoStatus(id, 'aprovado', undefined, user.nome);
      await fetchDoc();
      setShowRejectForm(false);
    } catch (e) {
      alert('Erro ao aprovar documento');
    } finally {
      setUpdating(false);
    }
  };

  const handleRejectOrRequestResend = async (status) => {
    if (!motivoRejeicao.trim()) {
      alert('O motivo é obrigatório ao rejeitar ou pedir reenvio.');
      return;
    }
    setUpdating(true);
    try {
      await updateDocumentoStatus(id, status, motivoRejeicao, user.nome);
      setMotivoRejeicao('');
      setShowRejectForm(false);
      await fetchDoc();
    } catch (e) {
      alert(`Erro ao marcar como ${status}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setUpdating(true);
    try {
      await addDocumentoInternalNote(id, noteText, user.nome);
      setNoteText('');
      await fetchDoc();
    } catch (e) {
      alert('Erro ao adicionar nota interna');
    } finally {
      setUpdating(false);
    }
  };

  const suggestRejectReason = (reason) => {
    setMotivoRejeicao(reason);
  };

  if (loading) return <LoadingState message="Carregando documento..." />;
  if (!doc) return <ErrorState message="Documento não encontrado" onRetry={() => navigate('/admin/documentos')} />;

  const sectionStyle = {
    backgroundColor: 'var(--portal-surface)',
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
    fontWeight: 600
  };

  const valueStyle = {
    fontSize: '0.875rem',
    color: 'var(--portal-text-main)',
    marginBottom: '1rem'
  };

  const canAnalyze = ['enviado', 'em_analise', 'rejeitado', 'precisa_reenviar', 'vencido'].includes(doc.status);

  return (
    <div>
      <div className="portal-flex portal-items-center portal-gap-4 portal-mb-6">
        <button onClick={() => navigate('/admin/documentos')} className="portal-btn portal-btn-ghost" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="portal-flex portal-items-center portal-gap-4">
            <h1 className="portal-h1" style={{ marginBottom: 0 }}>Análise de Documento</h1>
            <StatusBadge status={doc.status} />
          </div>
          <p className="portal-subtitle" style={{ marginBottom: 0 }}>ID: {doc.id} • Cliente: {doc.clienteNome}</p>
        </div>
      </div>

      <div className="portal-grid portal-grid-2">
        <div>
          {canAnalyze && (
            <div style={sectionStyle}>
              <h3 className="portal-h3">Ações de Análise</h3>
              
              {!showRejectForm ? (
                <div className="portal-flex portal-gap-2">
                  <PrimaryButton disabled={updating} onClick={handleApprove} style={{ backgroundColor: 'var(--portal-success)' }}>
                    Aprovar Documento
                  </PrimaryButton>
                  <SecondaryButton disabled={updating} onClick={() => setShowRejectForm(true)} style={{ color: 'var(--portal-danger)', borderColor: 'var(--portal-danger)' }}>
                    Rejeitar / Solicitar Reenvio
                  </SecondaryButton>
                </div>
              ) : (
                <div style={{ padding: '1rem', border: '1px solid var(--portal-danger)', borderRadius: '8px', backgroundColor: 'var(--portal-danger-light)' }}>
                  <div style={{ ...labelStyle, color: 'var(--portal-danger)' }}>Motivo para o cliente (em Espanhol)</div>
                  <textarea 
                    value={motivoRejeicao}
                    onChange={e => setMotivoRejeicao(e.target.value)}
                    placeholder="Ex: Necesitamos que envíes una imagen más clara."
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--portal-danger)', marginBottom: '0.5rem', minHeight: '80px', resize: 'vertical' }}
                  />
                  
                  <div className="portal-flex portal-gap-2 portal-mb-4" style={{ flexWrap: 'wrap' }}>
                    <button className="portal-btn portal-btn-ghost" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }} onClick={() => suggestRejectReason('Necesitamos que envíes una imagen más clara.')}>Imagem borrada</button>
                    <button className="portal-btn portal-btn-ghost" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }} onClick={() => suggestRejectReason('Falta una página del documento.')}>Incompleto</button>
                    <button className="portal-btn portal-btn-ghost" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }} onClick={() => suggestRejectReason('El documento enviado no corresponde al solicitado.')}>Incorreto</button>
                    <button className="portal-btn portal-btn-ghost" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }} onClick={() => suggestRejectReason('El archivo está vencido.')}>Vencido</button>
                  </div>

                  <div className="portal-flex portal-gap-2">
                    <PrimaryButton disabled={updating || !motivoRejeicao.trim()} onClick={() => handleRejectOrRequestResend('rejeitado')} style={{ backgroundColor: 'var(--portal-danger)' }}>
                      Rejeitar Documento
                    </PrimaryButton>
                    <SecondaryButton disabled={updating || !motivoRejeicao.trim()} onClick={() => handleRejectOrRequestResend('precisa_reenviar')}>
                      Solicitar Reenvio
                    </SecondaryButton>
                    <button className="portal-btn portal-btn-ghost" onClick={() => setShowRejectForm(false)}>Cancelar</button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={sectionStyle}>
            <h3 className="portal-h3">Arquivo Enviado (Mock)</h3>
            {doc.arquivoNome ? (
              <div className="portal-flex portal-items-center portal-justify-between" style={{ padding: '1rem', border: '1px solid var(--portal-border)', borderRadius: '8px', backgroundColor: 'var(--portal-bg)' }}>
                <div className="portal-flex portal-items-center portal-gap-3">
                  <div style={{ padding: '0.5rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid var(--portal-border)' }}>
                    <FileText size={20} style={{ color: 'var(--portal-text-muted)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--portal-text-main)' }}>{doc.arquivoNome}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--portal-text-muted)' }}>{doc.arquivoTamanho} • Enviado em {new Date(doc.dataEnvio).toLocaleDateString()}</div>
                  </div>
                </div>
                <SecondaryButton disabled>
                  <Download size={16} style={{ marginRight: '0.5rem' }} /> Baixar
                </SecondaryButton>
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--portal-bg)', borderRadius: '8px', border: '1px dashed var(--portal-border)', color: 'var(--portal-text-muted)' }}>
                <FileText size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>Nenhum arquivo enviado ainda.</p>
              </div>
            )}
          </div>

          <div style={sectionStyle}>
            <h3 className="portal-h3">Dados da Solicitação</h3>
            <div className="portal-grid portal-grid-2">
              <div><div style={labelStyle}>Cliente</div><div style={valueStyle}>{doc.clienteNome}</div></div>
              <div><div style={labelStyle}>Empresa</div><div style={valueStyle}>{doc.empresaNome || 'Não vinculada'}</div></div>
              <div><div style={labelStyle}>Documento</div><div style={valueStyle}>{doc.titulo}</div></div>
              <div><div style={labelStyle}>Tipo</div><div style={valueStyle}>{doc.tipo}</div></div>
              <div><div style={labelStyle}>Vínculo / Processo</div><div style={valueStyle}>{doc.processoNome || doc.notaFiscalTitulo || 'Nenhum'}</div></div>
              <div><div style={labelStyle}>Data Solicitação</div><div style={valueStyle}>{new Date(doc.dataSolicitacao).toLocaleDateString('pt-BR')}</div></div>
            </div>
            
            {doc.descricao && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={labelStyle}>Instruções para o Cliente:</div>
                <p style={{ fontSize: '0.875rem' }}>{doc.descricao}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div style={sectionStyle}>
            <h3 className="portal-h3">Comunicação e Observações</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={labelStyle}>Notas Internas (Admin apenas):</div>
              <div style={{ padding: '1rem', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
                {doc.observacoesInternas || 'Sem notas internas registradas.'}
              </div>
              <textarea 
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Adicionar nota interna sobre este documento..."
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--portal-border)', marginBottom: '0.5rem', minHeight: '80px', resize: 'vertical' }}
              />
              <SecondaryButton disabled={updating || !noteText.trim()} onClick={handleAddNote}>Salvar Observação</SecondaryButton>
            </div>

            <hr style={{ border: 0, borderTop: '1px solid var(--portal-border)', margin: '1rem 0' }} />

            <div>
              <div style={labelStyle}>Ação Rápida: Cliente</div>
              <PrimaryButton onClick={() => alert("Mensaje copiado al portapapeles: Necesitamos que revises este documento para continuar.")} fullWidth style={{ backgroundColor: 'var(--portal-purple)' }}>
                <Send size={18} /> Copiar Mensagem (WhatsApp)
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDocumentoDetails;
