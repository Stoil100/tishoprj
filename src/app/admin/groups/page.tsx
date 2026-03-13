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
                <div className="rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-100/80">
                            <TableRow>
                                <TableHead className="w-[80px] font-bold text-gray-700">
                                    ID
                                </TableHead>
                                <TableHead className="font-bold text-gray-700 uppercase text-xs tracking-wider">
                                    Име на група
                                </TableHead>
                                <TableHead className="font-bold text-gray-700 uppercase text-xs tracking-wider">
                                    Дата на създаване
                                </TableHead>
                                <TableHead className="font-bold text-gray-700 uppercase text-xs tracking-wider text-center">
                                    Хореограф
                                </TableHead>
                                <TableHead className="font-bold text-gray-700 uppercase text-xs tracking-wider text-right">
                                    История
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {rows.map((g) => (
                                <TableRow
                                    key={g.id}
                                    className="group hover:bg-blue-50/30 transition-all duration-200"
                                >
                                    {/* ID с дискретен дизайн */}
                                    <TableCell className="font-mono text-gray-400 text-sm">
                                        #{g.id}
                                    </TableCell>

                                    {/* Име с подчертан шрифт */}
                                    <TableCell className="font-semibold text-gray-900">
                                        {g.name}
                                    </TableCell>

                                    {/* Дата с иконка или по-лек цвят */}
                                    <TableCell className="text-gray-500 text-sm">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                            {new Date(
                                                g.created_at,
                                            ).toLocaleDateString("bg-BG")}
                                            <span className="text-xs opacity-60">
                                                {new Date(
                                                    g.created_at,
                                                ).toLocaleTimeString("bg-BG", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </span>
                                    </TableCell>

                                    {/* Хореограф с по-добра подредба */}
                                    <TableCell>
                                        <div className="flex justify-center items-center gap-3">
                                            <span className="px-3 py-1 rounded-lg bg-gray-100 text-sm font-medium text-gray-700 group-hover:bg-white group-hover:shadow-sm transition-all">
                                                {g.choreographer_name ??
                                                    "Няма назначен"}
                                            </span>
                                            <ChangeChoreographerDialog
                                                groupId={g.id}
                                                choreographers={choreographers}
                                            />
                                        </div>
                                    </TableCell>

                                    {/* Бутон за история, изравнен вдясно */}
                                    <TableCell className="text-right">
                                        <div className="flex justify-end">
                                            <GroupHistoryDialog
                                                groupId={g.id}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <p className="text-center text-gray-500">
                    Не са намерени групи.
                </p>
            )}
        </div>
    );
}
