import { Card } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "../db";
import { groups } from "../db/schema";

export default async function GroupsPage() {
    // 1. Get the user session
    const { sessionClaims, userId } = await auth();

    // 2. Fetch groups based on role
    let rows: any = [];
    if (sessionClaims?.metadata.role === "choreographer") {
        rows = await db
            .select()
            .from(groups)
            .where(eq(groups.choreographer_id, userId!));
    }

    // 3. Render
    return (
        <div className="max-w-4xl mx-auto py-12">
            <h1 className="text-3xl font-semibold mb-6">Groups</h1>
            {rows.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {rows.map((group: any) => (
                        <Link href={`/groups/${group.id}`} key={group.id}>
                            <Card className="h-32 flex items-center justify-center p-6 transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700">
                                <h2 className="text-xl font-medium text-center">
                                    {group.name}
                                </h2>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No groups found.</p>
            )}
        </div>
    );
}
