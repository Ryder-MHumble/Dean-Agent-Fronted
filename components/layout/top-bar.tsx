"use client";

import { Database, Menu } from "lucide-react";
import { AnimatedTitle } from "@/components/motion";
import { Button } from "@/components/ui/button";

export const INTELLIGENCE_SOURCE_POOL_URL =
  "https://alidocs.dingtalk.com/i/nodes/1zknDm0WRaY6P9nAc2qm6Kaq8BQEx5rG?iframeQuery=entrance%3Ddata%26sheetId%3DhERWDMS%26viewId%3DqvGDAH2";

interface TopBarProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export function TopBar({
  title,
  subtitle,
  onMenuClick,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-white/70 px-4 sm:px-6 backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted/60 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <AnimatedTitle title={title} subtitle={subtitle} />
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Button asChild variant="outline" size="sm">
          <a
            href={INTELLIGENCE_SOURCE_POOL_URL}
            target="_blank"
            rel="noreferrer"
          >
            <Database className="h-4 w-4" />
            情报引擎信源池
          </a>
        </Button>
      </div>
    </header>
  );
}
