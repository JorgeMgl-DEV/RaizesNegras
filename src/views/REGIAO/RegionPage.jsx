"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Footer from "../../components/footer/footer";
import Navbar from "../../components/top-section/Navbar/Navbar.jsx";
import regioes from "../../components/top-section/Mapa/regioes.json";
import logoCentro from "../../assets/logos/centro.png";
import logoLeste from "../../assets/logos/leste.png";
import logoNorte from "../../assets/logos/norte.png";
import logoOeste from "../../assets/logos/oeste.png";
import logoSul from "../../assets/logos/sul.png";
import mapaCentro from "../../assets/logos/maps/centro.png";
import mapaLeste from "../../assets/logos/maps/leste.png";
import mapaNorte from "../../assets/logos/maps/norte.png";
import mapaOeste from "../../assets/logos/maps/oeste.png";
import mapaSul from "../../assets/logos/maps/Sul.png";
import { regionDescriptions } from "@/src/data/regions";
import { env } from "@/src/utils/env";
import slugify from "@/src/utils/slugify";

const logos = {
  1: logoNorte,
  2: logoSul,
  3: logoLeste,
  4: logoOeste,
  5: logoCentro,
  default: logoNorte,
};

const mapas = {
  1: mapaNorte,
  2: mapaSul,
  3: mapaLeste,
  4: mapaOeste,
  5: mapaCentro,
  default: mapaNorte,
};

const foldersByRegion = {
  1: [env.googleDriveFolderNorte],
  2: [env.googleDriveFolderSul],
  3: [env.googleDriveFolderLeste],
  4: [env.googleDriveFolderOeste],
  5: [env.googleDriveFolderCentro],
};

export default function RegionPage({ slug }) {
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("recent");
  const debounceRef = useRef(null);

  const region = useMemo(
    () => regioes.find((item) => item.slug === slug || item.code === slug || slugify(item.name) === slug),
    [slug],
  );

  const regionDescription = region ? regionDescriptions[slugify(region.name)] || "" : "";
  const apiKey = env.googleApiKey;

  const isConfigured = Boolean(apiKey && region && foldersByRegion[region.code]);
  const logoSrc = logos[region?.code] || logos.default;
  const mapSrc = mapas[region?.code] || mapas.default;

  const fetchFiles = useCallback(
    async ({ q = query, sortKey = sort } = {}) => {
      if (!isConfigured) return;

      setLoading(true);
      setError("");

      try {
        const folders = (foldersByRegion[region.code] || []).filter(Boolean);

        if (folders.length === 0) {
          setFiles([]);
          return;
        }

        const requests = folders.map(async (folder) => {
          const params = new URLSearchParams({
            q: `mimeType='application/pdf' and ('${folder}' in parents)${q ? ` and name contains '${q.replace(/'/g, "\\'")}'` : ""}`,
            key: apiKey,
            fields: "files(id,name,mimeType,modifiedTime,webViewLink,thumbnailLink)",
            orderBy: sortKey === "recent" ? "modifiedTime desc" : sortKey === "oldest" ? "modifiedTime" : "name",
            pageSize: "12",
            supportsAllDrives: "true",
            includeItemsFromAllDrives: "true",
          });

          const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`);
          if (!response.ok) return { files: [] };
          return response.json();
        });

        const results = await Promise.all(requests);
        const merged = [];
        const seen = new Set();

        results.forEach((result) => {
          (result.files || []).forEach((file) => {
            if (seen.has(file.id)) return;
            seen.add(file.id);
            merged.push(file);
          });
        });

        if (sortKey === "recent") {
          merged.sort((a, b) => new Date(b.modifiedTime || 0) - new Date(a.modifiedTime || 0));
        } else if (sortKey === "oldest") {
          merged.sort((a, b) => new Date(a.modifiedTime || 0) - new Date(b.modifiedTime || 0));
        } else {
          merged.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
        }

        setFiles(merged);
      } catch (fetchError) {
        setError("Falha ao carregar conteúdos desta região. Tente novamente.");
        console.error("Erro ao buscar arquivos:", fetchError);
      } finally {
        setLoading(false);
      }
    },
    [apiKey, isConfigured, query, region, sort],
  );

  useEffect(() => {
    if (region && isConfigured) {
      fetchFiles({ q: "", sortKey: sort });
    }
  }, [fetchFiles, region, sort, isConfigured]);

  const onChangeQuery = (event) => {
    const value = event.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchFiles({ q: value, sortKey: sort });
    }, 400);
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("pt-BR", { year: "numeric", month: "short", day: "2-digit" });
  };

  if (!region) {
    return (
      <>
        <Navbar />
        <main className="region-page" id="conteudo" role="main">
          <div className="region-error">
            <h1>Região não encontrada</h1>
            <p>Não encontramos a região <strong>{slug}</strong>.</p>
            <Link href="/" className="region-backlink">
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
            <div className="region-page__info">
              <span className="region-page__eyebrow">Região {region.code}</span>
              <h1 className="region-page__title">{region.name}</h1>
              <p className="region-page__lead">Acervo e narrativas associados aos contextos históricos e culturais deste território.</p>
              <div className="region-page__logo-shell">
                <Image
                  src={logoSrc}
                  alt={`Símbolo representativo da região ${region.name}`}
                  className="region-page__logo"
                  sizes="(max-width: 920px) 52vw, 240px"
                />
              </div>

              <div className="region-description">
                <p>{regionDescription}</p>
                <p>{region.descricao}</p>
              </div>
            </div>

            <div className="region-page__map">
              <div className="region-page__map-shell">
                <Image
                  src={mapSrc}
                  alt={`Mapa ilustrativo da região ${region.name}`}
                  className="region-page__map-image"
                  sizes="(max-width: 920px) 84vw, 34vw"
                />
              </div>
            </div>
          </header>

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
                      onChange={(event) => setSort(event.target.value)}
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
                      {query ? `Nenhum arquivo encontrado para "${query}" nesta região.` : "Nenhum conteúdo encontrado para esta região ainda."}
                    </div>
                  )}

                  {!loading && !error && files.length > 0 && (
                    <>
                      <div className="region-content__header">
                        <div className="region-content__count">
                          {files.length} arquivo{files.length !== 1 ? "s" : ""} encontrado{files.length !== 1 ? "s" : ""}
                        </div>
                      </div>

                      <div className="region-content__grid">
                        {files.map((file) => (
                          <Link key={file.id} href={`/artigo/${file.id}`} className="article-card">
                            <div className="article-card__icon">
                              <i className="fa-solid fa-file-pdf" aria-hidden="true" />
                            </div>
                            <div className="article-card__content">
                              <h3 className="article-card__title">{file.name}</h3>
                              <p className="article-card__meta">
                                <i className="fa-solid fa-calendar" aria-hidden="true" />
                                {formatDate(file.modifiedTime)}
                              </p>
                            </div>
                            <div className="article-card__arrow">
                              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                            </div>
                          </Link>
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
  );
}
