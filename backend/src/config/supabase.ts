import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

let client: SupabaseClient | null = null;

if (env.supabaseUrl && env.supabaseKey) {
  client = createClient(env.supabaseUrl, env.supabaseKey);
}

export const supabase = client;

