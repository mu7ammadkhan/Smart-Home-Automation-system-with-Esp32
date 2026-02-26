import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    // fetch user + password (only needed if schema has select:false)
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

    const token = jwt.sign({ userId: user._id.toString() }, secret, {
      expiresIn: "7d",
    });

    // ==================== CHANGE START: Set JWT in HttpOnly Cookie (Middleware can read) ====================
    // Before: token was returned in JSON (less secure, middleware can't read localStorage)
    // Now: token is stored in an HttpOnly cookie so middleware can protect routes automatically.
    
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

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

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