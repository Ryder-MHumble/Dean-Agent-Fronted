"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  searchLabel?: string;
}

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = "搜索...",
  className,
  inputClassName,
  buttonClassName,
  searchLabel = "搜索",
}: SearchInputProps) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(value.trim());
  }

  function handleClear() {
    onChange("");
    onSearch("");
  }

  return (
    <form
      className={cn("flex min-w-0 items-center gap-2", className)}
      onSubmit={handleSubmit}
    >
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={cn("pl-9 pr-9", inputClassName)}
        />
        {value.trim().length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <Button
        type="submit"
        variant="outline"
        className={cn("shrink-0", buttonClassName)}
      >
        <Search className="h-3.5 w-3.5" />
        {searchLabel}
      </Button>
    </form>
  );
}
