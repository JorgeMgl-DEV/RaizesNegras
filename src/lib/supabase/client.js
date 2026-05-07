import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseCredentials } from "./config";

let browserClient;

export function createClient() {
  if (browserClient) {
    return browserClient;
  }

  const { supabaseUrl, supabasePublishableKey } = getSupabaseCredentials();

  browserClient = createBrowserClient(supabaseUrl, supabasePublishableKey);
  return browserClient;
}
