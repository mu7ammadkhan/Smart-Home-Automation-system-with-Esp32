import { NextResponse, NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

type AuthPayLoad = JwtPayload & { userId?: string};

export function requiresAuth(req: NextRequest): { userId: string } | NextResponse {
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
        return NextResponse.json(
            {success: false, message: "Unauthorized: Request token missing"},
            {status: 401}
        );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return NextResponse.json(
            {success: false, message: "Server misconfigured: JWT_SECRET missing"},
            {status: 500}
        );
    }

    try {
        const decoded = jwt.verify(token,secret) as AuthPayLoad;
        const userId = decoded.userId;

        if (!userId) {
            return NextResponse.json(
                {success: false, message: "Unauthorized: invalid token payload"},
                {status: 401}
            );
        }

        return { userId };
    } catch {
        return NextResponse.json(
            {success: false, message: "Unauthorized: invalid or expired access token"},
            { status: 401 }
        );
    }
}