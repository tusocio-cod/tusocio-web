import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, Globe, Lock, Shield, ArrowRight, CheckCircle2, ChevronDown, Building2, MessageCircle, Star, ClipboardList, ShieldCheck, Key, FileText, ShoppingCart, Box, MessageSquare, FileSearch, CheckSquare, Send, Users, BarChart3 } from 'lucide-react';

const InstagramIcon = ({ size = 24, color = "currentColor", className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size} height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);
import './index.css';
import './App.css';
import images from './images';

const menuData = [
  {
    title: "Contabilidad",
    columns: 2,
    cta: { text: "Hablar con un especialista", link: "https://wa.me/5511999999999" },
    items: [
      { title: "Contabilidad Mensual", desc: "Mantén tu empresa en regla todos los meses con impuestos.", link: "/contabilidad-mensual" },
      { title: "Apertura de CNPJ", desc: "Abre tu empresa en Brasil con acompañamiento completo.", link: "/apertura-cnpj" },
      { title: "Regularización de CNPJ", desc: "Resuelve pendencias, declaraciones atrasadas y deudas.", link: "/regularizacion-cnpj" },
      { title: "Certificado Digital", desc: "E-CPF y E-CNPJ para emitir notas y operar con seguridad.", link: "/certificado-digital" },
      { title: "Nota Fiscal e Impuestos", desc: "Orientación para emitir notas fiscales y mantener impuestos en orden.", link: "/nota-fiscal-impuestos" },
      { title: "Contabilidad Marketplace", desc: "Soporte para vendedores de Shopee, Shein y Mercado Libre.", link: "/contabilidad-marketplace" },
      { title: "Consultoría Empresarial", desc: "Organiza tu negocio, mejora tus números y toma decisiones.", link: "/consultoria-empresarial" }
    ]
  },
  {
    title: "Marketplace",
    columns: 2,
    cta: { text: "Preparar mi negocio", link: "/marketplace" },
    items: [
      { title: "Vender en Marketplace", desc: "Prepara tu empresa para vender con seguridad online.", link: "/marketplace" },
      { title: "CNPJ para Marketplace", desc: "Abre o ajusta tu CNPJ para operar en canales de venta.", link: "/cnpj-marketplace" },
      { title: "Certificado Digital", desc: "Emite notas, firma documentos y mantén tu operación activa.", link: "/certificado-digital" },
      { title: "Nota Fiscal e Impuestos", desc: "Organiza tus notas fiscales y obligaciones de venta.", link: "/nota-fiscal-impuestos" },
      { title: "Regularización de Cuenta", desc: "Orientación para vendedores con problemas fiscales.", link: "/regularizacion-marketplace" },
      { title: "Shopee, Shein y Mercado Libre", desc: "Soluciones para vendedores que quieren más estructura.", link: "/marketplace-plataformas" }
    ]
  },
  {
    title: "Inversiones",
    columns: 1,
    cta: { text: "Hablar con un asesor", link: "/inversiones-brasil" },
    items: [
      { title: "Inversiones en Brasil", desc: "Orientación para entender oportunidades y obligaciones.", link: "/inversiones-brasil" },
      { title: "Organización Patrimonial", desc: "Apoyo para estructurar bienes e ingresos.", link: "/organizacion-patrimonial" },
      { title: "Impuestos sobre Inversiones", desc: "Declaración fiscal para rendimientos y patrimonio.", link: "/impuestos-inversiones" },
      { title: "Planificación Financiera", desc: "Organiza tus números antes de tomar decisiones.", link: "/planificacion-financiera" },
      { title: "Declaración de Renta", desc: "Soporte para declarar bienes e inversiones.", link: "/declaracion-renta" }
    ]
  },
  {
    title: "Inmobiliaria",
    columns: 1,
    cta: { text: "Consultar oportunidades", link: "/inmobiliaria" },
    items: [
      { title: "Comprar Inmueble en Brasil", desc: "Orientación para invertir o vivir en Brasil.", link: "/comprar-inmueble-brasil" },
      { title: "Alquiler para Extranjeros", desc: "Apoyo con documentos y contratos para alquilar.", link: "/alquiler-extranjeros" },
      { title: "Documentación Inmobiliaria", desc: "Organiza contratos y requisitos antes de avanzar.", link: "/documentacion-inmobiliaria" },
      { title: "Regularización de Inmuebles", desc: "Apoyo para revisar pendencias y obligaciones.", link: "/regularizacion-inmuebles" },
      { title: "Impuestos sobre Inmuebles", desc: "Orientación fiscal para compra, venta y alquiler.", link: "/impuestos-inmuebles" }
    ]
  },
  {
    title: "Nosotros",
    columns: 1,
    cta: { text: "Conocer Tu Socio", link: "/nosotros" },
    items: [
      { title: "Quiénes Somos", desc: "Conoce la historia y el propósito de Tu Socio.", link: "/nosotros" },
      { title: "Nuestro Método", desc: "Procesos para abrir y regularizar negocios en Brasil.", link: "/metodo-tu-socio" },
      { title: "Para Quién Trabajamos", desc: "Emprendedores, comercios y familias.", link: "/publico" },
      { title: "Equipo Tu Socio", desc: "Especialistas preparados para atender en español.", link: "/equipo" },
      { title: "Contacto", desc: "Habla con nuestro equipo y recibe orientación.", link: "/contacto" }
    ]
  },
  {
    title: "Blog",
    columns: 1,
    cta: { text: "Ver todos los artículos", link: "/blog" },
    items: [
      { title: "Guías para Emprendedores", desc: "Contenido práctico para abrir y organizar tu empresa.", link: "/blog/guias-emprendedores" },
      { title: "CNPJ y Contabilidad", desc: "Artículos sobre impuestos, notas fiscales y obligaciones.", link: "/blog/cnpj-contabilidad" },
      { title: "Marketplace", desc: "Consejos para vender con seguridad online.", link: "/blog/marketplace" },
      { title: "Impuestos y Declaraciones", desc: "Orientación sobre renta, documentos y plazos.", link: "/blog/impuestos" },
      { title: "Vida en Brasil", desc: "Información útil para inmigrantes y empresarios.", link: "/blog/vida-en-brasil" }
    ]
  }
];

