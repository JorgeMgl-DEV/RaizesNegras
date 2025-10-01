import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/top-section/Navbar/Navbar.jsx";
import Footer from "../../components/footer/footer";
import {
  API_KEY,
  driveFileBinaryURL,
  getFileMetaURL,
  listInFolderURL,
  drivePreviewURL,
} from "../../utils/drive";
import "./article.css";

// pdf.js via NPM (Vite)
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?worker";
GlobalWorkerOptions.workerPort = new pdfWorker();

export default function Article() {
  const { id } = useParams();
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [usePreview, setUsePreview] = useState(false); // Fallback anti-CORS
  const [recs, setRecs] = useState([]);
  const canvasRef = useRef(null);

  // 1) Buscar metadados
  useEffect(() => {
    const run = async () => {
      try {
        if (!API_KEY) throw new Error("API key ausente");
        const res = await fetch(getFileMetaURL(id));
        if (!res.ok) throw new Error("Arquivo não encontrado ou privado");
        const m = await res.json();
        setMeta(m);
      } catch (e) {
        setErr(e.message || "Falha ao carregar metadados");
      }
    };
    run();
  }, [id]);

  // 2) Renderizar PDF com pdf.js; se der CORS/erro, cair para preview do Drive
  useEffect(() => {
    if (!meta || meta.mimeType !== "application/pdf" || usePreview) return;

    const url = driveFileBinaryURL(meta.id);
    const render = async () => {
      try {
        const loadingTask = getDocument({ url });
        const pdf = await loadingTask.promise;
        setPages(pdf.numPages);
        const pageObj = await pdf.getPage(page);
        const viewport = pageObj.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await pageObj.render({ canvasContext: ctx, viewport }).promise;
      } catch (e) {
        console.error(e);
        // Não trava o usuário: ativa fallback do preview oficial do Drive
        setUsePreview(true);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    render();
  }, [meta, page, usePreview]);

  // 3) Recomendações (mesma pasta)
  useEffect(() => {
    const loadRecs = async () => {
      try {
        if (!meta) return;
        let folderId =
          (meta.parents && meta.parents[0]) ||
          import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_GENERAL;
        if (!folderId) return;
        const res = await fetch(listInFolderURL(folderId, { pageSize: 25 }));
        if (!res.ok) return;
        const data = await res.json();
        const items = (data.files || [])
          .filter((f) => f.id !== meta.id)
          .slice(0, 6);
        setRecs(items);
      } catch (e) {
        console.warn("recs", e);
      }
    };
    loadRecs();
  }, [meta]);

  const isPdf = meta?.mimeType === "application/pdf";
  const next = () => setPage((p) => Math.min(pages, p + 1));
  const prev = () => setPage((p) => Math.max(1, p - 1));

  return (
    <>
      <Navbar />
      <main className="article-layout">
        <section className="article-viewer">
          {err && <div className="error">{err}</div>}

          {/* Arquivo não-PDF: apenas aviso + link para abrir no Drive */}
          {!err && !isPdf && meta && (
            <>
              <h2 style={{ margin: "4px 0 8px" }}>{meta?.name || "Carregando..."}</h2>
              <div
                style={{
                  padding: "12px",
                  background: "#fffbe6",
                  border: "1px solid #ffe58f",
                  borderRadius: 8,
                }}
              >
                Este arquivo não é PDF (<code>{meta?.mimeType}</code>).
                <a
                  href={meta?.webViewLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{ marginLeft: 8 }}
                >
                  Abrir no Google Drive
                </a>
              </div>
            </>
          )}

          {/* PDF com pdf.js (ok) */}
          {!err && isPdf && !usePreview && (
            <>
              <h2 style={{ margin: "4px 0 8px" }}>{meta?.name || "Carregando..."}</h2>
              <div className="article-controls">
                <button onClick={prev} disabled={page <= 1}>
                  Anterior
                </button>
                <span>
                  {page} / {pages}
                </span>
                <button onClick={next} disabled={page >= pages}>
                  Próxima
                </button>
                {meta?.webViewLink && (
                  <a
                    href={meta.webViewLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginLeft: "auto" }}
                  >
                    Abrir no Google Drive
                  </a>
                )}
              </div>
              <canvas ref={canvasRef} className="article-canvas"></canvas>
            </>
          )}

          {/* Fallback: preview oficial do Drive (anti-CORS) */}
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
          {recs.map((r) => (
            <Link className="reco-item" key={r.id} to={`/artigo/${r.id}`}>
              <div className="reco-name">{r.name}</div>
              <div className="reco-meta">
                {new Date(r.modifiedTime || Date.now()).toLocaleDateString("pt-BR")}
              </div>
            </Link>
          ))}
        </aside>
      </main>
      <Footer />
    </>
  );
}
