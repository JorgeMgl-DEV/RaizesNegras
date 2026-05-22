import Link from "next/link";
import ProfileFields from "@/src/components/auth/ProfileFields";
import { getUserDisplayName } from "@/src/lib/profile";
import { createClient } from "@/src/lib/supabase/server";
import { hasSupabaseCredentials } from "@/src/lib/supabase/config";
import { login, logout, signup } from "./actions";
import LoginSubmitButton from "./login-submit-button";

export const metadata = {
  title: "Login | Raizes Negras",
};

function getFeedbackMessage(error, mode) {
  if (error === "config") {
    return "Configure as variaveis do Supabase antes de usar o logon.";
  }

  if (error === "missing") {
    return mode === "signup"
      ? "Preencha email, senha e os campos obrigatorios do cadastro."
      : "Preencha email e senha para continuar.";
  }

  if (error === "session") {
    return "Faca login para acessar seu perfil.";
  }

  return error || "";
}

export default async function LoginPage({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {};
  const setupReady = hasSupabaseCredentials();
  const mode = resolvedSearchParams.mode === "signup" ? "signup" : "login";
  const error = getFeedbackMessage(
    typeof resolvedSearchParams.error === "string" ? resolvedSearchParams.error : "",
    mode,
  );
  const success = typeof resolvedSearchParams.success === "string" ? resolvedSearchParams.success : "";

  let user = null;

  if (setupReady) {
    const supabase = await createClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    user = currentUser;
  }

  const displayName = user ? getUserDisplayName(user) : "";

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-panel">
          <div className="login-panel__intro">
            <span className="login-panel__eyebrow">Conta Raizes Negras</span>
            <h1>Acesso e cadastro</h1>
            <p>
              Crie uma conta com email e senha, descreva seu vinculo com o projeto e mantenha a sessao SSR do
              Supabase ativa no navegador.
            </p>
            <div className="login-panel__notes">
              <p>O cadastro salva os dados principais diretamente em `user_metadata` do Supabase Auth.</p>
              <p>Aluno e professor informam instituicao. Quilombola informa regiao e comunidade de origem.</p>
              <p>A foto de perfil e opcional e funciona por URL publica nesta primeira versao.</p>
            </div>
            <Link href="/" className="login-panel__back">
              Voltar para o site
            </Link>
          </div>

          <div className="login-card">
            {!setupReady && (
              <div className="login-alert login-alert--warning">
                <strong>Configuracao pendente.</strong>
                <p>Defina `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` no `.env.local`.</p>
              </div>
            )}

            <div className="login-switcher" aria-label="Alternar entre login e cadastro">
              <Link
                href="/login?mode=login"
                className={`login-switcher__link ${mode === "login" ? "is-active" : ""}`}
              >
                Entrar
              </Link>
              <Link
                href="/login?mode=signup"
                className={`login-switcher__link ${mode === "signup" ? "is-active" : ""}`}
              >
                Cadastrar
              </Link>
            </div>

            {error && (
              <div className="login-alert login-alert--error">
                <strong>Falha no acesso.</strong>
                <p>{error}</p>
              </div>
            )}

            {success === "created" && !user && (
              <div className="login-alert login-alert--success">
                <strong>Conta criada.</strong>
                <p>Agora entre com seu email e senha para continuar.</p>
              </div>
            )}

            {success && user && (
              <div className="login-alert login-alert--success">
                <strong>Login realizado.</strong>
                <p>Sessao ativa para {user.email}.</p>
              </div>
            )}

            {user ? (
              <div className="login-session">
                <span className="login-session__label">Sessao atual</span>
                <h2>{displayName}</h2>
                <p>Usuario autenticado com cookies SSR do Supabase ativos neste navegador.</p>
                <div className="login-session__actions">
                  <Link href="/perfil" className="login-form__submit login-form__submit--secondary login-session__link">
                    Abrir perfil
                  </Link>
                  <Link href="/" className="login-form__submit login-form__submit--secondary login-session__link">
                    Ir para o site
                  </Link>
                  <form action={logout}>
                    <button className="login-session__logout" type="submit">
                      Sair
                    </button>
                  </form>
                </div>
              </div>
            ) : mode === "signup" ? (
              <form action={signup} className="login-form">
                <div className="login-form__grid">
                  <div className="login-form__field">
                    <label htmlFor="signup-email">Email</label>
                    <input
                      id="signup-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="voce@exemplo.com"
                      required
                    />
                  </div>

                  <div className="login-form__field">
                    <label htmlFor="signup-password">Senha</label>
                    <input
                      id="signup-password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Crie uma senha"
                      minLength="6"
                      required
                    />
                  </div>
                </div>

                <ProfileFields initialProfile={{}} idPrefix="signup" />

                <div className="login-form__helper">
                  <span>Esse cadastro ja cria a conta e abre o caminho para o perfil completo.</span>
                  <span>Os dados ajudam a diferenciar alunos, docentes, pesquisadores e comunidades.</span>
                </div>

                <div className="login-form__actions">
                  <LoginSubmitButton
                    label="Criar conta"
                    pendingLabel="Criando conta..."
                    formAction={signup}
                    className="login-form__submit"
                  />
                </div>
              </form>
            ) : (
              <form action={login} className="login-form">
                <div className="login-form__field">
                  <label htmlFor="login-email">Email</label>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="voce@exemplo.com"
                    required
                  />
                </div>

                <div className="login-form__field">
                  <label htmlFor="login-password">Senha</label>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Digite sua senha"
                    minLength="6"
                    required
                  />
                </div>

                <div className="login-form__helper">
                  <span>Use este acesso para entrar e depois completar ou revisar seu perfil.</span>
                  <span>Se ainda nao tem conta, troque para a aba de cadastro acima.</span>
                </div>

                <div className="login-form__actions">
                  <LoginSubmitButton label="Entrar" pendingLabel="Entrando..." formAction={login} />
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
