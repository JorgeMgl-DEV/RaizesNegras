# Raízes Negras

Portal sobre memória e cultura afro-maranhense, migrado para **Next.js** e integrado à **Google Drive API** para listar e visualizar PDFs por região.

## Estrutura

```text
RaizesNegras/
|-- app/                  # Rotas do Next.js App Router
|-- public/               # Arquivos estáticos
|-- src/
|   |-- assets/           # Imagens e logos
|   |-- components/       # Componentes reutilizáveis
|   |-- data/             # Metadados e descrições das regiões
|   |-- utils/            # Helpers de ambiente e Google Drive
|   |-- views/            # Implementação visual das páginas
|-- .env.example          # Exemplo de variáveis públicas
|-- next.config.mjs       # Configuração do Next.js
|-- package.json
```

## Stack

- Next.js 15
- React 19
- CSS puro
- Google Drive API
- Vercel
- Sentry (monitoramento de erros)
- Resend (notificacoes transacionais)

## Desenvolvimento

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar ambiente

Crie um `.env` na raiz usando o `.env.example` como base:

```env
NEXT_PUBLIC_GOOGLE_API_KEY= SUA_CHAVE_API_AQUI
NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_GENERAL= ID_PASTA_GERAL
NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_CENTRO= ID_PASTA_CENTRO
NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_LESTE= ID_PASTA_LESTE
NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_NORTE= ID_PASTA_NORTE
NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_OESTE= ID_PASTA_OESTE
NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_SUL= ID_PASTA_SUL
NEXT_PUBLIC_GOOGLE_DRIVE_SUBFOLDER_ID= ID_SUBPASTA_OPCIONAL
```

Para ativar monitoramento e notificacoes, configure tambem:

```env
NEXT_PUBLIC_SENTRY_DSN= DSN_PUBLICO_DO_SENTRY
SENTRY_DSN= DSN_DO_SENTRY
SENTRY_ORG= SLUG_DA_ORGANIZACAO
SENTRY_PROJECT= SLUG_DO_PROJETO
SENTRY_AUTH_TOKEN= TOKEN_PARA_SOURCE_MAPS
RESEND_API_KEY= CHAVE_DA_RESEND
NOTIFICATION_FROM_EMAIL= "Raizes Negras <notificacoes@raizesnegrasma.com.br>"
NEXT_PUBLIC_SITE_URL= https://raizesnegrasma.com.br
```

O Sentry permanece desativado quando o DSN nao esta configurado. O status da submissao continua sendo salvo mesmo se o envio de email falhar; nesse caso, a falha e registrada no Sentry e informada no painel administrativo. A Resend exige que o dominio usado em `NOTIFICATION_FROM_EMAIL` esteja verificado.

### 3. Rodar em desenvolvimento

```bash
npm run dev
```

### 4. Build de produção

```bash
npm run build
```

### 5. Subir localmente em modo produção

```bash
npm run start
```

## Deploy na Vercel

O projeto agora está alinhado com o fluxo padrão da Vercel para Next.js:

1. Conecte o repositório na Vercel.
2. Configure as variáveis `NEXT_PUBLIC_*` no painel.
3. Deixe o framework como `Next.js` em autodetect.

Não use mais o rewrite antigo de SPA do Vite.
