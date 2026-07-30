import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";
import bcrypt from "bcryptjs";
import { signToken, setTokenCookie } from "../../../../lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const insert = await query(
      `INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, role`,
      [email, hashed, name || null]
    );

    const user = insert.rows[0];
    const token = signToken({ id: user.id, email: user.email, role: user.role });

    const res = NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
    setTokenCookie(res, token);
    return res;
  } catch (err: any) {
    if (err?.code === "23505") {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
