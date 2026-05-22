"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { validateProfile, getProfileFromFormData, toUserMetadata } from "@/src/lib/profile";
import { hasSupabaseCredentials } from "@/src/lib/supabase/config";
import { createClient } from "@/src/lib/supabase/server";

function buildProfileErrorMessage(error) {
  if (!error) {
    return "Nao foi possivel salvar o perfil agora.";
  }

  const message = error.message.toLowerCase();

  if (message.includes("jwt") || message.includes("session")) {
    return "Sua sessao expirou. Entre novamente para continuar.";
  }

  return "Nao foi possivel salvar o perfil agora.";
}

export async function updateProfile(formData) {
  if (!hasSupabaseCredentials()) {
    redirect("/login?error=config");
  }

  const profile = getProfileFromFormData(formData);
  const validationMessage = validateProfile(profile);

  if (validationMessage) {
    redirect(`/perfil?error=${encodeURIComponent(validationMessage)}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=session");
  }

  const { error } = await supabase.auth.updateUser({
    data: toUserMetadata(profile),
  });

  if (error) {
    redirect(`/perfil?error=${encodeURIComponent(buildProfileErrorMessage(error))}`);
  }

  revalidatePath("/", "layout");
  revalidatePath("/login");
  revalidatePath("/perfil");
  redirect("/perfil?saved=1");
}
