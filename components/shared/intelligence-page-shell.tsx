import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function IntelligencePageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-intelligence-page=""
      className={cn(
        "flex h-[var(--app-content-height,100dvh)] min-h-0 flex-col gap-3 overflow-y-auto bg-[#f7f8fa] p-3 sm:p-4 md:overflow-hidden lg:p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}
