
📌 Visão Geral

O Raízes Negras é uma aplicação web desenvolvida em React.js, com integração à Google Drive API para organização e exibição de conteúdos multimídia relacionados à memória e cultura afro-maranhense.

O sistema permite:

Upload e consulta de arquivos organizados por região do Maranhão.

Visualização de artigos, imagens e PDFs diretamente na interface.

Navegação por filtros e busca.

Exibição de conteúdos em carrosséis e seções dinâmicas.

🏗️ Estrutura do Projeto

A estrutura de diretórios segue o padrão de aplicações React:

RaizesNegras/
│-- public/               # Arquivos estáticos
│-- src/
│   │-- api/              # Serviços de integração (Google Drive API)
│   │-- components/       # Componentes reutilizáveis
│   │-- pages/            # Páginas principais do site
│   │-- assets/           # Imagens, ícones e estilos
│   │-- App.jsx           # Componente raiz
│   │-- index.jsx         # Ponto de entrada da aplicação
│-- .env                  # Variáveis de ambiente (NÃO VERSIONAR!)
│-- package.json          # Dependências e scripts do projeto
│-- vite.config.js        # Configuração do Vite

⚙️ Tecnologias Utilizadas

Frontend: React.js + Vite

Estilos: CSS puro (com possibilidade de Tailwind ou styled-components em expansões futuras)

APIs: Google Drive API

Deploy: Vercel

🚀 Instalação e Execução
1. Pré-requisitos

Node.js versão 18+

npm ou yarn

2. Clonar o repositório
git clone https://github.com/SEU-USUARIO/RaizesNegras.git
cd RaizesNegras

3. Instalar dependências
npm install

4. Configurar variáveis de ambiente

Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:

VITE_GOOGLE_API_KEY= SUA_CHAVE_API_AQUI
VITE_GOOGLE_DRIVE_FOLDER_GENERAL= ID_PASTA_GERAL
VITE_GOOGLE_DRIVE_FOLDER_CENTRO= ID_PASTA_CENTRO
VITE_GOOGLE_DRIVE_FOLDER_LESTE= ID_PASTA_LESTE
VITE_GOOGLE_DRIVE_FOLDER_SUL= ID_PASTA_SUL
VITE_GOOGLE_DRIVE_FOLDER_NORTE= ID_PASTA_NORTE
VITE_GOOGLE_DRIVE_FOLDER_OESTE= ID_PASTA_OESTE


⚠️ Atenção:

Nunca compartilhe o .env no GitHub.

Adicione .env no .gitignore (já configurado).

As chaves da API e os IDs de pastas são sensíveis e não podem ser públicos.

5. Rodar em ambiente de desenvolvimento
npm run dev

6. Gerar versão de produção
npm run build

7. Servir build localmente
npm run preview

🌐 Deploy na Vercel

O projeto está preparado para deploy na Vercel:

Conectar o repositório ao painel da Vercel.

Configurar as variáveis de ambiente no painel (.env).

A Vercel cuidará do build e deploy automático.

📂 Principais Funcionalidades

Página inicial: lista de artigos por região.

Carrossel dinâmico: exibe arquivos aleatórios das pastas do Google Drive.

Página de conteúdo: visualização inline de PDFs, imagens e textos.

Busca: pesquisa de arquivos por título ou região.

📜 Licença

Este projeto está sob a licença MIT. Consulte o arquivo LICENSE
 para mais informações.