export const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
export const driveFileBinaryURL = (id) => `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${API_KEY}`;
export const getFileMetaURL = (id) => `https://www.googleapis.com/drive/v3/files/${id}?key=${API_KEY}&fields=id,name,mimeType,modifiedTime,parents,thumbnailLink,webViewLink`;
export const listInFolderURL = (folderId, opts = {}) => {
  const params = new URLSearchParams({
    q: `mimeType='application/pdf' and '${folderId}' in parents`,
    key: API_KEY,
    fields: "files(id,name,mimeType,modifiedTime,thumbnailLink)",
    orderBy: opts.orderBy || "modifiedTime desc",
    pageSize: opts.pageSize || "50",
    supportsAllDrives: "true",
    includeItemsFromAllDrives: "true",
  });
  return `https://www.googleapis.com/drive/v3/files?${params.toString()}`;
};