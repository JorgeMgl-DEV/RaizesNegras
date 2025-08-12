import React, { useState, useRef, useEffect } from "react";
import "./cultural-carroussel.css";
const CulturalCarousel = ({
    title = "Teia Cultural",
    subtitle = "Confira abaixo uma seleção de conteúdos sobre a cultura afro-maranhense.",
    sectionLabel = "Últimos Artigos Adicionados",
    items = [
        { img: "src/assets/imagens/tamborDeMina.png", alt: "Tambor de Mina", text: "Reflexões sobre a ancestralidade africana do Tambor de Mina do Maranhão.", href: "#" },
        { img: "src/assets/imagens/cadaDeMinas.png", alt: "Casa das Minas", text: "A CASA DAS MINAS DE SÃO LUÍS DO MARANHÃO e a saga de NA AGONTIMÉ...", href: "#" },
        { img: "src/assets/imagens/maranhao.png", alt: "Economia e demografia", text: "Economia e demografia da escravidão no Maranhão...", href: "#" },
        { img: "src/assets/imagens/crianças.png", alt: "Origem africana", text: "Famílias e alunos de origem africana no Maranhão do século XIX...", href: "#" },
        { img: "src/assets/imagens/tamborDeMina.png", alt: "Tambor de Mina 2", text: "Linha de pesquisa e musicalidade.", href: "#" },
        { img: "src/assets/imagens/cadaDeMinas.png", alt: "Casa das Minas 2", text: "Tradições e liderança religiosa.", href: "#" },
        { img: "src/assets/imagens/maranhao.png", alt: "Economia 2", text: "Ciclos econômicos e impactos sociais.", href: "#" },
        { img: "src/assets/imagens/crianças.png", alt: "Infâncias 2", text: "Trajetórias educativas no século XIX.", href: "#" },
        { img: "src/assets/imagens/maranhao.png", alt: "Maranhão 3", text: "Cartografias culturais.", href: "#" },
        { img: "src/assets/imagens/cadaDeMinas.png", alt: "Casa das Minas 3", text: "Matrizes africanas no Maranhão.", href: "#" }
    ],
    perView = 5
}) => {
    const [page, setPage] = useState(0);
    const viewportRef = useRef(null);
    const pageCount = Math.max(1, Math.ceil(items.length / perView));

    const next = () => setPage((p) => (p + 1) % pageCount);
    const prev = () => setPage((p) => (p - 1 + pageCount) % pageCount);
    const goTo = (i) => setPage(i);

    let startX = 0;
    const onTouchStart = (e) => {
        startX = e.touches[0].clientX;
    };
    const onTouchEnd = (e) => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) {
            if (dx < 0) next(); else prev();
        }
    };

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        };
        const vp = viewportRef.current;
        vp && vp.addEventListener("keydown", onKey);
        return () => vp && vp.removeEventListener("keydown", onKey);
    }, [pageCount]);

    const trackWidthPct = pageCount * 100;
    const itemBasisPct = 100 / (perView * pageCount);
    const translatePct = (page * 100) / pageCount;

    return (
        <section className="cultural-section">
            <div className="cultural-section__text">
                <h1 className="cultural-section__text title">{title}</h1>
                <h1 className="cultural-section__text text">{subtitle}</h1>
                <h3 className="cultural-section__text subtitle">{sectionLabel}</h3>
            </div>

            <div className="cultural-section__carrossel" aria-roledescription="carousel">
                <button className="cultural-section__nav cultural-section__nav--prev" onClick={prev} aria-label="Anterior">‹</button>

                <div
                    className="cultural-section__viewport"
                    ref={viewportRef}
                    tabIndex={0}
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                >
                    <div
                        className="cultural-section__track"
                        style={{ display: "flex", width: `${trackWidthPct}%`, transform: `translateX(-${translatePct}%)`, transition: "transform .4s ease" }}
                    >
                        {items.map((it, i) => (
                            <div key={i} className="cultural-section__carrossel__item" style={{ flex: `0 0 ${itemBasisPct}%` }}>
                                <img src={it.img} alt={it.alt} />
                                <p>{it.text}</p>
                                <a href={it.href}>Acesse o artigo aqui</a>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="cultural-section__nav cultural-section__nav--next" onClick={next} aria-label="Próximo">›</button>
            </div>

            <div className="cultural-section__dots" role="tablist" aria-label="Seleção de páginas">
                {Array.from({ length: pageCount }).map((_, i) => (
                    <button
                        key={i}
                        role="tab"
                        aria-selected={i === page}
                        className={`cultural-section__dot ${i === page ? "is-active" : ""}`}
                        onClick={() => goTo(i)}
                    />
                ))}
            </div>
        </section>
    );
};

export default CulturalCarousel;