import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, email, password } = body as {
            username: string;
            email: string;
            password: string;
        };

        const client = await clerkClient();
        const user = await client.users.createUser({
            username: username,
            emailAddress: [email],
            password,
            publicMetadata: { role: "choreographer" },
        });
        return NextResponse.json(
            { message: "User created", user },
            { status: 201 }
        );
    } catch (err: any) {
        console.error("Error in /api/admin/create-user:", err);
        return NextResponse.json(
            { error: err.message || "Something went wrong." },
            { status: 400 }
        );
    }
}
