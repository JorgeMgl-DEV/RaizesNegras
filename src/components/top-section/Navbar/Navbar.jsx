import { useState } from 'react';
import './Navbar.css';
import logoRclaro from '../../../assets/logos/logoRclaro.png';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen((v) => !v);
        setSearchOpen(false);
    };

    const toggleSearch = () => {
        setSearchOpen((v) => !v);
        setMenuOpen(false);
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
                    <input
                        type="text"
                        placeholder="Buscar..."
                        aria-label="Campo de busca"
                    />
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
