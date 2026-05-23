import Link from "next/link";
import { redirect } from "next/navigation";
import { hasAdminWhitelist, isAdminUser } from "@/src/lib/admin";
import {
  PERSON_TYPE_OPTIONS,
  getOptionLabel,
  getProfileFromMetadata,
  getUserDisplayName,
  getUserInitials,
} from "@/src/lib/profile";
import { hasSupabaseCredentials } from "@/src/lib/supabase/config";
import { createClient } from "@/src/lib/supabase/server";
import { logout } from "../login/actions";

export const metadata = {
  title: "Admin | Raizes Negras",
};

export default async function AdminPage() {
  if (!hasSupabaseCredentials()) {
    redirect("/login?error=config");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=session");
  }

  if (!isAdminUser(user)) {
    redirect("/perfil?error=admin");
  }

  const profile = getProfileFromMetadata(user.user_metadata);
  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);
  const personTypeLabel = getOptionLabel(PERSON_TYPE_OPTIONS, profile.personType, "Perfil em configuracao");
  const whitelistMode = hasAdminWhitelist();

  return (
    <main className="login-page profile-page admin-page">
      <section className="login-shell">
        <div className="login-panel">
          <div className="login-panel__intro profile-sidebar">
            <span className="login-panel__eyebrow">Admin</span>
            <h1>Painel administrativo</h1>
            <p>
              Esta area inicial serve como ponto de entrada para administracao restrita, validada no servidor antes
              de renderizar a pagina.
            </p>

            <div className="profile-summary">
              <div className="profile-summary__avatar" aria-hidden="true">
                {profile.avatarUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={profile.avatarUrl} alt={displayName} />
                  </>
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              <div className="profile-summary__meta">
                <strong>{displayName}</strong>
                <span>{user.email}</span>
              </div>
            </div>

            <div className="login-panel__notes">
              <p>Tipo de perfil: {personTypeLabel}.</p>
              <p>Modo de acesso atual: whitelist fixa por email em `ADMIN_EMAILS`.</p>
              {!whitelistMode && <p>Sem `ADMIN_EMAILS` definido, ninguem deve ser tratado como admin.</p>}
            </div>

            <div className="profile-admin-badge">Administrador autorizado</div>

            <div className="profile-sidebar__actions">
              <Link href="/perfil" className="login-panel__back">
                Voltar ao perfil
              </Link>
              <Link href="/" className="login-form__submit login-form__submit--secondary profile-link-button">
                Ir para o site
              </Link>
            </div>
          </div>

          <div className="login-card admin-card">
            <div className="profile-header">
              <div>
                <span className="login-session__label">Area restrita</span>
                <h2>Visao geral</h2>
                <p>Somente usuarios reconhecidos como admin conseguem abrir esta rota.</p>
              </div>

              <form action={logout}>
                <button className="login-session__logout" type="submit">
                  Sair
                </button>
              </form>
            </div>

            <div className="admin-grid">
              <article className="admin-panel">
                <span className="admin-panel__label">Controle</span>
                <strong>Rota protegida</strong>
                <p>O acesso a `/admin` esta travado no servidor e redireciona usuarios sem permissao.</p>
              </article>

              <article className="admin-panel">
                <span className="admin-panel__label">Modo de acesso</span>
                <strong>Whitelist por env</strong>
                <p>A regra usa somente os emails definidos em `ADMIN_EMAILS`.</p>
              </article>

              <article className="admin-panel">
                <span className="admin-panel__label">Conta atual</span>
                <strong>{user.email}</strong>
                <p>Perfil autenticado com permissao administrativa reconhecida nesta sessao.</p>
              </article>

              <article className="admin-panel">
                <span className="admin-panel__label">Proximo passo</span>
                <strong>Ferramentas do painel</strong>
                <p>Daqui voce pode evoluir para gestao de usuarios, moderacao e conteudos protegidos.</p>
              </article>
            </div>

            <div className="admin-checklist">
              <h3>Checklist recomendado</h3>
              <ul>
                <li>Trocar o fallback temporario por `ADMIN_EMAILS` com os tres emails reais.</li>
                <li>Criar as primeiras acoes administrativas que realmente precisem de restricao.</li>
                <li>Separar futuras permissoes por papel se o projeto ganhar mais operadores.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
