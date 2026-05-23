const titleExtensionPattern =
  /\.(pdf|png|jpe?g|webp|gif|svg|bmp|mp4|mov|avi|mkv|webm|m4v|mpeg|mpg|wav|mp3)$/i;

export const DRIVE_MEDIA_FIELDS = [
  "id",
  "name",
  "mimeType",
  "modifiedTime",
  "parents",
  "thumbnailLink",
  "webViewLink",
  "webContentLink",
  "videoMediaMetadata",
  "imageMediaMetadata",
].join(",");

function escapeDriveQueryValue(value = "") {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

export function buildDriveMediaQuery({ folderIds = [], searchTerm = "" } = {}) {
  const normalizedFolderIds = folderIds.filter(Boolean);
  const parentsQuery =
    normalizedFolderIds.length > 0
      ? ` and (${normalizedFolderIds.map((folderId) => `('${folderId}' in parents)`).join(" or ")})`
      : "";
  const searchQuery = searchTerm ? ` and name contains '${escapeDriveQueryValue(searchTerm)}'` : "";

  return `(mimeType='application/pdf' or mimeType contains 'image/' or mimeType contains 'video/') and trashed=false${parentsQuery}${searchQuery}`;
}

export function getDriveMediaKind(mimeType = "") {
  if (mimeType === "application/pdf") {
    return "pdf";
  }

  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (mimeType.startsWith("video/")) {
    return "video";
  }

  return "other";
}

export function isDrivePdf(mimeType = "") {
  return getDriveMediaKind(mimeType) === "pdf";
}

export function isDriveImage(mimeType = "") {
  return getDriveMediaKind(mimeType) === "image";
}

export function isDriveVideo(mimeType = "") {
  return getDriveMediaKind(mimeType) === "video";
}

export function getDriveMediaLabel(mimeType = "") {
  switch (getDriveMediaKind(mimeType)) {
    case "pdf":
      return "PDF";
    case "image":
      return "Imagem";
    case "video":
      return "Video";
    default:
      return "Arquivo";
  }
}

export function getDriveMediaIconClass(mimeType = "") {
  switch (getDriveMediaKind(mimeType)) {
    case "pdf":
      return "fa-solid fa-file-pdf";
    case "image":
      return "fa-solid fa-image";
    case "video":
      return "fa-solid fa-video";
    default:
      return "fa-solid fa-file";
  }
}

export function formatDriveItemTitle(name = "") {
  return name.replace(titleExtensionPattern, "").replace(/_/g, " ").replace(/\s+/g, " ").trim();
}

export function enhanceDriveThumbnail(thumbnailLink = "") {
  if (!thumbnailLink) {
    return "";
  }

  return thumbnailLink.replace(/=s\d+/, "=s1200");
}
