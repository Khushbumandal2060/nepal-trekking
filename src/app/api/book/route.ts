import { NextResponse } from "next/server";
import { query } from "../../../lib/db";
import { getTokenFromRequest } from "../../../lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tour, name, email, people, message } = body;

    if (!tour || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Try to get user id from token if present
    let userId: number | null = null;
    try {
      const token = getTokenFromRequest(req as Request);
      if (token) {
        const jwt = await import("jsonwebtoken");
        const payload: any = jwt.verify(token, process.env.JWT_SECRET || "please-change-this-secret");
        userId = payload?.id || null;
      }
    } catch (e) {
      // ignore token errors
      userId = null;
    }

    const resInsert = await query(
      `INSERT INTO bookings (tour_slug, name, email, people, message, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at`,
      [tour, name, email, Number(people) || 1, message || null, userId]
    );

    const booking = {
      id: resInsert.rows[0].id,
      tour,
      name,
      email,
      people: Number(people) || 1,
      message: message || "",
      userId,
      createdAt: resInsert.rows[0].created_at,
    };

    return NextResponse.json({ success: true, booking });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
