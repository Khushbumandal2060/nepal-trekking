import type { DefaultSession } from "next-auth";

/**
 * Type augmentation so `session.user.id` is typed everywhere.
 * The id is populated from the provider's user id in src/lib/auth.ts.
 */
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            /** Which provider signed the user in ("credentials" | "google"). */
            provider?: string;
            /** When the account was created, when known. */
            created_at?: Date | string;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        provider?: string;
    }
}
