"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import logoRclaro from "../../../assets/logos/logoRclaro.png";
import { env } from "@/src/utils/env";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchFiles = useCallback(async (query) => {
    const apiKey = env.googleApiKey;
    const folders = [
      env.googleDriveFolderGeneral,
      env.googleDriveFolderCentro,
      env.googleDriveFolderLeste,
      env.googleDriveFolderNorte,
      env.googleDriveFolderOeste,
      env.googleDriveFolderSul,
      env.googleDriveSubfolderId,
    ].filter(Boolean);

    if (!apiKey || folders.length === 0) return [];

    try {
      const requests = folders.map(async (folder) => {
        const params = new URLSearchParams({
          q: `mimeType='application/pdf' and ('${folder}' in parents) and name contains '${query.replace(/'/g, "\\'")}'`,
          key: apiKey,
          fields: "files(id,name,mimeType,webViewLink)",
          orderBy: "name",
          pageSize: "10",
          supportsAllDrives: "true",
          includeItemsFromAllDrives: "true",
        });

        const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`);
        if (!response.ok) return { files: [] };
        return response.json();
      });

      const results = await Promise.all(requests);
      const seen = new Set();
      const merged = [];

      results.forEach((result) => {
        (result.files || []).forEach((file) => {
          if (seen.has(file.id)) return;
          seen.add(file.id);
          merged.push(file);
        });
      });

      merged.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
      return merged;
    } catch (error) {
      console.error("Erro na busca:", error);
      return [];
    }
  }, []);

  const handleSearch = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const results = await searchFiles(value);
    setSearchResults(results);
    setIsSearching(false);
  };

  const toggleMenu = () => {
    setMenuOpen((value) => !value);
    setSearchOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen((value) => !value);
    setMenuOpen(false);

    if (!searchOpen) {
      setSearchResults([]);
      setSearchTerm("");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <Link href="/">
          <Image src={logoRclaro} alt="Logo Raízes Negras" width={100} height={84} />
        </Link>
      </div>

      <div className="navbar__direita">
        <div id="menu-principal" className={`navbar__menu ${menuOpen ? "is-open" : ""}`} role="navigation">
          <ul>
            <li><Link href="/">Início</Link></li>
            <li><Link href="/sobre">Sobre</Link></li>
            <li><Link href="/conteudo">Conteúdo</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/privacidade">Privacidade</Link></li>
            <li><Link href="/termos">Termos de Uso</Link></li>
            <li><Link href="/contato">Contato</Link></li>
          </ul>
        </div>

        <div className={`navbar__search ${searchOpen ? "is-open" : ""}`}>
          <button
            className="fa-solid fa-magnifying-glass navbar__search-btn"
            aria-label={searchOpen ? "Fechar busca" : "Abrir busca"}
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
                    href={`/artigo/${result.id}`}
                    className="navbar__search-result-item"
                  >
                    <i className="fa-solid fa-file-pdf" />
                    {result.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          className="navbar__hamburger"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
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
