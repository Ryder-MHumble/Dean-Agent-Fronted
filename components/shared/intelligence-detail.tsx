import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function IntelligenceDetailHeader({
  badges,
  title,
  meta,
}: {
  badges?: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <header data-intelligence-detail="" className="space-y-3">
      {badges && <div className="flex flex-wrap items-center gap-2">{badges}</div>}
      <h2 className="text-2xl font-semibold leading-8 text-[#1a3a5c]">
        {title}
      </h2>
      {meta && <div className="text-sm leading-6 text-[#667085]">{meta}</div>}
    </header>
  );
}

export function IntelligenceSection({
  title,
  children,
  className,
}: {
  title: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "space-y-3 border-t border-[#e5e9f0] pt-5 first:border-t-0 first:pt-0",
        className,
      )}
    >
      <h3 className="text-lg font-semibold text-[#1a3a5c]">{title}</h3>
      <div className="space-y-3 text-sm leading-6 text-[#344054]">
        {children}
      </div>
    </section>
  );
}
