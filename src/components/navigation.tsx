"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
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
                    <Link href="/" className="-m-1.5 p-1.5">
                        {/* <Image
              alt="ByteBash Logo"
              src="/logo.png"
              width={256}
              height={256}
              className="w-32 dark:invert"
            /> */}
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        asChild
                        className="rounded-md bg-foreground px-3 py-2 text-secondary"
                    >
                        <Link href="/groups">
                            <SignedOut>Вписване</SignedOut>{" "}
                            <SignedIn>Табло</SignedIn> <ChevronRight />
                        </Link>
                    </Button>
                </div>
            </nav>
        </header>
    );
}
