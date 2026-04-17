export const env = {
  googleApiKey:
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.VITE_GOOGLE_API_KEY || "",
  googleDriveId:
    process.env.NEXT_PUBLIC_GOOGLE_DRIVE_ID || process.env.VITE_GOOGLE_DRIVE_ID || "",
  googleDriveFolderGeneral:
    process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_GENERAL ||
    process.env.VITE_GOOGLE_DRIVE_FOLDER_GENERAL ||
    "",
  googleDriveFolderCentro:
    process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_CENTRO ||
    process.env.VITE_GOOGLE_DRIVE_FOLDER_CENTRO ||
    "",
  googleDriveFolderLeste:
    process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_LESTE ||
    process.env.VITE_GOOGLE_DRIVE_FOLDER_LESTE ||
    "",
  googleDriveFolderNorte:
    process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_NORTE ||
    process.env.VITE_GOOGLE_DRIVE_FOLDER_NORTE ||
    "",
  googleDriveFolderOeste:
    process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_OESTE ||
    process.env.VITE_GOOGLE_DRIVE_FOLDER_OESTE ||
    "",
  googleDriveFolderSul:
    process.env.NEXT_PUBLIC_GOOGLE_DRIVE_FOLDER_SUL ||
    process.env.VITE_GOOGLE_DRIVE_FOLDER_SUL ||
    "",
  googleDriveSubfolderId:
    process.env.NEXT_PUBLIC_GOOGLE_DRIVE_SUBFOLDER_ID ||
    process.env.VITE_GOOGLE_DRIVE_SUBFOLDER_ID ||
    "",
};
