import { env } from "@/src/utils/env";
import { createDriveListParams, DRIVE_MEDIA_FIELDS } from "@/src/utils/driveMedia";

export const API_KEY = env.googleApiKey;

export const driveFileBinaryURL = (id) =>
  `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${API_KEY}`;

export const getFileMetaURL = (id) => {
  const params = new URLSearchParams({
    key: API_KEY,
    fields: DRIVE_MEDIA_FIELDS,
  });

  params.set("supportsAllDrives", "true");

  return `https://www.googleapis.com/drive/v3/files/${id}?${params.toString()}`;
};

export const listInFolderURL = (folderId, opts = {}) => {
  const params = createDriveListParams({
    apiKey: API_KEY,
    folderIds: [folderId],
    searchTerm: opts.searchTerm || "",
    fields: `files(${DRIVE_MEDIA_FIELDS})`,
    orderBy: opts.orderBy || "modifiedTime desc",
    pageSize: opts.pageSize || 12,
  });

  return `https://www.googleapis.com/drive/v3/files?${params.toString()}`;
};

export const drivePreviewURL = (id) => `https://drive.google.com/file/d/${id}/preview`;
