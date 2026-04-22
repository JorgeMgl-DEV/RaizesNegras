"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Footer from "../../components/footer/footer";
import Navbar from "../../components/top-section/Navbar/Navbar.jsx";
import { env } from "@/src/utils/env";

const regionLabelMap = {
  all: "Todas as regiões",
  geral: "Geral/Sem região",
  centro: "Centro",
  leste: "Leste",
  norte: "Norte",
  oeste: "Oeste",
  sul: "Sul",
};

const folderEntries = [
  { id: env.googleDriveFolderGeneral, regionKey: "geral" },
  { id: env.googleDriveSubfolderId, regionKey: "geral" },
  { id: env.googleDriveFolderCentro, regionKey: "centro" },
  { id: env.googleDriveFolderLeste, regionKey: "leste" },
  { id: env.googleDriveFolderNorte, regionKey: "norte" },
  { id: env.googleDriveFolderOeste, regionKey: "oeste" },
  { id: env.googleDriveFolderSul, regionKey: "sul" },
].filter(({ id }) => Boolean(id));

const foldersByRegion = {
  all: folderEntries.map(({ id }) => id),
  centro: folderEntries.filter(({ regionKey }) => regionKey === "centro").map(({ id }) => id),
  leste: folderEntries.filter(({ regionKey }) => regionKey === "leste").map(({ id }) => id),
  norte: folderEntries.filter(({ regionKey }) => regionKey === "norte").map(({ id }) => id),
  oeste: folderEntries.filter(({ regionKey }) => regionKey === "oeste").map(({ id }) => id),
  sul: folderEntries.filter(({ regionKey }) => regionKey === "sul").map(({ id }) => id),
  geral: folderEntries.filter(({ regionKey }) => regionKey === "geral").map(({ id }) => id),
};

