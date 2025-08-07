import './Navbar.css';
import logoRclaro from '../../../assets/logoRclaro.png';

function Navbar(){
    return(
        <>
        <nav className="navbar">
        <div className="navbar__logo">
            <a href="#"><img src={logoRclaro} alt="Logo Raízes Negras" /></a>
        </div>
        <div className="navbar__direita">
            <div className="navbar__menu">
                <ul>
                    <li><a href="#">Início</a></li>
                    <li><a href="#">Sobre</a></li>
                    <li><a href="#">Conteúdo</a></li>
                    <li><a href="#">FAQ & Contato</a></li>
                </ul>
            </div>
            <div className="navbar__search">
                <input type="text" placeholder="Buscar..."></input>
                <button className="fa fa-search" aria-label="Buscar"></button>
            </div>
        </div>
    </nav>
        </>
    )
}

export default Navbar