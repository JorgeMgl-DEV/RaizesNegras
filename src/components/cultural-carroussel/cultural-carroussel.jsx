import React, { useState, useRef, useEffect } from "react";
import "./cultural-carroussel.css";
const CulturalCarousel = ({
    title = "Teia Cultural",
    subtitle = "Confira abaixo uma seleção de conteúdos sobre a cultura afro-maranhense.",
    sectionLabel = "Últimos Artigos Adicionados",
    items = [
        { img: "https://folhadopirajucara.com.br/wp-content/uploads/2023/06/OIP-1.jpg", alt: "Tambor de Mina", text: "Reflexões sobre a ancestralidade do Tambor de Mina...", href: "https://www.scielo.br/j/rs/a/r4QX3qfZ74B7wMRBMxWMKJJ/" },
        { img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2AxuYJWSjUEOUrNPLt5sTj0OsALYgNaQ7Rg&s", alt: "Casa das Minas", text: "A Casa das Minas de São Luís e a saga de Nã Agontimé...", href: "https://www.scielo.br/j/sant/a/6k43brLBj9VmSx5Qypqjt6n/" },
        { img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm3KnZNUkaWRU32fwoNvsp5q3pYTLyBMPM3w&s", alt: "Economia e demografia", text: "Economia e demografia da escravidão no Maranhão...", href: "https://www.scielo.br/j/rh/a/c8QHwBqkVRgD9Fphx8VVyLc/" },
        { img: "https://www.omenelick2ato.com/wp-content/uploads/2018/05/site-DONA-RAQUEL-01-peq.jpg", alt: "Origem africana", text: "Famílias e alunos de origem africana no séc. XIX...", href: "#" },

        { img: "https://culturaemmovimento.com.br/wp-content/uploads/2020/03/Tambor-O-imparcial.jpg", alt: "Tambor de Crioula (IPHAN)", text: "Tambor de Crioula: dossiê e salvaguarda do IPHAN...", href: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT28SQWrWv5z0nqjiS5bz_SAf7-GNr30p55Fw&s" },
        { img: "https://www.ipatrimonio.org/wp-content/uploads/2017/04/Casa-das-Minas-Jeje-Imagem-UFMA.jpg", alt: "Fachada da Casa das Minas", text: "Casa das Minas: história, culto e patrimonialização...", href: "https://sociologiaeantropologia.com.br/wp-content/uploads/2024/07/v09n02_ARTIGO01-MariaLauraViveirosdeCastroCavalcanti_pt.pdf" },
        { img: "https://static.mundoeducacao.uol.com.br/mundoeducacao/2020/11/mesorre-ma.jpg", alt: "Mapa do Maranhão", text: "Posse de cativos no Maranhão e Grão-Pará (1785–1850)...", href: "https://revistas.usp.br/revhistoria/article/view/121833" },
        { img: "https://turismosaoluis.com.br/wp-content/uploads/2023/09/TAMBOR-DE-CRIOULA-scaled.jpg", alt: "Roda de Tambor de Crioula", text: "Tambor de Crioula: identidade, memória e visualidades...", href: "https://files.cercomp.ufg.br/weby/up/778/o/CulturaVisual_L1_050.pdf" },
        { img: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Casas_de_taipa_no_Maranh%C3%A3o.jpg", alt: "Quilombos no Maranhão", text: "Quilombos maranhenses: luta por território e direitos...", href: "https://periodicos.unb.br/index.php/emtempos/article/download/56188/42361/208207" },
        { img: "https://folhadopirajucara.com.br/wp-content/uploads/2023/06/OIP-1.jpg", alt: "Tambor de Mina", text: "Reflexões sobre a ancestralidade do Tambor de Mina...", href: "https://www.scielo.br/j/rs/a/r4QX3qfZ74B7wMRBMxWMKJJ/" },
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