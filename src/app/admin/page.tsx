import CreateGroupForm from "@/components/admin/forms/createGroup";
import CreateUserForm from "@/components/admin/forms/createUser";
import { checkRole } from "@/utils/roles";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "../db";
import { users } from "../db/schema";

export default async function AdminDashboard() {
    if (!checkRole("admin")) {
        redirect("/");
    }
    const choreographers = await db
        .select({
            id: users.id,
            username: users.username,
        })
        .from(users)
        .where(eq(users.role, "choreographer"));

    return (
        <div className="w-full h-screen-minus-nav flex justify-center items-center gap-4 p-4">
            <CreateUserForm />
            <CreateGroupForm choreographers={choreographers} />
        </div>
    );
}
