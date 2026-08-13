import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminNotaFiscalById, updateNotaFiscalStatus, addNotaFiscalInternalNote } from '../../../portal/fakeServices';
import { useAuth } from '../../../auth/AuthContext';
import { LoadingState, StatusBadge, PrimaryButton, SecondaryButton, ErrorState } from '../../../shared/components/SharedComponents';
import { ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminNotaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nota, setNota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchNota();
  }, [id]);

  const fetchNota = () => {
    setLoading(true);
    getAdminNotaFiscalById(id).then(res => {
      setNota(res);
      setLoading(false);
    });
  };

  const handleUpdateStatus = async (status) => {
    setUpdating(true);
    try {
      await updateNotaFiscalStatus(id, status, user.nome);
      await fetchNota();
    } catch (e) {
      alert('Erro ao atualizar status');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    setUpdating(true);
    try {
      await addNotaFiscalInternalNote(id, noteText, user.nome);
      setNoteText('');
      await fetchNota();
    } catch (e) {
      alert('Erro ao adicionar nota interna');
    } finally {
      setUpdating(false);
    }
  };

  const handleSendClientMessage = () => {
    alert("Mensagem (Mock): Necesitamos que revises los datos enviados para continuar con la emisión de tu nota fiscal.");
  };

  if (loading) return <LoadingState message="Carregando detalhes..." />;
  if (!nota) return <ErrorState message="Nota não encontrada" onRetry={() => navigate('/admin/notas')} />;

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

  return (
    <div>
      <div className="portal-flex portal-items-center portal-gap-4 portal-mb-6">
        <button onClick={() => navigate('/admin/notas')} className="portal-btn portal-btn-ghost" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="portal-flex portal-items-center portal-gap-4">
            <h1 className="portal-h1" style={{ marginBottom: 0 }}>Gestão de Nota Fiscal</h1>
            <StatusBadge status={nota.status} />
          </div>
          <p className="portal-subtitle" style={{ marginBottom: 0 }}>ID: {nota.id} • Cliente: {nota.clienteNome}</p>
        </div>
      </div>

      <div className="portal-grid portal-grid-2">
        <div>
          <div style={sectionStyle}>
            <h3 className="portal-h3">Ações de Status</h3>
            <div className="portal-grid portal-grid-2" style={{ gap: '0.5rem' }}>
              <SecondaryButton disabled={updating} onClick={() => handleUpdateStatus('em_revisao')}>Marcar "Em Revisão"</SecondaryButton>
              <SecondaryButton disabled={updating} onClick={() => handleUpdateStatus('aguardando_dados')} style={{ color: 'var(--portal-warning)', borderColor: 'var(--portal-warning)' }}>Faltam Dados</SecondaryButton>
              <SecondaryButton disabled={updating} onClick={() => handleUpdateStatus('pronta_para_emissao')}>Pronta p/ Emissão</SecondaryButton>
              <PrimaryButton disabled={updating} onClick={() => handleUpdateStatus('emitida')} style={{ backgroundColor: 'var(--portal-success)' }}>Marcar como Emitida</PrimaryButton>
              <SecondaryButton disabled={updating} onClick={() => handleUpdateStatus('erro_emissao')} style={{ color: 'var(--portal-danger)', borderColor: 'var(--portal-danger)' }}>Reportar Erro</SecondaryButton>
            </div>
          </div>

          <div style={sectionStyle}>
            <h3 className="portal-h3">Dados da Solicitação</h3>
            <div className="portal-grid portal-grid-2">
              <div><div style={labelStyle}>Cliente (Portal)</div><div style={valueStyle}>{nota.clienteNome}</div></div>
              <div><div style={labelStyle}>Empresa Emitente</div><div style={valueStyle}>{nota.empresaNome}</div></div>
              <div><div style={labelStyle}>Tipo / Canal</div><div style={valueStyle}>{nota.tipoNota} / {nota.canal}</div></div>
              <div><div style={labelStyle}>Data de Competência</div><div style={valueStyle}>{new Date(nota.dataCompetencia).toLocaleDateString('pt-BR')}</div></div>
            </div>
            <hr style={{ border: 0, borderTop: '1px solid var(--portal-border)', margin: '1rem 0' }} />
            <div className="portal-grid portal-grid-2">
              <div><div style={labelStyle}>Tomador (Para quem emitir)</div><div style={valueStyle}>{nota.tomadorNome}</div></div>
              <div><div style={labelStyle}>CPF/CNPJ Tomador</div><div style={valueStyle}>{nota.tomadorDocumento}</div></div>
              <div style={{ gridColumn: '1 / -1' }}><div style={labelStyle}>Descrição do Serviço</div><div style={valueStyle}>{nota.descricao}</div></div>
              <div><div style={labelStyle}>Quantidade</div><div style={valueStyle}>{nota.quantidade}</div></div>
              <div><div style={labelStyle}>Valor Unitário</div><div style={valueStyle}>R$ {nota.valorUnitario.toFixed(2)}</div></div>
              <div><div style={labelStyle}>Valor Total</div><div style={{ ...valueStyle, fontWeight: 700, fontSize: '1rem', color: 'var(--portal-purple)' }}>R$ {nota.valorTotal.toFixed(2)}</div></div>
            </div>
          </div>
        </div>

        <div>
          <div style={sectionStyle}>
            <h3 className="portal-h3">Comunicação e Observações</h3>
            
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--portal-bg)', borderRadius: '8px' }}>
              <div style={labelStyle}>Observações do Cliente:</div>
              <p style={{ fontSize: '0.875rem' }}>{nota.observacoesCliente || 'Nenhuma observação.'}</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={labelStyle}>Notas Internas (Admin apenas):</div>
              <div style={{ padding: '1rem', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
                {nota.observacoesInternas || 'Sem notas internas.'}
              </div>
              <textarea 
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Adicionar nota interna sobre esta solicitação..."
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--portal-border)', marginBottom: '0.5rem', minHeight: '80px', resize: 'vertical' }}
              />
              <SecondaryButton disabled={updating || !noteText.trim()} onClick={handleAddNote}>Salvar Observação</SecondaryButton>
            </div>

            <hr style={{ border: 0, borderTop: '1px solid var(--portal-border)', margin: '1rem 0' }} />

            <div>
              <div style={labelStyle}>Ação Rápida: Cliente</div>
              <PrimaryButton onClick={handleSendClientMessage} fullWidth style={{ backgroundColor: 'var(--portal-purple)' }}>
                <Send size={18} /> Preparar mensagem via Portal
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotaDetails;
