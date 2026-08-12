import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_NEXT = ["/dashboard", "/nueva-contrasena"];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const linkError = searchParams.get("error_description");
  const destination = next && ALLOWED_NEXT.includes(next) ? next : "/dashboard";
  const isRecovery = type === "recovery" || next === "/nueva-contrasena";

  const redirectTo = request.nextUrl.clone();
  redirectTo.search = "";

  if (linkError) {
    console.error("[auth/confirm] link error:", linkError);
  }

  if (!linkError && tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      redirectTo.pathname = isRecovery ? "/nueva-contrasena" : destination;
      return NextResponse.redirect(redirectTo);
    }
    console.error("[auth/confirm] verifyOtp failed:", error.message);
  }

  if (!linkError && code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      redirectTo.pathname = destination;
      return NextResponse.redirect(redirectTo);
    }
    console.error("[auth/confirm] exchangeCodeForSession failed:", error.message);
  }

  redirectTo.pathname = isRecovery ? "/recuperar" : "/login";
  redirectTo.search = "?error=link";
  return NextResponse.redirect(redirectTo);
}
