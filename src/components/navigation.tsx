"use client";

import { SignedIn, SignedOut, SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";

export default function Navigation() {
    const navRef = useRef<HTMLElement | null>(null);
    const { user } = useUser();

    useEffect(() => {
        if (navRef.current) {
            const navHeight = navRef.current.offsetHeight;
            document.documentElement.style.setProperty(
                "--nav-height",
                `${navHeight}px`
            );
        }
    }, []);

    const role = user?.publicMetadata?.role as string | undefined;

    return (
        <header
            ref={navRef}
            className="fixed top-0 z-[999] w-full border-b bg-background shadow-sm"
        >
            <nav className="flex items-center justify-between p-4">
                <div className="flex lg:flex-1">
                    <SignedOut>
                        <Link href="/auth">Вписване</Link>
                    </SignedOut>
                    <SignedIn>
                        {role === "admin" ? (
                            <>
                                <Button variant="ghost">
                                    <Link href="/admin">Табло</Link>
                                </Button>
                                <Button variant="ghost">
                                    <Link href="/admin/groups">Групи</Link>
                                </Button>
                            </>
                        ) : (
                            role === "choreographer" && (
                                <Button variant="ghost">
                                    <Link href="/groups">Табло</Link>
                                </Button>
                            )
                        )}
                    </SignedIn>
                </div>
                <SignedIn>
                    <div className="flex items-center gap-2">
                        <SignOutButton />
                    </div>
                </SignedIn>
            </nav>
        </header>
    );
}
