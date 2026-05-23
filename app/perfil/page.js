import Link from "next/link";
import { redirect } from "next/navigation";
import ProfileFields from "@/src/components/auth/ProfileFields";
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
import LoginSubmitButton from "../login/login-submit-button";
import { updateProfile } from "./actions";

export const metadata = {
  title: "Perfil | Raizes Negras",
};

function getProfileMessage(error) {
  if (error === "config") {
    return "Configure as variaveis do Supabase antes de usar os perfis.";
  }

  if (error === "session") {
    return "Faca login para acessar seu perfil.";
  }

  if (error === "admin") {
    return "Seu usuario nao tem permissao para acessar o painel administrativo.";
  }

  return error || "";
}

export default async function ProfilePage({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {};
  const error = getProfileMessage(
    typeof resolvedSearchParams.error === "string" ? resolvedSearchParams.error : "",
  );
  const saved = resolvedSearchParams.saved === "1";
  const created = resolvedSearchParams.created === "1";
  const loggedIn = resolvedSearchParams.login === "1";

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

  const profile = getProfileFromMetadata(user.user_metadata);
  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);
  const personTypeLabel = getOptionLabel(PERSON_TYPE_OPTIONS, profile.personType, "Perfil em configuracao");
  const adminUser = isAdminUser(user);
  const adminWhitelistReady = hasAdminWhitelist();

  return (
    <main className="login-page profile-page">
      <section className="login-shell">
        <div className="login-panel">
          <div className="login-panel__intro profile-sidebar">
            <span className="login-panel__eyebrow">Perfil</span>
            <h1>{displayName}</h1>
            <p>
              Centralize aqui os dados do seu cadastro para contextualizar visitas, pesquisa, ensino e vinculos
              territoriais.
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
                <strong>{user.email}</strong>
                <span>{personTypeLabel}</span>
              </div>
            </div>

            <div className="login-panel__notes">
              <p>Os dados abaixo sao salvos no Supabase Auth como metadados do usuario.</p>
              <p>A foto de perfil continua opcional, mas agora pode ser enviada como arquivo para o Storage.</p>
              {!adminWhitelistReady && (
                <p>Defina `ADMIN_EMAILS` na env para liberar acesso administrativo aos usuarios corretos.</p>
              )}
            </div>

            {adminUser && <div className="profile-admin-badge">Administrador autorizado</div>}

            <div className="profile-sidebar__actions">
              {adminUser && (
                <Link href="/admin" className="login-panel__back">
                  Abrir painel admin
                </Link>
              )}
              <Link href="/" className="login-form__submit login-form__submit--secondary profile-link-button">
                Voltar para o site
              </Link>
            </div>
          </div>

          <div className="login-card">
            {error && (
              <div className="login-alert login-alert--error">
                <strong>Falha no perfil.</strong>
                <p>{error}</p>
              </div>
            )}

            {created && (
              <div className="login-alert login-alert--success">
                <strong>Conta criada.</strong>
                <p>Seu cadastro foi iniciado e o perfil ja pode ser ajustado aqui.</p>
              </div>
            )}

            {loggedIn && (
              <div className="login-alert login-alert--success">
                <strong>Login realizado.</strong>
                <p>Sessao ativa para {user.email}.</p>
              </div>
            )}

            {saved && (
              <div className="login-alert login-alert--success">
                <strong>Perfil salvo.</strong>
                <p>Os dados do seu cadastro foram atualizados com sucesso.</p>
              </div>
            )}

            <div className="profile-header">
              <div>
                <span className="login-session__label">Conta autenticada</span>
                <h2>Dados de perfil</h2>
                <p>Seu email continua sendo o identificador principal de acesso.</p>
              </div>

              <form action={logout}>
                <button className="login-session__logout" type="submit">
                  Sair
                </button>
              </form>
            </div>

            <div className="login-form__grid profile-readonly">
              <div className="login-form__field login-form__field--wide">
                <label htmlFor="profile-email">Email de acesso</label>
                <input id="profile-email" type="email" value={user.email || ""} readOnly disabled />
              </div>
            </div>

            <form action={updateProfile} className="login-form">
              <ProfileFields initialProfile={profile} idPrefix="profile" allowAvatarUpload userId={user.id} />

              <div className="login-form__actions profile-actions">
                <LoginSubmitButton label="Salvar perfil" pendingLabel="Salvando..." formAction={updateProfile} />
                <Link href="/" className="login-form__submit login-form__submit--secondary profile-link-button">
                  Continuar navegando
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
