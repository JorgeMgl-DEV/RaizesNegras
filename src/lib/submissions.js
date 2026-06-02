export const SUBMISSION_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CHANGES_REQUESTED: "CHANGES_REQUESTED",
};

export const SUBMISSION_STATUS_LABELS = {
  PENDING: "Pendente",
  APPROVED: "Aprovada",
  REJECTED: "Recusada",
  CHANGES_REQUESTED: "Alteracoes solicitadas",
};

export const SUBMISSION_TYPE_OPTIONS = [
  { value: "artigo", label: "Artigo" },
  { value: "relato-experiencia", label: "Relato de experiencia" },
  { value: "ensaio", label: "Ensaio" },
  { value: "material-didatico", label: "Material didatico" },
  { value: "registro-cultural", label: "Registro cultural" },
  { value: "documento-historico", label: "Documento historico" },
  { value: "imagem-video", label: "Imagem ou video" },
  { value: "outro", label: "Outro" },
];

export const KNOWLEDGE_AREA_OPTIONS = [
  { value: "ciencias-humanas", label: "Ciencias Humanas" },
  { value: "ciencias-sociais-aplicadas", label: "Ciencias Sociais Aplicadas" },
  { value: "linguagens-artes", label: "Linguagens e Artes" },
  { value: "educacao", label: "Educacao" },
  { value: "historia", label: "Historia" },
  { value: "antropologia", label: "Antropologia" },
  { value: "memoria-patrimonio", label: "Memoria e Patrimonio" },
  { value: "cultura-popular", label: "Cultura Popular" },
  { value: "outro", label: "Outro" },
];

export const SUBMISSION_STATUS_OPTIONS = Object.entries(SUBMISSION_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const driveFilePatterns = [
  /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
  /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
  /drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/,
  /[?&]id=([a-zA-Z0-9_-]+)/,
];

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanMultiline(value) {
  return cleanText(value).replace(/\r\n/g, "\n");
}

function isValidHttpUrl(value) {
  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

export function getSubmissionStatusLabel(status) {
  return SUBMISSION_STATUS_LABELS[status] || "Pendente";
}

export function getSubmissionTypeLabel(value) {
  return SUBMISSION_TYPE_OPTIONS.find((option) => option.value === value)?.label || "Nao informado";
}

export function getKnowledgeAreaLabel(value) {
  return KNOWLEDGE_AREA_OPTIONS.find((option) => option.value === value)?.label || "Nao informado";
}

export function getSubmissionFromFormData(formData) {
  return {
    title: cleanText(formData.get("title")),
    authors: cleanText(formData.get("authors")),
    institution: cleanText(formData.get("institution")),
    knowledgeArea: cleanText(formData.get("knowledgeArea")),
    researchArea: cleanText(formData.get("researchArea")),
    submissionType: cleanText(formData.get("submissionType")),
    abstract: cleanMultiline(formData.get("abstract")),
    keywords: cleanText(formData.get("keywords")),
    driveLink: cleanText(formData.get("driveLink")),
    contactEmail: cleanText(formData.get("contactEmail")).toLowerCase(),
    contactPhone: cleanText(formData.get("contactPhone")),
  };
}

export function validateSubmission(data) {
  if (data.title.length < 6) {
    return "Informe um titulo mais completo para a submissao.";
  }

  if (data.authors.length < 3) {
    return "Informe os autores da submissao.";
  }

  if (data.abstract.length < 80) {
    return "O resumo precisa ter pelo menos 80 caracteres.";
  }

  if (!data.submissionType) {
    return "Selecione o tipo de material submetido.";
  }

  if (!data.knowledgeArea) {
    return "Selecione a area de conhecimento.";
  }

  if (!data.contactEmail || !data.contactEmail.includes("@")) {
    return "Informe um email de contato valido.";
  }

  if (!isValidHttpUrl(data.driveLink) || !data.driveLink.includes("drive.google.com")) {
    return "Informe um link publico valido do Google Drive.";
  }

  return "";
}

export function extractDriveFileId(value = "") {
  const cleanedValue = cleanText(value);

  for (const pattern of driveFilePatterns) {
    const match = cleanedValue.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  if (/^[a-zA-Z0-9_-]{20,}$/.test(cleanedValue)) {
    return cleanedValue;
  }

  return "";
}

export function buildDriveFileViewLink(fileId) {
  return fileId ? `https://drive.google.com/file/d/${fileId}/view` : "";
}

export function formatSubmissionDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
