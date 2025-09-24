import React from "react";
import "./footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__content">
                <span>&copy; 2025 Raízes Negras. Todos os direitos reservados.</span>
                <div className="institutional">
                    <span>
                        Realização: Jorge Miguel Viana Torres | Murilo Gabriel Mourão
                        <br />
                        Orientação: Erick MacGregor
                    </span>
                </div>
                <div className="footer__contact">
                    <strong>Contato</strong>
                    <div>E-mail: acervo.raizesnegras@gmail.com</div>
                    <div>Instagram: @raizesnegras</div>
                    <div>Telefone/WhatsApp: (98) 98624-9925</div>
                </div>
                <div className="footer__logos">
                    <img src="https://iema.ma.gov.br/wp-content/uploads/2024/03/SEQUENCIA-LOGOS-GOV-SEDUC-IEMA-UNESCO.png" alt="Governo do Maranhão" />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