const accederMenu = [
  { title: "Área del Cliente", desc: "Accede a tus documentos y procesos.", link: "/area-cliente" },
  { title: "Consultar Proceso", desc: "Acompaña el estado de tu trámite.", link: "/consultar-proceso" },
  { title: "Soporte", desc: "Habla con nuestro equipo de atención.", link: "/soporte" }
];

// ─────────────────────────────────────────────
// HERO SLIDER — 5 slides, 15s autoplay
// To edit a slide: update the heroSlides array.
// To swap an image: replace the file in public/images/hero/ keeping the same filename.
// ─────────────────────────────────────────────
const heroSlides = [
  {
    image: '/images/hero/hero-contabilidad.webp',
    eyebrow: 'LA SOLUCIÓN PARA TU NEGOCIO',
    title: ['Infraestructura contable,', 'fiscal y empresarial', 'para tu negocio.'],
    subtitle: 'Una solución completa para emprendedores, comercios y empresas que quieren operar en Brasil con seguridad, vender por marketplace y mantener CNPJ, impuestos y documentos en orden.',
    primaryBtn: { label: 'Consultar por WhatsApp', href: 'https://wa.me/5511999999999' },
    secondaryBtn: { label: 'Conocer soluciones', href: '#soluciones' },
    benefits: ['CNPJ listo para operar', 'Contabilidad empresarial', 'Marketplace e impuestos'],
  },
  {
    image: '/images/hero/hero-renta-2026.webp',
    eyebrow: 'TEMPORADA FISCAL 2026',
    title: ['Declaración de renta 2026', 'con orientación', 'clara y segura.'],
    subtitle: 'Organizamos tus ingresos, bienes, documentos y obligaciones para declarar correctamente en Brasil, con atención en español y acompañamiento paso a paso.',
    primaryBtn: { label: 'Declarar mi renta', href: 'https://wa.me/5511999999999' },
    secondaryBtn: { label: 'Consultar requisitos', href: '#soluciones' },
    benefits: ['Personas y empresas', 'Bienes e ingresos', 'Atención en español'],
  },
  {
    image: '/images/hero/hero-marketplace.webp',
    eyebrow: 'MARKETPLACE Y NEGOCIOS DIGITALES',
    title: ['Vende en marketplace', 'con tu empresa', 'en orden.'],
    subtitle: 'Preparamos tu CNPJ, certificado digital, nota fiscal, impuestos y contabilidad para vender con más seguridad en Shopee, Shein, Mercado Libre, TikTok Shop y otros canales.',
    primaryBtn: { label: 'Preparar mi empresa', href: 'https://wa.me/5511999999999' },
    secondaryBtn: { label: 'Ver soluciones', href: '#soluciones' },
    benefits: ['Nota fiscal', 'Certificado digital', 'Shopee, Shein y Mercado Libre'],
  },
  {
    image: '/images/hero/hero-documentacion.webp',
    eyebrow: 'DOCUMENTOS EN BRASIL',
    title: ['CPF, RNM y trámites', 'documentales con', 'acompañamiento.'],
    subtitle: 'Te orientamos en documentos, protocolos y procesos importantes para vivir, emprender y organizar tu situación en Brasil con más tranquilidad.',
    primaryBtn: { label: 'Consultar documentación', href: 'https://wa.me/5511999999999' },
    secondaryBtn: { label: 'Hablar con un especialista', href: '#soluciones' },
    benefits: ['CPF y RNM', 'Protocolos', 'Soporte en español'],
  },
  {
    image: '/images/hero/hero-inmobiliaria.webp',
    eyebrow: 'ASESORÍA INMOBILIARIA',
    title: ['Trámites inmobiliarios', 'con análisis y', 'acompañamiento.'],
    subtitle: 'Apoyamos en la revisión de documentos, contratos, requisitos y procesos para compra, alquiler o regularización inmobiliaria en Brasil.',
    primaryBtn: { label: 'Consultar asesoría', href: 'https://wa.me/5511999999999' },
    secondaryBtn: { label: 'Conocer el proceso', href: '#soluciones' },
    benefits: ['Análisis documental', 'Contratos y requisitos', 'Acompañamiento'],
  },
];