const formatDocumentTitle = (name = "") =>
  name
    .replace(/\.pdf$/i, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const enhanceThumbnail = (thumbnailLink = "") => {
  if (!thumbnailLink) return "";
  return thumbnailLink.replace(/=s\d+/, "=s1200");
};

export default function Conteudo() {
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nextPageToken, setNextPageToken] = useState("");
  const [currentPageToken, setCurrentPageToken] = useState("");
  const [prevTokens, setPrevTokens] = useState([]);
  const [region, setRegion] = useState("all");
  const [sort, setSort] = useState("recent");
  const debounceRef = useRef(null);
  const queryRef = useRef("");

  const apiKey = env.googleApiKey;
  const isConfigured = Boolean(apiKey && folderEntries.length > 0);

  const buildQuery = (value, regionKey) => {
    const contains = value ? ` and name contains '${value.replace(/'/g, "\\'")}'` : "";
    const folders = (foldersByRegion[regionKey] || []).filter(Boolean);
    const parents = folders.length > 0 ? `(${folders.map((id) => `('${id}' in parents)`).join(" or ")})` : "";
    return `mimeType='application/pdf' and trashed=false${parents ? ` and ${parents}` : ""}${contains}`;
  };

  const fetchFiles = useCallback(
    async ({ q = "", pageToken = "", regionKey = "all", sortKey = "recent" } = {}) => {
      if (!isConfigured) return;

      setLoading(true);
      setError("");

      try {
        if (regionKey === "all") {
          const requests = folderEntries.map(async ({ id: folderId, regionKey: folderRegionKey }) => {
            const params = new URLSearchParams({
              q: `mimeType='application/pdf' and trashed=false and ('${folderId}' in parents)${q ? ` and name contains '${q.replace(/'/g, "\\'")}'` : ""}`,
              key: apiKey,
              fields: "nextPageToken, files(id,name,mimeType,modifiedTime,webViewLink,thumbnailLink)",
              orderBy: sortKey === "recent" ? "modifiedTime desc" : sortKey === "oldest" ? "modifiedTime" : "name",
              pageSize: "12",
              supportsAllDrives: "true",
              includeItemsFromAllDrives: "true",
            });

            const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`);
            if (!response.ok) return { files: [], regionKey: folderRegionKey };
            const data = await response.json();
            return { ...data, regionKey: folderRegionKey };
          });

          const results = await Promise.all(requests);
          const merged = [];
          const seen = new Set();

          results.forEach((result) => {
            (result.files || []).forEach((file) => {
              if (seen.has(file.id)) return;
              seen.add(file.id);
              merged.push({ ...file, regionKey: result.regionKey });
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
          setCurrentPageToken("");
          setNextPageToken("");
        } else {
          const params = new URLSearchParams({
            q: buildQuery(q, regionKey),
            key: apiKey,
            fields: "nextPageToken, files(id,name,mimeType,modifiedTime,webViewLink,thumbnailLink)",
            orderBy: sortKey === "recent" ? "modifiedTime desc" : sortKey === "oldest" ? "modifiedTime" : "name",
            pageSize: "12",
            supportsAllDrives: "true",
            includeItemsFromAllDrives: "true",
          });

          if (pageToken) params.set("pageToken", pageToken);

          const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);

          const data = await response.json();
          setFiles((data.files || []).map((file) => ({ ...file, regionKey })));
          setCurrentPageToken(pageToken);
          setNextPageToken(data.nextPageToken || "");
        }
      } catch {
        setError("Falha ao carregar conteúdos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    },
    [apiKey, isConfigured],
  );

  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  useEffect(() => {
    if (!isConfigured) return;
    setPrevTokens([]);
    setCurrentPageToken("");
    fetchFiles({ q: queryRef.current, pageToken: "", regionKey: region, sortKey: sort });
  }, [fetchFiles, isConfigured, region, sort]);

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const onChangeQuery = (event) => {
    const value = event.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setPrevTokens([]);
      setCurrentPageToken("");
      fetchFiles({ q: value, pageToken: "", regionKey: region, sortKey: sort });
    }, 400);
  };

  const onNext = () => {
    if (!nextPageToken) return;
    setPrevTokens((tokens) => [...tokens, currentPageToken]);
    fetchFiles({ q: query, pageToken: nextPageToken, regionKey: region, sortKey: sort });
  };

  const onPrev = () => {
    if (prevTokens.length === 0) return;
    const newTokens = [...prevTokens];
    const previous = newTokens.pop() ?? "";
    setPrevTokens(newTokens);
    fetchFiles({ q: query, pageToken: previous, regionKey: region, sortKey: sort });
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("pt-BR", { year: "numeric", month: "short", day: "2-digit" });
  };

  return (
    <>
      <Navbar />
      <main className="conteudo__main">
        <section className="conteudo__hero">
          <div className="conteudo__hero-copy">
            <span className="conteudo__eyebrow">Arquivo e pesquisa</span>
            <h1 className="conteudo__title">Conteúdo do acervo</h1>
            <p className="conteudo__text">
              Consulte materiais organizados por região e explore o acervo com filtros simples, leitura pública e navegação direta para cada documento.
            </p>
          </div>
          <div className="conteudo__hero-card">
            <span>Recorte ativo</span>
            <strong>{regionLabelMap[region]}</strong>
            <small>{files.length} resultado(s) visíveis</small>
          </div>
        </section>

        {!isConfigured && <p className="conteudo__text conteudo__text--warning">Configuração do Google Drive ausente.</p>}

        {isConfigured && (
          <>
            <div className="conteudo__controls">
              <input
                className="conteudo__search"
                type="text"
                placeholder="Buscar PDFs..."
                value={query}
                onChange={onChangeQuery}
                aria-label="Buscar PDFs"
              />
              <label className="conteudo__label" htmlFor="conteudo-region">
                Região
              </label>
              <select
                id="conteudo-region"
                className="conteudo__select"
                value={region}
                onChange={(event) => {
                  if (debounceRef.current) clearTimeout(debounceRef.current);
                  setPrevTokens([]);
                  setCurrentPageToken("");
                  setRegion(event.target.value);
                }}
                aria-label="Filtrar por região"
              >
                <option value="all">Todas as regiões</option>
                <option value="geral">Geral/Sem região</option>
                <option value="centro">Centro</option>
                <option value="leste">Leste</option>
                <option value="norte">Norte</option>
                <option value="oeste">Oeste</option>
                <option value="sul">Sul</option>
              </select>

              <label className="conteudo__label" htmlFor="conteudo-ordem">
                Ordenar
              </label>
              <select
                id="conteudo-ordem"
                className="conteudo__select"
                value={sort}
                onChange={(event) => {
                  if (debounceRef.current) clearTimeout(debounceRef.current);
                  setPrevTokens([]);
                  setCurrentPageToken("");
                  setSort(event.target.value);
                }}
                aria-label="Ordenar resultados"
              >
                <option value="recent">Mais recente</option>
                <option value="oldest">Mais antigo</option>
              </select>
            </div>

            {loading && <div className="conteudo__loading">Carregando...</div>}
            {error && <div className="conteudo__error">{error}</div>}

            {!loading && !error && files.length === 0 && (
              <div className="conteudo__empty">Nenhum arquivo encontrado.</div>
            )}

            <div className="conteudo__header">
              <div className="conteudo__badge">{regionLabelMap[region]}</div>
              <div className="conteudo__count">{files.length} resultado(s)</div>
            </div>

            <div className="conteudo__grid">
              {files.map((file) => {
                const title = formatDocumentTitle(file.name);
                const regionLabel = regionLabelMap[file.regionKey] || regionLabelMap[region] || "Acervo";
                const thumbnail = enhanceThumbnail(file.thumbnailLink);
                const modifiedAt = formatDate(file.modifiedTime);

                return (
                  <Link key={file.id} href={`/artigo/${file.id}`} className="article-card">
                    <div className="article-card__media" aria-hidden="true">
                      {thumbnail ? (
                        <Image src={thumbnail} alt="" fill sizes="(max-width: 860px) 100vw, 33vw" />
                      ) : (
                        <div className="article-card__media-fallback">
                          <i className="fa-solid fa-file-pdf" aria-hidden="true" />
                          <span>PDF</span>
                        </div>
                      )}
                    </div>
                    <div className="article-card__content">
                      <div className="article-card__tags">
                        <span className="article-card__badge">{regionLabel}</span>
                        <span className="article-card__filetype">PDF</span>
                      </div>
                      <h3 className="article-card__title">{title}</h3>
                      <p className="article-card__meta">
                        <i className="fa-solid fa-clock" aria-hidden="true" />
                        {modifiedAt ? `Atualizado em ${modifiedAt}` : "Documento do acervo"}
                      </p>
                    </div>
                    <div className="article-card__footer">
                      <span className="article-card__cta">Abrir documento</span>
                      <span className="article-card__arrow">
                        <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {region !== "all" && (
              <div className="conteudo__pager">
                <button className="conteudo__btn" type="button" onClick={onPrev} disabled={prevTokens.length === 0 || loading}>
                  Anterior
                </button>
                <button className="conteudo__btn" type="button" onClick={onNext} disabled={!nextPageToken || loading}>
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
