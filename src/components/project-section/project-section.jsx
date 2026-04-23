"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";

export default function ProjectSection({
  title = "O Projeto",
  text = "O projeto Raízes Negras tem como objetivo valorizar e preservar a memória cultural afrodescendente no Maranhão. Apesar de sua relevância histórica, muitos aspectos dessa cultura permanecem pouco documentados. A plataforma organiza entrevistas, documentos históricos e materiais audiovisuais como base de consulta para estudantes, pesquisadores e educadores.",
  imageSrc = "https://imagens.ebc.com.br/594W97SUTSOPC8q24p-XC46T5i8=/1170x700/smart/https://agenciabrasil.ebc.com.br/sites/default/files/thumbnails/image/6189776129_60bc98ca5f_o.jpg?itok=V6FQ3e86",
  imageAlt = "Foto do projeto Raízes Negras",
  subtitle = "Alcântara é o município brasileiro com maior número de comunidades quilombolas, segundo lideranças locais. Foto: CONAQ.",
}) {
  const sectionRef = useRef(null);

  const handleScrollDown = useCallback(() => {
    if (!sectionRef.current) return;
    window.scrollTo({ top: window.scrollY + 800, behavior: "smooth" });
  }, []);

  return (
    <section className="project-section" ref={sectionRef}>
      <div className="project-section__text">
        <span className="project-section__eyebrow">Curadoria e permanência</span>
        <h2 className="project-section__title">{title}</h2>
        <p className="project-section__body">{text}</p>
      </div>
      <figure className="project-section__img">
        <div className="project-section__frame">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={1170}
            height={700}
            sizes="(max-width: 640px) calc(100vw - 2.5rem), (max-width: 1024px) calc(100vw - 3rem), 46vw"
          />
        </div>
        <figcaption className="subtitle">{subtitle}</figcaption>
      </figure>

      <button className="project-section__scroll-arrow" onClick={handleScrollDown} type="button" aria-label="Descer">
        ↓
      </button>
    </section>
  );
}
