import React, { useRef, useCallback } from "react";
import "./project-section.css";

const ProjectSection = ({
    title = "O Projeto",
    text = "O projeto Raízes Negras tem como objetivo valorizar e preservar a memória cultural afrodescendente no Maranhão. Apesar de sua relevância histórica, muitos aspectos dessa cultura permanecem não documentados, dificultando sua valorização. A criação de uma plataforma digital interativa reunirá entrevistas com líderes comunitários, documentos históricos e materiais audiovisuais, servindo como um recurso educacional para estudantes e pesquisadores e promovendo a educação.",
    imageSrc = "https://imagens.ebc.com.br/594W97SUTSOPC8q24p-XC46T5i8=/1170x700/smart/https://agenciabrasil.ebc.com.br/sites/default/files/thumbnails/image/6189776129_60bc98ca5f_o.jpg?itok=V6FQ3e86",
    imageAlt = "Foto do projeto Raízes Negras",
    subtitle = "Alcântara é o município brasileiro com maior número de comunidades quilombolas, segundo lideranças locais. Foto: CONAQ "
}) => {
    const sectionRef = useRef(null);

    const handleScrollDown = useCallback(() => {
        if (sectionRef.current) {
            const target = window.scrollY + 800;
            window.scrollTo({ top: target, behavior: "smooth" });
        }
    }, []);


    return (
        <section className="project-section" ref={sectionRef}>
            <div className="project-section__text">
                <h1 className="project-section__text title">{title}</h1>
                <span className="project-section__text text">{text}</span>
            </div>
            <div className="project-section__img">
                <img src={imageSrc} alt={imageAlt} />
                <span className="subtitle">{subtitle}</span>
            </div>

            <div
                className="scroll-arrow"
                onClick={handleScrollDown}
                role="button"
                aria-label="Descer"
            >
                ↓
            </div>
        </section>
    );
};

export default ProjectSection;
