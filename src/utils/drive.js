// Utils centralizados para URLs da Google Drive API (arquivos públicos, sem login)
export const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

// Se você usa "Meu Drive" comum, deixe false.
// Se for "Drive Compartilhado" (Shared Drive), mude para true e preencha VITE_GOOGLE_DRIVE_ID no .env
const USE_SHARED_DRIVE = false;
const SHARED_DRIVE_ID = import.meta.env.VITE_GOOGLE_DRIVE_ID || "";

// Binário do arquivo (PDF) — usado pelo pdf.js quando houver CORS ok
export const driveFileBinaryURL = (id) =>
  `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${API_KEY}`;

// Metadados do arquivo (nome, mimeType, pasta, etc)
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

// Listagem de PDFs dentro de uma pasta
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

// URL de preview oficial do Drive (abre em <iframe> sem login) — nosso fallback anti-CORS
export const drivePreviewURL = (id) =>
  `https://drive.google.com/file/d/${id}/preview`;
