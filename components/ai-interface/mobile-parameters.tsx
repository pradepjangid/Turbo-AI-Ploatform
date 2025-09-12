"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ParametersPanel } from "./parameters-panel"
import { Settings } from "lucide-react"

export function MobileParameters() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="sm:hidden bg-transparent">
          <Settings className="h-4 w-4 mr-2" />
          Parameters
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Model Parameters</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <ParametersPanel />
        </div>
      </SheetContent>
    </Sheet>
  )
}
