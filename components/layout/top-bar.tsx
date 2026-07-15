"use client";

import { Bot, ChevronDown, Copy, Menu, Terminal } from "lucide-react";
import { AnimatedTitle } from "@/components/motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { copyTextToClipboard } from "@/lib/copy-text";
import {
  buildAccessCurl,
  buildAccessPrompt,
  getIntelligenceAccessConfig,
} from "@/lib/intelligence-access";
import { toast } from "sonner";

interface TopBarProps {
  activePage: string;
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export function TopBar({
  activePage,
  title,
  subtitle,
  onMenuClick,
}: TopBarProps) {
  const accessConfig = getIntelligenceAccessConfig(activePage);

  const handleCopy = async (content: string, successMessage: string) => {
    const copied = await copyTextToClipboard(content);
    if (copied) {
      toast.success(successMessage);
      return;
    }
    toast.error("复制失败，请检查浏览器权限");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-white px-4 shadow-sm sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted/60 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0 overflow-hidden">
          <AnimatedTitle title={title} subtitle={subtitle} />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              aria-label="当前页面快速接入"
            >
              <Terminal className="h-4 w-4" />
              <span className="hidden lg:inline">当前页面快速接入</span>
              <ChevronDown className="hidden h-3.5 w-3.5 sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              当前页：{accessConfig.title}
            </DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={() =>
                void handleCopy(
                  buildAccessCurl(accessConfig),
                  "已复制当前页面 curl 命令",
                )
              }
            >
              <Copy className="h-4 w-4" />
              复制 curl 命令
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                void handleCopy(
                  buildAccessPrompt(accessConfig),
                  "已复制当前页面智能体提示词",
                )
              }
            >
              <Bot className="h-4 w-4" />
              复制智能体提示词
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
