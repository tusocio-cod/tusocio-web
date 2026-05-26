import React, { useState, useEffect } from 'react';
import { ShoppingBag, HelpCircle, ChevronDown, CheckCircle2, ChevronUp, Trash2, Calculator, ArrowRight, Lightbulb, AlertTriangle, MessageCircle } from 'lucide-react';
import { marketplaceFeeConfig, calculateMarketplaceFees } from '../utils/marketplaceCalculator';
import './CalculadoraPrecios.css';

const WA_LINK = "https://wa.me/5511952170637?text=Hola%2C%20vi%20la%20calculadora%20y%20quisiera%20m%C3%A1s%20informaci%C3%B3n.";

export default function CalculadoraPrecios() {
  const [platform, setPlatform] = useState('shopee');
  const [sellerType, setSellerType] = useState('CNPJ');
  const [hasSFP, setHasSFP] = useState(true);
  const [mode, setMode] = useState('calculateNet'); // 'calculateNet' or 'calculateSuggestedPrice'
  
  const [inputs, setInputs] = useState({
    mainValue: '', // Precio final or Valor deseado
    productCost: '',
    shippingCost: '',
    otherCosts: '',
    affiliateCommission: ''
  });

  const [result, setResult] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleInputChange = (e, nameOverride) => {
    const { name, value } = e.target;
    const fieldName = nameOverride || name;
    // Allow only numbers, dot, and comma
    if (value === '' || /^\d*[.,]?\d*$/.test(value)) {
      setInputs(prev => ({ ...prev, [fieldName]: value }));
    }
  };

  const handleClear = () => {
    setInputs({
      mainValue: '',
      productCost: '',
      shippingCost: '',
      otherCosts: '',
      affiliateCommission: ''
    });
    setResult(null);
    setShowDetails(false);
  };

  const parseVal = (val) => val ? val.replace(',', '.') : '0';

  const handleCalculate = () => {
    if (!inputs.mainValue) return;

    const res = calculateMarketplaceFees({
      platformId: platform,
      mode: mode,
      mainValue: parseVal(inputs.mainValue),
      productCost: parseVal(inputs.productCost),
      shippingCost: parseVal(inputs.shippingCost),
      otherCosts: parseVal(inputs.otherCosts),
      sellerType: sellerType,
      hasSFP: hasSFP,
      affiliateCommission: parseVal(inputs.affiliateCommission)
    });
    
    setResult(res);
    setShowDetails(false); // reset details view on new calc
  };

  const formatMoney = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  const parseInputToNum = (val) => Number(parseVal(val)) || 0;

  const config = marketplaceFeeConfig[platform];

  return (
    <div className="calc-page-wrapper">
      <section className="calc-hero">
        <h1>Calcula tus precios <br/>para <span className="highlight">vender mejor</span></h1>
        <p>Simula las tasas de Shopee, SHEIN, TikTok Shop y Mercado Livre para entender cuánto recibes o por cuánto debes vender.</p>
      </section>

      <div className="calc-container">
        {/* Left Column: Form */}
        <div className="calc-card">
          <div className="step-title">1. Elige tu marketplace</div>
          <div className="platform-grid">
            {Object.keys(marketplaceFeeConfig).map(key => {
              const p = marketplaceFeeConfig[key];
              if (!p.active) return null;
              return (
                <div 
                  key={key} 
                  className={`platform-btn ${platform === key ? 'active' : ''}`}
                  onClick={() => {
                    setPlatform(key);
                    setResult(null); // Clear result on platform change
                  }}
                >
                  <ShoppingBag size={24} color={platform === key ? '#ff5a00' : '#a1a1aa'} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{p.label}</span>
                </div>
              );
            })}
          </div>

          {platform === 'shopee' && (
            <div style={{ marginTop: '-1rem', marginBottom: '2rem', padding: '1.25rem', background: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="step-title" style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>Tipo de Vendedor (Shopee)</div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className={`btn-calc ${sellerType === 'CNPJ' ? 'btn-calc-primary' : 'btn-calc-secondary'}`}
                  style={{ padding: '0.75rem', fontSize: '0.9rem', flex: 1 }}
                  onClick={() => { setSellerType('CNPJ'); setResult(null); }}
                >
                  CNPJ
                </button>
                <button 
                  className={`btn-calc ${sellerType === 'CPF' ? 'btn-calc-primary' : 'btn-calc-secondary'}`}
                  style={{ padding: '0.75rem', fontSize: '0.9rem', flex: 1 }}
                  onClick={() => { setSellerType('CPF'); setResult(null); }}
                >
                  CPF (+R$ 3,00)
                </button>
              </div>
            </div>
          )}

          {platform === 'tiktokshop' && (
            <div style={{ marginTop: '-1rem', marginBottom: '2rem', padding: '1.25rem', background: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="step-title" style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>¿Participas en el Programa de Frete Grátis (SFP)?</div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className={`btn-calc ${!hasSFP ? 'btn-calc-primary' : 'btn-calc-secondary'}`}
                  style={{ padding: '0.75rem', fontSize: '0.9rem', flex: 1 }}
                  onClick={() => { setHasSFP(false); setResult(null); }}
                >
                  No
                </button>
                <button 
                  className={`btn-calc ${hasSFP ? 'btn-calc-primary' : 'btn-calc-secondary'}`}
                  style={{ padding: '0.75rem', fontSize: '0.9rem', flex: 1 }}
                  onClick={() => { setHasSFP(true); setResult(null); }}
                >
                  Sí (+6%)
                </button>
              </div>
            </div>
          )}

          <div className="step-title">2. ¿Qué quieres calcular?</div>
          <div className="mode-grid">
            <div 
              className={`mode-btn ${mode === 'calculateNet' ? 'active' : ''}`}
              onClick={() => { setMode('calculateNet'); setResult(null); }}
            >
              <div className="mode-btn-title">
                <div className="mode-btn-radio"><div className="inner"></div></div>
                Quiero saber cuánto gano
              </div>
              <div className="mode-btn-desc">Ingresa el precio final de venta y te mostramos cuánto recibes después de las tasas.</div>
            </div>
            <div 
              className={`mode-btn ${mode === 'calculateSuggestedPrice' ? 'active' : ''}`}
              onClick={() => { setMode('calculateSuggestedPrice'); setResult(null); }}
            >
              <div className="mode-btn-title">
                <div className="mode-btn-radio"><div className="inner"></div></div>
                Quiero saber por cuánto vender
              </div>
              <div className="mode-btn-desc">Ingresa cuánto quieres recibir y calculamos un precio sugerido para anunciar.</div>
            </div>
          </div>

          <div className="step-title">3. Completa los valores</div>
          <div className="inputs-grid">
            <div className="input-group">
              <label className="input-label">
                <span>{mode === 'calculateNet' ? 'Precio final de venta (R$)' : 'Valor líquido que deseas (R$)'} <span style={{color: '#ff5a00'}}>*</span></span>
                <div className="tooltip-container">
                  <HelpCircle size={14} />
                  <div className="custom-tooltip">
                    {mode === 'calculateNet' 
                      ? "Representa el valor total que el cliente pagará.\nEj: 219.80\nSugerencia: Ingresa el precio que planeas poner en tu anuncio." 
                      : "Representa cuánto quieres que te quede libre de comisiones.\nEj: 150.00\nSugerencia: Calcula tu costo + tu ganancia ideal."}
                  </div>
                </div>
              </label>
              <input 
                type="text" 
                className="calc-input" 
                name="mainValue"
                value={inputs.mainValue}
                onChange={handleInputChange}
                placeholder="Ej: 100.00"
              />
            </div>
            <div className="input-group">
              <label className="input-label">
                <span>Costo del producto (R$) (opcional)</span>
                <div className="tooltip-container">
                  <HelpCircle size={14} />
                  <div className="custom-tooltip">
                    Representa cuánto te costó a ti el producto (fabricación o compra al proveedor).<br/>Ej: 130.00<br/>Sugerencia: Incluye impuestos de compra o fletes.
                  </div>
                </div>
              </label>
              <input 
                type="text" 
                className="calc-input" 
                name="productCost"
                value={inputs.productCost}
                onChange={handleInputChange}
                placeholder="Ej: 40.00"
              />
            </div>
            <div className="input-group">
              <label className="input-label">
                <span>Otros costos (R$) (opcional)</span>
                <div className="tooltip-container">
                  <HelpCircle size={14} />
                  <div className="custom-tooltip custom-tooltip-right">
                    Representa costos extras como embalaje, envío, publicidad (Ads), contador o devoluciones estimadas.<br/>Ej: 5.00<br/>Sugerencia: Pon un 2-5% del valor por margen de error.
                  </div>
                </div>
              </label>
              <input 
                type="text" 
                className="calc-input" 
                placeholder="Ej: 5.00"
                value={inputs.otherCosts}
                onChange={(e) => handleInputChange(e, 'otherCosts')}
              />
            </div>
            {platform === 'tiktokshop' && (
              <div className="input-group">
                <label className="input-label">
                  <span>Comisión de afiliado (%) (opcional)</span>
                  <div className="tooltip-container">
                    <HelpCircle size={14} />
                    <div className="custom-tooltip custom-tooltip-right">
                      Porcentaje de comisión destinado a afiliados en TikTok.<br/>Ej: 10<br/>Sugerencia: Ingresa el valor pactado (usualmente 10-11%).
                    </div>
                  </div>
                </label>
                <input 
                  type="text" 
                  className="calc-input" 
                  placeholder="Ej: 10"
                  value={inputs.affiliateCommission}
                  onChange={(e) => handleInputChange(e, 'affiliateCommission')}
                />
              </div>
            )}
          </div>

          <div className="calc-actions">
            <button className="btn-calc btn-calc-secondary" onClick={handleClear}>
              <Trash2 size={18}/> Limpiar
            </button>
            <button className="btn-calc btn-calc-primary" onClick={handleCalculate} disabled={!inputs.mainValue}>
              <Calculator size={18}/> Calcular
            </button>
          </div>

          <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#6b7280', display: 'flex', justifyContent: 'space-between' }}>
            <span>Base de tasas actualizada el: {config.lastUpdated || <span style={{color: '#fb923c'}}>Pendiente</span>}</span>
          </div>
        </div>

        {/* Right Column: Results */}
        <div>
          <div className="result-card">
            <div className="result-header">
              <Calculator size={20}/>
              Resultado estimado
            </div>

            <div className="result-main">
              <div className="result-main-label">
                {mode === 'calculateNet' ? 'Valor líquido que recibes' : 'Precio sugerido para anunciar'}
                <HelpCircle size={14} color="#6b7280"/>
              </div>
              <div className={`result-main-value ${mode === 'calculateSuggestedPrice' ? 'suggested' : ''}`}>
                {result ? (
                  mode === 'calculateNet' ? formatMoney(result.estimatedNetValue) : formatMoney(result.suggestedPrice)
                ) : 'R$ 0,00'}
              </div>
            </div>

            <div className="result-grid">
              <div className="result-item">
                <div className="result-item-label">
                  {mode === 'calculateNet' ? 'Precio final de venta' : 'Valor líquido deseado'}
                </div>
                <div className="result-item-value">
                  {result ? formatMoney(mode === 'calculateNet' ? result.grossPrice : result.desiredNetValue) : 'R$ 0,00'}
                </div>
              </div>
              <div className="result-item">
                <div className="result-item-label">Total de tasas</div>
                <div className="result-item-value negative">
                  {result ? `- ${formatMoney(result.totalPlatformFees)}` : '- R$ 0,00'}
                </div>
              </div>
              <div className="result-item">
                <div className="result-item-label">Costos informados</div>
                <div className="result-item-value negative">
                  {result ? `- ${formatMoney(result.totalUserCosts)}` : '- R$ 0,00'}
                </div>
              </div>
              <div className="result-item">
                <div className="result-item-label">Tu ganancia estimada</div>
                <div 
                  className={`result-item-value ${result && result.estimatedProfit > 0 ? 'positive' : ''} ${result && result.estimatedProfit < 0 ? 'negative' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  {result && result.estimatedProfit < 0 && <AlertTriangle size={20} color="#f87171" />}
                  {result ? formatMoney(result.estimatedProfit) : 'R$ 0,00'}
                </div>
              </div>
            </div>

            <button className="accordion-btn" onClick={() => setShowDetails(!showDetails)}>
              + Detalles del cálculo {showDetails ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
            </button>

            <div className={`accordion-content ${showDetails ? 'open' : ''}`}>
              <table className="details-table">
                <thead>
                  <tr>
                    <th>Concepto</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Comisión de la plataforma</td>
                    <td>% sobre venta</td>
                    <td>{result ? result.breakdown.commission + '%' : (platform === 'shopee' ? 'Variable' : config.commissionPercent + '%')}</td>
                  </tr>
                  <tr>
                    <td>Tarifa de servicio</td>
                    <td>% sobre venta</td>
                    <td>{result ? result.breakdown.service + '%' : (platform === 'shopee' ? '0%' : (platform === 'tiktokshop' && hasSFP ? '6%' : config.servicePercent + '%'))}</td>
                  </tr>
                  <tr>
                    <td>Tarifa de transacción</td>
                    <td>% sobre venta</td>
                    <td>{result ? result.breakdown.transaction + '%' : (platform === 'shopee' ? '2%' : config.transactionPercent + '%')}</td>
                  </tr>
                  <tr>
                    <td>{platform === 'shein' ? 'Intermediación de flete' : 'Tarifa fija por pedido'}</td>
                    <td>Fija</td>
                    <td>{result ? formatMoney(result.breakdown.fixed) : (platform === 'shopee' ? (sellerType === 'CPF' ? 'R$ 4,00 a R$ 29,00' : 'R$ 4,00 a R$ 26,00') : formatMoney(config.fixedFee))}</td>
                  </tr>
                  <tr>
                    <td>{platform === 'tiktokshop' ? 'Comisión de afiliado' : 'Impuestos y otros cargos'}</td>
                    <td>% sobre venta</td>
                    <td>{result ? result.breakdown.extra + '%' : (platform === 'shopee' ? '0%' : (platform === 'tiktokshop' ? (inputs.affiliateCommission || '0') + '%' : config.extraFeePercent + '%'))}</td>
                  </tr>
                  <tr className="details-total-row">
                    <td>Total de tasas</td>
                    <td>% sobre venta</td>
                    <td>{result ? result.totalPercentFees + '%' : (platform === 'shopee' ? 'Variable' : (config.commissionPercent + (platform === 'tiktokshop' && hasSFP ? 6 : config.servicePercent) + config.transactionPercent + (platform === 'tiktokshop' ? Number(inputs.affiliateCommission || 0) : config.extraFeePercent)) + '%')}</td>
                  </tr>
                  <tr>
                    <td>Total de tasas (en R$)</td>
                    <td></td>
                    <td>{result ? formatMoney(result.totalPlatformFees) : 'R$ 0,00'}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} style={{ borderBottom: 'none', height: '10px' }}></td>
                  </tr>
                  <tr>
                    <td>Costo del producto</td>
                    <td></td>
                    <td>{result ? formatMoney(inputs.productCost || 0) : 'R$ 0,00'}</td>
                  </tr>
                  <tr>
                    <td>Otros costos informados</td>
                    <td></td>
                    <td>{result ? formatMoney(inputs.otherCosts || 0) : 'R$ 0,00'}</td>
                  </tr>
                  <tr className="details-final-row">
                    <td>{mode === 'calculateNet' ? 'Valor líquido estimado que recibes' : 'Precio sugerido para venta'}</td>
                    <td></td>
                    <td>{result ? formatMoney(mode === 'calculateNet' ? result.estimatedNetValue : result.suggestedPrice) : 'R$ 0,00'}</td>
                  </tr>
                </tbody>
              </table>
              <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#6b7280' }}>
                <p><strong>Fuente:</strong> {config.source}</p>
                {config.notes && <p><strong>Nota:</strong> {config.notes}</p>}
                {!config.lastUpdated && <p style={{color: '#fb923c'}}>Base de tasas pendiente de actualización por el equipo Tu Socio.</p>}
              </div>
            </div>

            <div className="disclaimer-box">
              <Lightbulb className="disclaimer-icon" size={24}/>
              <div className="disclaimer-text">
                Esta calculadora es una simulación.<br/>
                Las tasas pueden variar si estás participando en acciones comerciales o promociones especiales de cada marketplace.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-horizontal-banner">
        <div className="cta-horizontal-text">
          <h3>¿Quieres vender con más seguridad?</h3>
          <p>Te ayudamos con CNPJ, nota fiscal, organización de tienda y orientación para marketplaces.</p>
        </div>
        <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="cta-horizontal-button">
          <MessageCircle size={18} /> Habla con un especialista
        </a>
      </div>
    </div>
  );
}
