"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Settings,
  UserPlus,
  Plus,
  Gift,
  HelpCircle,
  Palette,
  LogOut,
  ChevronRight,
  Clock,
} from "lucide-react";
import { useTheme } from "next-themes";

function useClickOutside(
  ref: React.RefObject<HTMLDivElement>,
  onClose: () => void
) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onClose]);
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

interface UserProfileDropdownProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    isPro?: boolean;
  };
  credits?: {
    current: number;
    total: number;
    resetTime?: string;
  };
  workspaces?: Array<{
    id: string;
    name: string;
    isFree?: boolean;
    isActive?: boolean;
  }>;
}

export function UserProfileDropdown({
  user = {
    name: "Demo User",
    email: "demo@turboai.com",
    isPro: false,
  },
  credits = {
    current: 5,
    total: 10,
    resetTime: "midnight UTC",
  },
  workspaces = [
    { id: "1", name: "Personal Workspace", isFree: true, isActive: true },
  ],
}: UserProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setOpen(false));
  const { theme } = useTheme();

  const creditsPercentage = (credits.current / credits.total) * 100;

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="relative h-9 w-9 rounded-full flex items-center justify-center overflow-hidden border 
                   bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 
                   transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-medium text-sm text-gray-700 dark:text-gray-200">
            {getInitials(user.name)}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 rounded-xl border shadow-xl overflow-hidden z-50 
                       bg-white text-gray-800 border-gray-200 
                       dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
            role="menu"
          >
            {/* User Info */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <span className="font-semibold text-gray-700 dark:text-gray-100">
                      {getInitials(user.name)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{user.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                {!user.isPro && (
                  <button className="flex-1 px-2 py-1 bg-yellow-500 rounded-md text-sm font-medium hover:bg-yellow-600 transition-colors flex items-center justify-center">
                    <Star className="h-3 w-3 mr-1" />
                    Turn Pro
                  </button>
                )}
                <button className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  Upgrade
                </button>
              </div>
            </div>

            {/* Credits */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Credits</span>
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center">
                  {credits.current} left
                  <ChevronRight className="h-3 w-3 ml-1" />
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mb-2 overflow-hidden">
                <div
                  style={{ width: `${creditsPercentage}%` }}
                  className="h-full bg-green-500 transition-all"
                />
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3" />
                Daily credits reset at {credits.resetTime}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <button className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center">
                  <Settings className="h-3 w-3 mr-1" />
                  Settings
                </button>
                <button className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center">
                  <UserPlus className="h-3 w-3 mr-1" />
                  Invite
                </button>
              </div>
            </div>

            {/* Workspaces */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Workspaces ({workspaces.length})
              </div>
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  className="flex items-center justify-between py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium">
                      {getInitials(workspace.name)}
                    </div>
                    <span className="text-sm">{workspace.name}</span>
                    {workspace.isFree && (
                      <span className="ml-1 px-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded">
                        FREE
                      </span>
                    )}
                  </div>
                  {workspace.isActive && (
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                  )}
                </div>
              ))}

              <div className="flex items-center py-1 px-2 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Create new workspace
              </div>
            </div>

            {/* Menu */}
            <div className="p-2">
              <div className="flex items-center py-2 px-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                <Gift className="h-4 w-4 mr-2 text-blue-500" />
                Get free credits
              </div>
              <div className="flex items-center py-2 px-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                <HelpCircle className="h-4 w-4 mr-2 text-blue-500" />
                Help Center
              </div>
              <div className="flex items-center py-2 px-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                <Palette className="h-4 w-4 mr-2 text-blue-500" />
                Appearance
                <ChevronRight className="h-3 w-3 ml-auto" />
              </div>
              <hr className="my-2 border-gray-200 dark:border-gray-700" />
              <div className="flex items-center py-2 px-2 cursor-pointer text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-900/20 rounded-md transition-colors">
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
