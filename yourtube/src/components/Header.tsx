"use client";
import { Bell, Menu, Mic, Search, User, VideoIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

const Header = () => {
  const { user, logout, handlegooglesignin } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-6 h-6" />
        </Button>
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-red-600 p-1.5 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 5.83-.25 2.02-1.13 3.4-2.62 3.96-1.5.56-4.87.83-8.94.83-4.07 0-7.44-.27-8.94-.83-1.49-.56-2.37-1.94-2.62-3.96C.16 15.8 0 14.19 0 12c0-2.19.16-3.8.44-5.83.25-2.02 1.13-3.4 2.62-3.96C4.56 1.65 7.93 1.38 12 1.38c4.07 0 7.44.27 8.94.83 1.49.56 2.37 1.94 2.62 3.96.06.6.14 1.29.2 2.09.06.6.1 1.3.1 1.91l.04 1.09z" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tighter">YouTube</span>
        </Link>
      </div>

      <form
        onSubmit={handleSearch}
        className="hidden md:flex items-center flex-1 max-w-2xl mx-8"
      >
        <div className="flex flex-1">
          <Input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-l-full border-r-0 focus-visible:ring-2 focus-visible:ring-blue-500 pl-6 py-2.5"
          />
          <Button
            type="submit"
            className="rounded-r-full px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 border border-l-0"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-gray-100 ml-4"
        >
          <Mic className="w-5 h-5" />
        </Button>
      </form>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <Button variant="ghost" size="icon" className="rounded-full">
              <VideoIcon className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="w-6 h-6" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.image} />
                    <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link href={`/channel/${user?._id}`}>Your channel</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/history">History</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/liked">Liked videos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/watch-later">Watch later</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-full border-gray-300"
              onClick={handlegooglesignin}
            >
              <User className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-blue-500">Sign in</span>
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;