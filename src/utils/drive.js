import { env } from "@/src/utils/env";

export const API_KEY = env.googleApiKey;

const USE_SHARED_DRIVE = false;
const SHARED_DRIVE_ID = env.googleDriveId;

export const driveFileBinaryURL = (id) =>
  `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${API_KEY}`;

export const getFileMetaURL = (id) => {
  const params = new URLSearchParams({
    key: API_KEY,
    fields: "id,name,mimeType,modifiedTime,parents,thumbnailLink,webViewLink",
  });

  if (USE_SHARED_DRIVE) {
    params.set("supportsAllDrives", "true");
    params.set("includeItemsFromAllDrives", "true");
  }

  return `https://www.googleapis.com/drive/v3/files/${id}?${params.toString()}`;
};

export const listInFolderURL = (folderId, opts = {}) => {
  const params = new URLSearchParams({
    q: `mimeType='application/pdf' and '${folderId}' in parents and trashed=false`,
    key: API_KEY,
    fields: "files(id,name,mimeType,modifiedTime,thumbnailLink,webViewLink)",
    orderBy: opts.orderBy || "modifiedTime desc",
    pageSize: String(opts.pageSize || 12),
  });

  if (USE_SHARED_DRIVE) {
    params.set("supportsAllDrives", "true");
    params.set("includeItemsFromAllDrives", "true");
    params.set("corpora", "drive");
    params.set("driveId", SHARED_DRIVE_ID);
  }

  return `https://www.googleapis.com/drive/v3/files?${params.toString()}`;
};

export const drivePreviewURL = (id) => `https://drive.google.com/file/d/${id}/preview`;
