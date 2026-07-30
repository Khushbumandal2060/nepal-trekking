import jwt from "jsonwebtoken";
import { parseCookie, stringifySetCookie } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "please-change-this-secret";
const TOKEN_NAME = "token";

export function signToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as any;
}

export function getTokenFromRequest(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const parsed = parseCookie(cookieHeader);
  return parsed[TOKEN_NAME];
}

export function setTokenCookie(res: Response | any, token: string) {
  // For NextResponse, set header 'Set-Cookie'
  const secure = process.env.NODE_ENV === "production";
  const cookie = stringifySetCookie({
    name: TOKEN_NAME,
    value: token,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
    secure,
  });

  // If res supports headers (NextResponse), set header; otherwise, return cookie string
  if (res && typeof res.headers !== "undefined") {
    res.headers.append("Set-Cookie", cookie);
  }
  return cookie;
}

export function clearTokenCookie(res: Response | any) {
  const secure = process.env.NODE_ENV === "production";
  const cookie = stringifySetCookie({
    name: TOKEN_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    secure,
  });
  if (res && typeof res.headers !== "undefined") {
    res.headers.append("Set-Cookie", cookie);
  }
  return cookie;
}
