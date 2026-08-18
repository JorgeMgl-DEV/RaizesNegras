import { getRegionMetadata, regionSlugs } from "@/src/data/regions";
import RegionPage from "@/src/views/REGIAO/RegionPage";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const metadata = getRegionMetadata(slug);
  return {
    title: metadata?.title || "Região | Raízes Negras",
    description: metadata?.description,
  };
}

export default async function Page({ params }) {
  const { slug } = await params;

  return <RegionPage slug={slug} />;
}

export async function generateStaticParams() {
  return regionSlugs.map((slug) => ({ slug }));
}
