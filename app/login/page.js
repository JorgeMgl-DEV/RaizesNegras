import Link from "next/link";
import { createClient } from "@/src/lib/supabase/server";
import { hasSupabaseCredentials } from "@/src/lib/supabase/config";
import { login, logout } from "./actions";
import LoginSubmitButton from "./login-submit-button";

export const metadata = {
  title: "Login | Raizes Negras",
};

function getFeedbackMessage(error) {
  if (error === "config") {
    return "Configure as variaveis do Supabase antes de usar o logon.";
  }

  if (error === "missing") {
    return "Preencha email e senha para entrar.";
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
            <h1>Acesso administrativo</h1>
            <p>
              Esta etapa deixa o projeto pronto para autenticar usuarios do painel via Supabase. Por enquanto,
              o fluxo esta limitado ao logon com email e senha.
            </p>
            <div className="login-panel__notes">
              <p>Cadastre os usuarios no painel do Supabase em Authentication &gt; Users.</p>
              <p>Quando o login estiver validado, o proximo passo natural e proteger rotas de administracao.</p>
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
                  <input id="email" name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" />
                </div>

                <div className="login-form__field">
                  <label htmlFor="password">Senha</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Digite sua senha"
                  />
                </div>

                <div className="login-form__helper">
                  <span>Sem cadastro publico nesta etapa.</span>
                  <span>A criacao de usuarios fica centralizada no Supabase.</span>
                </div>

                <LoginSubmitButton />
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
