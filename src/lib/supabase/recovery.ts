import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export function createRecoveryClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!,
    {
      auth: {
        flowType: "implicit",
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        storageKey: "growndona-recovery",
      },
    }
  );
}
