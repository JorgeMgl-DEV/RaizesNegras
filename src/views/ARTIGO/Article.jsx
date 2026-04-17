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

  return (
    <>
      <Navbar />
      <main className="article-layout">
        <section className="article-viewer">
          {err && <div className="error">{err}</div>}
          {!err && loading && <div className="article-loading">Carregando artigo...</div>}

          {!err && !isPdf && meta && (
            <>
              <h2 style={{ margin: "4px 0 8px" }}>{meta.name || "Carregando..."}</h2>
              <div
                style={{
                  padding: "12px",
                  background: "#fffbe6",
                  border: "1px solid #ffe58f",
                  borderRadius: 8,
                }}
              >
                Este arquivo não é PDF (<code>{meta.mimeType}</code>).
                <a href={meta.webViewLink} target="_blank" rel="noreferrer" style={{ marginLeft: 8 }}>
                  Abrir no Google Drive
                </a>
              </div>
            </>
          )}

          {!err && isPdf && !usePreview && (
            <>
              <h2 style={{ margin: "4px 0 8px" }}>{meta?.name || "Carregando..."}</h2>
              <div className="article-controls">
                <button onClick={prev} disabled={page <= 1}>
                  Anterior
                </button>
                <span>{page} / {pages}</span>
                <button onClick={next} disabled={page >= pages}>
                  Próxima
                </button>
                {meta?.webViewLink && (
                  <a href={meta.webViewLink} target="_blank" rel="noreferrer" style={{ marginLeft: "auto" }}>
                    Abrir no Google Drive
                  </a>
                )}
              </div>
              <canvas ref={canvasRef} className="article-canvas" />
            </>
          )}

          {!err && isPdf && usePreview && (
            <>
              <h2 style={{ margin: "4px 0 8px" }}>{meta?.name}</h2>
              <iframe
                title={meta?.name}
                src={drivePreviewURL(meta.id)}
                style={{ width: "100%", height: "80vh", border: 0, borderRadius: 8 }}
                allow="autoplay"
              />
            </>
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
