import { NextRequest, NextResponse } from "next/server";
import { requiresAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requiresAuth(req);

  // if token invalid or missing → requireAuth already returns response
  if (auth instanceof NextResponse) return auth;

  // auth.userId guaranteed after this point
  return NextResponse.json({
    success: true,
    message: "Rooms API protected successfully.",
    userId: auth.userId
  });
}