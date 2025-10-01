import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/top-section/Navbar/Navbar.jsx";
import Footer from "../../components/footer/footer";
import "./conteudo.css";

function Conteudo() {
    const [query, setQuery] = useState("");
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [nextPageToken, setNextPageToken] = useState("");
    const [prevTokens, setPrevTokens] = useState([]);
    const [region, setRegion] = useState("all");
    const [sort, setSort] = useState("recent");
    const debounceRef = useRef(null);

    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    const folderGeneral = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_GENERAL;
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
            import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_GENERAL,
            import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_CENTRO,
            import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_LESTE,
            import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_NORTE,
            import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_OESTE,
            import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_SUL,
            import.meta.env.VITE_GOOGLE_DRIVE_SUBFOLDER_ID,
        ],
        centro: [import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_CENTRO],
        leste: [import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_LESTE],
        norte: [import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_NORTE],
        oeste: [import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_OESTE],
        sul: [import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_SUL],
        geral: [import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_GENERAL],
    };
    const isConfigured = Boolean(apiKey && (folderGeneral || foldersByRegion.all.some(Boolean)));

    const buildQuery = (q, regionKey) => {
        const contains = q ? ` and name contains '${q.replace(/'/g, "\\'")}'` : "";
        const folders = (foldersByRegion[regionKey] || []).filter(Boolean);
        const parents = folders.length > 0 ? `(${folders.map((id) => `('${id}' in parents)`).join(' or ')})` : "";
        return `mimeType='application/pdf'${parents ? ` and ${parents}` : ''}${contains}`;
    };

    const fetchFiles = async ({ q = query, pageToken = "", regionKey = region, sortKey = sort } = {}) => {
        if (!isConfigured) return;
        setLoading(true);
        setError("");
        try {
            // When querying across multiple folders, Drive API may 403 if any parent is unauthorized.
            // To avoid that, if regionKey == 'all', we query folders individually and merge results.
            if (regionKey === 'all') {
                const folders = (foldersByRegion.all || []).filter(Boolean);
                const requests = folders.map(async (folder) => {
                    const qParents = `('${folder}' in parents)`;
                    const params = new URLSearchParams({
                        q: `mimeType='application/pdf' and ${qParents}${q ? ` and name contains '${q.replace(/'/g, "\\'")}'` : ''}`,
                        key: apiKey,
                        fields: "nextPageToken, files(id,name,mimeType,modifiedTime,webViewLink,thumbnailLink)",
                        orderBy: sortKey === 'recent' ? "modifiedTime desc" : (sortKey === 'oldest' ? "modifiedTime" : "name"),
                        pageSize: "12",
                        supportsAllDrives: "true",
                        includeItemsFromAllDrives: "true",
                    });
                    const url = `https://www.googleapis.com/drive/v3/files?${params.toString()}`;
                    const res = await fetch(url);
                    if (!res.ok) return { files: [] };
                    return res.json();
                });
                const results = await Promise.all(requests);
                const merged = [];
                const seen = new Set();
                results.forEach((r) => {
                    (r.files || []).forEach((f) => {
                        if (!seen.has(f.id)) {
                            seen.add(f.id);
                            merged.push(f);
                        }
                    });
                });
                if (sortKey === 'recent') {
                    merged.sort((a, b) => new Date(b.modifiedTime || 0) - new Date(a.modifiedTime || 0));
                } else if (sortKey === 'oldest') {
                    merged.sort((a, b) => new Date(a.modifiedTime || 0) - new Date(b.modifiedTime || 0));
                } else {
                    merged.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
                }
                setFiles(merged);
                setNextPageToken("");
            } else {
                const params = new URLSearchParams({
                    q: buildQuery(q, regionKey),
                    key: apiKey,
                    fields: "nextPageToken, files(id,name,webViewLink,modifiedTime)",
                    orderBy: sortKey === 'recent' ? "modifiedTime desc" : (sortKey === 'oldest' ? "modifiedTime" : "name"),
                    pageSize: "12",
                    supportsAllDrives: "true",
                    includeItemsFromAllDrives: "true",
                });
                if (pageToken) params.set("pageToken", pageToken);
                const url = `https://www.googleapis.com/drive/v3/files?${params.toString()}`;
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setFiles(data.files || []);
                setNextPageToken(data.nextPageToken || "");
            }
        } catch (e) {
            setError("Falha ao carregar conteúdos. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles({ q: "", regionKey: region, sortKey: sort });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConfigured, region, sort]);

    const onChangeQuery = (e) => {
        const value = e.target.value;
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setPrevTokens([]);
            fetchFiles({ q: value, pageToken: "", regionKey: region, sortKey: sort });
        }, 400);
    };

    const onNext = () => {
        if (!nextPageToken) return;
        setPrevTokens((t) => [...t, nextPageToken]);
        fetchFiles({ q: query, pageToken: nextPageToken, regionKey: region, sortKey: sort });
    };

    const onPrev = () => {
        if (prevTokens.length === 0) return;
        const newTokens = [...prevTokens];
        const prev = newTokens.pop();
        setPrevTokens(newTokens);
        fetchFiles({ q: query, pageToken: prev, regionKey: region, sortKey: sort });
    };

    const formatDate = (iso) => {
        if (!iso) return "";
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return "";
        return d.toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: '2-digit' });
    };

    return (
        <>
            <Navbar />
            <main className="conteudo__main">
                <h1 className="conteudo__title">Conteúdo</h1>
                {!isConfigured && (
                    <p className="conteudo__text">Configuração do Google Drive ausente.</p>
                )}

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
                            <label className="conteudo__label" htmlFor="conteudo-region">Região</label>
                            <select id="conteudo-region" className="conteudo__select" value={region} onChange={(e) => { setPrevTokens([]); setRegion(e.target.value); }} aria-label="Filtrar por região">
                                <option value="all">Todas as regiões</option>
                                <option value="geral">Geral/Sem região</option>
                                <option value="centro">Centro</option>
                                <option value="leste">Leste</option>
                                <option value="norte">Norte</option>
                                <option value="oeste">Oeste</option>
                                <option value="sul">Sul</option>
                            </select>

                            <label className="conteudo__label" htmlFor="conteudo-ordem">Ordenar</label>
                            <select id="conteudo-ordem" className="conteudo__select" value={sort} onChange={(e) => { setPrevTokens([]); setSort(e.target.value); }} aria-label="Ordenar resultados">
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
                            {files.map((f) => (
                                <a key={f.id} href={`/artigo/${f.id}` }>
                                    <i className="fa fa-file-pdf-o" />
                                    <span className="conteudo__name">{f.name}</span>
                                    <span className="conteudo__meta">Atualizado: {formatDate(f.modifiedTime)}</span>
                                </a>
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

export default Conteudo;


