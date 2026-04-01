import { db } from "@/app/db";
import { groups } from "@/app/db/schema";
import { SearchAndFilterGroups } from "@/components/choreographer/searchAndFilter";
import { GroupSchemaType } from "@/components/schemas/group";
import { Card } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import Link from "next/link";

interface Group extends GroupSchemaType {
    id: number;
}

const COLOR_STYLES = {
    gray: {
        card: "bg-slate-300 border-slate-500",
        text: "text-slate-900",
    },
    blue: {
        card: "bg-blue-500 border-blue-700",
        text: "text-white",
    },
    green: {
        card: "bg-emerald-500 border-emerald-700",
        text: "text-white",
    },
    yellow: {
        card: "bg-amber-400 border-amber-600",
        text: "text-slate-900",
    },
    red: {
        card: "bg-rose-500 border-rose-700",
        text: "text-white",
    },
    purple: {
        card: "bg-violet-500 border-violet-700",
        text: "text-white",
    },
} as const;

const VALID_COLORS = [
    "gray",
    "blue",
    "green",
    "yellow",
    "red",
    "purple",
] as const;
type GroupColor = (typeof VALID_COLORS)[number];

interface GroupsPageProps {
    searchParams?: {
        search?: string;
        color?: string;
    };
}

export default async function GroupsPage({ searchParams }: GroupsPageProps) {
    const { sessionClaims, userId } = await auth();

    const search = searchParams?.search?.trim().toLowerCase() ?? "";
    const color = VALID_COLORS.includes(searchParams?.color as GroupColor)
        ? (searchParams?.color as GroupColor)
        : "";

    let rows: Group[] = [];

    if (sessionClaims?.metadata.role === "choreographer") {
        rows = await db
            .select()
            .from(groups)
            .where(eq(groups.choreographer_id, userId!));
    }

    const filteredRows = rows.filter((group) => {
        const matchesSearch =
            !search || group.name.toLowerCase().includes(search);
        const matchesColor = !color || group.color === color;

        return matchesSearch && matchesColor;
    });

    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-semibold mb-8">Групи</h1>

            <SearchAndFilterGroups
                currentSearch={searchParams?.search ?? ""}
                currentColor={color}
            />

            {filteredRows.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredRows.map((group: Group) => {
                        const colorStyle =
                            COLOR_STYLES[group.color ?? "gray"] ??
                            COLOR_STYLES.gray;

                        return (
                            <Link href={`/groups/${group.id}`} key={group.id}>
                                <Card
                                    className={`h-32 flex items-center justify-center p-6 transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer border ${colorStyle.card}`}
                                >
                                    <h2
                                        className={`text-xl font-semibold text-center ${colorStyle.text}`}
                                    >
                                        {group.name}
                                    </h2>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-8">
                    {search || color
                        ? "Не са намерени групи със тези критерии."
                        : "Не са намерени групи."}
                </p>
            )}
        </div>
    );
}
