import regioes from "@/src/components/top-section/Mapa/regioes.json";
import slugify from "@/src/utils/slugify";

export const regionDescriptions = {
  norte:
    "A região Norte do Maranhão é berço de importantes manifestações culturais afro-brasileiras, incluindo o Tambor de Crioula e o Bumba Meu Boi. Esta área preserva tradições centenárias e uma forte conexão com as raízes africanas.",
  sul:
    "O Sul maranhense guarda histórias de resistência e quilombos, com comunidades que mantêm vivas as tradições ancestrais. A região é conhecida por seus rituais, danças e pela preservação da medicina tradicional.",
  leste:
    "Na região Leste, encontramos um rico patrimônio cultural materializado em festas religiosas, artesanato e culinária típica. As comunidades locais são guardiãs de saberes tradicionais únicos.",
  oeste:
    "O Oeste do Maranhão se destaca pela forte presença de comunidades quilombolas e pela preservação de ritmos e danças tradicionais. A região mantém viva a memória dos ancestrais através de suas manifestações culturais.",
  centro:
    "A região Central representa um ponto de convergência cultural, onde diferentes tradições se encontram e se renovam. É um território de intensas trocas culturais e preservação da identidade afro-maranhense.",
};

export const regionSlugs = regioes.map((regiao) => slugify(regiao.name));

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
    description: regionDescriptions[slugify(region.name)] || region.descricao,
  };
}
