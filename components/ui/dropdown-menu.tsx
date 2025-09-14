import { useClickOutside } from "@/hooks/useClickOutside";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownContext = createContext<DropdownContextType | undefined>(
  undefined
);

const useDropdownContext = (): DropdownContextType => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown components must be used within a Dropdown");
  }
  return context;
};

interface DropdownProps {
  children: React.ReactNode;
}

export function Dropdown({ children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);
  useClickOutside([boxRef], () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });
  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div ref={boxRef} className="relative">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

interface DropdownTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function DropdownTrigger({
  children,
  asChild = false,
}: DropdownTriggerProps) {
  const { isOpen, setIsOpen } = useDropdownContext();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  if (asChild) {
    return React.cloneElement(
      React.Children.only(children) as React.ReactElement,
      {
        onClick: handleClick,
        "aria-expanded": isOpen,
        "aria-haspopup": true,
      }
    );
  }

  return (
    <button onClick={handleClick} aria-expanded={isOpen} aria-haspopup="true">
      {children}
    </button>
  );
}

interface DropdownContentProps {
  children: React.ReactNode;
  className?: string;
}

export function DropdownContent({
  children,
  className = "",
}: DropdownContentProps) {
  const { isOpen } = useDropdownContext();
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = contentRef.current?.parentElement ?? null;
  const [position, setPosition] = useState<"top" | "bottom">("bottom");

  useEffect(() => {
    if (!isOpen || !contentRef.current || !triggerRef) return;

    const triggerRect = triggerRef.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    // Decide placement
    if (spaceBelow < 200 && spaceAbove > spaceBelow) {
      setPosition("top");
    } else {
      setPosition("bottom");
    }
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={contentRef}
      className={`absolute min-w-[10rem] rounded-md border shadow-md z-50 ${
        position === "bottom" ? "top-full mt-2" : "bottom-full mb-2"
      } left-0 ${className}`}
    >
      {children}
    </div>
  );
}

interface DropdownGroupProps {
  children: React.ReactNode;
}

export function DropdownGroup({ children }: DropdownGroupProps) {
  return <div className="flex flex-col gap-1 py-1">{children}</div>;
}

interface DropdownItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function DropdownItem({
  children,
  className = "",
  onClick,
}: DropdownItemProps) {
  const { setIsOpen } = useDropdownContext();

  const handleClick = () => {
    if (onClick) onClick();
    setIsOpen(false);
  };

  return (
    <button
      className={`hover:bg-accent  dark:hover:bg-accent dark:hover:text-accent-foreground flex w-full items-center overflow-y-hidden rounded-sm px-1 py-0.5 text-sm text-white transition-colors focus:text-white focus:outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 rtl:flex-row-reverse rtl:justify-between ${className} `}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
