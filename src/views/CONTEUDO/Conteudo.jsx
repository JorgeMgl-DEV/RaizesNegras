"use client";

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

const foldersByRegion = {
  all: [
    env.googleDriveFolderGeneral,
    env.googleDriveFolderCentro,
    env.googleDriveFolderLeste,
    env.googleDriveFolderNorte,
    env.googleDriveFolderOeste,
    env.googleDriveFolderSul,
    env.googleDriveSubfolderId,
  ],
  centro: [env.googleDriveFolderCentro],
  leste: [env.googleDriveFolderLeste],
  norte: [env.googleDriveFolderNorte],
  oeste: [env.googleDriveFolderOeste],
  sul: [env.googleDriveFolderSul],
  geral: [env.googleDriveFolderGeneral],
};

export default function Conteudo() {
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nextPageToken, setNextPageToken] = useState("");
  const [prevTokens, setPrevTokens] = useState([]);
  const [region, setRegion] = useState("all");
  const [sort, setSort] = useState("recent");
  const debounceRef = useRef(null);

  const apiKey = env.googleApiKey;
  const folderGeneral = env.googleDriveFolderGeneral;
  const isConfigured = Boolean(apiKey && (folderGeneral || foldersByRegion.all.some(Boolean)));

  const buildQuery = (value, regionKey) => {
    const contains = value ? ` and name contains '${value.replace(/'/g, "\\'")}'` : "";
    const folders = (foldersByRegion[regionKey] || []).filter(Boolean);
    const parents = folders.length > 0 ? `(${folders.map((id) => `('${id}' in parents)`).join(" or ")})` : "";
    return `mimeType='application/pdf'${parents ? ` and ${parents}` : ""}${contains}`;
  };

  const fetchFiles = useCallback(
    async ({ q = query, pageToken = "", regionKey = region, sortKey = sort } = {}) => {
      if (!isConfigured) return;

      setLoading(true);
      setError("");

      try {
        if (regionKey === "all") {
          const folders = (foldersByRegion.all || []).filter(Boolean);
          const requests = folders.map(async (folder) => {
            const params = new URLSearchParams({
              q: `mimeType='application/pdf' and ('${folder}' in parents)${q ? ` and name contains '${q.replace(/'/g, "\\'")}'` : ""}`,
              key: apiKey,
              fields: "nextPageToken, files(id,name,mimeType,modifiedTime,webViewLink,thumbnailLink)",
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
          setNextPageToken("");
        } else {
          const params = new URLSearchParams({
            q: buildQuery(q, regionKey),
            key: apiKey,
            fields: "nextPageToken, files(id,name,webViewLink,modifiedTime)",
            orderBy: sortKey === "recent" ? "modifiedTime desc" : sortKey === "oldest" ? "modifiedTime" : "name",
            pageSize: "12",
            supportsAllDrives: "true",
            includeItemsFromAllDrives: "true",
          });

          if (pageToken) params.set("pageToken", pageToken);

          const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);

          const data = await response.json();
          setFiles(data.files || []);
          setNextPageToken(data.nextPageToken || "");
        }
      } catch {
        setError("Falha ao carregar conteúdos. Tente novamente.");
      } finally {
        setLoading(false);
      }
    },
    [apiKey, isConfigured, query, region, sort],
  );

  useEffect(() => {
    fetchFiles({ q: "", regionKey: region, sortKey: sort });
  }, [fetchFiles, isConfigured, region, sort]);

  const onChangeQuery = (event) => {
    const value = event.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setPrevTokens([]);
      fetchFiles({ q: value, pageToken: "", regionKey: region, sortKey: sort });
    }, 400);
  };

  const onNext = () => {
    if (!nextPageToken) return;
    setPrevTokens((tokens) => [...tokens, nextPageToken]);
    fetchFiles({ q: query, pageToken: nextPageToken, regionKey: region, sortKey: sort });
  };

  const onPrev = () => {
    if (prevTokens.length === 0) return;
    const newTokens = [...prevTokens];
    const previous = newTokens.pop();
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
        <h1 className="conteudo__title">Conteúdo</h1>
        {!isConfigured && <p className="conteudo__text">Configuração do Google Drive ausente.</p>}

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
                  setPrevTokens([]);
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
                  setPrevTokens([]);
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
              {files.map((file) => (
                <Link key={file.id} href={`/artigo/${file.id}`} className="article-card">
                  <div className="article-card__content">
                    <h3 className="article-card__title">{file.name}</h3>
                    <p className="article-card__meta">
                      <i className="fa-solid fa-clock" aria-hidden="true" />
                      Atualizado: {formatDate(file.modifiedTime)}
                    </p>
                  </div>
                  <div className="article-card__arrow">
                    <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="conteudo__pager">
              <button className="conteudo__btn" type="button" onClick={onPrev} disabled={prevTokens.length === 0 || loading}>
                Anterior
              </button>
              <button className="conteudo__btn" type="button" onClick={onNext} disabled={!nextPageToken || loading}>
                Próxima
              </button>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
