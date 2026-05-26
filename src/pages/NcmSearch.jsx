import React, { useState } from 'react';
import { Search, FileSearch, CheckCircle2, Copy, AlertTriangle, MessageCircle, ChevronDown, ChevronUp, Package, X, RefreshCw, Database } from 'lucide-react';
import { useNcmData } from '../hooks/useNcmData';
import './NcmSearch.css';

const WA_LINK = "https://wa.me/5511952170637?text=Hola%2C%20quisiera%20ayuda%20con%20el%20NCM%20de%20mis%20productos.";

// ── Formata a data de sincronização ─────────────────────────
function formatSyncDate(isoDate) {
  if (!isoDate) return null;
  try {
    return isoDate.slice(0, 10); // "YYYY-MM-DD"
  } catch { return null; }
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

  const handleCopy = () => {
    navigator.clipboard.writeText(result.normalizedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ncm-result-card">
      <div className="ncm-result-main">
        <div className="ncm-card-icon">
          <Package size={28} />
        </div>
        <div className="ncm-card-content">
          <div className="ncm-card-code">
            NCM {result.code}
            <span className={`ncm-badge ${result.confidence.toLowerCase()}`}>
              Confianza: {result.confidence}
            </span>
          </div>
          {result.material && (
            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ background: 'rgba(255, 90, 0, 0.1)', color: '#fdba74', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', border: '1px solid rgba(255, 90, 0, 0.2)' }}>
                🧶 Material: {result.material}
              </span>
            </div>
          )}
          <div className="ncm-card-desc">
            {result.simpleDescription || result.officialDescription}
          </div>

          <div className="ncm-card-actions">
            <button onClick={handleCopy} className="btn-copy-ncm">
              {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              {copied ? '¡Copiado!' : 'Copiar NCM'}
            </button>
            <button onClick={() => setShowDetails(!showDetails)} className="btn-details">
              {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
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
                NCM {result.subheading || result.heading}
              </div>

              <div className="ncm-tree">
                {/* Seção */}
                <div className="ncm-tree-level ncm-tree-section">
                  <span className="ncm-tree-label">Seção XI</span>
                  <span className="ncm-tree-desc">Matérias têxteis e suas obras</span>
                </div>

                {/* Capítulo */}
                <div className="ncm-tree-level ncm-tree-chapter">
                  <span className="ncm-tree-label">{result.chapter}</span>
                  <span className="ncm-tree-desc">
                    {result.chapter === '61' ? 'Vestuário e seus acessórios, de malha' :
                     result.chapter === '62' ? 'Vestuário e seus acessórios, exceto de malha' :
                     result.chapter === '63' ? 'Outros artefatos têxteis confeccionados' :
                     `Capítulo ${result.chapter}`}
                  </span>
                </div>

                {/* Posição (Heading) */}
                <div className="ncm-tree-level ncm-tree-heading">
                  <span className="ncm-tree-label">{result.heading}</span>
                  <span className="ncm-tree-desc">{result.officialDescription}</span>
                </div>

                {/* Subposição */}
                {result.subheading && (
                  <div className="ncm-tree-level ncm-tree-subheading">
                    <span className="ncm-tree-label">{result.subheading}</span>
                    <span className="ncm-tree-desc">{result.simpleDescription || result.officialDescription}</span>
                  </div>
                )}

                {/* Código completo */}
                <div className="ncm-tree-level ncm-tree-item active-node">
                  <span className="ncm-tree-label">{result.normalizedCode}</span>
                  <span className="ncm-tree-desc">{result.simpleDescription || result.officialDescription}</span>
                </div>
              </div>

              <div className="ncm-detail-row" style={{ marginTop: '1rem' }}>
                <div className="ncm-detail-label">Actualización</div>
                <div className="ncm-detail-value">{result.lastUpdated || '—'}</div>
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
              <>
                <span>{syncInfo.totalItems.toLocaleString('pt-BR')} códigos NCM</span>
                <span className="ncm-sync-dot" />
                <span>Fonte: {syncInfo.source}</span>
                {syncInfo.syncedAt && (
                  <>
                    <span className="ncm-sync-dot" />
                    <span>Sincronizado: {formatSyncDate(syncInfo.syncedAt)}</span>
                  </>
                )}
              </>
            ) : (
              <>
                <span style={{ color: '#fb923c' }}>Base local ({syncInfo.totalItems} códigos)</span>
                <span className="ncm-sync-dot" />
                <span style={{ color: '#9ca3af' }}>Execute <code>npm run sync:ncm</code> para atualizar</span>
              </>
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

        {/* CTA Banner — padronizado com o restante do site */}
        <div className="cta-premium-block" style={{ marginTop: '3rem' }}>
          <div className="cta-content flex-row items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-2xl mb-2">¿No estás seguro del NCM correcto?</h3>
              <p className="text-gray-300 text-lg">Clasificar mal un producto puede generar multas o problemas con tu nota fiscal. Nuestro equipo especializado puede ayudarte.</p>
            </div>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-pill flex items-center gap-2 whitespace-nowrap mt-4 md:mt-0 hover-lift" style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', boxShadow: '0 4px 14px rgba(255,90,0,0.3)', textDecoration: 'none' }}>
              <MessageCircle size={18} /> Hablar con un especialista
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
