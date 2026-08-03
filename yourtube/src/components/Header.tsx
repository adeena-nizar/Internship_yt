"use client";
import { Bell, Menu, Mic, Search, User, VideoIcon, X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
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
import Logo from "./Logo";
import { mockVideos } from "@/data/mock-videos";

const Header = () => {
  const { user, logout, handlegooglesignin } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedSearches = JSON.parse(
      localStorage.getItem("recentSearches") || "[]"
    );
    setRecentSearches(storedSearches);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent, query?: string) => {
    e.preventDefault();
    const finalQuery = (query || searchQuery).trim();
    if (finalQuery) {
      const updatedSearches = [
        finalQuery,
        ...recentSearches.filter((s) => s !== finalQuery),
      ].slice(0, 10);
      setRecentSearches(updatedSearches);
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
      router.push(`/search?q=${encodeURIComponent(finalQuery)}`);
      setIsSearchFocused(false);
    }
  };

  const handleRemoveSearch = (
    e: React.MouseEvent,
    search: string,
    isAll = false
  ) => {
    e.stopPropagation();
    let updatedSearches: string[];
    if (isAll) {
      updatedSearches = [];
    } else {
      updatedSearches = recentSearches.filter((s) => s !== search);
    }
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const debounce = setTimeout(() => {
        const allVideos = [
          ...mockVideos,
          ...(JSON.parse(localStorage.getItem("uploadedVideos") || "[]") as any[]),
        ];
        const filtered = allVideos.filter((v) =>
          v.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 5));
      }, 300);
      return () => clearTimeout(debounce);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white border-b sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-6 h-6" />
        </Button>
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
      </div>

      <div
        ref={searchContainerRef}
        className="hidden md:flex items-center flex-1 max-w-2xl mx-8 relative"
      >
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="rounded-full border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 pl-12 py-2.5 w-full"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </form>
        {isSearchFocused && (
          <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-10">
            {suggestions.length > 0 ? (
              suggestions.map((video) => (
                <div
                  key={video._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => handleSearch(e, video.title)}
                >
                  {video.title}
                </div>
              ))
            ) : (
              <>
                <div className="flex justify-between items-center p-2">
                  <h3 className="font-semibold">Recent searches</h3>
                  <Button
                    variant="link"
                    onClick={(e) => handleRemoveSearch(e, "", true)}
                  >
                    Clear all
                  </Button>
                </div>
                {recentSearches.map((search) => (
                  <div
                    key={search}
                    className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={(e) => handleSearch(e, search)}
                  >
                    <span>{search}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleRemoveSearch(e, search)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-gray-100 ml-4"
        >
          <Mic className="w-5 h-5" />
        </Button>
      </div>

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
                  <Link href={`/channel`}>Your channel</Link>
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