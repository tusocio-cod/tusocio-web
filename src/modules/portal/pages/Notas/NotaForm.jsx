import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';
import { createNotaFiscalSolicitacao } from '../../fakeServices';
import { PrimaryButton, SecondaryButton } from '../../../shared/components/SharedComponents';
import { Save, Send } from 'lucide-react';

export const NotaForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    tipoNota: 'servico',
    canal: 'servico_direto',
    empresaCnpj: '',
    tomadorNome: '',
    tomadorDocumento: '',
    tomadorEmail: '',
    tomadorCidade: '',
    tomadorUf: '',
    descricao: '',
    quantidade: 1,
    valorUnitario: '',
    valorTotal: '',
    dataCompetencia: '',
    observacoesCliente: '',
    confirmacao: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const calculateTotal = (qtd, vUnitario) => {
    const q = parseFloat(qtd) || 0;
    const v = parseFloat(vUnitario) || 0;
    return (q * v).toFixed(2);
  };

  const handleBlurValue = () => {
    setFormData(prev => ({
      ...prev,
      valorTotal: calculateTotal(prev.quantidade, prev.valorUnitario)
    }));
  };

  const handleSubmit = async (e, asDraft = false) => {
    e.preventDefault();
    if (!asDraft && !formData.confirmacao) {
      alert('Por favor, confirma que la información es correcta.');
      return;
    }

    setLoading(true);
    try {
      await createNotaFiscalSolicitacao({
        ...formData,
        clienteId: user.id,
        clienteNome: user.nome,
        empresaId: 'emp_001', // Mockado para o teste atual
        status: asDraft ? 'rascunho' : 'em_revisao',
        quantidade: parseFloat(formData.quantidade) || 1,
        valorUnitario: parseFloat(formData.valorUnitario) || 0,
        valorTotal: parseFloat(formData.valorTotal) || 0,
      });
      navigate('/area-cliente/notas');
    } catch (error) {
      console.error(error);
      alert('Error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid var(--portal-border)',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    backgroundColor: 'var(--portal-surface)',
    color: 'var(--portal-text-main)'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--portal-text-main)',
    marginBottom: '0.5rem'
  };

  const sectionStyle = {
    backgroundColor: 'var(--portal-card)',
    padding: '1.5rem',
    borderRadius: 'var(--portal-radius)',
    border: '1px solid var(--portal-border)',
    marginBottom: '1.5rem',
    boxShadow: 'var(--portal-shadow)'
  };

  return (
    <div>
      <div className="portal-flex portal-justify-between portal-items-center portal-mb-8">
        <div>
          <h1 className="portal-h1">Solicitar nota fiscal</h1>
          <p className="portal-subtitle" style={{ marginBottom: 0 }}>
            Completa los datos y nuestro equipo revisará la información antes de emitir.
          </p>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)}>
        {/* Bloco 1 — Tipo de nota */}
        <div style={sectionStyle}>
          <h3 className="portal-h3">1. Tipo de operación</h3>
          <div className="portal-grid portal-grid-2">
            <div>
              <label style={labelStyle}>Tipo de nota *</label>
              <select name="tipoNota" value={formData.tipoNota} onChange={handleChange} style={inputStyle} required>
                <option value="servico">Nota de servicio</option>
                <option value="produto">Nota de producto / venta</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Canal de venta relacionado *</label>
              <select name="canal" value={formData.canal} onChange={handleChange} style={inputStyle} required>
                <option value="servico_direto">Servicio directo</option>
                <option value="shopee">Shopee</option>
                <option value="tiktok_shop">TikTok Shop</option>
                <option value="shein">SHEIN</option>
                <option value="mercado_livre">Mercado Libre</option>
                <option value="loja_fisica">Tienda física</option>
                <option value="outro">Otro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bloco 2 — Empresa emitente */}
        <div style={sectionStyle}>
          <h3 className="portal-h3">2. Empresa emitente (Tu Empresa)</h3>
          <label style={labelStyle}>CNPJ da empresa *</label>
          <input 
            type="text" 
            name="empresaCnpj" 
            placeholder="00.000.000/0001-00" 
            value={formData.empresaCnpj} 
            onChange={handleChange} 
            style={inputStyle} 
            required 
          />
        </div>

        {/* Bloco 3 — Dados do tomador/cliente */}
        <div style={sectionStyle}>
          <h3 className="portal-h3">3. Datos del Cliente (A quién le vendes)</h3>
          <div className="portal-grid portal-grid-2">
            <div>
              <label style={labelStyle}>Nombre / Razón Social *</label>
              <input type="text" name="tomadorNome" value={formData.tomadorNome} onChange={handleChange} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>CPF / CNPJ *</label>
              <input type="text" name="tomadorDocumento" value={formData.tomadorDocumento} onChange={handleChange} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>E-mail (Opcional)</label>
              <input type="email" name="tomadorEmail" value={formData.tomadorEmail} onChange={handleChange} style={inputStyle} />
            </div>
            <div className="portal-grid portal-grid-2" style={{ gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Ciudad</label>
                <input type="text" name="tomadorCidade" value={formData.tomadorCidade} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>UF</label>
                <input type="text" name="tomadorUf" maxLength="2" placeholder="SP" value={formData.tomadorUf} onChange={handleChange} style={inputStyle} />
              </div>
            </div>
          </div>
        </div>

        {/* Bloco 4 — Dados da nota */}
        <div style={sectionStyle}>
          <h3 className="portal-h3">4. Detalles de la Factura</h3>
          <label style={labelStyle}>Descripción del servicio/producto *</label>
          <textarea 
            name="descricao" 
            value={formData.descricao} 
            onChange={handleChange} 
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} 
            required 
            placeholder="Describe qué vendiste o qué servicio prestaste..."
          />
          
          <div className="portal-grid portal-grid-3">
            <div>
              <label style={labelStyle}>Cantidad *</label>
              <input type="number" name="quantidade" min="1" value={formData.quantidade} onChange={handleChange} onBlur={handleBlurValue} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Valor Unitario (R$) *</label>
              <input type="number" step="0.01" name="valorUnitario" placeholder="0.00" value={formData.valorUnitario} onChange={handleChange} onBlur={handleBlurValue} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Valor Total (R$) *</label>
              <input type="number" step="0.01" name="valorTotal" value={formData.valorTotal} onChange={handleChange} style={{ ...inputStyle, backgroundColor: 'var(--portal-bg)' }} readOnly />
            </div>
          </div>

          <label style={labelStyle}>Fecha de competencia *</label>
          <input type="date" name="dataCompetencia" value={formData.dataCompetencia} onChange={handleChange} style={inputStyle} required />
          
          <label style={labelStyle}>Observaciones internas / Duda (Opcional)</label>
          <input type="text" name="observacoesCliente" value={formData.observacoesCliente} onChange={handleChange} style={inputStyle} placeholder="¿Alguna nota extra para nuestro equipo?" />
        </div>

        {/* Bloco 5 — Anexos */}
        <div style={sectionStyle}>
          <h3 className="portal-h3">5. Archivos adjuntos</h3>
          <div style={{ border: '2px dashed var(--portal-border)', padding: '2rem', textAlign: 'center', borderRadius: '8px', backgroundColor: 'var(--portal-bg)', marginBottom: '1rem' }}>
            <p style={{ color: 'var(--portal-text-muted)', fontSize: '0.875rem' }}>
              En esta etapa, los archivos son simulados para desarrollo. El upload real será implementado después.
            </p>
          </div>
        </div>

        {/* Bloco 6 — Revisão */}
        <div style={{ backgroundColor: 'var(--portal-warning-light)', padding: '1.5rem', borderRadius: '8px', borderLeft: '4px solid var(--portal-warning)', marginBottom: '2rem' }}>
          <label className="portal-flex portal-items-center" style={{ gap: '0.75rem', cursor: 'pointer' }}>
            <input type="checkbox" name="confirmacao" checked={formData.confirmacao} onChange={handleChange} style={{ width: '20px', height: '20px', accentColor: 'var(--portal-warning)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--portal-text-main)' }}>
              Confirmo que las informaciones enviadas están correctas para revisión de Tu Socio.
            </span>
          </label>
        </div>

        <div className="portal-flex portal-gap-4 portal-mb-8" style={{ flexWrap: 'wrap' }}>
          <SecondaryButton type="button" onClick={() => navigate('/area-cliente/notas')}>Cancelar</SecondaryButton>
          <div style={{ flex: 1 }}></div>
          <SecondaryButton type="button" onClick={(e) => handleSubmit(e, true)} disabled={loading}>
            <Save size={18} /> Guardar borrador
          </SecondaryButton>
          <PrimaryButton type="submit" loading={loading}>
            <Send size={18} /> Enviar para revisión
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default NotaForm;
