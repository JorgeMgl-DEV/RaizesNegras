import regioes from "@/src/components/top-section/Mapa/regioes.json";
import slugify from "@/src/utils/slugify";

export const regionSlugs = regioes.map((regiao) => regiao.slug);

export function getRegionBySlug(slug) {
  return regioes.find(
    (regiao) =>
      regiao.slug === slug || regiao.code === slug || slugify(regiao.name) === slug,
  );
}

export function getRegionMetadata(slug) {
  const region = getRegionBySlug(slug);
  if (!region) return null;

  return {
    title: `${region.name} | Raízes Negras`,
    description: region.descricao,
  };
}
