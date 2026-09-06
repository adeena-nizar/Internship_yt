"use client";
import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-red-600 p-1.5 rounded-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <span className="text-2xl font-bold tracking-tighter text-black">
        YourTube IN
      </span>
    </div>
  );
};

export default Logo;