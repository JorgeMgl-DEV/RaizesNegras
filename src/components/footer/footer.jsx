import Image from "next/image";
import Link from "next/link";
import { siteContact, siteContactLinks, siteTeam } from "@/src/data/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__brand">
          <span className="footer__eyebrow">Raízes Negras</span>
          <p>
            Acervo digital afro-maranhense com navegação por territórios, leitura pública e curadoria voltada à memória negra no Maranhão.
          </p>
        </div>
        <div className="institutional">
          <strong>Equipe</strong>
          <p>Realização: {siteTeam.slice(0, 2).map(({ name }) => name).join(" e ")}.</p>
          <p>Orientação: {siteTeam[2].name}.</p>
          <span className="footer__copyright">© {currentYear} Raízes Negras. Todos os direitos reservados.</span>
        </div>
        <div className="footer__contact">
          <strong>Contato</strong>
          <a href={siteContactLinks.email}>{siteContact.email}</a>
          <a href={siteContactLinks.whatsapp} target="_blank" rel="noreferrer">
            {siteContact.whatsappLabel}
          </a>
          <div className="footer__legal-links">
            <Link href="/privacidade">Privacidade</Link>
            <Link href="/termos">Termos de Uso</Link>
            <Link href="/contato">Contato</Link>
          </div>
        </div>
        <div className="footer__logos" aria-label="Instituições apoiadoras">
          <div className="footer__logos-grid">
            <Image
              src="https://iema.ma.gov.br/wp-content/uploads/2024/03/SEQUENCIA-LOGOS-GOV-SEDUC-IEMA-UNESCO.png"
              alt="Governo do Maranhão"
              width={900}
              height={120}
              sizes="(max-width: 720px) calc(100vw - 3rem), (max-width: 1040px) min(82vw, 640px), 560px"
              className="footer__logo-strip"
            />
            <Image
              src="/logo-fapema.png"
              alt="FAPEMA"
              width={1628}
              height={602}
              sizes="(max-width: 720px) 220px, 260px"
              className="footer__logo-fapema"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
