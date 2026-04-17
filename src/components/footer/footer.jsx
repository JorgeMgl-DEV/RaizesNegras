import Image from "next/image";
import Link from "next/link";

export default function Footer() {
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
          <div>Telefone/WhatsApp: (98) 98624-9925</div>
          <div className="footer__legal-links">
            <Link href="/privacidade">Privacidade</Link> |{" "}
            <Link href="/termos">Termos de Uso</Link> |{" "}
            <Link href="/contato">Contato</Link>
          </div>
        </div>
        <div className="footer__logos">
          <Image
            src="https://iema.ma.gov.br/wp-content/uploads/2024/03/SEQUENCIA-LOGOS-GOV-SEDUC-IEMA-UNESCO.png"
            alt="Governo do Maranhão"
            width={900}
            height={120}
          />
        </div>
      </div>
    </footer>
  );
}
