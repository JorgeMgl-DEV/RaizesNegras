import { useState, useEffect, useCallback } from 'react';
import './Navbar.css';
import logoRclaro from '../../../assets/logos/logoRclaro.png';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const searchFiles = useCallback(async (query) => {
        const folderId = import.meta.env.VITE_GOOGLE_DRIVE_SUBFOLDER_ID;
        const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
        
        try {
            const response = await fetch(
                `https://www.googleapis.com/drive/v3/files?q=name contains '${query}' and '${folderId}' in parents and mimeType='application/pdf'&key=${apiKey}&fields=files(id,name,webViewLink)&orderBy=name&pageSize=10`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.files || [];
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
                <a href="#">
                    <img src={logoRclaro} alt="Logo Raízes Negras" />
                </a>
            </div>

            <div className="navbar__direita">
                {/* MENU fixo no desktop */}
                <div
                    id="menu-principal"
                    className={`navbar__menu ${menuOpen ? 'is-open' : ''}`}
                    role="navigation"
                >
                    <ul>
                        <li><a href="#">Início</a></li>
                        <li><a href="#">Sobre</a></li>
                        <li><a href="#">Conteúdo</a></li>
                        <li><a href="#">FAQ & Contato</a></li>
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
                                    <a
                                        key={result.id}
                                        href={result.webViewLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="navbar__search-result-item"
                                    >
                                        <i className="fa fa-file-pdf-o" />
                                        {result.name}
                                    </a>
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
