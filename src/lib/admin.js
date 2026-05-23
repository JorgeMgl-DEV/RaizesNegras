function normalizeText(value) {
  return typeof value === "string"
    ? value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    : "";
}

function normalizeEmail(email) {
  return normalizeText(email);
}

const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map(normalizeEmail)
  .filter(Boolean);

export function hasAdminWhitelist() {
  return adminEmails.length > 0;
}

export function isAdminEmail(email) {
  return adminEmails.includes(normalizeEmail(email));
}

export function isAdminUser(user) {
  return isAdminEmail(user?.email || "");
}
