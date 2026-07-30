import { NextResponse } from "next/server";
import { query } from "../../../../lib/db";
import { getTokenFromRequest, verifyToken } from "../../../../lib/auth";

export async function GET(req: Request) {
  try {
    const token = getTokenFromRequest(req as Request);
    if (!token) return NextResponse.json({ error: "Not authorized" }, { status: 401 });

    let payload: any;
    try {
      payload = verifyToken(token);
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const resBookings = await query(`SELECT * FROM bookings ORDER BY created_at DESC LIMIT 500`);
    return NextResponse.json({ success: true, bookings: resBookings.rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
