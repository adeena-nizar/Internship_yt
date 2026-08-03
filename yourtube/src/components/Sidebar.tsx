"use client";
import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  History,
  User,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useUser } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const { user } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </Button>
      <aside
        className={cn(
          "bg-gray-50 border-r h-full p-4 transition-all duration-300 ease-in-out",
          "fixed md:relative md:translate-x-0",
          isSidebarOpen
            ? "w-64 translate-x-0"
            : "w-20 -translate-x-full md:translate-x-0"
        )}
      >
        <nav className="space-y-2">
          <SidebarLink href="/" icon={<Home />} isOpen={isSidebarOpen}>
            Home
          </SidebarLink>
          <SidebarLink
            href="/explore"
            icon={<Compass />}
            isOpen={isSidebarOpen}
          >
            Explore
          </SidebarLink>
          <SidebarLink
            href="/subscriptions"
            icon={<PlaySquare />}
            isOpen={isSidebarOpen}
          >
            Subscriptions
          </SidebarLink>

          <div className="border-t my-4"></div>

          <SidebarLink
            href="/library"
            icon={<PlaySquare />}
            isOpen={isSidebarOpen}
          >
            Library
          </SidebarLink>
          <SidebarLink
            href="/history"
            icon={<History />}
            isOpen={isSidebarOpen}
          >
            History
          </SidebarLink>
          <SidebarLink
            href="/channel"
            icon={<PlaySquare />}
            isOpen={isSidebarOpen}
          >
            Your channel
          </SidebarLink>
          <SidebarLink
            href="/watch-later"
            icon={<Clock />}
            isOpen={isSidebarOpen}
          >
            Watch later
          </SidebarLink>
          <SidebarLink href="/liked" icon={<ThumbsUp />} isOpen={isSidebarOpen}>
            Liked videos
          </SidebarLink>

          {user && (
            <>
              <div className="border-t my-4"></div>
              <h2
                className={cn(
                  "text-lg font-semibold mb-2",
                  isOpen ? "block" : "hidden"
                )}
              >
                Subscriptions
              </h2>
              {/* Add subscription links here */}
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

const SidebarLink = ({ href, icon, isOpen, children }: any) => (
  <Link href={href}>
    <Button
      variant="ghost"
      className={cn(
        "w-full flex items-center gap-4 transition-all",
        isOpen ? "justify-start" : "justify-center"
      )}
    >
      {icon}
      {isOpen && <span className="font-medium">{children}</span>}
    </Button>
  </Link>
);

export default Sidebar;