/**
 * scripts/sync-ncm.mjs
 *
 * Pipeline de sincronização NCM:
 *   BrasilAPI (Receita Federal/Siscomex)
 *     ↓
 *   Merge com enriquecimento Baserow (se .env configurado)
 *     ↓
 *   public/ncm-cache.json
 *
 * Uso: npm run sync:ncm
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.resolve(__dirname, '../public/ncm-cache.json');

// ── Configuração ──────────────────────────────────────────
const BRASIL_API = 'https://brasilapi.com.br/api/ncm/v1';
const BASEROW_TOKEN    = process.env.BASEROW_TOKEN    || '';
const BASEROW_TABLE_ID = process.env.BASEROW_TABLE_ID || '';
const BASEROW_API_URL  = process.env.BASEROW_API_URL  || 'https://api.baserow.io';

// ── Helpers ───────────────────────────────────────────────
function log(msg)  { console.log(`\x1b[36m[sync-ncm]\x1b[0m ${msg}`); }
function ok(msg)   { console.log(`\x1b[32m[sync-ncm]\x1b[0m ${msg}`); }
function warn(msg) { console.log(`\x1b[33m[sync-ncm]\x1b[0m ${msg}`); }
function err(msg)  { console.error(`\x1b[31m[sync-ncm]\x1b[0m ${msg}`); }

// Extrai o número do capítulo (2 primeiros dígitos do código)
function extractChapter(code) {
  return code ? code.replace(/\D/g, '').slice(0, 2) : '';
}

// Extrai a posição (4 primeiros dígitos)
function extractHeading(code) {
  const digits = code ? code.replace(/\D/g, '') : '';
  if (digits.length >= 4) {
    return `${digits.slice(0, 4)}`;
  }
  return digits;
}

// Normaliza código NCM para formato 00000000 (8 dígitos sem pontos)
function normalizeCode(code) {
  return (code || '').replace(/\D/g, '').padEnd(8, '0').slice(0, 8);
}

// Formata código NCM com pontos: XXXX.XX.XX
function formatCode(code) {
  const n = normalizeCode(code);
  if (n.length === 8) {
    return `${n.slice(0, 4)}.${n.slice(4, 6)}.${n.slice(6, 8)}`;
  }
  return code;
}

// ── 1. Buscar dados da BrasilAPI (Receita Federal) ─────────
async function fetchBrasilApi() {
  log('Buscando tabela NCM completa na BrasilAPI (Receita Federal)...');
  try {
    const res = await fetch(BRASIL_API, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'tusocio-web-sync/1.0' },
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    ok(`BrasilAPI: ${data.length} códigos NCM recebidos.`);
    return data;
  } catch (e) {
    err(`Falha ao buscar BrasilAPI: ${e.message}`);
    return null;
  }
}

// ── 2. Buscar enriquecimento do Baserow ────────────────────
async function fetchBaserow() {
  if (!BASEROW_TOKEN || !BASEROW_TABLE_ID) {
    warn('Baserow não configurado (BASEROW_TOKEN ou BASEROW_TABLE_ID ausente). Pulando enriquecimento.');
    return {};
  }

  log(`Buscando enriquecimento no Baserow (table ${BASEROW_TABLE_ID})...`);
  const enrichment = {};
  let page = 1;
  let hasMore = true;

  try {
    while (hasMore) {
      const url = `${BASEROW_API_URL}/api/database/rows/table/${BASEROW_TABLE_ID}/?user_field_names=true&page=${page}&size=200`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Token ${BASEROW_TOKEN}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(15_000),
      });

      if (!res.ok) throw new Error(`Baserow HTTP ${res.status}`);

      const json = await res.json();
      const rows = json.results || [];

      for (const row of rows) {
        const code = (row['ncm_code'] || '').trim();
        if (!code) continue;

        const parseJsonField = (val) => {
          if (!val) return [];
          if (Array.isArray(val)) return val;
          try { return JSON.parse(val); } catch { return val.split(',').map(s => s.trim()).filter(Boolean); }
        };

        enrichment[code] = {
          keywords:    parseJsonField(row['keywords']),
          synonyms:    parseJsonField(row['synonyms']),
          simpleDescription: row['simple_description'] || '',
          material:    row['material'] || '',
          confidenceRules: {
            high:   parseJsonField(row['confidence_high']),
            medium: parseJsonField(row['confidence_medium']),
            review: [],
          },
        };
      }

      hasMore = !!json.next;
      page++;
    }

    ok(`Baserow: ${Object.keys(enrichment).length} códigos enriquecidos.`);
  } catch (e) {
    err(`Falha ao buscar Baserow: ${e.message}`);
  }

  return enrichment;
}

// ── 3. Transformar e fazer merge dos dados ─────────────────
function transformAndMerge(brasilApiItems, baserowEnrichment) {
  log('Processando e mesclando dados...');

  return brasilApiItems.map((item) => {
    const rawCode    = item.codigo || '';
    const normCode   = normalizeCode(rawCode);
    const fmtCode    = formatCode(rawCode);
    const chapter    = extractChapter(rawCode);
    const heading    = extractHeading(rawCode);
    const subheading = fmtCode.split('.').slice(0, 2).join('.'); // ex: 6104.42

    // Tenta enriquecimento por diferentes formatos do código
    const enrich = baserowEnrichment[rawCode]
      || baserowEnrichment[fmtCode]
      || baserowEnrichment[normCode]
      || {};

    return {
      code:               fmtCode,
      normalizedCode:     normCode,
      officialDescription: item.descricao || '',
      simpleDescription:  enrich.simpleDescription || item.descricao || '',
      material:           enrich.material || '',
      chapter,
      heading,
      subheading,
      keywords:           enrich.keywords || [],
      synonyms:           enrich.synonyms || [],
      confidenceRules:    enrich.confidenceRules || { high: [], medium: [], review: [] },
      lastUpdated:        item.data_inicio ? item.data_inicio.split('T')[0] : '',
      source:             'BrasilAPI + Receita Federal',
      active:             !item.data_fim, // data_fim ausente = ainda vigente
    };
  });
}

// ── 4. Salvar cache ────────────────────────────────────────
async function saveCache(items) {
  const cache = {
    syncedAt:   new Date().toISOString(),
    source:     BASEROW_TOKEN ? 'BrasilAPI + Baserow' : 'BrasilAPI (Receita Federal)',
    totalItems: items.length,
    items,
  };

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(cache, null, 2), 'utf-8');
  ok(`Cache salvo em: ${OUTPUT_PATH}`);
  ok(`Total de códigos NCM: ${items.length}`);
}

// ── Main ───────────────────────────────────────────────────
async function main() {
  console.log('\n\x1b[1m━━━ Sincronização NCM — Tu Socio ━━━\x1b[0m');
  console.log(`Destino: ${OUTPUT_PATH}\n`);

  const [brasilApiData, baserowData] = await Promise.all([
    fetchBrasilApi(),
    fetchBaserow(),
  ]);

  if (!brasilApiData) {
    err('Não foi possível buscar dados da BrasilAPI. Sincronização abortada.');
    err('Verifique sua conexão com a internet e tente novamente.');
    process.exit(1);
  }

  const merged = transformAndMerge(brasilApiData, baserowData);
  await saveCache(merged);

  console.log('\n\x1b[1m\x1b[32m✓ Sincronização concluída!\x1b[0m\n');
}

main().catch((e) => {
  err(`Erro inesperado: ${e.message}`);
  process.exit(1);
});
