"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { createClient } from "@/src/lib/supabase/client";

const AVATAR_BUCKET = "avatars";
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function normalizeFilename(filename) {
  return filename
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function buildAvatarErrorMessage(error) {
  const message = error?.message?.toLowerCase?.() || "";

  if (message.includes("bucket")) {
    return "Crie o bucket `avatars` no Supabase Storage antes de enviar a foto.";
  }

  if (message.includes("row-level security") || message.includes("policy")) {
    return "Falta liberar a policy de upload do bucket `avatars` para usuarios autenticados.";
  }

  return "Nao foi possivel enviar a foto agora.";
}

export default function AvatarUploader({
  userId,
  initialAvatarUrl = "",
  initialAvatarPath = "",
  inputNameUrl = "avatarUrl",
  inputNamePath = "avatarPath",
}) {
  const inputId = useId();
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [avatarPath, setAvatarPath] = useState(initialAvatarPath);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [previewObjectUrl, setPreviewObjectUrl] = useState("");

  const previewUrl = useMemo(() => previewObjectUrl || avatarUrl, [previewObjectUrl, avatarUrl]);

  useEffect(() => {
    return () => {
      if (previewObjectUrl) {
        URL.revokeObjectURL(previewObjectUrl);
      }
    };
  }, [previewObjectUrl]);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];

    setErrorMessage("");
    setStatusMessage("");

    if (!file) {
      return;
    }

    if (!allowedMimeTypes.has(file.type)) {
      setErrorMessage("Use uma imagem JPG, PNG ou WEBP.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("A imagem precisa ter no maximo 2 MB.");
      return;
    }

    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeFileName = normalizeFilename(file.name.replace(/\.[^.]+$/, ""));
    const filePath = `${userId}/${Date.now()}-${safeFileName}.${fileExtension}`;
    const localPreview = URL.createObjectURL(file);

    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl);
    }

    setPreviewObjectUrl(localPreview);
    setUploading(true);

    try {
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filePath);

      setAvatarPath(filePath);
      setAvatarUrl(publicUrl);
      setStatusMessage("Foto enviada. Agora clique em salvar perfil para concluir.");
    } catch (error) {
      setErrorMessage(buildAvatarErrorMessage(error));
      URL.revokeObjectURL(localPreview);
      setPreviewObjectUrl("");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="login-form__field login-form__field--wide">
      <label htmlFor={inputId}>Foto de perfil</label>
      <div className="avatar-upload">
        <div className="profile-avatar-preview">
          <div className="profile-avatar-preview__media">
            {previewUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Previa da foto de perfil" loading="lazy" />
              </>
            ) : (
              <span className="profile-avatar-preview__placeholder">Sem foto</span>
            )}
          </div>
          <div className="profile-avatar-preview__copy">
            <strong>Arquivo de imagem</strong>
            <span>Envie JPG, PNG ou WEBP com ate 2 MB.</span>
            {statusMessage && <span className="avatar-upload__status">{statusMessage}</span>}
            {errorMessage && <span className="avatar-upload__error">{errorMessage}</span>}
          </div>
        </div>

        <label className={`avatar-upload__button ${uploading ? "is-uploading" : ""}`} htmlFor={inputId}>
          {uploading ? "Enviando foto..." : "Escolher imagem"}
        </label>
        <input
          id={inputId}
          className="avatar-upload__input"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <input type="hidden" name={inputNameUrl} value={avatarUrl} readOnly />
        <input type="hidden" name={inputNamePath} value={avatarPath} readOnly />
      </div>
      <span className="login-form__hint">
        O arquivo sobe para o Supabase Storage e a URL final e salva no perfil quando voce clicar em salvar.
      </span>
    </div>
  );
}
