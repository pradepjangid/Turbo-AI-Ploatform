"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        aria-label="Toggle theme"
        className="w-9 h-9"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="w-9 h-9 relative"
          >
            {/* Sun Icon */}
            <Sun
              className={`h-4 w-4 transition-all duration-300 absolute 
                ${
                  resolvedTheme === "dark"
                    ? "rotate-90 scale-0 opacity-0"
                    : "rotate-0 scale-100 opacity-100"
                }`}
            />
            {/* Moon Icon */}
            <Moon
              className={`h-4 w-4 transition-all duration-300 absolute
                ${
                  resolvedTheme === "dark"
                    ? "rotate-0 scale-100 opacity-100"
                    : "-rotate-90 scale-0 opacity-0"
                }`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {resolvedTheme === "dark"
            ? "Switch to Light mode"
            : "Switch to Dark mode"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
