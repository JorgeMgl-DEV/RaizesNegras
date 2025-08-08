import React from 'react';
import Navbar from './Navbar/Navbar';
import MapaMA from './Mapa/Mapa-MA';
import './TopSection.css';

const TopSection = () => {
    return (
        <div className="top-section">
            <Navbar />
            <MapaMA />
            <div className="scroll-arrow">
                ↓
            </div>
        </div>
    );
};

export default TopSection;