function HeroSlider() {
  const AUTOPLAY_MS = 15000;
  const RESUME_DELAY = 6000;
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);
  const resumeRef = useRef(null);
  const touchStartX = useRef(null);

  const goTo = useCallback((idx, pauseFor = 0) => {
    setVisible(false);
    setTimeout(() => {
      setCurrent(idx);
      setVisible(true);
    }, 700);
    if (pauseFor > 0) {
      clearTimeout(resumeRef.current);
      clearInterval(timerRef.current);
      resumeRef.current = setTimeout(() => startAutoplay(), pauseFor);
    }
  }, []);

  const next = useCallback(() => goTo((current + 1) % heroSlides.length, RESUME_DELAY), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + heroSlides.length) % heroSlides.length, RESUME_DELAY), [current, goTo]);

  const startAutoplay = useCallback(() => {
    if (prefersReduced) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(c => {
        const next = (c + 1) % heroSlides.length;
        setVisible(false);
        setTimeout(() => { setCurrent(next); setVisible(true); }, 700);
        return c;
      });
    }, AUTOPLAY_MS);
  }, [prefersReduced]);

  useEffect(() => {
    if (!isHovered) startAutoplay();
    else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [isHovered, startAutoplay]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const slide = heroSlides[current];

  return (
    <section
      className="hero-slider"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
        touchStartX.current = null;
      }}
      aria-label="Hero Slider"
    >
      {/* Background images — all preloaded, only active one visible */}
      {heroSlides.map((s, i) => (
        <div
          key={i}
          className="hero-slide-bg"
          style={{
            backgroundImage: `url('${s.image}')`,
            opacity: i === current ? 1 : 0,
            transform: i === current ? 'scale(1.04)' : 'scale(1)',
          }}
        />
      ))}

      {/* Overlay */}
      <div className="hero-slider-overlay" />

      {/* Content */}
      <div className="container-hero" style={{ position: 'relative', zIndex: 2 }}>
        <div
          className={`hero-slide-content ${visible ? 'slide-in' : 'slide-out'}`}
          style={{ maxWidth: '660px' }}
        >
          <div className="badge" style={{ marginBottom: '1rem' }}>{slide.eyebrow}</div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.08, marginBottom: '1rem', color: 'white' }}>
            {slide.title.map((line, i) => (
              <span key={i}>
                {i === slide.title.length - 1
                  ? <><span style={{ color: 'var(--color-primary)' }}>{line}</span></>
                  : <>{line}<br /></>
                }
              </span>
            ))}
          </h1>

          <p style={{ fontSize: '1rem', lineHeight: 1.55, color: '#cbd5e1', maxWidth: '480px', marginBottom: '1.75rem' }}>
            {slide.subtitle}
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <a href={slide.primaryBtn.href} className="btn btn-orange btn-lg btn-pill font-semibold">
              {slide.primaryBtn.label}
            </a>
            <a href={slide.secondaryBtn.href} className="btn btn-secondary btn-lg btn-pill font-semibold" style={{ background: 'transparent' }}>
              {slide.secondaryBtn.label} <ArrowRight size={16} />
            </a>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {slide.benefits.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#e2e8f0' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button className="hero-arrow hero-arrow-prev" onClick={prev} aria-label="Slide anterior">
        <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
      </button>
      <button className="hero-arrow hero-arrow-next" onClick={next} aria-label="Próximo slide">
        <ChevronRight size={20} />
      </button>

      {/* Dot indicators + progress */}
      <div className="hero-dots">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? 'active' : ''}`}
            onClick={() => goTo(i, RESUME_DELAY)}
            aria-label={`Slide ${i + 1}`}
          >
            {i === current && !prefersReduced && (
              <span className="hero-dot-progress" style={{ animationDuration: `${AUTOPLAY_MS}ms` }} />
            )}
          </button>
        ))}
      </div>

      {/* Bottom Glass Bar — pinned absolute to hero bottom via CSS */}
      <div className="hero-glass-bar">
        <div className="container flex items-center h-full">
          <div className="text-sm font-bold text-gray-400 mr-12 z-10 relative leading-tight uppercase tracking-wider" style={{ minWidth: 'max-content' }}>
            Clientes<br /><span className="text-white">Tu Socio</span>
          </div>
          <div className="marquee-wrapper" style={{ flex: 1, display: 'flex', alignItems: 'center', height: '100%' }}>
            <div className="marquee-content-glass">
              {[...Array(2)].map((_, idx) => (
                <div key={idx} className="marquee-group flex items-center" style={{ gap: '5rem', paddingRight: '5rem', minWidth: 'max-content' }}>
                  {[...Array(4)].map((_, subIdx) => (
                    <React.Fragment key={subIdx}>
                      <img src="/clientes/Bicentenário.png" alt="Cliente 1" style={{ width: '48px', height: '48px', objectFit: 'contain', filter: 'grayscale(100%) opacity(60%)', transition: 'all 0.3s' }} onMouseOver={e => { e.currentTarget.style.filter = 'grayscale(0%) opacity(100%)'; }} onMouseOut={e => { e.currentTarget.style.filter = 'grayscale(100%) opacity(60%)'; }} />
                      <img src="/clientes/Logo 03.png" alt="Cliente 2" style={{ width: '48px', height: '48px', objectFit: 'contain', filter: 'grayscale(100%) opacity(60%)', transition: 'all 0.3s' }} onMouseOver={e => { e.currentTarget.style.filter = 'grayscale(0%) opacity(100%)'; }} onMouseOut={e => { e.currentTarget.style.filter = 'grayscale(100%) opacity(60%)'; }} />
                      <img src="/clientes/LogoPNG.png" alt="Cliente 3" style={{ width: '48px', height: '48px', objectFit: 'contain', filter: 'grayscale(100%) opacity(60%)', transition: 'all 0.3s' }} onMouseOver={e => { e.currentTarget.style.filter = 'grayscale(0%) opacity(100%)'; }} onMouseOut={e => { e.currentTarget.style.filter = 'grayscale(100%) opacity(60%)'; }} />
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Animated counter for Numeros section ──
function AnimatedStat({ value, suffix = '' }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef(null);
  const started = useRef(false);

  const run = useCallback(() => {
    const duration = 1500;
    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * value);
      setDisplay(current.toLocaleString('es-ES'));
      if (progress < 1) requestAnimationFrame(step);
      else setDisplay(value.toLocaleString('es-ES'));
    };
    requestAnimationFrame(step);
  }, [value]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq?.matches) { setDisplay(value.toLocaleString('es-ES')); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true; run();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [run, value]);

  return <span ref={ref}>{display}{suffix}</span>;
}

const solucionesSets = [
  [
    { title: "Abrir", desc: "CNPJ, certificado digital y documentos para empezar correctamente.", icon: <Building2 size={24} />, cta: "Iniciar →", bg: "/soluciones/abrir.png" },
    { title: "Regularizar", desc: "Pendencias, impuestos y declaraciones organizadas con claridad.", icon: <ShieldCheck size={24} />, cta: "Regularizar →", bg: "/soluciones/regularizar.png" },
    { title: "Gestionar", desc: "Contabilidad, nota fiscal y soporte para seguir creciendo.", icon: <BarChart3 size={24} />, cta: "Gestionar →", bg: "/soluciones/gestionar.png" }
  ],
  [
    { title: "Vender", desc: "Prepara tu empresa para marketplace, nota fiscal y canales digitales.", icon: <ShoppingCart size={24} />, cta: "Vender →", bg: "/soluciones/abrir.png" },
    { title: "Declarar", desc: "Impuestos, renta y obligaciones fiscales con orientación clara.", icon: <ClipboardList size={24} />, cta: "Declarar →", bg: "/soluciones/regularizar.png" },
    { title: "Acompañar", desc: "Atención en español para que siempre sepas el próximo paso.", icon: <MessageCircle size={24} />, cta: "Acompañar →", bg: "/soluciones/gestionar.png" }
  ],
  [
    { title: "Organizar", desc: "Documentos, procesos y números más claros para tu empresa.", icon: <FileText size={24} />, cta: "Organizar →", bg: "/soluciones/abrir.png" },
    { title: "Proteger", desc: "Evita errores, multas y bloqueos por falta de regularización.", icon: <Key size={24} />, cta: "Proteger →", bg: "/soluciones/regularizar.png" },
    { title: "Crecer", desc: "Estructura contable y empresarial para avanzar con más control.", icon: <ArrowRight size={24} />, cta: "Crecer →", bg: "/soluciones/gestionar.png" }
  ]
];

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSet, setActiveSet] = useState(0);
  const [isHoveredSoluciones, setIsHoveredSoluciones] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isHoveredMetodo, setIsHoveredMetodo] = useState(false);

  useEffect(() => {
    if (isHoveredMetodo) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq?.matches) return;
    const interval = setInterval(() => setActiveStep(p => (p + 1) % 4), 4500);
    return () => clearInterval(interval);
  }, [isHoveredMetodo]);

  useEffect(() => {
    if (isHoveredSoluciones) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery?.matches) return;

    const interval = setInterval(() => {
      setActiveSet(prev => (prev + 1) % solucionesSets.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHoveredSoluciones]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLang = (lang) => {
    console.log("Language changed to", lang);
    // Here you would implement your i18n logic
  };

  return (
    <>
      {/* Navigation Pill (Mercury Style) */}
      <header className={`header-wrapper ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-pill">
          <div className="logo">
            <img src="/logo.png" alt="Tu Socio" style={{ maxHeight: '42px', width: 'auto' }} />
          </div>

          <nav className="nav-links">
            <a href="#" className="nav-link" style={{ fontWeight: 600 }}>Inicio</a>
            {menuData.map((menu, idx) => (
              <div key={idx} className="nav-item">
                <a href="#" className="nav-link font-semibold">{menu.title} <ChevronDown size={14} /></a>
                <div className={`mega-menu columns-${menu.columns}`}>
                  {menu.items.map((item, i) => (
                    <a key={i} href={item.link} className="mega-item">
                      <span className="mega-item-title">{item.title}</span>
                      <span className="mega-item-desc">{item.desc}</span>
                    </a>
                  ))}
                  <div className="mega-cta">
                    <a href={menu.cta.link}>{menu.cta.text} <ArrowRight size={14} /></a>
                  </div>
                </div>
              </div>
            ))}
          </nav>

          <div className="nav-actions">
            <div className="lang-switcher">
              ES <ChevronDown size={14} />
              <div className="lang-menu">
                <div className="lang-option" onClick={() => changeLang('es')}>Español</div>
                <div className="lang-option" onClick={() => changeLang('pt')}>Português (BR)</div>
              </div>
            </div>

            <div className="nav-item user-menu-wrapper" style={{ padding: 0 }}>
              <a href="#" className="btn btn-secondary btn-pill flex items-center gap-2">Acceder <ChevronDown size={14} /></a>
              <div className="mega-menu columns-1" style={{ minWidth: '250px', transform: 'translateX(-70%) translateY(10px)' }}>
                {accederMenu.map((item, i) => (
                  <a key={i} href={item.link} className="mega-item">
                    <span className="mega-item-title">{item.title}</span>
                    <span className="mega-item-desc">{item.desc}</span>
                  </a>
                ))}
              </div>
            </div>

            <a href="https://wa.me/5511999999999" className="btn btn-primary btn-pill font-bold">Abrir empresa</a>
          </div>
        </div>
      </header>

      {/* Hero Slider */}
      <HeroSlider />

      {/* Soluciones */}
      <section id="soluciones" className="section bg-base">
        <div className="container">
          <div className="text-center mx-auto" style={{ marginBottom: '4rem', maxWidth: '48rem' }}>
            <p className="font-bold tracking-wider text-sm mb-3" style={{ color: 'var(--color-primary)' }}>NUESTRAS SOLUCIONES</p>
            <h2 className="heading-h2" style={{ marginBottom: '1rem', fontSize: '3rem' }}>Estructura. Orden. Crecimiento.</h2>
            <p className="text-lg text-gray-400">Soluciones empresariales que simplifican lo complejo<br />para que tu negocio funcione con seguridad en Brasil.</p>
          </div>

          <div
            className="soluciones-premium-grid"
            onMouseEnter={() => setIsHoveredSoluciones(true)}
            onMouseLeave={() => setIsHoveredSoluciones(false)}
          >
            {[0, 1, 2].map((colIndex) => (
              <div key={colIndex} className={`soluciones-premium-card ${colIndex === 1 ? 'card-center' : ''}`} style={{ backgroundImage: `url(${solucionesSets[activeSet][colIndex].bg})` }}>
                <div className="card-overlay"></div>
                <div className="card-content" key={activeSet}>
                  <div className="icon-wrapper">
                    {solucionesSets[activeSet][colIndex].icon}
                  </div>
                  <div className="text-content">
                    <h3 className="card-title">{solucionesSets[activeSet][colIndex].title}</h3>
                    <p className="card-desc">{solucionesSets[activeSet][colIndex].desc}</p>
                    <span className="card-cta">{solucionesSets[activeSet][colIndex].cta}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Full width CTA Card */}
          <div className="cta-premium-block" style={{ backgroundImage: 'url(/soluciones/atendimento.png)' }}>
            <div className="cta-overlay"></div>
            <div className="cta-content flex-row items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-2xl mb-2">¿No sabes por dónde empezar?</h3>
                <p className="text-gray-300 text-lg">Hablamos contigo y te indicamos el mejor camino para tu negocio.</p>
              </div>
              <a href="https://wa.me/5511999999999" className="btn btn-primary btn-pill flex items-center gap-2 whitespace-nowrap mt-4 md:mt-0 hover-lift" style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', boxShadow: '0 4px 14px rgba(255,90,0,0.3)' }}>
                <MessageCircle size={18} /> Hablar con un especialista
              </a>
            </div>
          </div>

          <div style={{ height: '5rem' }}></div>

          {/* Método Tu Socio */}
          <div
            onMouseEnter={() => setIsHoveredMetodo(true)}
            onMouseLeave={() => setIsHoveredMetodo(false)}
          >
            {/* Section Header */}
            <div className="text-center mx-auto" style={{ marginBottom: '4rem', maxWidth: '56rem' }}>
              <p style={{ color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.15em', fontSize: '0.8rem', marginBottom: '1rem' }}>MÉTODO TU SOCIO</p>
              <h2 className="heading-h2" style={{ marginBottom: '1rem', fontSize: '3rem' }}>De la duda al negocio en orden.</h2>
              <p className="text-lg text-gray-400">Un acompañamiento claro para abrir, regularizar y gestionar tu empresa en Brasil,<br />con seguimiento en español en cada etapa.</p>
            </div>

            {/* Two-column layout */}
            <div className="metodo-layout">
              {/* Left column */}
              <div className="metodo-left">
                <div style={{ width: '40px', height: '2px', background: 'var(--color-primary)', marginBottom: '2rem' }}></div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', lineHeight: 1.3, marginBottom: '1.5rem' }}>Un proceso pensado para que siempre sepas el próximo paso.</h3>
                <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: '2.5rem' }}>Analizamos tu caso, organizamos documentos, ejecutamos el proceso y te mantenemos informado hasta que tu empresa esté en orden.</p>
                <a href="https://wa.me/5511999999999" className="btn btn-pill flex items-center gap-2" style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', boxShadow: '0 4px 14px rgba(255,90,0,0.35)', width: 'fit-content' }}>
                  <MessageCircle size={18} /> Hablar con un especialista
                </a>
              </div>

              {/* Right column - animated card */}
              {(() => {
                const steps = [
                  { num: '01', title: 'Diagnóstico', desc: 'Entendemos tu situación, tu actividad y lo que necesitas resolver.', icon: <MessageSquare size={28} />, bg: '/soluciones/abrir.png' },
                  { num: '02', title: 'Ruta empresarial', desc: 'Definimos el mejor camino: CNPJ, documentos, impuestos y próximos pasos.', icon: <FileSearch size={28} />, bg: '/soluciones/regularizar.png' },
                  { num: '03', title: 'Ejecución', desc: 'Nuestro equipo organiza el proceso, revisa documentos y acompaña cada trámite.', icon: <CheckSquare size={28} />, bg: '/soluciones/gestionar.png' },
                  { num: '04', title: 'Acompañamiento', desc: 'Te mantenemos informado y te orientamos para seguir operando en regla.', icon: <Send size={28} />, bg: '/soluciones/atendimento.png' }
                ];
                const step = steps[activeStep];
                return (
                  <div className="metodo-right">
                    {/* Progress bar */}
                    <div className="metodo-progress-bar">
                      {steps.map((_, i) => (
                        <div
                          key={i}
                          onClick={() => setActiveStep(i)}
                          className="metodo-progress-segment"
                          style={{ cursor: 'pointer', background: i === activeStep ? 'var(--color-primary)' : 'rgba(255,255,255,0.08)' }}
                        />
                      ))}
                    </div>

                    {/* The Card */}
                    <div
                      className="metodo-card"
                      style={{ backgroundImage: `url(${step.bg})` }}
                    >
                      <div className="card-overlay" style={{ background: 'linear-gradient(135deg, rgba(10,10,10,0.97) 0%, rgba(10,10,10,0.8) 55%, rgba(10,10,10,0.4) 100%)' }}></div>
                      <div className="metodo-card-inner" key={activeStep}>
                        <div style={{ color: 'var(--color-primary)', fontSize: '4rem', fontWeight: 800, lineHeight: 1, marginBottom: '0.75rem' }}>{step.num}</div>
                        <div style={{ width: '32px', height: '2px', background: 'var(--color-primary)', marginBottom: '1.5rem' }}></div>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>{step.title}</h3>
                        <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '260px' }}>{step.desc}</p>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '1px solid rgba(255,90,0,0.4)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(255,90,0,0.15)' }}>
                          {step.icon}
                        </div>
                      </div>
                    </div>

                    {/* Step nav */}
                    <div className="metodo-step-nav">
                      {steps.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveStep(i)}
                          className="metodo-step-btn"
                          style={{ color: i === activeStep ? 'var(--color-primary)' : '#6b7280' }}
                        >
                          <span className="step-nav-num" style={{ color: i === activeStep ? 'var(--color-primary)' : '#4b5563' }}>{s.num}</span>
                          <span className="step-nav-title">{s.title}</span>
                          {i === activeStep && <div className="step-nav-underline" />}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          <div style={{ height: '1px', borderBottom: '1px solid rgba(255,255,255,0.05)', margin: '5rem 0' }}></div>

          {/* Nuestros Números ─ Premium layout */}
          <div style={{ paddingBottom: '4rem' }}>
            <div className="text-center mx-auto" style={{ marginBottom: '3.5rem', maxWidth: '52rem' }}>
              <p style={{ color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.15em', fontSize: '0.8rem', marginBottom: '1rem' }}>NUESTROS NÚMEROS</p>
              <h2 className="heading-h2" style={{ marginBottom: '1rem', fontSize: '2.75rem' }}>
                Confianza construida con resultados<span style={{ color: 'var(--color-primary)' }}>.</span>
              </h2>
              <p className="text-lg text-gray-400">Números que reflejan nuestra experiencia acompañando<br />emprendedores, comercios, empresas y familias en Brasil.</p>
            </div>

            <div className="numeros-premium-layout">
              {/* Main featured card */}
              <div className="numeros-main-card bento-card" style={{ background: 'var(--color-bg-elevated)', border: '1px solid rgba(255,90,0,0.25)', borderRadius: 'var(--radius-xl)', padding: '3rem', boxShadow: '0 0 60px rgba(255,90,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '1px solid rgba(255,90,0,0.3)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'auto' }}>
                  <Users size={26} />
                </div>
                <div style={{ marginTop: '4rem' }}>
                  <div style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1, marginBottom: '0.5rem' }}>+<AnimatedStat value={5000} /></div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>Clientes atendidos en Brasil</h3>
                  <div style={{ width: '40px', height: '2px', background: 'var(--color-primary)', marginBottom: '1rem' }}></div>
                  <p style={{ color: '#9ca3af', lineHeight: 1.6 }}>Personas, familias y empresas orientadas por Tu Socio para operar con seguridad y crecimiento.</p>
                </div>
              </div>

              {/* 2x2 smaller cards */}
              <div className="numeros-small-grid">
                {[
                  { icon: <Building2 size={22} />, num: 1000, suffix: '', prefix: '+', title: 'Empresas abiertas y regularizadas', desc: 'CNPJs creados, ajustados o regularizados para operar con seguridad.' },
                  { icon: <BarChart3 size={22} />, num: 200, suffix: '', prefix: '+', title: 'Empresas bajo gestión contable mensual', desc: 'Impuestos, obligaciones y soporte continuo todos los meses.' },
                  { icon: <ShoppingCart size={22} />, num: 60, suffix: 'M', prefix: '+R$ ', title: 'En facturación de empresas acompañadas', desc: 'Operaciones empresariales atendidas con control contable y fiscal.' },
                  { icon: <FileText size={22} />, num: 1000, suffix: '', prefix: '+', title: 'Documentos y protocolos gestionados', desc: 'CPF, RNM y trámites documentales acompañados en Brasil.' }
                ].map((s, i) => (
                  <div key={i} className="numeros-small-card bento-card" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-xl)', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', border: '1px solid rgba(255,90,0,0.25)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>{s.icon}</div>
                    <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1, marginBottom: '0.75rem' }}>{s.prefix}<AnimatedStat value={s.num} suffix={s.suffix} /></div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem', lineHeight: 1.3 }}>{s.title}</h4>
                    <div style={{ width: '28px', height: '2px', background: 'var(--color-primary)', marginBottom: '0.75rem' }}></div>
                    <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials ─ infinite lateral marquee */}
      <section className="section" style={{ backgroundColor: 'var(--color-bg-surface)', padding: '6rem 0' }}>
        <div className="container" style={{ marginBottom: '3rem' }}>
          <div className="text-center">
            <p style={{ color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.15em', fontSize: '0.8rem', marginBottom: '1rem' }}>TESTIMONIOS</p>
            <h2 className="heading-h2" style={{ marginBottom: '1rem' }}>Empresarios validan nuestro trabajo.</h2>
            <p className="text-lg text-gray-400">No confíes solo en nosotros. Escucha a quienes ya usan Tu Socio.</p>
          </div>
        </div>

        {/* Row 1 ─ scrolls left */}
        <div className="testimonial-marquee-wrapper" style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
          <div className="testimonial-marquee-track" style={{ animationDuration: '45s' }}>
            {[
              { name: "Carlos M.", biz: "Tienda en Mercado Libre", text: "Abrir el CNPJ fue tan rápido que pensé que algo faltaba. Hoy Tu Socio lo maneja todo y no me estreso con impuestos." },
              { name: "Lucía R.", biz: "E-commerce de Ropa", text: "Antes pagaba demasiado en impuestos. Hicieron la revisión y ahora me sobra dinero a fin de mes para invertir." },
              { name: "Fernando T.", biz: "Prestador de Servicios", text: "El certificado digital salió al instante y la atención por WhatsApp resolvió mi duda en 5 minutos." },
              { name: "Valeria S.", biz: "Importadora de Productos", text: "Me explicaron todo en español, paso a paso. Jamás me sentí perdida en el proceso." },
              { name: "Diego A.", biz: "Vendedor en Shopee", text: "Gracias a Tu Socio regularicé mi empresa y ahora emito notas sin problema. Excelente soporte." },
              { name: "Mariana L.", biz: "Consultóra Digital", text: "Profesionales, rápidos y siempre disponibles. Mi empresa en Brasil quedó lista en una semana." },
              { name: "Andrés P.", biz: "Restaurante en São Paulo", text: "Abrimos el negocio con toda la documentación en orden. El acompañamiento fue impecable." }
            ].concat([
              { name: "Carlos M.", biz: "Tienda en Mercado Libre", text: "Abrir el CNPJ fue tan rápido que pensé que algo faltaba. Hoy Tu Socio lo maneja todo y no me estreso con impuestos." },
              { name: "Lucía R.", biz: "E-commerce de Ropa", text: "Antes pagaba demasiado en impuestos. Hicieron la revisión y ahora me sobra dinero a fin de mes para invertir." },
              { name: "Fernando T.", biz: "Prestador de Servicios", text: "El certificado digital salió al instante y la atención por WhatsApp resolvió mi duda en 5 minutos." },
              { name: "Valeria S.", biz: "Importadora de Productos", text: "Me explicaron todo en español, paso a paso. Jamás me sentí perdida en el proceso." },
              { name: "Diego A.", biz: "Vendedor en Shopee", text: "Gracias a Tu Socio regularicé mi empresa y ahora emito notas sin problema. Excelente soporte." },
              { name: "Mariana L.", biz: "Consultóra Digital", text: "Profesionales, rápidos y siempre disponibles. Mi empresa en Brasil quedó lista en una semana." },
              { name: "Andrés P.", biz: "Restaurante en São Paulo", text: "Abrimos el negocio con toda la documentación en orden. El acompañamiento fue impecable." }
            ]).map((t, i) => (
              <div key={i} className="testimonial-marquee-card">
                <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }}>{[...Array(5)].map((_, j) => <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />)}</div>
                <p style={{ color: '#d1d5db', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem', flex: 1 }}>“{t.text}”</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>{t.name[0]}</div>
                  <div>
                    <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>{t.biz}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>



      {/* Blog Section */}
      <section className="section" style={{ overflow: 'hidden', backgroundColor: 'var(--color-bg-base)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '0.15em', fontSize: '0.8rem', marginBottom: '0.75rem' }}>BLOG</p>
              <h2 className="heading-h2" style={{ marginBottom: '0.5rem' }}>Recursos que impulsan tu negocio.</h2>
              <p style={{ color: '#9ca3af' }}>Contenido práctico para emprendedores y comerciantes.</p>
            </div>
            <a href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem', border: '1px solid rgba(255,90,0,0.3)', padding: '0.6rem 1.25rem', borderRadius: '99px', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
              Ver todos los artículos <ArrowRight size={16} />
            </a>
          </div>

          <div className="social-feed" style={{ gap: '1.5rem', paddingBottom: '2rem' }}>
            {[
              { href: '/blog/mei-ou-ltda', img: 'https://picsum.photos/400/250?random=11', cat: 'CONTABILIDAD', title: 'MEI ou Ltda: ¿cuál es la mejor opción para tu negocio?' },
              { href: '/blog/receita-federal', img: 'https://picsum.photos/400/250?random=12', cat: 'IMPUESTOS', title: 'Receita Federal: principales obligaciones del MEI en 2024' },
              { href: '/blog/nota-fiscal-marketplace', img: 'https://picsum.photos/400/250?random=13', cat: 'MARKETPLACES', title: 'Cómo emitir nota fiscal para Shopee, Shein y Mercado Libre' },
              { href: '/blog/checklist-abrir-empresa', img: 'https://picsum.photos/400/250?random=14', cat: 'NEGOCIOS', title: 'Checklist para abrir tu empresa en Brasil sin errores' }
            ].map((post, i) => (
              <a key={i} href={post.href} className="blog-card" style={{ flex: '0 0 auto', width: '300px', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'var(--color-bg-elevated)', display: 'flex', flexDirection: 'column', transition: 'all 0.3s', textDecoration: 'none' }}>
                <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                  <img src={post.img} alt={post.cat} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} />
                </div>
                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
                  <div style={{ color: 'var(--color-primary)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em' }}>{post.cat}</div>
                  <h3 style={{ color: 'white', fontWeight: 600, fontSize: '1rem', lineHeight: 1.4, flex: 1 }}>{post.title}</h3>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '99px', fontSize: '0.85rem', fontWeight: 600, width: 'fit-content', transition: 'opacity 0.2s' }}>
                    Leer artículo <ArrowRight size={14} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: '#080808', padding: '6rem 0 2.5rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
            {/* Brand col */}
            <div style={{ paddingRight: '1rem' }}>
              <img src="/logo.png" alt="Tu Socio" style={{ maxHeight: '52px', width: 'auto', marginBottom: '1.25rem', display: 'block' }} />
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.7, marginBottom: '2rem' }}>
                Ecosistema empresarial completo para emprendedores, comercios y empresas que quieren crecer en Brasil.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {[
                  { href: '#', icon: <InstagramIcon size={20} /> },
                  { href: '#', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" /></svg> },
                  { href: '#', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg> },
                  { href: 'https://wa.me/5511999999999', icon: <MessageCircle size={20} /> }
                ].map((s, i) => (
                  <a key={i} href={s.href} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', transition: 'all 0.2s' }}
                    onMouseOver={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                    onMouseOut={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  >{s.icon}</a>
                ))}
              </div>
            </div>

            {[{ title: 'Contabilidad', links: ['Apertura de CNPJ', 'Contabilidad Mensual', 'Regularización de CNPJ', 'Certificado Digital', 'Nota Fiscal e Impuestos', 'Consultoría Empresarial'] },
            { title: 'Marketplace', links: ['Vender en Marketplace', 'CNPJ para Marketplace', 'Nota Fiscal', 'Shopee, Shein y ML', 'Soporte para Vendedores'] },
            { title: 'Inversiones', links: ['Inversiones en Brasil', 'Organización Patrimonial', 'Impuestos sobre Inversiones', 'Planificación Financiera', 'Declaración de Renta'] },
            { title: 'Nosotros', links: ['Quiénes Somos', 'Nuestro Método', 'Equipo', 'Contacto'] },
            { title: 'Legal', links: ['Política de Privacidad', 'Términos de Uso'] }
            ].map((col, i) => (
              <div key={i}>
                <h4 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.5rem', letterSpacing: '0.02em' }}>{col.title}</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {col.links.map((link, j) => (
                    <li key={j}><a href="#" style={{ color: '#9ca3af', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.color = 'white'}
                      onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}
                    >{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ color: '#4b5563', fontSize: '0.8rem' }}>© 2024 Tu Socio. Todos los derechos reservados.</p>
            <p style={{ color: '#4b5563', fontSize: '0.8rem' }}>Ecosistema empresarial para Brasil · Atención en español</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hablar por WhatsApp"
        style={{
          position: 'fixed',
          right: '1.5rem',
          bottom: '1.5rem',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#25D366',
          color: 'white',
          padding: '0.75rem 1.25rem',
          borderRadius: '99px',
          fontWeight: 600,
          fontSize: '0.875rem',
          boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
          textDecoration: 'none',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,211,102,0.5)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,211,102,0.4)'; }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        WhatsApp
      </a>
    </>
  );
}

export default App;
