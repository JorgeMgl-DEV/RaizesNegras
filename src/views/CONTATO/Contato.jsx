"use client";

import { useState } from "react";
import Footer from "../../components/footer/footer";
import Navbar from "../../components/top-section/Navbar/Navbar.jsx";

export default function Contato() {
  const [form, setForm] = useState({ nome: "", email: "", mensagem: "" });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setEnviado(true);
  };

  return (
    <>
      <Navbar />
      <main className="legal-shell">
        <section className="legal-page__hero">
          <span className="legal-page__eyebrow">Contato institucional</span>
          <h1>Fale com o projeto</h1>
          <p>Envie dúvidas, sugestões ou solicitações sobre o portal, o acervo e os materiais organizados por região.</p>
        </section>

        <div className="legal-grid legal-grid--contact">
          <section className="legal-page legal-page--article">
            <h2>Mensagem</h2>
            <p>
              Preencha o formulário com seu nome, e-mail e a mensagem que deseja encaminhar. Para contato imediato, utilize também os canais diretos ao lado.
            </p>
            <form className="contato-form" onSubmit={handleSubmit}>
              <label>
                Nome
                <input type="text" name="nome" value={form.nome} onChange={handleChange} required />
              </label>
              <label>
                E-mail
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </label>
              <label>
                Mensagem
                <textarea name="mensagem" value={form.mensagem} onChange={handleChange} required rows={6} />
              </label>
              <button type="submit">Enviar</button>
            </form>
            {enviado && <p className="enviado-msg">Mensagem enviada. Entraremos em contato em breve.</p>}
          </section>

          <aside className="legal-aside legal-aside--contact">
            <strong>Contato direto</strong>
            <div className="legal-aside__stack">
              <div className="legal-aside__card">
                <span>E-mail</span>
                <a href="mailto:acervo.raizesnegras@gmail.com">acervo.raizesnegras@gmail.com</a>
              </div>
              <div className="legal-aside__card">
                <span>WhatsApp</span>
                <a href="https://wa.me/5598986249925" target="_blank" rel="noreferrer">
                  (98) 98624-9925
                </a>
              </div>
              <div className="legal-aside__card">
                <span>Equipe</span>
                <p>Jorge Miguel Viana Torres, Murilo Gabriel Mourão e Erick MacGregor.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
