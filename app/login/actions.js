"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasSupabaseCredentials } from "@/src/lib/supabase/config";
import { createClient } from "@/src/lib/supabase/server";

function buildErrorMessage(error) {
  if (!error) {
    return "Nao foi possivel concluir o login.";
  }

  const message = error.message.toLowerCase();

  if (message.includes("invalid login credentials")) {
    return "Email ou senha invalidos.";
  }

  if (message.includes("email not confirmed")) {
    return "Confirme o email antes de entrar.";
  }

  return "Nao foi possivel concluir o login agora.";
}

export async function login(formData) {
  if (!hasSupabaseCredentials()) {
    redirect("/login?error=config");
  }

  const email = formData.get("email")?.toString().trim().toLowerCase() || "";
  const password = formData.get("password")?.toString() || "";

  if (!email || !password) {
    redirect("/login?error=missing");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(buildErrorMessage(error))}`);
  }

  revalidatePath("/", "layout");
  redirect("/login?success=1");
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
