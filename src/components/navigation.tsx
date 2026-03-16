"use client";

import { SignedIn, SignedOut, SignOutButton, useUser } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
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
                `${navHeight}px`,
            );
        }
    }, []);

    const role = user?.publicMetadata?.role as string | undefined;

    return (
        <header
            ref={navRef}
            className="fixed top-0 z-[999] w-full border-b border-white/20 bg-gradient-to-r from-[#D84A44] via-[#C2352F] to-[#A91F1A] shadow-sm"
        >
            <nav className="flex items-center justify-between p-4 text-white text-shadow-sm">
                <div className="flex lg:flex-1">
                    <SignedOut>
                        <Button variant="ghost">
                            <Link
                                href="/auth"
                            >
                                Вписване
                            </Link>
                        </Button>
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
                        <SignOutButton>
                            <Button variant="ghost" className="cursor-pointer flex items-center justify-center gap-2">
                                Изход <LogOut/>
                            </Button>
                        </SignOutButton>
                    </div>
                </SignedIn>
            </nav>
        </header>
    );
}
