"use client"

import { useParams, Link } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import "./RegionPage.css"
import "./RegionPageCustom.css"
import Navbar from "../../components/top-section/Navbar/Navbar.jsx"
import Footer from "../../components/footer/footer"
import regioes from "../../components/top-section/Mapa/regioes.json"
import logoNorte from "../../assets/logos/norte.png"
import logoSul from "../../assets/logos/sul.png"
import logoLeste from "../../assets/logos/leste.png"
import logoOeste from "../../assets/logos/oeste.png"
import logoCentro from "../../assets/logos/centro.png"
import mapaNorte from "../../assets/logos/maps/norte.png"
import mapaSul from "../../assets/logos/maps/Sul.png"
import mapaLeste from "../../assets/logos/maps/leste.png"
import mapaOeste from "../../assets/logos/maps/oeste.png"
import mapaCentro from "../../assets/logos/maps/centro.png"

// util simples de slug; se você já tem um em utils/slugify.js, use-o.
const slugify = (s) =>
    s
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove acentos
        .toLowerCase()
        .replace(/ç/g, "c")
        .replace(/\s+/g, "-")

const regionDescriptions = {
    norte: "A região Norte do Maranhão é berço de importantes manifestações culturais afro-brasileiras, incluindo o Tambor de Crioula e o Bumba Meu Boi. Esta área preserva tradições centenárias e uma forte conexão com as raízes africanas.",
    sul: "O Sul maranhense guarda histórias de resistência e quilombos, com comunidades que mantêm vivas as tradições ancestrais. A região é conhecida por seus rituais, danças e pela preservação da medicina tradicional.",
    leste: "Na região Leste, encontramos um rico patrimônio cultural materializado em festas religiosas, artesanato e culinária típica. As comunidades locais são guardiãs de saberes tradicionais únicos.",
    oeste: "O Oeste do Maranhão se destaca pela forte presença de comunidades quilombolas e pela preservação de ritmos e danças tradicionais. A região mantém viva a memória dos ancestrais através de suas manifestações culturais.",
    centro: "A região Central representa um ponto de convergência cultural, onde diferentes tradições se encontram e se renovam. É um território de intensas trocas culturais e preservação da identidade afro-maranhense."
};

