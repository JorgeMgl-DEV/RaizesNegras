export const PERSON_TYPE_OPTIONS = [
  { value: "visitante", label: "Visitante" },
  { value: "pesquisador", label: "Pesquisador" },
  { value: "professor", label: "Professor" },
  { value: "aluno", label: "Aluno" },
  { value: "quilombola", label: "Quilombola" },
  { value: "artista-cultural", label: "Artista / fazedor cultural" },
  { value: "lideranca-comunitaria", label: "Lideranca comunitaria" },
  { value: "mestre-tradicional", label: "Mestre de saber tradicional" },
  { value: "gestor-cultural", label: "Gestor cultural" },
  { value: "outro", label: "Outro" },
];

export const RACIAL_IDENTITY_OPTIONS = [
  { value: "preta", label: "Preta" },
  { value: "parda", label: "Parda" },
  { value: "branca", label: "Branca" },
  { value: "indigena", label: "Indigena" },
  { value: "amarela", label: "Amarela" },
  { value: "quilombola", label: "Quilombola" },
  { value: "outra", label: "Outra" },
  { value: "nao-informar", label: "Prefiro nao informar" },
];

export const STUDENT_LEVEL_OPTIONS = [
  { value: "fundamental", label: "Ensino fundamental" },
  { value: "medio", label: "Ensino medio" },
  { value: "graduacao", label: "Graduacao" },
  { value: "pos-graduacao", label: "Pos-graduacao" },
  { value: "maior", label: "Maior / educacao livre" },
  { value: "phd", label: "PhD" },
];

export const QUILOMBOLA_REGION_OPTIONS = [
  { value: "metropolitana", label: "Regiao metropolitana / ilha" },
  { value: "centro", label: "Centro" },
  { value: "leste", label: "Leste" },
  { value: "norte", label: "Norte" },
  { value: "oeste", label: "Oeste" },
  { value: "sul", label: "Sul" },
  { value: "outra", label: "Outra regiao" },
];

const institutionLinkedTypes = new Set(["aluno", "professor"]);
const personTypeValues = new Set(PERSON_TYPE_OPTIONS.map((option) => option.value));
const racialIdentityValues = new Set(RACIAL_IDENTITY_OPTIONS.map((option) => option.value));
const studentLevelValues = new Set(STUDENT_LEVEL_OPTIONS.map((option) => option.value));
const quilombolaRegionValues = new Set(QUILOMBOLA_REGION_OPTIONS.map((option) => option.value));

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanMultiline(value) {
  return cleanText(value).replace(/\r\n/g, "\n");
}

function normalizeChoice(value, allowedValues) {
  const normalizedValue = cleanText(value);
  return allowedValues.has(normalizedValue) ? normalizedValue : "";
}

function isValidHttpUrl(value) {
  if (!value) {
    return true;
  }

  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

export function isInstitutionLinkedType(personType) {
  return institutionLinkedTypes.has(personType);
}

export function isStudentType(personType) {
  return personType === "aluno";
}

export function isQuilombolaType(personType) {
  return personType === "quilombola";
}

export function getOptionLabel(options, value, fallback = "") {
  return options.find((option) => option.value === value)?.label || fallback;
}

export function getProfileFromMetadata(metadata = {}) {
  const personType = normalizeChoice(metadata.person_type, personTypeValues);
  const profile = {
    fullName: cleanText(metadata.full_name || metadata.name),
    personType,
    racialIdentity: normalizeChoice(metadata.racial_identity, racialIdentityValues),
    studentLevel: normalizeChoice(metadata.student_level, studentLevelValues),
    institution: cleanText(metadata.institution),
    quilombolaRegion: normalizeChoice(metadata.quilombola_region, quilombolaRegionValues),
    quilombolaCommunity: cleanText(metadata.quilombola_community),
    culturalConnection: cleanMultiline(metadata.cultural_connection),
    phone: cleanText(metadata.phone),
    avatarUrl: cleanText(metadata.avatar_url),
  };

  if (!isInstitutionLinkedType(personType)) {
    profile.institution = "";
  }

  if (!isStudentType(personType)) {
    profile.studentLevel = "";
  }

  if (!isQuilombolaType(personType)) {
    profile.quilombolaRegion = "";
    profile.quilombolaCommunity = "";
  }

  return profile;
}

export function getProfileFromFormData(formData) {
  return getProfileFromMetadata({
    full_name: formData.get("fullName"),
    person_type: formData.get("personType"),
    racial_identity: formData.get("racialIdentity"),
    student_level: formData.get("studentLevel"),
    institution: formData.get("institution"),
    quilombola_region: formData.get("quilombolaRegion"),
    quilombola_community: formData.get("quilombolaCommunity"),
    cultural_connection: formData.get("culturalConnection"),
    phone: formData.get("phone"),
    avatar_url: formData.get("avatarUrl"),
  });
}

export function validateProfile(profile) {
  if (profile.fullName.length < 3) {
    return "Informe um nome valido para o perfil.";
  }

  if (!profile.personType) {
    return "Selecione o tipo de pessoa no cadastro.";
  }

  if (!profile.racialIdentity) {
    return "Selecione a identificacao racial ou cultural do perfil.";
  }

  if (profile.phone.replace(/\D/g, "").length < 8) {
    return "Informe um telefone valido.";
  }

  if (isInstitutionLinkedType(profile.personType) && !profile.institution) {
    return "Informe a instituicao vinculada ao perfil.";
  }

  if (isStudentType(profile.personType) && !profile.studentLevel) {
    return "Selecione o nivel de ensino do aluno.";
  }

  if (isQuilombolaType(profile.personType) && !profile.quilombolaRegion) {
    return "Selecione a regiao quilombola do perfil.";
  }

  if (isQuilombolaType(profile.personType) && !profile.quilombolaCommunity) {
    return "Informe a comunidade quilombola de origem ou pertencimento.";
  }

  if (!isValidHttpUrl(profile.avatarUrl)) {
    return "Use uma URL publica valida para a foto de perfil.";
  }

  return "";
}

export function toUserMetadata(profile) {
  return {
    full_name: profile.fullName || null,
    person_type: profile.personType || null,
    racial_identity: profile.racialIdentity || null,
    student_level: isStudentType(profile.personType) ? profile.studentLevel || null : null,
    institution: isInstitutionLinkedType(profile.personType) ? profile.institution || null : null,
    quilombola_region: isQuilombolaType(profile.personType) ? profile.quilombolaRegion || null : null,
    quilombola_community: isQuilombolaType(profile.personType) ? profile.quilombolaCommunity || null : null,
    cultural_connection: profile.culturalConnection || null,
    phone: profile.phone || null,
    avatar_url: profile.avatarUrl || null,
  };
}

export function getProfileDisplayName(profile, fallbackEmail = "") {
  if (profile.fullName) {
    return profile.fullName;
  }

  const normalizedEmail = cleanText(fallbackEmail).toLowerCase();

  if (!normalizedEmail) {
    return "Perfil";
  }

  return normalizedEmail.split("@")[0];
}

export function getUserDisplayName(user) {
  const profile = getProfileFromMetadata(user?.user_metadata);
  return getProfileDisplayName(profile, user?.email || "");
}

export function getUserInitials(user) {
  const displayName = getUserDisplayName(user);
  const words = displayName
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length === 0) {
    return "RN";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0] || ""}${words[words.length - 1][0] || ""}`.toUpperCase();
}
