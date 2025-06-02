import { Header } from "@/components/header";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import * as React from "react";

export default function AppLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <SignedIn>
                <Header />
                {children}
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
}
