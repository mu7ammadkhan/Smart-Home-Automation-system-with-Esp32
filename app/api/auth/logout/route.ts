import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json(
        { success: true, message: "Logged out. " },
        { status: 200}
    );

    // Prevent any caching of this resonse
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.headers.set("pragma","no-cache");
    res.headers.set("Expires", "0");

    // Clear the token cokie safely
    res.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0),
    });

    return res;
}