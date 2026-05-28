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

// ── Dicionário Comercial de Tecidos ─────────────────────────
// Traduz nomes comuns de lojas para o linguajar técnico da Receita
const COMMERCIAL_FABRICS = {
  // Sintéticos (Final 3)
  crepinho: 'sinteticas',
  duna: 'sinteticas',
  poliester: 'sinteticas',
  tule: 'sinteticas',
  suplex: 'sinteticas',
  alfaiataria: 'sinteticas', // Maioria comercial
  
  // Artificiais (Final 4)
  viscose: 'artificiais',
  viscolycra: 'artificiais',
  liscolaicra: 'artificiais', // Variação de escrita
  modal: 'artificiais',
  
  // Algodão (Final 2)
  tricoline: 'algodao',
  moletom: 'algodao',
  jeans: 'algodao',

  // Outras Matérias (Final 9)
  linho: 'outras',
  viscolinho: 'outras',
  seda: 'outras',
};

// ── Função para pegar filhos (Explorer) ──────────────────────
export const getChildrenNcm = async (prefixCode) => {
  const data = await loadData();
  if (!prefixCode || prefixCode.length < 4) return [];
  const cleanPrefix = prefixCode.replace(/\./g, '');
  
  // Retorna apenas códigos filhos mais específicos (maiores que o prefixo, ou folhas válidas)
  // E que não terminem em 0000 se não for estritamente necessário.
  return data.filter(item => 
    item.normalizedCode !== cleanPrefix && 
    item.normalizedCode.startsWith(cleanPrefix)
  );
};

// ── Funções de parsing para vestuário (6104 e 6204) ────────
const getClothingProductType = (typeDigit) => {
  if (typeDigit === '1') return 'tailleurs';
  if (typeDigit === '2') return 'conjuntos';
  if (typeDigit === '3') return 'blazers';
  if (typeDigit === '4') return 'vestidos';
  if (typeDigit === '5') return 'saias';
  if (typeDigit === '6') return 'calcas';
  return null;
};

const getClothingMaterial = (matDigit) => {
  if (matDigit === '1') return 'De lã ou de pelos finos';
  if (matDigit === '2') return 'De algodão';
  if (matDigit === '3') return 'De fibras sintéticas';
  if (matDigit === '4') return 'De fibras artificiais';
  if (matDigit === '9') return 'De outras matérias têxteis';
  return null;
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
    ...tokens.flatMap(t => COMMERCIAL_FABRICS[t] ? [COMMERCIAL_FABRICS[t]] : []), // mapeamento comercial
  ])];

  // Pré-computa um Set de todos os códigos para checar folhas
  const allCodes = new Set(data.map(item => item.normalizedCode));

  const results = data.map(item => {
    let score = 0;
    let confidence = 'Revisar';

    // Se o código for agrupador (termina em zeros), verificamos se existem filhos.
    // Se existem filhos mais específicos na base, nós pulamos o pai para não poluir a busca.
    if (item.normalizedCode.match(/0+$/)) {
      const prefix = item.normalizedCode.replace(/0+$/, '');
      const hasChildren = data.some(other => other.normalizedCode !== item.normalizedCode && other.normalizedCode.startsWith(prefix));
      if (hasChildren) {
        return { item, score: 0, confidence }; // Zero score = exclui dos resultados
      }
    }

    const normOfficialDesc = normalizeText(item.officialDescription);
    const normSimpleDesc   = normalizeText(item.simpleDescription);
    const normKeywords     = (item.keywords || []).map(normalizeText);
    const normSynonyms     = (item.synonyms || []).map(normalizeText);

    for (const term of searchTerms) {
      const isFullPhrase = term === normQuery;
      // Multiplicador: frase completa vale mais que token individual
      const mult = isFullPhrase ? 1.5 : 1;

      // Helper para match de palavra inteira ou prefixo (evita que 'vestido' dê match em 'revestido')
      const hasMatch = (text, t) => {
        if (!text) return false;
        // Check se a palavra t aparece no texto (começando na borda da palavra)
        return new RegExp(`\\b${t}`, 'i').test(text);
      };

      // 1. Match exato em keywords
      if (normKeywords.includes(term))
        score += 100 * mult;
      else if (normKeywords.some(k => hasMatch(k, term) || hasMatch(term, k)))
        score += 70 * mult;

      // 2. Match em synonyms
      if (normSynonyms.includes(term))
        score += 60 * mult;
      else if (normSynonyms.some(s => hasMatch(s, term) || hasMatch(term, s)))
        score += 40 * mult;

      // 3. Match na descrição simples
      if (hasMatch(normSimpleDesc, term))
        score += 50 * mult;

      // 4. Match na descrição oficial
      if (hasMatch(normOfficialDesc, term))
        score += 30 * mult;
    }

    // 5. Calcular confiança com base nos tokens principais (sem boost)
    const rules = item.confidenceRules || { high: [], medium: [] };
    const highRules   = (rules.high   || []).map(normalizeText);
    const mediumRules = (rules.medium || []).map(normalizeText);

    if (highRules.some(rule => normQuery.includes(rule))) {
      confidence = 'ALTA';
      score += 200;
    } else if (mediumRules.some(rule => normQuery.includes(rule))) {
      confidence = 'MEDIA';
      score += 100;
    }

    // 6. Lógica de isolamento para Vestuário (Capítulos 61 e 62)
    // Se a pessoa procura "vestido", não deve vir "tailleur" só porque estão na mesma família.
    let material = null;
    let productType = null;
    if (item.normalizedCode.length >= 6 && (item.normalizedCode.startsWith('6104') || item.normalizedCode.startsWith('6204'))) {
      const typeDigit = item.normalizedCode[4];
      const matDigit = item.normalizedCode[5];
      
      productType = getClothingProductType(typeDigit);
      material = getClothingMaterial(matDigit);

      // Se a pessoa pesquisou especificamente por um tipo (ex: vestido), 
      // e o código atual é de outro tipo (ex: tailleur), removemos da busca.
      if (productType) {
        const isSearchingVestido = normQuery.includes('vestido');
        const isSearchingSaia = normQuery.includes('saia');
        const isSearchingConjunto = normQuery.includes('conjunto');
        const isSearchingBlazer = normQuery.includes('blazer') || normQuery.includes('casaco');
        
        if (isSearchingVestido && productType !== 'vestidos') score = -1000;
        else if (isSearchingSaia && productType !== 'saias') score = -1000;
        else if (isSearchingConjunto && productType !== 'conjuntos') score = -1000;
        else if (isSearchingBlazer && productType !== 'blazers' && productType !== 'tailleurs') score = -1000;
        else if (isSearchingVestido && productType === 'vestidos') score += 500; // Boost extra!
      }
    }

    return {
      ...item,
      score,
      confidence,
      material,
      productType
    };
  });

  return results
    .filter(res => res.score > 0)
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
