"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getProfileFromFormData, toUserMetadata, validateProfile } from "@/src/lib/profile";
import { hasSupabaseCredentials } from "@/src/lib/supabase/config";
import { createClient } from "@/src/lib/supabase/server";

function buildAuthErrorMessage(error, mode = "login") {
  if (!error) {
    return mode === "signup" ? "Nao foi possivel concluir o cadastro." : "Nao foi possivel concluir o login.";
  }

  const message = error.message.toLowerCase();

  if (message.includes("invalid login credentials")) {
    return "Email ou senha invalidos.";
  }

  if (message.includes("user already registered")) {
    return "Ja existe uma conta com esse email.";
  }

  if (message.includes("password should be")) {
    return "Escolha uma senha mais forte para concluir o cadastro.";
  }

  return mode === "signup" ? "Nao foi possivel concluir o cadastro agora." : "Nao foi possivel concluir o login agora.";
}

export async function login(formData) {
  if (!hasSupabaseCredentials()) {
    redirect("/login?error=config");
  }

  const email = formData.get("email")?.toString().trim().toLowerCase() || "";
  const password = formData.get("password")?.toString() || "";

  if (!email || !password) {
    redirect("/login?mode=login&error=missing");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?mode=login&error=${encodeURIComponent(buildAuthErrorMessage(error))}`);
  }

  revalidatePath("/", "layout");
  revalidatePath("/perfil");
  redirect("/perfil?login=1");
}

export async function signup(formData) {
  if (!hasSupabaseCredentials()) {
    redirect("/login?error=config");
  }

  const email = formData.get("email")?.toString().trim().toLowerCase() || "";
  const password = formData.get("password")?.toString() || "";
  const profile = getProfileFromFormData(formData);

  if (!email || !password) {
    redirect("/login?mode=signup&error=missing");
  }

  if (password.length < 6) {
    redirect("/login?mode=signup&error=Escolha%20uma%20senha%20com%20pelo%20menos%206%20caracteres.");
  }

  const validationMessage = validateProfile(profile);

  if (validationMessage) {
    redirect(`/login?mode=signup&error=${encodeURIComponent(validationMessage)}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: toUserMetadata(profile),
    },
  });

  if (error) {
    redirect(`/login?mode=signup&error=${encodeURIComponent(buildAuthErrorMessage(error, "signup"))}`);
  }

  revalidatePath("/", "layout");
  revalidatePath("/perfil");

  if (data.session) {
    redirect("/perfil?created=1");
  }

  redirect("/login?mode=login&success=created");
}

export async function logout() {
  if (!hasSupabaseCredentials()) {
    redirect("/login");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}
