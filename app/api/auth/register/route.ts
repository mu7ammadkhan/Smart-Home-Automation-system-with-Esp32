import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/Users";

// POST api/auth/register
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json().catch(() => null);

    const name = (body?.name ?? "").trim();
    const email = (body?.email ?? "").toLowerCase();
    const password = body?.password ?? "";

    // Basic Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email and password are required" },
        { status: 400 },
      );
    }

    // Password legth must be greater than 6
    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be greater than at least 6 characters",
        },
        { status: 409 },
      );
    }

    // Check duplicate
    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Email already Registered" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creaate user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Response ( Password will not be returned )
    return NextResponse.json(
      {
        success: true,
        message: "User Registered Successfully",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          createdAt: user.createdaAt,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    // Mongo duplicate key safety (if unique index )
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Email Already Registered" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { success: false, message: " Something went Wrong " },
      { status: 500 },
    );
  }
}
