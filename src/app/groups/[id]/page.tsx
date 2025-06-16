import { db } from "@/app/db";
import { dancers, groups, users } from "@/app/db/schema";
import AddDancerForm from "@/components/choreographer/addDancer";
import PaymentTracker from "@/components/choreographer/paymentTracker/paymentTracker";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function GroupPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const groupId = Number(id);
    const { userId } = await auth();

    // Load the group
    const [group] = await db
        .select({
            id: groups.id,
            name: groups.name,
            choreographer_id: groups.choreographer_id,
        })
        .from(groups)
        .where(eq(groups.id, groupId));

    if (userId !== group.choreographer_id) {
        redirect("/groups");
    }

    if (!group) {
        redirect("/groups");
    }
    // Load all dancers in this group
    const groupDancers = await db
        .select({
            id: dancers.id,
            name: dancers.name,
            created_at: dancers.created_at,
        })
        .from(dancers)
        .where(eq(dancers.group_id, groupId));

    const [choreoUser] = await db
        .select({ username: users.username })
        .from(users)
        .where(eq(users.id, group.choreographer_id));

    const choreographerName = choreoUser?.username ?? "Unknown";
    return (
        <div className="max-w-6xl mx-auto py-12 space-y-8">
            <h1 className="text-2xl font-semibold">Група: {group.name}</h1>

            <AddDancerForm groupId={groupId} />

            <PaymentTracker
                paramsId={groupId}
                dancers={groupDancers}
                groupName={group.name}
                choreographerId={group.choreographer_id}
                choreographerName={choreographerName}
            />
        </div>
    );
}
