import { env } from "@/src/utils/env";

export const driveFolderEntries = [
  { id: env.googleDriveFolderGeneral, regionKey: "geral" },
  { id: env.googleDriveSubfolderId, regionKey: "geral" },
  { id: env.googleDriveFolderCentro, regionKey: "centro", regionCode: "5" },
  { id: env.googleDriveFolderLeste, regionKey: "leste", regionCode: "3" },
  { id: env.googleDriveFolderNorte, regionKey: "norte", regionCode: "1" },
  { id: env.googleDriveFolderOeste, regionKey: "oeste", regionCode: "4" },
  { id: env.googleDriveFolderSul, regionKey: "sul", regionCode: "2" },
].filter(({ id }) => Boolean(id));

export const driveFolderIds = driveFolderEntries.map(({ id }) => id);

export const driveFoldersByRegion = Object.fromEntries(
  ["geral", "centro", "leste", "norte", "oeste", "sul"].map((regionKey) => [
    regionKey,
    driveFolderEntries.filter((entry) => entry.regionKey === regionKey).map(({ id }) => id),
  ]),
);

driveFoldersByRegion.all = driveFolderIds;

export const driveFoldersByRegionCode = Object.fromEntries(
  driveFolderEntries
    .filter(({ regionCode }) => regionCode)
    .map(({ id, regionCode }) => [regionCode, [id]]),
);
