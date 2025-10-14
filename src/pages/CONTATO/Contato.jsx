import React, { useState } from "react";
import "./legal.css";

const Contato = () => {
  const [form, setForm] = useState({ nome: "", email: "", mensagem: "" });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
    // Aqui você pode integrar com backend ou serviço de e-mail
  };

  return (
    <div className="legal-page">
      <h1>Contato Institucional</h1>
      <p>
        Fale conosco para dúvidas, sugestões ou solicitações relacionadas ao portal Raízes Negras. Preencha o formulário abaixo ou envie e-mail para contato@raizesnegras.com.br.
      </p>
      <form className="contato-form" onSubmit={handleSubmit}>
        <label>Nome:<br />
          <input type="text" name="nome" value={form.nome} onChange={handleChange} required />
        </label>
        <label>E-mail:<br />
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>Mensagem:<br />
          <textarea name="mensagem" value={form.mensagem} onChange={handleChange} required />
        </label>
        <button type="submit">Enviar</button>
      </form>
      {enviado && <p className="enviado-msg">Mensagem enviada! Entraremos em contato em breve.</p>}
    </div>
  );
};

export default Contato;
