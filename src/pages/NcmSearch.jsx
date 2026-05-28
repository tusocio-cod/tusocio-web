import React, { useState } from 'react';
import { Search, FileSearch, CheckCircle2, Copy, AlertTriangle, MessageCircle, ChevronDown, ChevronUp, Package, X, RefreshCw, Database, HelpCircle } from 'lucide-react';
import { useNcmData } from '../hooks/useNcmData';
import { getChildrenNcm } from '../utils/ncmSearch';
import './NcmSearch.css';

const WA_LINK = "https://wa.me/5511952170637?text=Hola%2C%20quisiera%20ayuda%20con%20el%20NCM%20de%20mis%20productos.";

// ── Formata a data de sincronização ─────────────────────────
function formatSyncDate(isoDate) {
  if (!isoDate) return null;
  try {
    const d = new Date(isoDate);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch { return null; }
}

// ── Utilitário para remover tags HTML (ex: <i>) ─────────────
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
}

// ── Skeleton Loader ──────────────────────────────────────────
function NcmSkeleton() {
  return (
    <div className="ncm-skeleton-wrapper">
      {[1, 2].map(i => (
        <div key={i} className="ncm-skeleton-card">
          <div className="ncm-skeleton-icon" />
          <div className="ncm-skeleton-lines">
            <div className="ncm-skeleton-line w80" />
            <div className="ncm-skeleton-line w60" />
            <div className="ncm-skeleton-line w40" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Card de resultado ────────────────────────────────────────
const NcmResultCard = ({ result }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(result.normalizedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- INÍCIO: Parser inteligente para Vestuário (Capítulos 61 e 62) ---
  const getClothingProductType = (typeDigit) => {
    if (typeDigit === '1') return 'Tailleurs (Fatos de saia-casaco)';
    if (typeDigit === '2') return 'Conjuntos';
    if (typeDigit === '3') return 'Blazers (Casacos)';
    if (typeDigit === '4') return 'Vestidos';
    if (typeDigit === '5') return 'Saias e saias-calças';
    if (typeDigit === '6') return 'Calças, jardineiras e shorts';
    return null;
  };

  const getClothingMaterial = (matDigit) => {
    if (matDigit === '1') return 'De lã ou pelos finos';
    if (matDigit === '2') return 'De algodão';
    if (matDigit === '3') return 'De fibras sintéticas';
    if (matDigit === '4') return 'De fibras artificiais';
    if (matDigit === '9') return 'De outras matérias têxteis';
    return null;
  };

  const parseClothingCategory = (code, level) => {
    if (!code || typeof code !== 'string') return null;
    const cleanCode = code.replace(/\./g, '');
    if (cleanCode.length < 5) return null;
    
    if (cleanCode.startsWith('6104') || cleanCode.startsWith('6204')) {
      const typeStr = getClothingProductType(cleanCode[4]);
      const matStr = cleanCode.length >= 6 ? getClothingMaterial(cleanCode[5]) : null;
      
      if (level === 'sub') return typeStr ? `${typeStr} de uso feminino` : null;
      if (level === 'item') return matStr ? matStr : 'Sem especificação adicional';
    }
    return null;
  };

  const parsedSub = parseClothingCategory(result.subheading || result.normalizedCode, 'sub');
  const parsedItem = parseClothingCategory(result.normalizedCode, 'item');
  // --- FIM: Parser ---

  // Se o parser funcionar, usamos o texto traduzido ao invés da API poluída
  const descHeading = stripHtml(result.officialDescription);
  const descSub = parsedSub || stripHtml(result.simpleDescription || result.officialDescription);
  const descItem = parsedItem || stripHtml(result.simpleDescription || result.officialDescription);

  // Se a subposição e o item não trazem descrição nova (ex: 6104.00.00)
  // nós apenas omitimos as linhas redundantes do meio para deixar limpo.
  const isSubRedundant = descSub === descHeading && !parsedSub;
  const isItemRedundant = descItem === (isSubRedundant ? descHeading : descSub) && !parsedItem;

  const getItemText = () => {
    if (!isItemRedundant) return descItem;
    return <span style={{color: '#9ca3af', fontStyle: 'italic'}}>{result.material ? `Material: ${result.material}` : "Mesmas características da categoria principal"}</span>;
  };

  const getMaterialTooltip = (mat) => {
    if (!mat) return null;
    if (mat.includes('sintéticas')) return 'Crepinho, Duna, Poliéster, Tule, Suplex, Alfaiataria (comum).';
    if (mat.includes('artificiais')) return 'Viscose, Viscolycra, Liscolaicra, Modal, Rayon.';
    if (mat.includes('algodão')) return 'Tricoline, Moletom, Jeans.';
    if (mat.includes('outras')) return 'Linho puro, Viscolinho (onde o Linho for predominante), Seda.';
    return null;
  };

  const tooltipText = getMaterialTooltip(result.material);

  return (
    <div className="ncm-result-card">
      <div className="ncm-result-main">
        <div className="ncm-icon-wrapper">
          <Package className="ncm-icon" />
        </div>
        <div className="ncm-card-content">
          <div className="ncm-card-code">
            NCM {result.code}
            <span className={`ncm-badge ${result.confidence.toLowerCase()}`}>
              Confianza: {result.confidence}
            </span>
          </div>
          {result.material && (
            <div style={{ marginBottom: '0.75rem', position: 'relative' }}>
              <span 
                onClick={() => tooltipText && setShowTooltip(!showTooltip)}
                style={{ 
                  cursor: tooltipText ? 'pointer' : 'default',
                  background: 'rgba(255, 90, 0, 0.1)', 
                  color: '#fdba74', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '4px', 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  border: '1px solid rgba(255, 90, 0, 0.2)' 
                }}>
                🧶 Material: {result.material}
                {tooltipText && <HelpCircle size={14} style={{ opacity: 0.8 }} />}
              </span>
              
              {showTooltip && tooltipText && (
                <div style={{ 
                  marginTop: '0.5rem', 
                  padding: '0.75rem', 
                  background: 'rgba(20, 20, 24, 0.95)', 
                  border: '1px solid rgba(255, 90, 0, 0.3)', 
                  borderRadius: '8px', 
                  fontSize: '0.85rem', 
                  color: '#cbd5e1', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)', 
                  maxWidth: '100%',
                  lineHeight: '1.4'
                }}>
                  <div style={{ fontWeight: 600, color: '#e2e8f0', marginBottom: '0.25rem' }}>Exemplos comerciais:</div>
                  {tooltipText}
                </div>
              )}
            </div>
          )}
          <div className="ncm-card-desc">
            {stripHtml(result.simpleDescription || result.officialDescription)}
          </div>

          <div className="ncm-card-actions">
            <button onClick={handleCopy} className="btn-copy-ncm">
              {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              {copied ? '¡Copiado!' : 'Copiar NCM'}
            </button>
            <button onClick={() => setShowDetails(!showDetails)} className="btn-details">
              {showDetails ? 'Ocultar detalhes' : 'Ver detalhes'}
              {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-consult-ncm">
              <MessageCircle size={16} /> Consultar con Tu Socio
            </a>
          </div>

          {showDetails && (
            <div className="ncm-details-panel">
              {/* NCM Hierarchy Tree */}
              <div className="ncm-hierarchy-title">
                Itenização NCM {result.subheading || result.heading}
              </div>
              <div className="ncm-tree">
                {/* Capítulo */}
                <div className="ncm-tree-level ncm-tree-chapter">
                  <span className="ncm-tree-label">{result.chapter}</span>
                  <span className="ncm-tree-desc">
                    {result.chapter === '61' ? 'Vestuário e acessórios, de Malha' :
                     result.chapter === '62' ? 'Vestuário e acessórios, de Tecido Plano (exceto malha)' :
                     result.chapter === '63' ? 'Outros artefatos têxteis confeccionados' :
                     `Capítulo ${result.chapter}`}
                  </span>
                </div>

                {/* Posição (Heading) */}
                <div className="ncm-tree-level ncm-tree-heading">
                  <span className="ncm-tree-label">{result.heading}</span>
                  <span className="ncm-tree-desc">{descHeading}</span>
                </div>

                {/* Subposição (Padrão) */}
                {result.subheading && !isSubRedundant && (
                  <div className="ncm-tree-level ncm-tree-subheading">
                    <span className="ncm-tree-label">{result.subheading}</span>
                    <span className="ncm-tree-desc">
                      {result.subheading && result.subheading.endsWith('.00') ? 
                        <span style={{color: '#f87171', fontStyle: 'italic'}}>Agrupador de categoria (Não utilizar)</span> 
                        : descSub}
                    </span>
                  </div>
                )}

                {/* Código completo (Padrão) */}
                <div className="ncm-tree-level ncm-tree-item active-node">
                  <span className="ncm-tree-label">{result.normalizedCode}</span>
                  <span className="ncm-tree-desc">
                    {getItemText()}
                  </span>
                </div>
              </div>



              <div className="ncm-detail-row" style={{ marginTop: '1rem' }}>
                <div className="ncm-detail-label">Actualización</div>
                <div className="ncm-detail-value">{result.lastUpdated ? formatSyncDate(result.lastUpdated) : '—'}</div>
              </div>

              <div className="ncm-detail-alert">
                <AlertTriangle size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.5rem' }} />
                Este resultado es una orientación inicial. La clasificación final depende de materiales exactos, porcentajes de composición y uso del producto.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Componente principal ─────────────────────────────────────
export default function NcmSearch() {
  const { loading, ready, error, syncInfo, searchNcm } = useNcmData();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showFabricGuide, setShowFabricGuide] = useState(false);

  const popularSearches = ['Vestido', 'Blusa', 'Conjunto', 'Falda', 'Short', 'Regata', 'Legging'];

  const doSearch = async (term) => {
    if (!term.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setSearching(true);
    const res = await searchNcm(term);
    setResults(res);
    setHasSearched(true);
    setSearching(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    doSearch(query);
  };

  const handleQuickSearch = (term) => {
    setQuery(term);
    doSearch(term);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="ncm-page-wrapper">
      <div className="ncm-container">

        {/* Hero Section */}
        <div className="ncm-hero">
          <h1>Encuentra el <span className="highlight">NCM</span> de tu producto</h1>
          <p>Busca por palabras simples como vestido, blusa, conjunto, short o falda. Te ayudamos a encontrar códigos probables sin complicaciones.</p>
        </div>

        {/* Badge de sincronização */}
        {syncInfo && (
          <div className="ncm-sync-badge">
            <Database size={14} />
            {syncInfo.fromCache ? (
              syncInfo.syncedAt && <span>Atualizado en {formatSyncDate(syncInfo.syncedAt)}</span>
            ) : (
              <span style={{ color: '#fb923c' }}>Base local: Execute npm run sync:ncm</span>
            )}
          </div>
        )}

        {/* Info Cards */}
        <div className="ncm-info-cards">
          <div className="ncm-info-card">
            <div className="ncm-info-card-icon"><FileSearch size={24} /></div>
            <p>El NCM es un código obligatorio para notas fiscales y ventas online.</p>
          </div>
          <div className="ncm-info-card">
            <div className="ncm-info-card-icon"><Package size={24} /></div>
            <p>Identifica el tipo de producto, su composición y cómo tributa.</p>
          </div>
          <div className="ncm-info-card">
            <div className="ncm-info-card-icon"><AlertTriangle size={24} /></div>
            <p>Usa esto como guía. Si tienes dudas, revisa con nuestros asesores.</p>
          </div>
        </div>

        {/* Search Box */}
        <div className="ncm-search-card">
          <div className="ncm-search-header">
            <Search size={20} />
            Buscador Inteligente
            {loading && (
              <span className="ncm-loading-indicator">
                <RefreshCw size={14} className="ncm-spin" /> Cargando base...
              </span>
            )}
          </div>
          <form onSubmit={handleSearch} className="ncm-search-input-group">
            <input
              type="text"
              className="ncm-search-input"
              placeholder="Ejemplo: vestido de algodon, blusa, conjunto..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            {query && (
              <button type="button" onClick={handleClear} style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', marginRight: '0.5rem' }}>
                <X size={20} />
              </button>
            )}
            <button type="submit" className="btn-search" disabled={loading || searching}>
              {searching ? <RefreshCw size={16} className="ncm-spin" /> : <Search size={16} />}
              {searching ? 'Buscando...' : 'Buscar NCM'}
            </button>
          </form>

          {/* Botão Guia de Tecidos */}
          <div className="fabric-guide-btn-container">
            <button 
              type="button"
              onClick={() => setShowFabricGuide(true)}
              className="fabric-guide-btn"
            >
              📖 Guia de Tecidos Comerciais
            </button>
          </div>

          <div className="ncm-quick-chips">
            <span>Búsquedas rápidas:</span>
            {popularSearches.map(term => (
              <button
                key={term}
                type="button"
                className={`ncm-chip ${query.toLowerCase() === term.toLowerCase() ? 'active' : ''}`}
                onClick={() => handleQuickSearch(term)}
                disabled={loading}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Results / Skeleton */}
        {searching && <NcmSkeleton />}

        {hasSearched && !searching && (
          <div className="ncm-results-container">
            <div className="ncm-results-header">
              <h3>Resultados para: <span className="highlight-text">"{query}"</span></h3>
              <div className="ncm-results-count">{results.length} resultados encontrados</div>
            </div>

            {results.length > 0 ? (
              <div className="ncm-results-grid">
                {results.map((item) => (
                  <NcmResultCard key={`${item.code}-${item.normalizedCode}`} result={item} />
                ))}
              </div>
            ) : (
              <div className="ncm-empty-state">
                <div className="ncm-empty-icon">
                  <Search size={32} />
                </div>
                <h3>No encontramos un resultado exacto</h3>
                <p>Prueba buscando con palabras más simples o sinónimos. Ejemplo: "vestido" en lugar de "vestido largo de fiesta rojo".</p>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-search" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageCircle size={18} /> Hablar con un asesor
                </a>
              </div>
            )}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="ncm-detail-alert" style={{ marginBottom: '2rem' }}>
            <AlertTriangle size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '0.5rem' }} />
            Error al cargar la base NCM: {error}
          </div>
        )}

        {/* CTA Consultoria */}
        <div className="ncm-cta-section mt-12 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between bg-dark-secondary p-8 rounded-xl border border-white/5 text-center md:text-left">
            <div className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 className="text-2xl font-bold text-white" style={{ margin: 0 }}>¿Dudas con tu NCM?</h3>
              <div className="text-gray-300 text-lg leading-relaxed">
                <p style={{ margin: 0 }}>Clasificar mal un producto puede generar multas o problemas con tu nota fiscal. Nuestro equipo especializado puede ayudarte.</p>
              </div>
            </div>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-pill flex items-center justify-center gap-2 whitespace-nowrap w-full md:w-auto hover-lift" style={{ marginTop: '2rem', backgroundColor: '#ff5a00', color: 'white', border: 'none', boxShadow: '0 4px 14px rgba(255,90,0,0.3)', textDecoration: 'none', padding: '0.875rem 1.5rem', fontWeight: 600 }}>
              <MessageCircle size={18} /> Hablar con un especialista
            </a>
          </div>
        </div>

        {/* Modal Guia de Tecidos */}
        {showFabricGuide && (
          <div className="fabric-modal-overlay">
            <div className="fabric-modal-content">
              <div className="fabric-modal-header">
                <h3>📖 Guia de Tecidos Comerciais</h3>
                <button onClick={() => setShowFabricGuide(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="fabric-modal-body">
                <p className="fabric-modal-intro">
                  A Receita Federal exige o nome técnico da matéria-prima. Veja como classificar os tecidos que você vende na loja:
                </p>

                <div className="fabric-modal-grid">
                  <div className="fabric-card fabric-sintetico">
                    <div className="fabric-card-title">Fibras Sintéticas (Final 3)</div>
                    <div className="fabric-card-desc">Crepinho, Duna, Poliéster, Tule, Suplex, "Alfaiataria" (a maioria comercial é poliéster).</div>
                  </div>

                  <div className="fabric-card fabric-artificial">
                    <div className="fabric-card-title">Fibras Artificiais (Final 4)</div>
                    <div className="fabric-card-desc">Viscose, Viscolycra, Liscolaicra, Modal, Rayon.</div>
                  </div>

                  <div className="fabric-card fabric-algodao">
                    <div className="fabric-card-title">De Algodão (Final 2)</div>
                    <div className="fabric-card-desc">Tricoline, Moletom, Jeans (maioria algodão).</div>
                  </div>

                  <div className="fabric-card fabric-outras">
                    <div className="fabric-card-title">Outras Matérias Têxteis (Final 9)</div>
                    <div className="fabric-card-desc">Linho puro, Viscolinho (onde o Linho é predominante), Seda.</div>
                  </div>
                </div>

                <div className="fabric-modal-alert">
                  <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Nota sobre Mistas (ex: Viscolinho):</strong> A regra NCM manda classificar pelo fio que tiver o maior percentual (%) na etiqueta da peça.</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
