import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { getSupabaseCredentials, hasSupabaseCredentials } from "./config";

export async function updateSession(request) {
  if (!hasSupabaseCredentials()) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const { supabaseUrl, supabasePublishableKey } = getSupabaseCredentials();

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.getUser();
  response.headers.set("Cache-Control", "private, no-store");

  return response;
}
