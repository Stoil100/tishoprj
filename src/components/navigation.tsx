"use client";

import { SignedIn, SignedOut, SignOutButton, useUser } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Image from "next/image";
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
            <nav className="flex items-center px-4 h-[64px] text-white text-shadow-sm">
                
                {/* ЛЯВА ЧАСТ (лого) */}
                <Link href="/" className="flex items-center h-full">
                    <Image
                        src="/Logo.png"
                        alt="Logo"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="h-[48px] w-auto object-contain"
                        priority
                    />
                </Link>

                {/* ДЯСНА ЧАСТ (ВСИЧКИ бутони) */}
                <div className="flex items-center gap-4 ml-auto">
                    
                    <SignedOut>
                        <Button variant="ghost">
                            <Link href="/auth">Вписване</Link>
                        </Button>
                    </SignedOut>

                    <SignedIn>
                        {role === "admin" && (
                            <>
                                <Button variant="ghost">
                                    <Link href="/admin">Табло</Link>
                                </Button>
                                <Button variant="ghost">
                                    <Link href="/admin/groups">Групи</Link>
                                </Button>
                            </>
                        )}

                        {role === "choreographer" && (
                            <Button variant="ghost">
                                <Link href="/groups">Табло</Link>
                            </Button>
                        )}

                        <SignOutButton>
                            <Button
                                variant="ghost"
                                className="cursor-pointer flex items-center gap-2"
                            >
                                Изход <LogOut />
                            </Button>
                        </SignOutButton>
                    </SignedIn>

                </div>
            </nav>
        </header>
    );
}