import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { connectDB } from "@/lib/mongodb";
import RefreshToken from "@/models/RefreshToken";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (refreshToken) {
      const tokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      // revoke refresh session in DB
      await RefreshToken.updateOne(
        { tokenHash },
        { revokedAt: new Date() }
      );
    }

    const res = NextResponse.json(
      { success: true, message: "Logged out." },
      { status: 200 }
    );

    // clear cookies
    res.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    res.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    res.headers.set("Cache-Control", "no-store");

    return res;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Logout failed." },
      { status: 500 }
    );
  }
}