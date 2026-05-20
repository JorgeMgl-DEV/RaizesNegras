"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
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

  if (message.includes("email not confirmed")) {
    return "Confirme o email antes de entrar.";
  }

  if (message.includes("user already registered")) {
    return "Ja existe uma conta com esse email.";
  }

  if (message.includes("password should be")) {
    return "Escolha uma senha mais forte para concluir o cadastro.";
  }

  return mode === "signup" ? "Nao foi possivel concluir o cadastro agora." : "Nao foi possivel concluir o login agora.";
}

async function getBaseUrl() {
  const headersList = await headers();
  const origin = headersList.get("origin");

  if (origin) {
    return origin;
  }

  const forwardedHost = headersList.get("x-forwarded-host");
  const forwardedProto = headersList.get("x-forwarded-proto") || "https";

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  const host = headersList.get("host");

  if (host) {
    const protocol = host.includes("localhost") ? "http" : "https";
    return `${protocol}://${host}`;
  }

  return "http://localhost:3000";
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
    redirect(`/login?error=${encodeURIComponent(buildAuthErrorMessage(error))}`);
  }

  revalidatePath("/", "layout");
  redirect("/login?success=1");
}

export async function signup(formData) {
  if (!hasSupabaseCredentials()) {
    redirect("/login?error=config");
  }

  const email = formData.get("email")?.toString().trim().toLowerCase() || "";
  const password = formData.get("password")?.toString() || "";

  if (!email || !password) {
    redirect("/login?error=missing");
  }

  const supabase = await createClient();
  const baseUrl = await getBaseUrl();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: baseUrl,
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(buildAuthErrorMessage(error, "signup"))}`);
  }

  revalidatePath("/", "layout");

  if (data.session) {
    redirect("/login?success=1");
  }

  redirect("/login?check-email=1");
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
