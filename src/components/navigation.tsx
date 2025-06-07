"use client";

import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";

export default function Navigation() {
    const navRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (navRef.current) {
            const navHeight = navRef.current.offsetHeight;
            document.documentElement.style.setProperty(
                "--nav-height",
                `${navHeight}px`
            );
        }
    }, []);

    return (
        <header
            ref={navRef}
            className="fixed top-0 z-[999] w-full border-b bg-background shadow-sm"
        >
            <nav className="flex items-center justify-between p-4">
                <div className="flex lg:flex-1">
                    <Button
                        asChild
                        className="rounded-md bg-foreground px-3 py-2 text-secondary"
                    >
                        <Button>
                            <SignedOut><Link href="/auth">Вписване</Link></SignedOut>{" "}
                            <SignedIn><Link href="/groups">Табло</Link></SignedIn> <ChevronRight />
                        </Button>
                    </Button>
                </div>
                <SignedIn>
                    <div className="flex items-center gap-2"><SignOutButton/></div>
                </SignedIn>
            </nav>
        </header>
    );
}
