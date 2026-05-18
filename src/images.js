/**
 * ─────────────────────────────────────────────
 *  CENTRAL IMAGE CONFIG — Tu Socio
 *  Para trocar qualquer imagem, altere apenas
 *  o caminho correspondente aqui.
 *  Todas as imagens ficam na pasta /public/img/
 * ─────────────────────────────────────────────
 */

const images = {
  // ── Logo ──────────────────────────────────
  logo: '/logo.png',

  // ── Seção Soluciones (3 cards grandes) ────
  soluciones: {
    abrir:       '/img/sol-abrir.png',       // CNPJ, documentos, escrivaninha escura
    regularizar: '/img/sol-regularizar.png', // dashboard financeiro, notebook
    gestionar:   '/img/sol-gestionar.png',   // caixas e-commerce, celular com vendas
  },

  // ── Seção Método (card animado steps 1–4) ─
  metodo: {
    step1: '/img/sol-abrir.png',       // Diagnóstico  → reutiliza abrir
    step2: '/img/sol-regularizar.png', // Ruta         → reutiliza regularizar
    step3: '/img/sol-gestionar.png',   // Ejecución    → reutiliza gestionar
    step4: '/img/atendimento.png',     // Acompañamiento → foto de atendimento
  },

  // ── CTA block (bloco inferior Soluciones) ─
  atendimento: '/img/atendimento.png', // duas pessoas em reunião, luz escura laranja

  // ── Blog (thumbnails dos artigos) ─────────
  blog: {
    post1: 'https://picsum.photos/400/250?random=11', // troque pela URL/caminho real
    post2: 'https://picsum.photos/400/250?random=12',
    post3: 'https://picsum.photos/400/250?random=13',
    post4: 'https://picsum.photos/400/250?random=14',
  },
};

export default images;
