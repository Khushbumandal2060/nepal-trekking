import { compare, hash } from "bcryptjs";
import { query } from "./db";

/**
 * User persistence + password helpers backed by the `users` table.
 *
 * A user may be created via:
 *   - email/password  → `password_hash` is set, provider = "credentials"
 *   - Google OAuth    → `password_hash` is NULL, provider = "google"
 */

export interface UserRow {
    id: string;
    name: string;
    email: string;
    password_hash: string | null;
    image: string | null;
    provider: "credentials" | "google";
    created_at: Date;
}

const USER_COLUMNS = `
    id,
    name,
    email,
    password_hash,
    image,
    provider,
    created_at
`;

export async function findUserByEmail(
    email: string
): Promise<UserRow | null> {
    const res = await query<UserRow>(
        `SELECT ${USER_COLUMNS} FROM users WHERE lower(email) = lower($1) LIMIT 1;`,
        [email]
    );
    return res.rows[0] ?? null;
}

export async function findUserById(id: string): Promise<UserRow | null> {
    const res = await query<UserRow>(
        `SELECT ${USER_COLUMNS} FROM users WHERE id = $1 LIMIT 1;`,
        [id]
    );
    return res.rows[0] ?? null;
}

export interface CreateUserInput {
    name: string;
    email: string;
    /** Plain-text password. If omitted the user is created passwordless (Google). */
    password?: string;
    image?: string | null;
    provider?: "credentials" | "google";
}

export async function createUser(input: CreateUserInput): Promise<UserRow> {
    const passwordHash = input.password
        ? await hash(input.password, 12)
        : null;

    const res = await query<UserRow>(
        `INSERT INTO users (name, email, password_hash, image, provider)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING ${USER_COLUMNS};`,
        [
            input.name.trim(),
            input.email.trim().toLowerCase(),
            passwordHash,
            input.image ?? null,
            input.provider ?? "credentials",
        ]
    );
    return res.rows[0];
}

/** Verify a plain-text password against a stored bcrypt hash. */
export async function verifyPassword(
    plain: string,
    passwordHash: string | null
): Promise<boolean> {
    if (!passwordHash) return false;
    try {
        return await compare(plain, passwordHash);
    } catch {
        return false;
    }
}
