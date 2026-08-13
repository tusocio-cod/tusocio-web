import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { createPagamento } from '../../../portal/fakeServices';
import { PrimaryButton, SecondaryButton } from '../../../shared/components/SharedComponents';

export default function AdminPagamentoForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clienteId: 'cli_001',
    clienteNome: 'Juan Pérez', // Mocked user info for MVP
    titulo: '',
    tipoCobranca: 'mensalidade_contabil',
    servicoRelacionado: '',
    valor: '',
    dataVencimento: '',
    metodoPagamento: 'PIX',
    descricao: '',
    observacoesInternas: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSubmit = {
        ...formData,
        valor: parseFloat(formData.valor) || 0
      };
      
      if (dataToSubmit.tipoCobranca === 'mensalidade_contabil') dataToSubmit.servicoRelacionado = 'Contabilidade Mensal';
      else if (dataToSubmit.tipoCobranca === 'abertura_empresa') dataToSubmit.servicoRelacionado = 'Abertura de Empresa';
      else if (dataToSubmit.tipoCobranca === 'alteracao_contratual') dataToSubmit.servicoRelacionado = 'Alteração Contratual';
      else if (dataToSubmit.tipoCobranca === 'imposto_renda') dataToSubmit.servicoRelacionado = 'Imposto de Renda';
      else if (dataToSubmit.tipoCobranca === 'documentacao') dataToSubmit.servicoRelacionado = 'Serviços de Documentação';

      const newPagamento = await createPagamento(dataToSubmit, 'Admin Tu Socio');
      navigate(`/admin/pagamentos/${newPagamento.id}`);
    } catch (error) {
      console.error("Erro ao criar cobrança", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button className="portal-btn portal-btn-ghost portal-mb-6" onClick={() => navigate('/admin/pagamentos')}>
        <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Voltar para Pagamentos
      </button>

      <div className="portal-card">
        <h1 className="portal-h2 portal-mb-6">Nova Cobrança</h1>

        <form onSubmit={handleSubmit} className="portal-flex-col portal-gap-4">
          
          <div className="portal-grid portal-grid-2 portal-gap-4">
            <div>
              <label className="portal-label">Cliente *</label>
              <select 
                className="portal-input" 
                name="clienteId" 
                value={formData.clienteId} 
                onChange={handleChange}
                required
              >
                <option value="cli_001">Juan Pérez (JP Imports)</option>
                <option value="cli_002">Maria Souza (Mock)</option>
              </select>
            </div>
            <div>
              <label className="portal-label">Tipo de Cobrança *</label>
              <select 
                className="portal-input" 
                name="tipoCobranca" 
                value={formData.tipoCobranca} 
                onChange={handleChange}
                required
              >
                <option value="mensalidade_contabil">Mensalidade Contábil</option>
                <option value="abertura_empresa">Abertura de Empresa</option>
                <option value="alteracao_contratual">Alteração Contratual</option>
                <option value="imposto_renda">Imposto de Renda</option>
                <option value="documentacao">Documentação</option>
                <option value="assessoria_imobiliaria">Assessoria Imobiliária</option>
                <option value="treinamento_marketplace">Treinamento Marketplace</option>
                <option value="emissao_nota">Emissão de Nota</option>
                <option value="suporte_operacional">Suporte Operacional</option>
                <option value="servico_avulso">Serviço Avulso</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="portal-label">Título da Cobrança *</label>
            <input 
              type="text" 
              className="portal-input" 
              name="titulo" 
              value={formData.titulo} 
              onChange={handleChange} 
              placeholder="Ex: Mensalidade - Outubro 2026"
              required 
            />
          </div>

          <div className="portal-grid portal-grid-2 portal-gap-4">
            <div>
              <label className="portal-label">Valor (R$) *</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                className="portal-input" 
                name="valor" 
                value={formData.valor} 
                onChange={handleChange} 
                placeholder="0.00"
                required 
              />
            </div>
            <div>
              <label className="portal-label">Vencimento *</label>
              <input 
                type="date" 
                className="portal-input" 
                name="dataVencimento" 
                value={formData.dataVencimento} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div>
            <label className="portal-label">Método de Pagamento Sugerido</label>
            <select 
              className="portal-input" 
              name="metodoPagamento" 
              value={formData.metodoPagamento} 
              onChange={handleChange}
            >
              <option value="PIX">PIX</option>
              <option value="Boleto">Boleto Bancário</option>
              <option value="Cartão de Crédito">Cartão de Crédito</option>
              <option value="Transferência">Transferência Bancária</option>
            </select>
          </div>

          <div>
            <label className="portal-label">Descrição para o Cliente (Opcional)</label>
            <textarea 
              className="portal-input" 
              name="descricao" 
              value={formData.descricao} 
              onChange={handleChange} 
              rows={3} 
              placeholder="Explique do que se trata esta cobrança. Visível para o cliente (em espanhol)."
            />
          </div>

          <div>
            <label className="portal-label">Observações Internas (Opcional)</label>
            <textarea 
              className="portal-input" 
              name="observacoesInternas" 
              value={formData.observacoesInternas} 
              onChange={handleChange} 
              rows={2} 
              placeholder="Notas apenas para a equipe Tu Socio."
            />
          </div>

          <div className="portal-mt-4 portal-flex portal-gap-4 portal-justify-end" style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--portal-border)' }}>
            <SecondaryButton type="button" onClick={() => navigate('/admin/pagamentos')}>
              <X size={18} style={{ marginRight: '0.5rem' }} /> Cancelar
            </SecondaryButton>
            <PrimaryButton type="submit" loading={loading}>
              <Save size={18} style={{ marginRight: '0.5rem' }} /> Salvar Cobrança
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
