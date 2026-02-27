import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // ===== CHANGE: needed to generate secure random refresh token + hash =====
import RefreshToken from "@/models/RefreshToken"; // ===== CHANGE: DB model for storing refresh sessions =====

import { connectDB } from "@/lib/mongodb";
import User from "@/models/Users";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json().catch(() => null);

    const email = (body?.email ?? "").trim().toLowerCase();
    const password = body?.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials." },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials." },
        { status: 401 },
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, message: "JWT_SECRET is missing in .env.local." },
        { status: 500 },
      );
    }

    // ==================== CHANGE START: PRODUCTION-LEVEL TOKEN SYSTEM ====================

    // 1) Short-lived access token (JWT)
    const accessToken = jwt.sign(
      { userId: user._id.toString() },
      secret,
      { expiresIn: "15m" } // short expiry for security
    );

    // 2) Long-lived refresh token (random string, NOT JWT)
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // 3) Store HASH of refresh token in DB (never store raw token)
    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const refreshExpiresAt = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 30 // 30 days
    );

    await RefreshToken.create({
      userId: user._id,
      tokenHash,
      expiresAt: refreshExpiresAt,
      userAgent: (req as any).headers?.get?.("user-agent") ?? "",
      ip:
        (req as any).headers?.get?.("x-forwarded-for") ??
        "",
    });

    // 4) Send response + set secure cookies
    const res = NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 },
    );

    // Access token cookie (short-lived)
    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    // Refresh token cookie (long-lived)
    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    res.headers.set("Cache-Control", "no-store");

    return res;

    // ==================== CHANGE END ====================

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
        error: error?.message,
      },
      { status: 500 },
    );
  }
}