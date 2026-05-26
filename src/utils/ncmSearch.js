// src/utils/ncmSearch.js
//
// Carrega dados NCM dinamicamente:
//   1. Tenta fetch('/ncm-cache.json')  ← gerado por: npm run sync:ncm
//   2. Fallback para ncmData.js        ← dados locais hardcoded
//
// Os dados ficam em memória (singleton) após a primeira carga.

import { ncmData as fallbackData } from '../data/ncmData';

// ── Singleton de cache em memória ─────────────────────────
let _cache = null;          // array de itens NCM carregados
let _syncInfo = null;       // { syncedAt, source, totalItems }
let _loadPromise = null;    // evita múltiplas chamadas simultâneas

// ── Normalização de texto ──────────────────────────────────
const normalizeText = (text) => {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

// ── Carregamento dos dados ─────────────────────────────────
async function loadData() {
  if (_cache) return _cache;
  if (_loadPromise) return _loadPromise;

  _loadPromise = (async () => {
    try {
      const res = await fetch('/ncm-cache.json', {
        headers: { 'Cache-Control': 'no-cache' },
        signal: AbortSignal.timeout(10_000),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();

      if (!json.items || !Array.isArray(json.items)) {
        throw new Error('Formato inválido de ncm-cache.json');
      }

      _cache = json.items;
      _syncInfo = {
        syncedAt:   json.syncedAt   || null,
        source:     json.source     || 'BrasilAPI',
        totalItems: json.totalItems || json.items.length,
        fromCache:  true,
      };

      console.info(`[NCM] Cache carregado: ${_cache.length} códigos (${_syncInfo.source})`);
      return _cache;

    } catch (e) {
      console.warn(`[NCM] ncm-cache.json não disponível (${e.message}). Usando dados locais.`);

      _cache = fallbackData;
      _syncInfo = {
        syncedAt:   null,
        source:     'Dados locais (base reduzida)',
        totalItems: fallbackData.length,
        fromCache:  false,
      };

      return _cache;
    }
  })();

  return _loadPromise;
}

// ── Palavras ignoradas na busca (stop words) ──────────────
const STOP_WORDS = new Set(['de', 'do', 'da', 'dos', 'das', 'e', 'em', 'com', 'para', 'por', 'um', 'uma']);

// ── Sinônimos de termos comuns de busca ───────────────────
// Permite que "feminino" contribua como boost para itens com "femenina/mulher"
const BOOST_MAP = {
  feminino:   ['femenin', 'mujer', 'niña', 'feminina'],
  masculino:  ['masculin', 'hombre', 'niño', 'masculino'],
  infantil:   ['infantil', 'niño', 'niña', 'bebe', 'baby'],
  esportivo:  ['fitness', 'deportiv', 'academia', 'sport'],
  moda:       ['ropa', 'vestuario', 'prenda'],
};

// ── Função de busca ────────────────────────────────────────
export const searchNcm = async (query) => {
  const data = await loadData();

  const normQuery = normalizeText(query);
  if (!normQuery) return [];

  // Tokeniza a query em palavras individuais, ignorando stop words
  const tokens = normQuery
    .split(/\s+/)
    .filter(t => t.length >= 2 && !STOP_WORDS.has(t));

  if (tokens.length === 0) return [];

  // Constrói lista de termos a buscar: tokens originais + expansões do boost map
  const searchTerms = [...new Set([
    normQuery,           // frase completa
    ...tokens,           // palavras individuais
    ...tokens.flatMap(t => BOOST_MAP[t] || []), // sinônimos de contexto
  ])];

  const results = data.map(item => {
    let score = 0;
    let confidence = 'Revisar';

    const normOfficialDesc = normalizeText(item.officialDescription);
    const normSimpleDesc   = normalizeText(item.simpleDescription);
    const normKeywords     = (item.keywords || []).map(normalizeText);
    const normSynonyms     = (item.synonyms || []).map(normalizeText);

    for (const term of searchTerms) {
      const isFullPhrase = term === normQuery;
      // Multiplicador: frase completa vale mais que token individual
      const mult = isFullPhrase ? 1.5 : 1;

      // 1. Match exato em keywords
      if (normKeywords.includes(term))
        score += 100 * mult;
      else if (normKeywords.some(k => k.includes(term) || term.includes(k)))
        score += 70 * mult;

      // 2. Match em synonyms
      if (normSynonyms.includes(term))
        score += 60 * mult;
      else if (normSynonyms.some(s => s.includes(term) || term.includes(s)))
        score += 40 * mult;

      // 3. Match na descrição simples
      if (normSimpleDesc.includes(term))
        score += 50 * mult;

      // 4. Match na descrição oficial
      if (normOfficialDesc.includes(term))
        score += 30 * mult;
    }

    // 5. Calcular confiança com base nos tokens principais (sem boost)
    const rules = item.confidenceRules || { high: [], medium: [] };
    const highRules   = (rules.high   || []).map(normalizeText);
    const mediumRules = (rules.medium || []).map(normalizeText);

    const matchesHigh   = tokens.some(t => highRules.some(r   => r.includes(t) || t.includes(r)));
    const matchesMedium = tokens.some(t => mediumRules.some(r => r.includes(t) || t.includes(r)));

    if (matchesHigh)         confidence = 'Alta';
    else if (matchesMedium)  confidence = 'Media';
    else if (score >= 70)    confidence = 'Media';
    else                     confidence = 'Revisar';

    return { ...item, score, confidence };
  });

  return results
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30);
};

// ── Expõe informações de sincronização ────────────────────
export const getSyncInfo = async () => {
  await loadData();
  return _syncInfo;
};

// ── Pré-carrega os dados (chamado no mount do componente) ──
export const preloadNcmData = () => loadData();
