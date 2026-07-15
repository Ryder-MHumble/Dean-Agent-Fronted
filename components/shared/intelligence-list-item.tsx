"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type IntelligenceListItemProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-current"
> & {
  selected?: boolean;
};

const IntelligenceListItem = forwardRef<
  HTMLButtonElement,
  IntelligenceListItemProps
>(function IntelligenceListItem(
  { selected = false, className, type = "button", ...props },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      data-intelligence-item=""
      aria-current={selected || undefined}
      className={cn(
        "w-full rounded-lg border border-[#e5e9f0] bg-white p-4 text-left transition-colors hover:border-[#cbd5e1] hover:bg-[#f8fafc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3156d8] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        selected && "border-[#6f83ff] bg-[#f1f4ff]",
        className,
      )}
    />
  );
});

export default IntelligenceListItem;