export default function RegionPage() {
    const { slug } = useParams();
    const [pageTitle, setPageTitle] = useState("");
    const [regionDescription, setRegionDescription] = useState("");

    // Estados para o sistema de conteúdos
    const [query, setQuery] = useState("");
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [nextPageToken, setNextPageToken] = useState("");
    const [prevTokens, setPrevTokens] = useState([]);
    const [sort, setSort] = useState("recent");
    const debounceRef = useRef(null);

    // 1) tenta por slug; 2) tenta por code (slug pode ser '1', por ex.)
    const region = regioes.find((r) => r.slug === slug || r.code === slug || slugify(r.name) === slug)

    // Efeito para configurar título e descrição da página
    useEffect(() => {
        if (region) {
            const title = `${region.name} - Raízes Negras`;
            setPageTitle(title);
            document.title = title;

            const description = regionDescriptions[slugify(region.name)];
            setRegionDescription(description);

            // Adiciona meta description dinâmica
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', description);
            } else {
                const meta = document.createElement('meta');
                meta.name = 'description';
                meta.content = description;
                document.head.appendChild(meta);
            }
        }
    }, [region]);

    // Mapeia as imagens de acordo com o código da região
    const logos = {
        1: logoNorte,
        2: logoSul,
        3: logoLeste,
        4: logoOeste,
        5: logoCentro,
        default: logoNorte,
    }

    const mapas = {
        1: mapaNorte,
        2: mapaSul,
        3: mapaLeste,
        4: mapaOeste,
        5: mapaCentro,
        default: mapaNorte,
    }

    const logoSrc = logos[region?.code] || logos["default"]
    const mapSrc = mapas[region?.code] || mapas["default"]

    // Configuração da API
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY

    // Mapeamento das pastas por região
    const foldersByRegion = {
        1: [import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_NORTE], // Norte
        2: [import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_SUL], // Sul
        3: [import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_LESTE], // Leste
        4: [import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_OESTE], // Oeste
        5: [import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_CENTRO], // Centro
    }

    const isConfigured = Boolean(apiKey && region && foldersByRegion[region.code])

    const buildQuery = (q) => {
        const contains = q ? ` and name contains '${q.replace(/'/g, "\\'")}'` : ""
        const folders = (foldersByRegion[region.code] || []).filter(Boolean)
        const parents = folders.length > 0 ? `(${folders.map((id) => `('${id}' in parents)`).join(" or ")})` : ""
        return `mimeType='application/pdf'${parents ? ` and ${parents}` : ""}${contains}`
    }

    const fetchFiles = async ({ q = query, pageToken = "", sortKey = sort } = {}) => {
        if (!isConfigured) return
        setLoading(true)
        setError("")

        try {
            const folders = (foldersByRegion[region.code] || []).filter(Boolean)

            if (folders.length === 0) {
                setFiles([])
                setNextPageToken("")
                return
            }

            // Query para buscar apenas na pasta da região específica
            const requests = folders.map(async (folder) => {
                const qParents = `('${folder}' in parents)`
                const params = new URLSearchParams({
                    q: `mimeType='application/pdf' and ${qParents}${q ? ` and name contains '${q.replace(/'/g, "\\'")}'` : ""}`,
                    key: apiKey,
                    fields: "files(id,name,mimeType,modifiedTime,webViewLink,thumbnailLink)",
                    orderBy: sortKey === "recent" ? "modifiedTime desc" : sortKey === "oldest" ? "modifiedTime" : "name",
                    pageSize: "12",
                    supportsAllDrives: "true",
                    includeItemsFromAllDrives: "true",
                })

                if (pageToken) params.set("pageToken", pageToken)

                const url = `https://www.googleapis.com/drive/v3/files?${params.toString()}`
                const res = await fetch(url)
                if (!res.ok) return { files: [] }
                return res.json()
            })

            const results = await Promise.all(requests)
            const merged = []
            const seen = new Set()

            results.forEach((r) => {
                ; (r.files || []).forEach((f) => {
                    if (!seen.has(f.id)) {
                        seen.add(f.id)
                        merged.push(f)
                    }
                })
            })

            // Ordenação
            if (sortKey === "recent") {
                merged.sort((a, b) => new Date(b.modifiedTime || 0) - new Date(a.modifiedTime || 0))
            } else if (sortKey === "oldest") {
                merged.sort((a, b) => new Date(a.modifiedTime || 0) - new Date(b.modifiedTime || 0))
            } else {
                merged.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
            }

            setFiles(merged)
            setNextPageToken("") // Para simplificar, removemos paginação para região específica
        } catch (e) {
            setError("Falha ao carregar conteúdos desta região. Tente novamente.")
            console.error("Erro ao buscar arquivos:", e)
        } finally {
            setLoading(false)
        }
    }

    // Carregar arquivos quando a região ou ordenação mudar
    useEffect(() => {
        if (region && isConfigured) {
            fetchFiles({ q: "", sortKey: sort })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [region, sort, isConfigured])

    const onChangeQuery = (e) => {
        const value = e.target.value
        setQuery(value)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            setPrevTokens([])
            fetchFiles({ q: value, pageToken: "", sortKey: sort })
        }, 400)
    }

    const formatDate = (iso) => {
        if (!iso) return ""
        const d = new Date(iso)
        if (Number.isNaN(d.getTime())) return ""
        return d.toLocaleDateString("pt-BR", { year: "numeric", month: "short", day: "2-digit" })
    }

    if (!region) {
        return (
            <>
                <Navbar />
                <main className="region-page" id="conteudo" role="main">
                    <div className="region-error">
                        <h1>Região não encontrada</h1>
                        <p>Não encontramos a região <strong>{slug}</strong>.</p>
                        <Link to="/" className="region-backlink">
                            Voltar à página inicial
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="region-page" id="conteudo" role="main">
                <article className="region-article">
                    <header className="region-page__header">
                        <div className="region-header-container">
                            <div className="region-header-content">
                                <div className="region-title-wrapper">
                                    <h1 className="region-page__title">{region.name}</h1>
                                    <div className="region-title-divider"></div>
                                </div>
                                
                                <img
                                    src={logoSrc}
                                    alt={`Símbolo representativo da região ${region.name}`}
                                    className="region-page__logo"
                                    loading="lazy"
                                    width={200}
                                    height={150}
                                />
                            </div>
                            
                            <div className="region-description-wrapper">
                                <div className="region-description-content">
                                    <p className="region-description__primary">{regionDescription}</p>
                                    <p className="region-description__secondary">{region.descricao}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="region-page__map-wrapper">
                            <img
                                src={mapSrc}
                                alt={`Mapa ilustrativo da região ${region.name}`}
                                className="region-page__map-image"
                                loading="lazy"
                                width={600}
                                height={400}
                            />
                        </div>
                    </header>

                    {/* Sistema de conteúdos da região */}
                    <section className="region-page__content" aria-label={`Conteúdos da região ${region.name}`}>
                        <div className="region-content">
                            <h2 className="region-content__title">Conteúdos da região {region.name}</h2>

                            {!isConfigured ? (
                                <p className="region-content__text">Configuração do Google Drive ausente para esta região.</p>
                            ) : (
                                <>
                                    <div className="region-content__controls">
                                        <input
                                            className="region-content__search"
                                            type="text"
                                            placeholder="Buscar PDFs nesta região..."
                                            value={query}
                                            onChange={onChangeQuery}
                                            aria-label="Buscar PDFs"
                                        />

                                        <label className="region-content__label" htmlFor="region-ordem">
                                            Ordenar
                                        </label>
                                        <select
                                            id="region-ordem"
                                            className="region-content__select"
                                            value={sort}
                                            onChange={(e) => setSort(e.target.value)}
                                            aria-label="Ordenar resultados"
                                        >
                                            <option value="recent">Mais recente</option>
                                            <option value="oldest">Mais antigo</option>
                                        </select>
                                    </div>

                                    {loading && <div className="region-content__loading">Carregando conteúdos da região...</div>}

                                    {error && <div className="region-content__error">{error}</div>}

                                    {!loading && !error && files.length === 0 && (
                                        <div className="region-content__empty">
                                            {query
                                                ? `Nenhum arquivo encontrado para "${query}" nesta região.`
                                                : "Nenhum conteúdo encontrado para esta região ainda."}
                                        </div>
                                    )}

                                    {!loading && !error && files.length > 0 && (
                                        <>
                                            <div className="region-content__header">
                                                <div className="region-content__count">
                                                    {files.length} arquivo{files.length !== 1 ? "s" : ""} encontrado
                                                    {files.length !== 1 ? "s" : ""}
                                                </div>
                                            </div>

                                            <div className="region-content__grid">
                                                {files.map((f) => (
                                                    <a key={f.id} href={`/artigo/${f.id}`} className="article-card">
                                                        <div className="article-card__icon">
                                                            <i className="fa fa-file-pdf-o" aria-hidden="true" />
                                                        </div>
                                                        <div className="article-card__content">
                                                            <h3 className="article-card__title">{f.name}</h3>
                                                            <p className="article-card__meta">
                                                                <i className="fa fa-calendar" aria-hidden="true" />
                                                                {formatDate(f.modifiedTime)}
                                                            </p>
                                                        </div>
                                                        <div className="article-card__arrow">
                                                            <i className="fa fa-arrow-right" aria-hidden="true" />
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </section>
                </article>
            </main>
            <Footer />
        </>
    )
}
