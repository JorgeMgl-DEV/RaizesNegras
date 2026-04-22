"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions, version as pdfjsVersion } from "pdfjs-dist/legacy/build/pdf.mjs";
import Footer from "../../components/footer/footer";
import Navbar from "../../components/top-section/Navbar/Navbar.jsx";
import { driveFileBinaryURL, drivePreviewURL, getFileMetaURL, listInFolderURL, API_KEY } from "../../utils/drive";
import { env } from "@/src/utils/env";

GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.mjs`;

export default function Article({ id }) {
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [usePreview, setUsePreview] = useState(false);
  const [recs, setRecs] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const run = async () => {
      try {
        if (!API_KEY) throw new Error("API key ausente");
        const response = await fetch(getFileMetaURL(id));
        if (!response.ok) throw new Error("Arquivo não encontrado ou privado");
        const metadata = await response.json();
        setMeta(metadata);
      } catch (error) {
        setErr(error.message || "Falha ao carregar metadados");
      }
    };

    run();
  }, [id]);

  useEffect(() => {
    if (!meta || meta.mimeType !== "application/pdf" || usePreview) return;

    const render = async () => {
      try {
        const loadingTask = getDocument({ url: driveFileBinaryURL(meta.id) });
        const pdf = await loadingTask.promise;
        setPages(pdf.numPages);

        const pageObject = await pdf.getPage(page);
        const viewport = pageObject.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await pageObject.render({ canvasContext: context, viewport }).promise;
      } catch (error) {
        console.error(error);
        setUsePreview(true);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    render();
  }, [meta, page, usePreview]);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        if (!meta) return;

        const folderId = (meta.parents && meta.parents[0]) || env.googleDriveFolderGeneral;
        if (!folderId) return;

        const response = await fetch(listInFolderURL(folderId, { pageSize: 25 }));
        if (!response.ok) return;

        const data = await response.json();
        const items = (data.files || []).filter((file) => file.id !== meta.id).slice(0, 6);
        setRecs(items);
      } catch (error) {
        console.warn("recs", error);
      }
    };

    loadRecommendations();
  }, [meta]);

  const isPdf = meta?.mimeType === "application/pdf";
  const next = () => setPage((current) => Math.min(pages, current + 1));
  const prev = () => setPage((current) => Math.max(1, current - 1));
  const articleTitle = meta?.name || "Carregando artigo";

  return (
    <>
      <Navbar />
      <main className="article-layout">
        <section className="article-viewer">
          <div className="article-header">
            <div className="article-header__copy">
              <span className="article-eyebrow">Leitura do acervo</span>
              <h1>{articleTitle}</h1>
            </div>
            {meta?.webViewLink && (
              <a className="article-drive-link" href={meta.webViewLink} target="_blank" rel="noreferrer">
                Abrir no Google Drive
              </a>
            )}
          </div>

          {err && <div className="error">{err}</div>}
          {!err && loading && <div className="article-loading">Carregando artigo...</div>}

          {!err && !isPdf && meta && (
            <div className="article-note">
              Este arquivo não é PDF (<code>{meta.mimeType}</code>). Abra o material diretamente no Google Drive para visualizar o conteúdo completo.
            </div>
          )}

          {!err && isPdf && !usePreview && (
            <>
              <div className="article-controls">
                <button onClick={prev} disabled={page <= 1}>
                  Anterior
                </button>
                <span>{page} / {pages}</span>
                <button onClick={next} disabled={page >= pages}>
                  Próxima
                </button>
              </div>
              <canvas ref={canvasRef} className="article-canvas" />
            </>
          )}

          {!err && isPdf && usePreview && (
            <iframe
              title={meta?.name}
              src={drivePreviewURL(meta.id)}
              className="article-frame"
              allow="autoplay"
            />
          )}
        </section>

        <aside className="sidebar">
          <h3>Artigos relacionados</h3>
          {recs.length === 0 && <div>Nenhuma recomendação.</div>}
          {recs.map((recommendation) => (
            <Link className="reco-item" key={recommendation.id} href={`/artigo/${recommendation.id}`}>
              <div className="reco-name">{recommendation.name}</div>
              <div className="reco-meta">
                {new Date(recommendation.modifiedTime || Date.now()).toLocaleDateString("pt-BR")}
              </div>
            </Link>
          ))}
        </aside>
      </main>
      <Footer />
    </>
  );
}
