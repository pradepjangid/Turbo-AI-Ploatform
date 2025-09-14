"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SettingsDialog } from "@/components/settings/settings-dialog";
import { Brain, Menu, Settings } from "lucide-react";
import { UserProfileDropdown } from "../profile/user-profile-dropdown";
import { useAI } from "@/contexts/ai-context";

interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

export function Header({ onMenuToggle, isSidebarOpen }: HeaderProps) {
  const { startNewConversation } = useAI();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-fade-in">
      <div className=" justify-between w-full flex h-12 sm:h-14 items-center px-3 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="md:hidden h-8 w-8 p-0 btn-hover-lift focus-enhanced transition-all duration-200 hover:bg-accent/20"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <Menu
              size={16}
              className="h-6 w-6 transition-transform duration-200 hover:scale-110"
            />
          </Button>

          <div
            onClick={() => startNewConversation()}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-accent flex-shrink-0 transition-all duration-300 group-hover:text-accent/80 group-hover:rotate-12 group-hover:scale-110" />
            <h1 className="font-serif text-base sm:text-lg font-bold text-balance text-foreground truncate transition-colors duration-200 group-hover:text-accent">
              <span className="inline">Turbo AI ⚡</span>
            </h1>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
          <SettingsDialog>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Settings"
              className="h-8 w-8 sm:h-9 sm:w-9 p-0 btn-hover-lift focus-enhanced transition-all duration-200 hover:bg-accent/20 hover:rotate-90"
            >
              <Settings className="h-4 w-4 transition-transform duration-300" />
            </Button>
          </SettingsDialog>
          <ThemeToggle />
          <UserProfileDropdown
            user={{
              name: "Turbo User",
              email: "user@turboai.com",
              isPro: false,
            }}
            credits={{
              current: 5,
              total: 10,
              resetTime: "midnight UTC",
            }}
            workspaces={[
              {
                id: "1",
                name: "Personal Workspace",
                isFree: true,
                isActive: true,
              },
              { id: "2", name: "Team Project", isFree: false, isActive: false },
            ]}
          />
        </div>
      </div>
    </header>
  );
}
