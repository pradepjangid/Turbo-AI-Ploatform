"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "next-themes";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  Settings,
  Palette,
  Zap,
  Shield,
  Database,
  Keyboard,
  Monitor,
  Sun,
  Moon,
} from "lucide-react";

interface SettingsData {
  autoSave: boolean;
  showTimestamps: boolean;
  enableSounds: boolean;
  compactMode: boolean;
  showTokenCount: boolean;
  autoExport: boolean;
  maxHistoryItems: number;
  defaultTemperature: number;
  enableKeyboardShortcuts: boolean;
}

interface SettingsDialogProps {
  children: React.ReactNode;
}

export function SettingsDialog({ children }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const [settings, setSettings] = useLocalStorage<SettingsData>(
    "ai-platform-settings",
    {
      autoSave: true,
      showTimestamps: true,
      enableSounds: false,
      compactMode: false,
      showTokenCount: true,
      autoExport: false,
      maxHistoryItems: 50,
      defaultTemperature: 0.7,
      enableKeyboardShortcuts: true,
    }
  );

  const updateSetting = <K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings({
      autoSave: true,
      showTimestamps: true,
      enableSounds: false,
      compactMode: false,
      showTokenCount: true,
      autoExport: false,
      maxHistoryItems: 50,
      defaultTemperature: 0.7,
      enableKeyboardShortcuts: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] overflow-hidden max-h-[90vh] sm:h-[85vh] sm:max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-2 sm:pr-4  h-[90vh] sm:h-[60vh] mb-4">
          <div className="space-y-4 sm:space-y-6">
            {/* Appearance Settings */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <Palette className="h-3 w-3 sm:h-4 sm:w-4" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Theme</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Choose your preferred color scheme
                    </p>
                  </div>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Compact Mode</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Reduce spacing for more content
                    </p>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) =>
                      updateSetting("compactMode", checked)
                    }
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Show Timestamps</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Display message timestamps
                    </p>
                  </div>
                  <Switch
                    checked={settings.showTimestamps}
                    onCheckedChange={(checked) =>
                      updateSetting("showTimestamps", checked)
                    }
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Show Token Count</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Display token usage information
                    </p>
                  </div>
                  <Switch
                    checked={settings.showTokenCount}
                    onCheckedChange={(checked) =>
                      updateSetting("showTokenCount", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Performance Settings */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Auto-save Conversations</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Automatically save chat history
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) =>
                      updateSetting("autoSave", checked)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Max History Items</Label>
                    <Badge variant="secondary" className="text-xs">
                      {settings.maxHistoryItems}
                    </Badge>
                  </div>
                  <Slider
                    value={[settings.maxHistoryItems]}
                    onValueChange={([value]) =>
                      updateSetting("maxHistoryItems", value)
                    }
                    max={200}
                    min={10}
                    step={10}
                    className="w-full"
                  />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Maximum number of conversations to keep in history
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Default Temperature</Label>
                    <Badge variant="secondary" className="text-xs">
                      {settings.defaultTemperature}
                    </Badge>
                  </div>
                  <Slider
                    value={[settings.defaultTemperature]}
                    onValueChange={([value]) =>
                      updateSetting("defaultTemperature", value)
                    }
                    max={2}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Default creativity level for new conversations
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Data Settings */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                  Privacy & Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Auto-export Conversations</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Automatically backup conversations
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoExport}
                    onCheckedChange={(checked) =>
                      updateSetting("autoExport", checked)
                    }
                  />
                </div>

                <div className="rounded-lg border p-3 bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="font-medium text-xs sm:text-sm">
                      Local Storage
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    All data is stored locally in your browser. No information
                    is sent to external servers.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Accessibility Settings */}
            <Card>
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <Keyboard className="h-3 w-3 sm:h-4 sm:w-4" />
                  Accessibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Keyboard Shortcuts</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Enable keyboard navigation shortcuts
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableKeyboardShortcuts}
                    onCheckedChange={(checked) =>
                      updateSetting("enableKeyboardShortcuts", checked)
                    }
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Sound Effects</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Play sounds for notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableSounds}
                    onCheckedChange={(checked) =>
                      updateSetting("enableSounds", checked)
                    }
                  />
                </div>

                <div className="rounded-lg border p-3 bg-muted/50">
                  <div className="space-y-2 text-xs">
                    <div className="font-medium">Keyboard Shortcuts:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs">
                      <div>Ctrl + Enter: Send message</div>
                      <div>Ctrl + /: Focus prompt</div>
                      <div>Ctrl + K: Open templates</div>
                      <div>Ctrl + S: Save prompt</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <Separator />

        <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={resetSettings}
            className="w-full sm:w-auto bg-transparent"
          >
            Reset to Defaults
          </Button>
          <Button onClick={() => setOpen(false)} className="w-full sm:w-auto">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
