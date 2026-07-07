import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Shield } from "lucide-react";
import { InquiryDialog } from "./InquiryDialog";
import { LoginModal } from "./LoginModal";

export function Navbar({ brand = "Nepal Trip", isAdmin = true, isSuperAdmin = true }) {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const pathname = location.pathname;

    const nav = [
        { label: "Home", to: "/" },
        { label: "Packages", to: "/packages" },
        { label: "Discover", to: "/discover" },
        { label: "About", to: "/about" },
        { label: "Gallery", to: "/gallery" },
        { label: "Testimonials", to: "/testimonials" },
        { label: "Contact", to: "/contact" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link
                    to="/"
                    className="flex items-center gap-3 transition-opacity hover:opacity-90"
                    onClick={() => setOpen(false)}
                >
                    <img
                        src="/logo.svg"
                        alt={`${brand} Logo`}
                        className="h-10 w-10 rounded-full object-cover shadow-sm bg-transparent"
                    />
                    <span className="font-serif text-2xl font-medium tracking-tight text-foreground">
                        {brand}
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-6 md:flex">
                    {nav.map((n) => (
                        <Link
                            key={n.to}
                            to={n.to}
                            className={`relative text-sm font-medium transition-all duration-300 ease-in-out hover:text-foreground ${pathname === n.to ? "text-foreground" : "text-muted-foreground"
                                }`}
                        >
                            {n.label}
                            <span
                                className={`absolute -bottom-1 left-0 h-0.5 bg-foreground transition-all duration-300 ease-in-out ${pathname === n.to ? "w-full opacity-100" : "w-0 opacity-0"
                                    }`}
                            />
                        </Link>
                    ))}

                    <div className="ml-2 flex items-center gap-3 border-l border-border/40 pl-6">
                        {/* Desktop Super Admin Shield */}
                        {isSuperAdmin && (
                            <Link
                                to="/superadmin"
                                title="Super Admin Dashboard"
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-purple-50 px-3 text-sm font-semibold text-purple-600 transition-colors hover:bg-purple-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500"
                            >
                                <Shield className="h-4 w-4" />
                                <span className="hidden lg:inline">Super Admin</span>
                            </Link>
                        )}

                        {/* Desktop Admin Shield */}
                        {isAdmin && !isSuperAdmin && (
                            <Link
                                to="/admin"
                                title="Admin Dashboard"
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-red-50 px-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500"
                            >
                                <Shield className="h-4 w-4" />
                                <span className="hidden lg:inline">Admin</span>
                            </Link>
                        )}

                        <InquiryDialog
                            trigger={
                                <button className="inline-flex h-9 items-center justify-center rounded-md bg-[#FA6D16] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 ease-in-out hover:bg-[#E55B05] hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                                    Inquiry
                                </button>
                            }
                        />
                        <LoginModal
                            trigger={
                                <button className="inline-flex h-9 items-center justify-center rounded-md border border-foreground bg-transparent px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-all duration-300 hover:bg-muted hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                                    Log in
                                </button>
                            }
                        />
                    </div>
                </nav>

                {/* Mobile Right-side Controls (Shield + Hamburger) */}
                <div className="flex items-center gap-4 md:hidden">
                    {/* Mobile Super Admin Shield */}
                    {isSuperAdmin && (
                        <Link
                            to="/superadmin"
                            title="Super Admin Dashboard"
                            className="text-purple-600 transition-transform active:scale-95 drop-shadow-sm"
                            onClick={() => setOpen(false)}
                        >
                            <Shield className="h-6 w-6" fill="currentColor" fillOpacity={0.1} />
                        </Link>
                    )}

                    {/* Mobile Admin Shield */}
                    {isAdmin && !isSuperAdmin && (
                        <Link
                            to="/admin"
                            title="Admin Dashboard"
                            className="text-red-600 transition-transform active:scale-95 drop-shadow-sm"
                            onClick={() => setOpen(false)}
                        >
                            <Shield className="h-6 w-6" fill="currentColor" fillOpacity={0.1} />
                        </Link>
                    )}

                    <button
                        className="text-foreground transition-transform duration-300 ease-in-out active:scale-90"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Dropdown */}
            <div
                className={`md:hidden grid transition-[grid-template-rows] duration-300 ease-in-out ${open ? "grid-rows-[1fr] border-b border-border/40" : "grid-rows-[0fr]"
                    }`}
            >
                <div className="overflow-hidden">
                    <nav className="flex flex-col space-y-2 px-4 py-4 bg-background">
                        {nav.map((n) => (
                            <Link
                                key={n.to}
                                to={n.to}
                                onClick={() => setOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ease-in-out ${pathname === n.to
                                    ? "bg-muted text-foreground"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                    }`}
                            >
                                {n.label}
                            </Link>
                        ))}

                        {/* Mobile Buttons added here */}
                        <div className="mt-2 flex flex-col gap-3 border-t border-border/40 pt-4 pb-2">
                            <InquiryDialog
                                trigger={
                                    <button className="inline-flex w-full h-10 items-center justify-center rounded-md bg-[#FA6D16] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 ease-in-out hover:bg-[#E55B05] active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                                        Inquiry
                                    </button>
                                }
                            />
                            <LoginModal
                                trigger={
                                    <button className="inline-flex w-full h-10 items-center justify-center rounded-md border border-foreground bg-transparent px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-all duration-300 hover:bg-muted active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                                        Log in
                                    </button>
                                }
                            />
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}