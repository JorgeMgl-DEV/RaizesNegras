import Article from "@/src/views/ARTIGO/Article";

export async function generateMetadata({ params }) {
  const { id } = await params;

  return {
    title: `Artigo ${id} | Raízes Negras`,
  };
}

export default async function Page({ params }) {
  const { id } = await params;

  return <Article id={id} />;
}
