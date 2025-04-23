import React, { useState } from 'react';
import './navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar__logo">
                <img src="path/to/logo.png" alt="Logo" />
            </div>
            <div className={`navbar__menu ${isOpen ? 'open' : ''}`}>
                <ul>
                    <li><a href="#section1">Section 1</a></li>
                    <li><a href="#section2">Section 2</a></li>
                    <li><a href="#section3">Section 3</a></li>
                </ul>
            </div>
            <div className="navbar__direita">
                <div className="navbar__search">
                    <input type="text" placeholder="Search..." />
                    <i className="fa fa-search"></i>
                </div>
                <button className="navbar__toggle" onClick={toggleMenu}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;