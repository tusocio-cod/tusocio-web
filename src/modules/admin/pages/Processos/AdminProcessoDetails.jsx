import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAdminProcessoById, updateProcessoStatus, addProcessoInternalNote, addProcessoClientMessage } from '../../../portal/fakeServices';
import { useAuth } from '../../../auth/AuthContext';
import { LoadingState, StatusBadge, PrimaryButton, SecondaryButton, ErrorState } from '../../../shared/components/SharedComponents';
import { ArrowLeft, Send, CheckCircle2, AlertCircle, Clock, Briefcase, ChevronRight } from 'lucide-react';

export const AdminProcessoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [proc, setProc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [clientMessage, setClientMessage] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProc();
  }, [id]);

  const fetchProc = () => {
    setLoading(true);
    getAdminProcessoById(id).then(res => {
      setProc(res);
      setLoading(false);
    });
  };

  const handleChangeStatus = async (novoStatus) => {
    setUpdating(true);
    try {
      await updateProcessoStatus(id, novoStatus, user.nome);
      await fetchProc();
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
      await addProcessoInternalNote(id, noteText, user.nome);
      setNoteText('');
      await fetchProc();
    } catch (e) {
      alert('Erro ao adicionar nota interna');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddClientMessage = async () => {
    if (!clientMessage.trim()) return;
    setUpdating(true);
    try {
      await addProcessoClientMessage(id, clientMessage, user.nome);
      alert('Mensagem enviada/registrada com sucesso para o cliente.');
      setClientMessage('');
      await fetchProc();
    } catch (e) {
      alert('Erro ao enviar mensagem');
    } finally {
      setUpdating(false);
    }
  };

  const suggestMessage = (msg) => {
    setClientMessage(msg);
  };

  if (loading) return <LoadingState message="Carregando processo..." />;
  if (!proc) return <ErrorState message="Processo não encontrado" onRetry={() => navigate('/admin/processos')} />;

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
        <button onClick={() => navigate('/admin/processos')} className="portal-btn portal-btn-ghost" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="portal-flex portal-items-center portal-gap-4">
            <h1 className="portal-h1" style={{ marginBottom: 0 }}>Gestão de Processo</h1>
            <StatusBadge status={proc.status} />
            {proc.prioridade === 'urgente' && <span style={{ fontSize: '0.75rem', color: 'white', backgroundColor: 'var(--portal-danger)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>URGENTE</span>}
          </div>
          <p className="portal-subtitle" style={{ marginBottom: 0 }}>ID: {proc.id} • Protocolo: {proc.protocolo}</p>
        </div>
      </div>

      <div className="portal-grid portal-grid-3">
        <div style={{ gridColumn: 'span 2' }}>
          
          <div style={sectionStyle}>
            <h3 className="portal-h3 portal-flex portal-items-center portal-gap-2">
              <Briefcase size={20} className="portal-text-primary" /> Detalhes do Serviço
            </h3>
            
            <div className="portal-grid portal-grid-2">
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={labelStyle}>Título do Processo</div>
                <div style={{ ...valueStyle, fontSize: '1.125rem', color: 'var(--portal-primary)' }}>{proc.titulo}</div>
              </div>
              
              <div>
                <div style={labelStyle}>Cliente</div>
                <div style={valueStyle}>{proc.clienteNome}</div>
              </div>

              <div>
                <div style={labelStyle}>Empresa Vinculada</div>
                <div style={valueStyle}>{proc.empresaNome || 'Não se aplica'} {proc.empresaCnpj ? `(${proc.empresaCnpj})` : ''}</div>
              </div>

              <div>
                <div style={labelStyle}>Tipo / Categoria</div>
                <div style={valueStyle}>{proc.tipo}</div>
              </div>

              <div>
                <div style={labelStyle}>Responsável Interno</div>
                <div style={valueStyle}>{proc.responsavel || 'Não atribuído'}</div>
              </div>

              <div>
                <div style={labelStyle}>Abertura</div>
                <div style={valueStyle}>{new Date(proc.dataCriacao).toLocaleDateString('pt-BR')}</div>
              </div>

              <div>
                <div style={labelStyle}>Previsão (SLA)</div>
                <div style={{ ...valueStyle, color: proc.previsaoConclusao && new Date(proc.previsaoConclusao) < new Date() ? 'var(--portal-danger)' : 'var(--portal-text-main)' }}>
                  {proc.previsaoConclusao ? new Date(proc.previsaoConclusao).toLocaleDateString('pt-BR') : 'Não definida'}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--portal-bg)', borderRadius: '8px', border: '1px solid var(--portal-border)' }}>
              <div style={labelStyle}>Próximo Passo (Visão do Cliente)</div>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>{proc.proximoPasso || 'Nenhum passo definido.'}</p>
            </div>
          </div>

          <div style={sectionStyle}>
            <h3 className="portal-h3">Mudar Status do Processo</h3>
            <div className="portal-flex portal-gap-2" style={{ flexWrap: 'wrap' }}>
              <button disabled={updating || proc.status === 'em_analise'} className="portal-btn portal-btn-secondary" onClick={() => handleChangeStatus('em_analise')}>Marcar em Análise</button>
              <button disabled={updating || proc.status === 'aguardando_cliente'} className="portal-btn portal-btn-secondary" onClick={() => handleChangeStatus('aguardando_cliente')}>Aguardar Cliente</button>
              <button disabled={updating || proc.status === 'aguardando_pagamento'} className="portal-btn portal-btn-secondary" onClick={() => handleChangeStatus('aguardando_pagamento')}>Aguardar Pagamento</button>
              <button disabled={updating || proc.status === 'em_execucao'} className="portal-btn portal-btn-secondary" onClick={() => handleChangeStatus('em_execucao')}>Em Execução</button>
              <button disabled={updating || proc.status === 'aguardando_orgao_externo'} className="portal-btn portal-btn-secondary" onClick={() => handleChangeStatus('aguardando_orgao_externo')}>Aguardar Órgão Ext.</button>
              <PrimaryButton disabled={updating || proc.status === 'concluido'} onClick={() => handleChangeStatus('concluido')} style={{ backgroundColor: 'var(--portal-success)' }}>
                Concluir Processo
              </PrimaryButton>
            </div>
          </div>

          <div style={sectionStyle}>
            <h3 className="portal-h3">Comunicação Rápida com Cliente (Espanhol)</h3>
            <div style={{ padding: '1rem', backgroundColor: 'var(--portal-bg)', border: '1px solid var(--portal-border)', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
              {proc.observacoesCliente || 'Nenhuma mensagem recente.'}
            </div>
            
            <textarea 
              value={clientMessage}
              onChange={e => setClientMessage(e.target.value)}
              placeholder="Ex: Tu proceso fue actualizado. Puedes acompañar el próximo paso desde el portal."
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--portal-border)', marginBottom: '0.5rem', minHeight: '80px', resize: 'vertical' }}
            />
            
            <div className="portal-flex portal-gap-2 portal-mb-4" style={{ flexWrap: 'wrap' }}>
              <button className="portal-btn portal-btn-ghost" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }} onClick={() => suggestMessage('Tu proceso fue actualizado. Puedes acompañar el próximo paso desde el portal.')}>Atualizado</button>
              <button className="portal-btn portal-btn-ghost" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }} onClick={() => suggestMessage('Necesitamos un documento tuyo para continuar. Por favor, verifica en el portal.')}>Falta Documento</button>
              <button className="portal-btn portal-btn-ghost" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }} onClick={() => suggestMessage('Estamos aguardando la respuesta del órgano responsable (Receita/Junta).')}>Aguardando Órgão</button>
              <button className="portal-btn portal-btn-ghost" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }} onClick={() => suggestMessage('¡Excelente noticia! Tu proceso fue concluido con éxito.')}>Concluído</button>
            </div>

            <div className="portal-flex portal-gap-2">
              <PrimaryButton disabled={updating || !clientMessage.trim()} onClick={handleAddClientMessage} style={{ backgroundColor: 'var(--portal-purple)' }}>
                <Send size={16} style={{ marginRight: '0.5rem' }} /> Enviar e Registrar
              </PrimaryButton>
            </div>
          </div>
        </div>

        <div>
          <div style={sectionStyle}>
            <h3 className="portal-h3">Histórico e Log</h3>
            <div className="portal-flex-col portal-gap-4" style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {proc.historico && proc.historico.length > 0 ? (
                proc.historico.slice().reverse().map((hist, index) => (
                  <div key={index} className="portal-flex portal-gap-3" style={{ borderLeft: '2px solid var(--portal-border)', paddingLeft: '0.75rem', marginLeft: '0.5rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-5px', top: '0', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: index === 0 ? 'var(--portal-primary)' : 'var(--portal-border)' }}></div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{hist.acao}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--portal-text-muted)' }}>
                        {new Date(hist.data).toLocaleString('pt-BR')} • {hist.usuario}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '0.875rem', color: 'var(--portal-text-muted)' }}>Sem histórico disponível.</p>
              )}
            </div>
          </div>

          <div style={{ ...sectionStyle, backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}>
            <h3 className="portal-h3" style={{ color: '#D97706' }}>Anotações Internas (Equipe)</h3>
            <div style={{ padding: '1rem', backgroundColor: 'white', border: '1px dashed #FDE68A', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1rem', whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto' }}>
              {proc.observacoesInternas || 'Nenhuma nota registrada.'}
            </div>
            <textarea 
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Adicionar nota restrita à equipe Tu Socio..."
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #FCD34D', marginBottom: '0.5rem', minHeight: '80px', resize: 'vertical' }}
            />
            <SecondaryButton disabled={updating || !noteText.trim()} onClick={handleAddNote}>Salvar Nota Interna</SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProcessoDetails;
