import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { connectDB } from "@/lib/mongodb";
import RefreshToken from "@/models/RefreshToken";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Read refresh token from HttpOnly cookie
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "Refresh token missing." },
        { status: 401 }
      );
    }

    // Hash incoming refresh token (compare with DB)
    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const existing = await RefreshToken.findOne({ tokenHash });

    if (!existing || existing.revokedAt) {
      return NextResponse.json(
        { success: false, message: "Invalid refresh token." },
        { status: 401 }
      );
    }

    if (existing.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, message: "Refresh token expired." },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, message: "Server misconfigured: JWT_SECRET missing." },
        { status: 500 }
      );
    }

    // -------------------- ROTATION START --------------------
    // Revoke old refresh token (single-use rotation)
    existing.revokedAt = new Date();
    await existing.save();

    // New access token (short-lived)
    const newAccessToken = jwt.sign(
      { userId: existing.userId.toString() },
      secret,
      { expiresIn: "15m" }
    );

    // New refresh token (random string)
    const newRefreshToken = crypto.randomBytes(64).toString("hex");
    const newTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await RefreshToken.create({
      userId: existing.userId,
      tokenHash: newTokenHash,
      expiresAt: newExpiresAt,
      userAgent: req.headers.get("user-agent") ?? "",
      ip:
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        req.headers.get("x-real-ip") ??
        "",
    });
    // -------------------- ROTATION END --------------------

    const res = NextResponse.json(
      { success: true, message: "Token refreshed." },
      { status: 200 }
    );

    // Set new access token cookie
    res.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    // Set new refresh token cookie
    res.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Prevent caching
    res.headers.set("Cache-Control", "no-store");

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Something went wrong.", error: error?.message },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";