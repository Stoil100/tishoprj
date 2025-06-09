import { db } from "@/app/db";
import { groups, users } from "@/app/db/schema";
import { ChangeChoreographerDialog } from "@/components/admin/dialogs/changeChoreographer";
import { GroupHistoryDialog } from "@/components/admin/dialogs/groupRehearsalsHistory";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export default async function GroupsPage() {
    const { sessionClaims } = await auth();

    let rows: {
        id: number;
        name: string;
        created_at: Date;
        choreographer_name: string | null;
    }[] = [];

    if (sessionClaims?.metadata.role === "admin") {
        rows = await db
            .select({
                id: groups.id,
                name: groups.name,
                created_at: groups.created_at,
                choreographer_name: users.username,
            })
            .from(groups)
            .leftJoin(users, eq(groups.choreographer_id, users.id));
    }

    const choreographers = await db
        .select({ id: users.id, username: users.username })
        .from(users)
        .where(eq(users.role, "choreographer"));
    return (
        <div className="max-w-4xl mx-auto py-12">
            <h1 className="text-3xl font-semibold mb-6">Групи</h1>
            {rows.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Хореограф</TableHead>
                            <TableHead>История</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((g) => (
                            <TableRow key={g.id}>
                                <TableCell>{g.id}</TableCell>
                                <TableCell>{g.name}</TableCell>
                                <TableCell>
                                    {new Date(g.created_at).toLocaleString()}
                                </TableCell>
                                <TableCell className="flex gap-2 items-center">
                                    {g.choreographer_name ?? "—"}
                                    <ChangeChoreographerDialog
                                        groupId={g.id}
                                        choreographers={choreographers}
                                    />
                                </TableCell>
                                <TableCell>
                                    <GroupHistoryDialog groupId={g.id} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <p className="text-center text-gray-500">
                    Не са намерени групи.
                </p>
            )}
        </div>
    );
}
