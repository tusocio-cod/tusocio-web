import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronRight, Globe, Lock, Shield, ArrowRight, CheckCircle2, ChevronDown, Building2, MessageCircle, Star, ClipboardList, ShieldCheck, Key, FileText, ShoppingCart, Box, MessageSquare, FileSearch, CheckSquare, Send, Users, BarChart3, Mail } from 'lucide-react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import CalculadoraPrecios from './pages/CalculadoraPrecios';
import NcmSearch from './pages/NcmSearch';
import ComingSoon from './pages/ComingSoon';

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

const FacebookIcon = ({ size = 20, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TikTokIcon = ({ size = 20, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const YoutubeIcon = ({ size = 20, color = "currentColor", className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="none" />
  </svg>
);

import './index.css';
import './App.css';
import './mobile.css';
import images from './images';

// ── WhatsApp — altere apenas aqui para mudar número ou mensagem ──
const WA_LINK = "https://wa.me/5511952170637?text=Hola%2C%20vi%20el%20sitio%20web%20y%20quisiera%20m%C3%A1s%20informaci%C3%B3n.";

const menuData = [
  {
    title: "Contabilidad",
    columns: 2,
    cta: { text: "Consultar Especialista", link: WA_LINK },
    items: [
      { title: "Contabilidad Mensual", desc: "Mantén tu empresa en regla todos los meses con impuestos.", link: "/contabilidad-mensual" },
      { title: "Apertura de CNPJ", desc: "Abre tu empresa en Brasil con acompañamiento completo.", link: "/apertura-cnpj" },
      { title: "Regularización de CNPJ", desc: "Resuelve pendencias, declaraciones atrasadas y deudas.", link: "/regularizacion-cnpj" },
      { title: "Certificado Digital", desc: "E-CPF y E-CNPJ para operar y emitir facturas con seguridad.", link: "/certificado-digital" },
      { title: "Nota Fiscal e Impuestos", desc: "Orientación para emitir notas fiscales y mantener impuestos en orden.", link: "/nota-fiscal-impuestos" },
      { title: "Consultoría", desc: "Organiza tu negocio, mejora tus números y toma decisiones estratégicas.", link: "/consultoria" }
    ]
  },
  {
    title: "Documentación",
    columns: 1,
    cta: { text: "Consultar Especialista", link: WA_LINK },
    items: [
      { title: "RNM Temporario y Permanente", desc: "Apoyo completo con el Registro Nacional Migratorio y residencia.", link: "/rnm-residencia" },
      { title: "CPF para Extranjeros", desc: "Orientación para obtener o regularizar tu CPF en Brasil.", link: "/cpf-extranjeros" },
      { title: "Pasaporte", desc: "Asistencia para trámites y emisión de pasaportes.", link: "/pasaporte" },
      { title: "Traducciones Juramentadas", desc: "Traducción oficial de documentos para trámites legales.", link: "/traducciones" },
      { title: "Naturalización", desc: "Asesoramiento completo para obtener la nacionalidad brasileña.", link: "/naturalizacion" }
    ]
  },
  {
    title: "Marketplace",
    columns: 2,
    cta: { text: "Consultar Especialista", link: WA_LINK },
    items: [
      { title: "Empezar a vender online", desc: "Prepara tu empresa para vender con seguridad online.", link: "/marketplace" },
      { title: "CNPJ para Marketplace", desc: "Abre o ajusta tu CNPJ para operar en canales de venta.", link: "/cnpj-marketplace" },
      { title: "Certificado Digital", desc: "Emite notas, firma documentos y mantén tu operación activa.", link: "/certificado-digital" },
      { title: "Nota Fiscal e Impuestos", desc: "Organiza tus notas fiscales y obligaciones de venta.", link: "/nota-fiscal-impuestos" },
      { title: "Alteración de Cuenta CPF para CNPJ", desc: "Orientación para migrar de CPF a CNPJ en tus tiendas.", link: "/regularizacion-marketplace" },
      { title: "Shopee, Shein y TiktokShop", desc: "Soluciones para vendedores en las principales plataformas.", link: "/marketplace-plataformas" },
      { title: "Calculadora de Precios", desc: "Herramienta para calcular los precios de venta en marketplaces.", link: "/precios", isRouterLink: true },
      { title: "Buscador de NCM", desc: "Consulta de NCM para clasificación fiscal de productos.", link: "/ncm", isRouterLink: true }
    ]
  },
  {
    title: "Inversiones",
    columns: 1,
    cta: { text: "Consultar Especialista", link: WA_LINK },
    items: [
      { title: "Inversiones en Bolsa", desc: "Orientación para entender oportunidades en el mercado de valores.", link: "/inversiones-bolsa" },
      { title: "Inversiones en el Exterior", desc: "Estrategias para diversificar capital fuera de Brasil.", link: "/inversiones-exterior" },
      { title: "Planificación Patrimonial", desc: "Estructuración de bienes y planificación sucesoria.", link: "/planificacion-patrimonial" },
      { title: "Planificación Financiera", desc: "Organización y control de tus flujos financieros y metas.", link: "/planificacion-financiera" },
      { title: "Inversión Inmobiliaria", desc: "Asesoría para invertir en inmuebles con alto rendimiento.", link: "/inversion-inmobiliaria" }
    ]
  },
  {
    title: "Inmobiliaria",
    columns: 1,
    cta: { text: "Consultar Especialista", link: WA_LINK },
    items: [
      { title: "Comprar Casa en Brasil", desc: "Orientación y trámites para adquirir tu inmueble de forma segura.", link: "/comprar-casa-brasil" },
      { title: "Administración de Alquiler", desc: "Gestión completa y soporte con contratos de alquiler.", link: "/administracion-alquiler" },
      { title: "Acompañamiento y Análisis de Contrato", desc: "Revisión legal de documentos y contratos inmobiliarios.", link: "/analisis-contrato" },
      { title: "Regularización de Inmuebles", desc: "Soporte para regularizar escrituras y pendencias del inmueble.", link: "/regularizacion-inmuebles" }
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
    primaryBtn: { label: 'Consultar por WhatsApp', href: WA_LINK },
    secondaryBtn: { label: 'Conocer soluciones', href: '#soluciones' },
    benefits: ['CNPJ listo para operar', 'Contabilidad empresarial', 'Marketplace e impuestos'],
  },
  {
    image: '/images/hero/hero-renta-2026.webp',
    eyebrow: 'TEMPORADA FISCAL 2026',
    title: ['Declaración de renta 2026', 'con orientación', 'clara y segura.'],
    subtitle: 'Organizamos tus ingresos, bienes, documentos y obligaciones para declarar correctamente en Brasil, con atención en español y acompañamiento paso a paso.',
    primaryBtn: { label: 'Declarar mi renta', href: WA_LINK },
    secondaryBtn: { label: 'Consultar requisitos', href: '#soluciones' },
    benefits: ['Personas y empresas', 'Bienes e ingresos', 'Atención en español'],
  },
  {
    image: '/images/hero/hero-marketplace.webp',
    eyebrow: 'MARKETPLACE Y NEGOCIOS DIGITALES',
    title: ['Vende en marketplace', 'con tu empresa', 'en orden.'],
    subtitle: 'Preparamos tu CNPJ, certificado digital, nota fiscal, impuestos y contabilidad para vender con más seguridad en Shopee, Shein, Mercado Libre, TikTok Shop y otros canales.',
    primaryBtn: { label: 'Preparar mi empresa', href: WA_LINK },
    secondaryBtn: { label: 'Ver soluciones', href: '#soluciones' },
    benefits: ['Nota fiscal', 'Certificado digital', 'Shopee, Shein y Mercado Libre'],
  },
  {
    image: '/images/hero/hero-documentacion.webp',
    eyebrow: 'DOCUMENTOS EN BRASIL',
    title: ['CPF, RNM y trámites', 'documentales con', 'acompañamiento.'],
    subtitle: 'Te orientamos en documentos, protocolos y procesos importantes para vivir, emprender y organizar tu situación en Brasil con más tranquilidad.',
    primaryBtn: { label: 'Consultar documentación', href: WA_LINK },
    secondaryBtn: { label: 'Hablar con un especialista', href: '#soluciones' },
    benefits: ['CPF y RNM', 'Protocolos', 'Soporte en español'],
  },
  {
    image: '/images/hero/hero-inmobiliaria.webp',
    eyebrow: 'ASESORÍA INMOBILIARIA',
    title: ['Trámites inmobiliarios', 'con análisis y', 'acompañamiento.'],
    subtitle: 'Apoyamos en la revisión de documentos, contratos, requisitos y procesos para compra, alquiler o regularización inmobiliaria en Brasil.',
    primaryBtn: { label: 'Consultar asesoría', href: WA_LINK },
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
      {/* Background images — first loaded eagerly, rest lazily */}
      {heroSlides.map((s, i) => (
        <div
          key={i}
          className={`hero-slide-bg ${i === current ? 'active' : ''}`}
          style={{
            opacity: i === current ? 1 : 0,
          }}
        >
          <img
            src={s.image}
            alt=""
            aria-hidden="true"
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'low'}
            decoding={i === 0 ? 'sync' : 'async'}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
            }}
          />
        </div>
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

          <div className="hero-cta-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
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
    { title: "Vender", desc: "Prepara tu empresa para marketplace, nota fiscal y canales digitales.", icon: <ShoppingCart size={24} />, cta: "Vender →", bg: "/soluciones/vender.png" },
    { title: "Declarar", desc: "Impuestos, renta y obligaciones fiscales con orientación clara.", icon: <ClipboardList size={24} />, cta: "Declarar →", bg: "/soluciones/declarar.png" },
    { title: "Acompañar", desc: "Atención en español para que siempre sepas el próximo paso.", icon: <MessageCircle size={24} />, cta: "Acompañar →", bg: "/soluciones/acompanar.png" }
  ],
  [
    { title: "Organizar", desc: "Documentos, procesos y números más claros para tu empresa.", icon: <FileText size={24} />, cta: "Organizar →", bg: "/soluciones/organizar.png" },
    { title: "Proteger", desc: "Evita errores, multas y bloqueos por falta de regularización.", icon: <Key size={24} />, cta: "Proteger →", bg: "/soluciones/proteger.png" },
    { title: "Crecer", desc: "Estructura contable y empresarial para avanzar con más control.", icon: <ArrowRight size={24} />, cta: "Crecer →", bg: "/soluciones/crecer.png" }
  ]
];

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSet, setActiveSet] = useState(0);
  const [isHoveredSoluciones, setIsHoveredSoluciones] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isHoveredMetodo, setIsHoveredMetodo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaTab, setActiveMegaTab] = useState(0);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

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
            <Link to="/">
              <img src="/logo.png" alt="Tu Socio" style={{ maxHeight: '42px', width: 'auto' }} />
            </Link>
          </div>

          <nav className="nav-links">
            <Link to="/" className="nav-link" style={{ fontWeight: 600 }}>Inicio</Link>

            <div className="nav-item group-hover" style={{ position: 'relative' }}>
              <a href="#soluciones" className="nav-link font-semibold" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Nuestros Servicios <ChevronDown size={14} />
              </a>

              <div className="mega-menu" style={{
                position: 'absolute',
                top: 'calc(100% + 12px)',
                left: '50%',
                transform: 'translateX(-50%) translateY(-8px)',
                width: '95vw',
                maxWidth: '1200px',
                backgroundColor: 'rgba(10, 10, 10, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '0',
                display: 'flex',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9)',
                zIndex: 100,
                overflow: 'hidden'
              }}>
                {/* Left Sidebar (Categories) */}
                <div style={{
                  width: '280px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRight: '1px solid rgba(255, 255, 255, 0.06)',
                  padding: '2rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ padding: '0 1rem', marginBottom: '1rem', color: '#9ca3af', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Departamentos
                  </div>
                  {menuData.map((category, idx) => {
                    const catIcons = {
                      "Contabilidad": <BarChart3 size={18} />,
                      "Documentación": <FileText size={18} />,
                      "Marketplace": <ShoppingCart size={18} />,
                      "Inversiones": <Building2 size={18} />,
                      "Inmobiliaria": <Globe size={18} />
                    };
                    const isActive = activeMegaTab === idx;
                    return (
                      <div 
                        key={idx}
                        onMouseEnter={() => setActiveMegaTab(idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '1rem',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          background: isActive ? 'rgba(255, 90, 0, 0.1)' : 'transparent',
                          border: isActive ? '1px solid rgba(255, 90, 0, 0.2)' : '1px solid transparent',
                          color: isActive ? 'white' : '#9ca3af',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ color: isActive ? 'var(--color-primary)' : '#6b7280' }}>
                          {catIcons[category.title]}
                        </div>
                        <span style={{ fontWeight: isActive ? 700 : 500, flex: 1 }}>{category.title}</span>
                        {isActive && <ChevronRight size={16} style={{ color: 'var(--color-primary)' }} />}
                      </div>
                    );
                  })}
                </div>

                {/* Right Content Area (Items) */}
                <div style={{
                  flex: 1,
                  padding: '2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(10, 10, 10, 0.98)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingBottom: '1.25rem',
                    marginBottom: '2rem'
                  }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', margin: 0 }}>
                      {menuData[activeMegaTab].title}
                    </h3>
                    {menuData[activeMegaTab].cta && (
                      <a href={menuData[activeMegaTab].cta.link} target="_blank" rel="noopener noreferrer" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        background: 'var(--color-primary)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = '#e65100'}
                      onMouseOut={e => e.currentTarget.style.background = 'var(--color-primary)'}
                      >
                        {menuData[activeMegaTab].cta.text} <ArrowRight size={14} />
                      </a>
                    )}
                  </div>

                  <ul style={{ 
                    listStyle: 'none', 
                    padding: 0, 
                    margin: 0, 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1.5rem',
                    columnGap: '2.5rem'
                  }}>
                    {menuData[activeMegaTab].items.map((item, i) => {
                      const linkContent = (
                        <>
                          <strong style={{ display: 'block', color: 'white', fontSize: '1rem', marginBottom: '0.5rem', fontWeight: 600, transition: 'color 0.2s' }}>
                            {item.title}
                          </strong>
                          <span style={{ fontSize: '0.85rem', color: '#9ca3af', display: 'block', lineHeight: 1.5, transition: 'color 0.2s' }}>{item.desc}</span>
                        </>
                      );
                      const linkProps = {
                        className: "mega-item-link",
                        style: {
                          display: 'block',
                          textDecoration: 'none',
                          padding: '1.25rem',
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.04)',
                          transition: 'all 0.2s ease',
                          height: '100%'
                        },
                        onMouseOver: e => {
                          e.currentTarget.style.background = 'rgba(255, 90, 0, 0.05)';
                          e.currentTarget.style.borderColor = 'rgba(255, 90, 0, 0.2)';
                          e.currentTarget.querySelector('strong').style.color = 'var(--color-primary)';
                          e.currentTarget.querySelector('span').style.color = '#d1d5db';
                        },
                        onMouseOut: e => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.04)';
                          e.currentTarget.querySelector('strong').style.color = 'white';
                          e.currentTarget.querySelector('span').style.color = '#9ca3af';
                        }
                      };
                      return (
                        <li key={i}>
                          {item.isRouterLink ? (
                            <Link to={item.link} {...linkProps}>{linkContent}</Link>
                          ) : (
                            <a href={item.link} {...linkProps}>{linkContent}</a>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

            <a href="#metodo" className="nav-link font-semibold">Quiénes Somos</a>
            <a href="#contacto" className="nav-link font-semibold">Contacto</a>
          </nav>

          <div className="nav-actions">
            {/* Social Icons */}
            <div className="header-socials" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              marginRight: '1.25rem',
            }}>
              <a href="mailto:contacto@tusocio.com.br" style={{ color: '#9ca3af', display: 'flex', transition: 'color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--color-primary)'}
                onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}><Mail size={18} /></a>
              <a href="https://www.facebook.com/profile.php?id=61571394935733" target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af', display: 'flex', transition: 'color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--color-primary)'}
                onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}><FacebookIcon size={18} /></a>
              <a href="https://www.instagram.com/tusociobr" target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af', display: 'flex', transition: 'color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--color-primary)'}
                onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}><InstagramIcon size={18} /></a>
              <a href="https://www.tiktok.com/@tusociobr" target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af', display: 'flex', transition: 'color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--color-primary)'}
                onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}><TikTokIcon size={18} /></a>
              <a href="https://www.youtube.com/@tusocioBR" target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af', display: 'flex', transition: 'color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--color-primary)'}
                onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}><YoutubeIcon size={18} /></a>
            </div>

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

            <a href={WA_LINK} className="btn btn-primary btn-pill font-bold">Abrir empresa</a>

            {/* Hamburger Button */}
            <button
              className={`hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}></div>
        <div className="mobile-drawer-panel">
          <div className="mobile-drawer-header">
            <img src="/logo.png" alt="Tu Socio" style={{ maxHeight: '36px', width: 'auto' }} />
            <button className="mobile-drawer-close" onClick={() => setMobileMenuOpen(false)}>
              ✕
            </button>
          </div>

          <nav className="mobile-drawer-nav">
            <a href="#" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Inicio</a>
            {menuData.map((menu, idx) => (
              <div key={idx} className="mobile-drawer-section" style={{ margin: '0.75rem 0 0.25rem 0' }}>
                <div style={{ padding: '0.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {menu.title}
                </div>
                {menu.items.map((item, i) => {
                  if (item.isRouterLink) {
                    return (
                      <Link
                        key={i}
                        to={item.link}
                        className="mobile-nav-link"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{ paddingLeft: '1.75rem', minHeight: '40px', fontSize: '0.9rem', display: 'block', textDecoration: 'none' }}
                      >
                        {item.title}
                      </Link>
                    )
                  }
                  return (
                    <a
                      key={i}
                      href={item.link}
                      className="mobile-nav-link"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ paddingLeft: '1.75rem', minHeight: '40px', fontSize: '0.9rem' }}
                    >
                      {item.title}
                    </a>
                  )
                })}
              </div>
            ))}
          </nav>

          <div className="mobile-drawer-footer">
            <a href={WA_LINK} className="mobile-cta-primary">
              <MessageCircle size={18} />
              Consultar Especialista
            </a>
          </div>
        </div>
      </div>

      {/* Hero Slider */}
      <Routes>
        <Route path="/" element={
          <>
            <HeroSlider />

            {/* Soluciones */}
            <section id="soluciones" className="section bg-base">
              <div className="container">
                <div className="text-center mx-auto" style={{ marginBottom: '4rem', maxWidth: '48rem' }}>
                  <div className="badge" style={{ marginBottom: '1.25rem' }}>NUESTRAS SOLUCIONES</div>
                  <h2 className="heading-h2" style={{ marginBottom: '1rem', fontSize: '3rem' }}>Estructura. Orden. Crecimiento.</h2>
                  <p className="text-lg text-gray-400">Todo lo que tu negocio necesita para operar con seguridad.<br /></p>
                </div>

                <div style={{ position: 'relative', width: '100%' }}>
                  {/* Left side arrow button */}
                  <button
                    onClick={() => setActiveSet(prev => (prev - 1 + solucionesSets.length) % solucionesSets.length)}
                    className="soluciones-nav-btn prev"
                    aria-label="Anterior"
                  >
                    <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                  </button>

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

                  {/* Right side arrow button */}
                  <button
                    onClick={() => setActiveSet(prev => (prev + 1) % solucionesSets.length)}
                    className="soluciones-nav-btn next"
                    aria-label="Siguiente"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Full width CTA Card */}
                <div className="cta-premium-block">
                  <div className="cta-content flex-row items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold text-2xl mb-2">¿No sabes por dónde empezar?</h3>
                      <p className="text-gray-300 text-lg">Hablamos contigo y te indicamos el mejor camino para tu negocio.</p>
                    </div>
                    <a href={WA_LINK} className="btn btn-primary btn-pill flex items-center gap-2 whitespace-nowrap mt-4 md:mt-0 hover-lift" style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', boxShadow: '0 4px 14px rgba(255,90,0,0.3)' }}>
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
                    <div className="badge" style={{ marginBottom: '1.25rem' }}>MÉTODO TU SOCIO</div>
                    <h2 className="heading-h2" style={{ marginBottom: '1rem', fontSize: '3rem' }}>Un método simple para poner tu empresa en orden.</h2>
                    <p className="text-lg text-gray-400">Te acompañamos para abrir, regularizar, organizar y <br />gestionar tu empresa, paso a paso.</p>
                  </div>

                  {/* Two-column layout */}
                  <div className="metodo-layout">
                    {/* Left column */}
                    <div className="metodo-left">
                      <div style={{ width: '40px', height: '2px', background: 'var(--color-primary)', marginBottom: '2rem' }}></div>
                      <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', lineHeight: 1.3, marginBottom: '1.5rem' }}>Un método claro para avanzar con seguridad.</h3>
                      <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: '2.5rem' }}>Analizamos tu caso, organizamos tus documentos y te acompañamos en cada etapa, para que tu empresa esté siempre en orden.</p>
                      <a href={WA_LINK} className="btn btn-pill flex items-center gap-2" style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', boxShadow: '0 4px 14px rgba(255,90,0,0.35)', width: 'fit-content' }}>
                        <MessageCircle size={18} /> Hablar con un especialista
                      </a>
                    </div>

                    {/* Right column - animated card */}
                    {(() => {
                      const steps = [
                        { num: '01', title: 'Diagnóstico', desc: 'Entendemos tu situación, tu actividad y lo que necesitas.', icon: <MessageSquare size={28} />, bg: '/soluciones/abrir.png' },
                        { num: '02', title: 'Plan', desc: 'Organizamos el camino: documentos, CNPJ, impuestos y lo que debes resolver primero.', icon: <FileSearch size={28} />, bg: '/soluciones/regularizar.png' },
                        { num: '03', title: 'Ejecución', desc: 'Nuestro equipo organiza el proceso, revisa documentos y acompaña cada trámite.', icon: <CheckSquare size={28} />, bg: '/soluciones/gestionar.png' },
                        { num: '04', title: 'Acompañamiento', desc: 'Te mantenemos informado y te orientamos como seguir operando.', icon: <Send size={28} />, bg: '/soluciones/atendimento.png' }
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
                    <div className="badge" style={{ marginBottom: '1.25rem' }}>NUESTROS NÚMEROS</div>
                    <h2 className="heading-h2" style={{ marginBottom: '1rem', fontSize: '2.75rem' }}>
                      Confianza construida con resultados<span style={{ color: 'var(--color-primary)' }}>.</span>
                    </h2>
                    <p className="text-lg text-gray-400">Nuestros números reflejan la experiencia acompañando<br />emprendedores, comercios y familias en Brasil.</p>
                  </div>

                  <div className="numeros-premium-layout">
                    {/* Main featured card */}
                    <div className="numeros-main-card bento-card" style={{ position: 'relative', overflow: 'hidden', background: 'var(--color-bg-elevated)', border: '1px solid rgba(255,90,0,0.25)', borderRadius: 'var(--radius-xl)', padding: '3rem', boxShadow: '0 0 60px rgba(255,90,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      {/* Tech glowing radar network background */}
                      <svg style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.18, zIndex: 0 }} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.7">
                          <circle cx="300" cy="100" r="150" stroke="url(#grid-glow)" strokeWidth="1" strokeDasharray="4 4" />
                          <circle cx="300" cy="100" r="100" stroke="url(#grid-glow)" strokeWidth="1.5" />
                          <circle cx="300" cy="100" r="50" stroke="url(#grid-glow)" strokeWidth="1" strokeDasharray="2 2" />
                          <line x1="150" y1="100" x2="450" y2="100" stroke="url(#grid-glow)" strokeWidth="1" />
                          <line x1="300" y1="-50" x2="300" y2="250" stroke="url(#grid-glow)" strokeWidth="1" />
                          <circle cx="300" cy="100" r="4" fill="var(--color-primary)" />
                          <circle cx="200" cy="100" r="3" fill="var(--color-primary)" />
                          <circle cx="300" cy="200" r="3" fill="var(--color-primary)" />
                          <circle cx="370" cy="170" r="3" fill="var(--color-primary)" />
                        </g>
                        <defs>
                          <radialGradient id="grid-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" transform="translate(300 100) rotate(90) scale(150)">
                            <stop stopColor="var(--color-primary)" stopOpacity="0.4" />
                            <stop offset="1" stopColor="var(--color-primary)" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                      </svg>

                      {/* Elegant active client avatars stacked */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 1, marginBottom: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {[
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80',
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
                            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
                            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80'
                          ].map((url, idx) => (
                            <img
                              key={idx}
                              src={url}
                              alt="Cliente de Tu Socio"
                              style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '50%',
                                border: '2.5px solid var(--color-bg-elevated)',
                                marginLeft: idx > 0 ? '-14px' : '0',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                                objectFit: 'cover'
                              }}
                            />
                          ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className="flex h-2.5 w-2.5 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e2e8f0' }}>Operando en vivo</span>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Soporte activo en español</span>
                        </div>
                      </div>

                      <div style={{ marginTop: '4rem', position: 'relative', zIndex: 1 }}>
                        <div style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1, marginBottom: '0.5rem' }}>+<AnimatedStat value={5000} /></div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>Clientes atendidos</h3>
                        <div style={{ width: '40px', height: '2px', background: 'var(--color-primary)', marginBottom: '1rem' }}></div>
                        <p style={{ color: '#9ca3af', lineHeight: 1.6 }}>Personas, familias y empresas orientadas por Tu Socio para operar con confianza y seguridad.</p>
                      </div>
                    </div>

                    {/* 2x2 smaller cards */}
                    <div className="numeros-small-grid">
                      {[
                        { icon: <Building2 size={22} />, num: 1000, suffix: '', prefix: '+', title: 'Empresas abiertas y regularizadas', desc: 'CNPJs creados, regularizados o transformados para operar con seguridad.' },
                        { icon: <BarChart3 size={22} />, num: 200, suffix: '', prefix: '+', title: 'Empresas bajo gestión contable', desc: 'Impuestos, obligaciones y soporte continuo todos los meses.' },
                        { icon: <ShoppingCart size={22} />, num: 60, suffix: 'M', prefix: '+R$ ', title: 'En facturación de empresas acompañadas', desc: 'Operaciones empresariales atendidas con control contable y fiscal.' },
                        { icon: <FileText size={22} />, num: 1000, suffix: '', prefix: '+', title: 'Documentos y trámites elaborados', desc: "RNM's, CPF's, CNH's, Naturalización y demás trámites." }
                      ].map((s, i) => (
                        <div key={i} className="numeros-small-card bento-card" style={{ position: 'relative', overflow: 'hidden', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-xl)', padding: '2rem', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease' }}>
                          {/* Faint orange decorative corner glow */}
                          <div style={{
                            position: 'absolute',
                            top: '-30px',
                            right: '-30px',
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255,90,0,0.06) 0%, rgba(255,90,0,0) 70%)',
                            pointerEvents: 'none',
                            zIndex: 0
                          }} />
                          <div style={{ position: 'relative', zIndex: 1, width: '44px', height: '44px', borderRadius: '10px', border: '1px solid rgba(255,90,0,0.25)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>{s.icon}</div>
                          <div style={{ position: 'relative', zIndex: 1, fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1, marginBottom: '0.75rem' }}>{s.prefix}<AnimatedStat value={s.num} suffix={s.suffix} /></div>
                          <h4 style={{ position: 'relative', zIndex: 1, fontSize: '1rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem', lineHeight: 1.3 }}>{s.title}</h4>
                          <div style={{ position: 'relative', zIndex: 1, width: '28px', height: '2px', background: 'var(--color-primary)', marginBottom: '0.75rem' }}></div>
                          <p style={{ position: 'relative', zIndex: 1, color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.6 }}>{s.desc}</p>
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
                  <div className="badge" style={{ marginBottom: '1.25rem' }}>TESTIMONIOS</div>
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
                    <div className="badge" style={{ marginBottom: '1.25rem' }}>BLOG</div>
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
          </>
        } />
        <Route path="/precios" element={<CalculadoraPrecios />} />
        <Route path="/ncm" element={<NcmSearch />} />
        <Route path="*" element={<ComingSoon />} />
      </Routes>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', background: '#080808', padding: '4rem 0 2rem' }}>
        <div className="container">
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr 1.1fr 1.1fr 0.8fr 0.8fr', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Brand col */}
            <div className="footer-brand-col" style={{ paddingRight: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <img src="/logo.png" alt="Tu Socio" className="footer-logo" style={{ maxHeight: '50px', width: 'auto', marginBottom: '1.25rem', display: 'block' }} />
              <p className="footer-desc" style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Ecosistema empresarial completo para emprendedores, comercios y empresas que quieren crecer en Brasil.
              </p>
              <div className="footer-socials" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                {[
                  { href: 'https://www.instagram.com/tusociobr', icon: <InstagramIcon size={20} /> },
                  { href: 'https://www.facebook.com/profile.php?id=61571394935733', icon: <FacebookIcon size={20} /> },
                  { href: 'https://www.tiktok.com/@tusociobr', icon: <TikTokIcon size={20} /> },
                  { href: 'https://www.youtube.com/@tusocioBR', icon: <YoutubeIcon size={20} /> },
                  { href: WA_LINK, icon: <MessageCircle size={20} /> }
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', transition: 'all 0.2s' }}
                    onMouseOver={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                    onMouseOut={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  >{s.icon}</a>
                ))}
              </div>
            </div>

            {[{ title: 'Contabilidad', links: ['Apertura de CNPJ', 'Contabilidad Mensual', 'Regularización de CNPJ', 'Certificado Digital', 'Nota Fiscal e Impuestos', 'Consultoría Empresarial'] },
            { title: 'Marketplace', links: ['Vender en Marketplace', 'CNPJ para Marketplace', 'Nota Fiscal', 'Shopee, Shein y ML', 'Soporte para Vendedores'] },
            { title: 'Inversiones', links: ['Inversiones en Brasil', 'Organización Patrimonial', 'Impuestos sobre Inversiones', 'Planificación Financiera', 'Declaración de Renta'] },
            {title: 'Nosotros', links: ['Quiénes Somos', 'Nuestro Método', 'Equipo', 'Contacto']},
            {title: 'Legal', links: ['Política de Privacidad', 'Términos de Uso']}
            ].map((col, i) => (
              <div key={i} className="footer-links-col">
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

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
            <p style={{ color: '#4b5563', fontSize: '0.8rem', margin: 0 }}>© 2024 Tu Socio. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={WA_LINK}
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
        <span className="wa-float-label">WhatsApp</span>
      </a>

      {/* Fixed Mobile CTA Bar */}
      <div className="mobile-sticky-cta">
        <a href={WA_LINK} className="cta-wa">
          <MessageCircle size={18} style={{ flexShrink: 0 }} />
          <span style={{ textAlign: 'left', lineHeight: '1.2' }}>Consultar<br/>Especialista</span>
        </a>
        <a href="#soluciones" className="cta-learn">
          Ver Soluciones
        </a>
      </div>
    </>
  );
}

export default App;
