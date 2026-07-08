import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Compass, Map, Menu } from "lucide-react";

export function MobileBottomNav({ onToggleDrawer, isDrawerOpen, onCloseDrawer }) {
    const pathname = useLocation().pathname;

    const navItems = [
        { label: "Home", to: "/", icon: Home },
        { label: "Packages", to: "/packages", icon: Map },
        { label: "Discover", to: "/discover", icon: Compass },
    ];

    return (
        <div
            className={`md:hidden fixed bottom-0 left-0 z-50 w-full transition-all duration-300 ease-in-out pb-safe
            ${isDrawerOpen
                    // Glossy effect when drawer is open
                    ? 'bg-background/30 backdrop-blur-xl border-t border-white/20 shadow-[0_-8px_30px_rgba(0,0,0,0.15)]'
                    // Standard effect when closed
                    : 'bg-background/80 backdrop-blur-md border-t border-border/40'
                }`}
        >
            <div className="flex h-16 items-center justify-around px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.to && !isDrawerOpen;
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            onClick={onCloseDrawer} // Auto-close drawer on navigation
                            className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 active:scale-95 ${isActive ? 'text-[#FA6D16]' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <item.icon
                                className="h-5 w-5 transition-transform duration-200"
                                strokeWidth={isActive ? 2.5 : 2}
                                fill="none"
                            />
                            <span className="text-[10px] font-semibold tracking-tight">{item.label}</span>
                            {isActive && (
                                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#FA6D16] animate-in fade-in zoom-in-50 duration-200" />
                            )}
                        </Link>
                    );
                })}

                <button
                    onClick={onToggleDrawer} // Toggle drawer state
                    className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 active:scale-95 ${isDrawerOpen ? 'text-[#FA6D16]' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    <Menu
                        className="h-5 w-5 transition-transform duration-200"
                        strokeWidth={isDrawerOpen ? 2.5 : 2}
                        fill="none"
                    />
                    <span className="text-[10px] font-semibold tracking-tight">Menu</span>
                    {isDrawerOpen && (
                        <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#FA6D16] animate-in fade-in zoom-in-50 duration-200" />
                    )}
                </button>
            </div>
        </div>
    );
}