import { handlers } from "@/lib/auth";

/**
 * NextAuth route handler — exposes /api/auth/* endpoints
 * (signin, callback, session, signout, csrf, providers).
 */
export const { GET, POST } = handlers;
