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

const temporaryAdminAliases = ["jorge", "erick", "murilo"];

function getEmailPrefix(email) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail.includes("@")) {
    return normalizedEmail;
  }

  return normalizedEmail.split("@")[0];
}

function getNameTokens(value) {
  return normalizeText(value)
    .split(/[\s._-]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

export function hasAdminWhitelist() {
  return adminEmails.length > 0;
}

export function isAdminEmail(email) {
  return adminEmails.includes(normalizeEmail(email));
}

export function isTemporaryAdminUser(user) {
  const emailPrefix = getEmailPrefix(user?.email || "");
  const nameTokens = [
    ...getNameTokens(user?.user_metadata?.full_name),
    ...getNameTokens(user?.user_metadata?.name),
  ];

  return temporaryAdminAliases.some((alias) => {
    return (
      emailPrefix === alias ||
      emailPrefix.startsWith(alias) ||
      nameTokens.includes(alias) ||
      nameTokens.some((token) => token.startsWith(alias))
    );
  });
}

export function isAdminUser(user) {
  return isAdminEmail(user?.email || "") || isTemporaryAdminUser(user);
}
