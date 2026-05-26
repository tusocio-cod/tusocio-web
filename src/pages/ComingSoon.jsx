import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import './ComingSoon.css';

const WA_LINK = "https://wa.me/5511952170637?text=Hola%2C%20vi%20el%20sitio%20web%20y%20quisiera%20m%C3%A1s%20informaci%C3%B3n.";

export default function ComingSoon() {
  return (
    <div className="cs-wrapper">
      <div className="cs-content">
        <div className="cs-emoji">🚧</div>

        <div className="cs-badge">Em Construção</div>

        <h1 className="cs-title">
          Esta página está sendo<br />
          <span className="cs-highlight">preparada com cuidado.</span>
        </h1>

        <p className="cs-desc">
          Nosso time está trabalhando neste conteúdo.<br />
          Em breve estará disponível com todas as informações.
        </p>

        <div className="cs-actions">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="cs-btn-primary"
          >
            <MessageCircle size={18} />
            Falar com um especialista
          </a>
          <Link to="/" className="cs-btn-secondary">
            ← Voltar ao início
          </Link>
        </div>

        <div className="cs-dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
