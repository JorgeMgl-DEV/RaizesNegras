import Article from "@/src/views/ARTIGO/Article";

export async function generateMetadata({ params }) {
  return {
    title: `Artigo ${params.id} | Raízes Negras`,
  };
}

export default function Page({ params }) {
  return <Article id={params.id} />;
}
