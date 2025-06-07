import { db } from "@/app/db";
import { users } from "@/app/db/schema";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req, {
            signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET!,
        });

        if (evt.type === "user.created") {
            const {
                id,
                email_addresses,
                username,
                created_at,
                public_metadata,
            } = evt.data;

            const role =
                typeof public_metadata?.role === "string"
                    ? public_metadata.role
                    : "user";

            const email = email_addresses?.[0]?.email_address;
            
            await db.insert(users).values({
                id,
                email,
                username: username!,
                role,
                created_at: new Date(created_at),
            });
        }

        return new Response("Webhook received", { status: 200 });
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error verifying webhook", { status: 400 });
    }
}
