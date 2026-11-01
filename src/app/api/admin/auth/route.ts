import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { ensureAdminUser, DEFAULT_ADMIN_CONFIG } from "@/lib/auth/seedAdmin";
import {
  adminLoginSchema,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  DUMMY_BCRYPT_HASH,
} from "@/lib/auth/security";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
};

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  try {
    // 1. Rate Limiting Check (Anti Brute-Force & SQL Injection Spray Protection)
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. To prevent security attacks (such as SQL injection or brute force), access is locked. Please wait ${rateLimit.retryAfterSeconds} seconds before trying again.`,
        },
        {
          status: 429,
          headers: {
            ...SECURITY_HEADERS,
            "Retry-After": String(rateLimit.retryAfterSeconds || 600),
          },
        }
      );
    }

    // 2. Parse request body safely
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload in request." },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    // 3. Strict Input Validation & SQL Injection Heuristic Check
    const validationResult = adminLoginSchema.safeParse(rawBody);
    if (!validationResult.success) {
      recordFailedAttempt(ip);
      const firstErrorMessage =
        validationResult.error.issues[0]?.message || "Invalid input detected.";
      return NextResponse.json(
        { error: firstErrorMessage },
        { status: 400, headers: SECURITY_HEADERS }
      );
    }

    const { email, password } = validationResult.data;

    // 4. Auto-ensure default admin user exists in DB from .env
    try {
      await ensureAdminUser();
    } catch (dbErr) {
      console.warn("[AUTH] Database connection issue during ensureAdminUser:", dbErr);
    }

    // 5. Query PostgreSQL safely via Prisma parameterized query
    let user: { id: string; email: string; name: string | null; role: string; password: string } | null = null;
    let dbQueryFailed = false;

    try {
      user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          password: true,
        },
      });
    } catch (dbQueryErr) {
      console.warn("[AUTH] Database query failed, checking fallback:", dbQueryErr);
      dbQueryFailed = true;
    }

    // 6. Timing-Attack Defense: Always execute bcrypt.compare in constant time
    const hashToVerify = user?.password || DUMMY_BCRYPT_HASH;
    const isPasswordValid = await bcrypt.compare(password, hashToVerify);

    let authenticatedUser: { id: string; email: string; name: string | null; role: string } | null = null;

    if (user && user.role === "ADMIN" && isPasswordValid) {
      authenticatedUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    } else if (dbQueryFailed) {
      // Fallback if PostgreSQL is offline
      const envEmail = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_CONFIG.email).toLowerCase().trim();
      const envPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_CONFIG.password;
      if (email === envEmail && password === envPassword) {
        authenticatedUser = {
          id: "admin-fallback",
          email: envEmail,
          name: process.env.ADMIN_NAME || DEFAULT_ADMIN_CONFIG.name,
          role: "ADMIN",
        };
      }
    }

    if (authenticatedUser) {
      // Successful login: Reset failed attempts for this IP
      resetRateLimit(ip);

      const response = NextResponse.json(
        {
          success: true,
          user: authenticatedUser,
        },
        { headers: SECURITY_HEADERS }
      );

      // Secure HTTP-Only Cookie Session
      response.cookies.set("launchcraft_admin_token", "authenticated_session", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    // Record failed attempt for rate limiting
    recordFailedAttempt(ip);

    return NextResponse.json(
      { error: "Invalid admin email or password. Please verify your credentials." },
      { status: 401, headers: SECURITY_HEADERS }
    );
  } catch (error) {
    console.error("[AUTH ERROR]:", error);
    return NextResponse.json(
      { error: "Authentication system error. Please try again later." },
      { status: 500, headers: SECURITY_HEADERS }
    );
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("launchcraft_admin_token");
  if (token?.value === "authenticated_session") {
    try {
      const dbUser = await prisma.user.findFirst({
        where: { role: "ADMIN" },
        select: { id: true, email: true, name: true, role: true },
      });

      if (dbUser) {
        return NextResponse.json(
          {
            authenticated: true,
            user: dbUser,
          },
          { headers: SECURITY_HEADERS }
        );
      }
    } catch {
      // Fallback if DB query fails
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          email: process.env.ADMIN_EMAIL || DEFAULT_ADMIN_CONFIG.email,
          name: process.env.ADMIN_NAME || DEFAULT_ADMIN_CONFIG.name,
          role: "ADMIN",
        },
      },
      { headers: SECURITY_HEADERS }
    );
  }

  return NextResponse.json(
    { authenticated: false },
    { status: 401, headers: SECURITY_HEADERS }
  );
}

export async function DELETE() {
  const response = NextResponse.json(
    { success: true, message: "Logged out." },
    { headers: SECURITY_HEADERS }
  );

  response.cookies.set("launchcraft_admin_token", "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}
