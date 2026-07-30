import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";
import bcrypt from "bcryptjs";
import { signToken, setTokenCookie } from "../../../../lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const resDb = await query(`SELECT id, email, password_hash, name, role FROM users WHERE email = $1`, [email]);
    const user = resDb.rows[0];
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    const res = NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
    setTokenCookie(res, token);
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
