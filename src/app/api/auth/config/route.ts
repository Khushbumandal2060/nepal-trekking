import { NextResponse } from "next/server";

/**
 * Reports whether real Google OAuth credentials are configured.
 * The client uses this to show friendly setup guidance instead of
 * sending placeholder credentials to Google (which produces the
 * cryptic "invalid_client" page).
 */
export async function GET() {
    const id = process.env.AUTH_GOOGLE_ID ?? "";
    const secret = process.env.AUTH_GOOGLE_SECRET ?? "";

    const isPlaceholder = (v: string) =>
        !v || v.startsWith("your_") || v.includes("your_google_");

    const configured = !isPlaceholder(id) && !isPlaceholder(secret);

    return NextResponse.json({
        configured,
        clientIdMissing: isPlaceholder(id),
        secretMissing: isPlaceholder(secret),
    });
}
