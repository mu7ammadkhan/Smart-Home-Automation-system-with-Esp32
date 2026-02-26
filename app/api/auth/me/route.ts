import { NextResponse } from "next/server";
import Jwt, { JwtPayload } from "jsonwebtoken";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/Users";

type TokenPayload = JwtPayload & {
  userId?: string;
};

export async function GET(req: Request) {
  try {
    // Read token from authorization header : "Bearear <token>"
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Token missing" },
        { status: 401 },
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: missing tokens" },
        { status: 401 },
      );
    }

    // Token verification
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json(
        {
          success: false,
          message: "Server missconfigured: JWT_SECRET missing",
        },
        { status: 500 },
      );
    }

    let decoded: TokenPayload;
    try {
      decoded = Jwt.verify(token, secret) as TokenPayload;
    } catch {
      return NextResponse.json(
        { success: false, message: "Unauthorized: invalid token" },
        { status: 401 },
      );
    }

    const userId = (decoded as any).userId;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: invalid token payload" },
        { status: 401 },
      );
    }

    // Fetch user
    await connectDB();
    const user = await User.findById(userId).select(
      "_id name email createdAt ",
    );
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: user not found" },
        { status: 401 },
      );
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
