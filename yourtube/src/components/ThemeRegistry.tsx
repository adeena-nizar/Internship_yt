"use client";

import { useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    const context = useContext(UserContext);

    useEffect(() => {
        if (context?.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [context?.theme]);

    return <>{children}</>;
}