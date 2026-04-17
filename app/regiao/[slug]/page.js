import { getRegionMetadata, regionSlugs } from "@/src/data/regions";
import RegionPage from "@/src/views/REGIAO/RegionPage";

export async function generateMetadata({ params }) {
  const metadata = getRegionMetadata(params.slug);
  return {
    title: metadata?.title || "Região | Raízes Negras",
    description: metadata?.description,
  };
}

export default function Page({ params }) {
  return <RegionPage slug={params.slug} />;
}

export async function generateStaticParams() {
  return regionSlugs.map((slug) => ({ slug }));
}
