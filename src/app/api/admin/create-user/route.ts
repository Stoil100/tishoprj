import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

type ClerkErrorShape = {
    errors: {
        code?: string;
        message?: string;
    }[];
};

function isClerkError(error: unknown): error is ClerkErrorShape {
    return (
        typeof error === "object" &&
        error !== null &&
        "errors" in error &&
        Array.isArray((error as { errors?: unknown }).errors)
    );
}

function normalizeClerkError(error: unknown): {
    code: string;
    message: string;
} {
    if (isClerkError(error)) {
        const clerkError = error.errors[0];

        switch (clerkError.code) {
            case "form_identifier_exists":
                return {
                    code: "USER_EXISTS",
                    message: "Потребител с този имейл вече съществува.",
                };

            case "form_password_pwned":
            case "form_password_weak":
                return {
                    code: "INVALID_PASSWORD",
                    message:
                        "Паролата е твърде слаба. Използвайте по-силна парола.",
                };

            case "form_username_invalid":
                return {
                    code: "INVALID_USERNAME",
                    message: "Невалидно потребителско име.",
                };

            default:
                return {
                    code: "CLERK_ERROR",
                    message:
                        clerkError.message ??
                        "Грешка при създаване на потребител.",
                };
        }
    }

    return {
        code: "UNKNOWN_ERROR",
        message: "Неочаквана грешка. Опитайте отново.",
    };
}

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
            username,
            emailAddress: [email],
            password,
            publicMetadata: { role: "choreographer" },
        });

        return NextResponse.json(
            {
                success: true,
                code: "USER_CREATED",
                message: `Потребителят "${username}" беше създаден успешно.`,
                data: {
                    id: user.id,
                    username: user.username,
                    email,
                },
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Create user error:", error);

        const normalized = normalizeClerkError(error);

        return NextResponse.json(
            {
                success: false,
                code: normalized.code,
                message: normalized.message,
            },
            { status: 400 },
        );
    }
}
