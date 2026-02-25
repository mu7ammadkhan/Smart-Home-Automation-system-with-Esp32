import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json(
      { ok: true, message: "MongoDB Connected" },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        message: "Failed Connecting with MongoDB",
        error: err?.message,
      },
      { status: 500 },
    );
  }
}
