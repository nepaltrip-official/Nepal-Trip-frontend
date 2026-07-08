import React, { useState } from "react";
import { MobileDrawer } from "./MobileDrawer";
import { MobileBottomNav } from "./MobileBottomNav";
import { useNavigate } from "react-router-dom"; // Assuming react-router

export function MobileLayout({ children, user, isAuthenticated, exploreNav }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const handleToggleDrawer = () => {
        setIsDrawerOpen((prev) => !prev);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    // Handles the delayed actions from the Drawer
    const handleAction = (action, payload) => {
        if (action === "navigate") {
            navigate(payload);
        } else if (action === "login") {
            // trigger login modal/flow
            console.log("Login triggered");
        } else if (action === "inquiry") {
            // trigger inquiry modal
            console.log("Inquiry triggered");
        }
    };

    return (
        <div className="relative min-h-screen pb-16">
            {/* Page Content */}
            <main>
                {children}
            </main>

            <MobileDrawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                user={user}
                isAuthenticated={isAuthenticated}
                handleLogout={() => console.log("Logging out")}
                exploreNav={exploreNav}
                onTriggerAction={handleAction}
            />

            <MobileBottomNav
                isDrawerOpen={isDrawerOpen}
                onToggleDrawer={handleToggleDrawer}
                onCloseDrawer={handleCloseDrawer}
            />
        </div>
    );
}