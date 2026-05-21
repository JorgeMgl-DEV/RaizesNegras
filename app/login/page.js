import Link from "next/link";
import { createClient } from "@/src/lib/supabase/server";
import { hasSupabaseCredentials } from "@/src/lib/supabase/config";
import { login, logout, signup } from "./actions";
import LoginSubmitButton from "./login-submit-button";

export const metadata = {
  title: "Login | Raizes Negras",
};

function getFeedbackMessage(error) {
  if (error === "config") {
    return "Configure as variaveis do Supabase antes de usar o logon.";
  }

  if (error === "missing") {
    return "Preencha email e senha para continuar.";
  }

  if (error === "confirm") {
    return "Nao foi possivel confirmar o email informado.";
  }

  return error || "";
}

export default async function LoginPage({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {};
  const setupReady = hasSupabaseCredentials();
  const error = getFeedbackMessage(
    typeof resolvedSearchParams.error === "string" ? resolvedSearchParams.error : "",
  );
  const success = resolvedSearchParams.success === "1";
  const checkEmail = resolvedSearchParams["check-email"] === "1";
  const confirmed = resolvedSearchParams.confirmed === "1";

  let user = null;

  if (setupReady) {
    const supabase = await createClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    user = currentUser;
  }

  return (
    <main className="login-page">
      <section className="login-shell">
        <div className="login-panel">
          <div className="login-panel__intro">
            <span className="login-panel__eyebrow">Supabase Auth</span>
            <h1>Acesso e cadastro</h1>
            <p>
              O site agora aceita criacao de conta e login por email e senha, mantendo sessao SSR com Supabase.
            </p>
            <div className="login-panel__notes">
              <p>O cadastro cria a conta direto no Supabase Authentication.</p>
              <p>Para confirmar cadastro por email, ajuste o template &quot;Confirm signup&quot; para usar `/auth/confirm`.</p>
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

            {error && (
              <div className="login-alert login-alert--error">
                <strong>Falha no acesso.</strong>
                <p>{error}</p>
              </div>
            )}

            {checkEmail && (
              <div className="login-alert login-alert--success">
                <strong>Cadastro iniciado.</strong>
                <p>Verifique seu email para confirmar a conta antes de entrar.</p>
              </div>
            )}

            {confirmed && (
              <div className="login-alert login-alert--success">
                <strong>Email confirmado.</strong>
                <p>Sua conta foi ativada. Agora voce ja pode entrar.</p>
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
                <h2>{user.email}</h2>
                <p>Usuario autenticado com cookies SSR do Supabase ativos neste navegador.</p>
                <form action={logout}>
                  <button className="login-session__logout" type="submit">
                    Sair
                  </button>
                </form>
              </div>
            ) : (
              <form action={login} className="login-form">
                <div className="login-form__field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="voce@exemplo.com"
                    required
                  />
                </div>

                <div className="login-form__field">
                  <label htmlFor="password">Senha</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Digite sua senha"
                    minLength="6"
                    required
                  />
                </div>

                <div className="login-form__helper">
                  <span>Use o mesmo formulario para entrar ou criar sua conta.</span>
                  <span>No primeiro cadastro por email, o Supabase pode pedir confirmacao por email.</span>
                </div>

                <div className="login-form__actions">
                  <LoginSubmitButton label="Entrar" pendingLabel="Entrando..." formAction={login} />
                  <LoginSubmitButton
                    label="Criar conta"
                    pendingLabel="Criando conta..."
                    formAction={signup}
                    className="login-form__submit login-form__submit--secondary"
                  />
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
