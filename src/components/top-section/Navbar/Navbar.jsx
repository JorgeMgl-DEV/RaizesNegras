import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logoRclaro from '../../../assets/logos/logoRclaro.png';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const searchFiles = useCallback(async (query) => {
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
        const folders = [
            import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_GENERAL,
            import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_CENTRO,
            import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_LESTE,
            import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_NORTE,
            import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_OESTE,
            import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_SUL,
            import.meta.env.VITE_GOOGLE_DRIVE_SUBFOLDER_ID,
        ].filter(Boolean);

        if (!apiKey || folders.length === 0) return [];

        try {
            const requests = folders.map(async (folder) => {
                const params = new URLSearchParams({
                    q: `mimeType='application/pdf' and ('${folder}' in parents) and name contains '${query.replace(/'/g, "\\'")}'`,
                    key: apiKey,
                    fields: 'files(id,name,mimeType,webViewLink)',
                    orderBy: 'name',
                    pageSize: '10',
                    supportsAllDrives: 'true',
                    includeItemsFromAllDrives: 'true',
                });
                const url = `https://www.googleapis.com/drive/v3/files?${params.toString()}`;
                const response = await fetch(url);
                if (!response.ok) return { files: [] };
                return response.json();
            });

            const results = await Promise.all(requests);
            const seen = new Set();
            const merged = [];
            results.forEach((r) => {
                (r.files || []).forEach((f) => {
                    if (!seen.has(f.id)) {
                        seen.add(f.id);
                        merged.push(f);
                    }
                });
            });
            merged.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
            return merged;
        } catch (error) {
            console.error('Erro na busca:', error);
            return [];
        }
    }, []);

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length >= 3) {
            setIsSearching(true);
            const results = await searchFiles(value);
            setSearchResults(results);
            setIsSearching(false);
        } else {
            setSearchResults([]);
        }
    };

    const toggleMenu = () => {
        setMenuOpen((v) => !v);
        setSearchOpen(false);
    };

    const toggleSearch = () => {
        setSearchOpen((v) => !v);
        setMenuOpen(false);
        if (!searchOpen) {
            setSearchResults([]);
            setSearchTerm('');
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar__logo">
                <Link to="/">
                    <img src={logoRclaro} alt="Logo Raízes Negras" />
                </Link>
            </div>

            <div className="navbar__direita">
                {/* MENU fixo no desktop */}
                <div
                    id="menu-principal"
                    className={`navbar__menu ${menuOpen ? 'is-open' : ''}`}
                    role="navigation"
                >
                    <ul>
                        <li><Link to="/">Início</Link></li>
                        <li><Link to="/sobre">Sobre</Link></li>
                        <li><Link to="/conteudo">Conteúdo</Link></li>
                        <li><Link to="/faq">FAQ</Link></li>
                        <li><Link to="/privacidade">Privacidade</Link></li>
                        <li><Link to="/termos">Termos de Uso</Link></li>
                        <li><Link to="/contato">Contato</Link></li>
                    </ul>
                </div>

                {/* BUSCA (desktop: direita) */}
                <div className={`navbar__search ${searchOpen ? 'is-open' : ''}`}>
                    <button
                        className="fa fa-search navbar__search-btn"
                        aria-label={searchOpen ? 'Fechar busca' : 'Abrir busca'}
                        onClick={toggleSearch}
                        type="button"
                    />
                    <div className="navbar__search-container">
                        <input
                            type="text"
                            placeholder="Buscar artigos..."
                            aria-label="Campo de busca"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        {isSearching && <div className="navbar__search-loading">Buscando...</div>}
                        {searchResults.length > 0 && (
                            <div className="navbar__search-results">
                                {searchResults.map((result) => (
                                    <Link
                                        key={result.id}
                                        to={`/artigo/${result.id}`}
                                        className="navbar__search-result-item"
                                    >
                                        <i className="fa fa-file-pdf-o" />
                                        {result.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* HAMBÚRGUER (mobile) */}
                <button
                    className="navbar__hamburger"
                    aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                    aria-controls="menu-principal"
                    aria-expanded={menuOpen}
                    onClick={toggleMenu}
                    type="button"
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
