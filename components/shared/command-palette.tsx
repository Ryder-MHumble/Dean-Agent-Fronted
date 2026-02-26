"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  FileText,
  Cpu,
  Globe,
  GraduationCap,
  Building,
  Users,
  Calendar,
  LayoutDashboard,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  DollarSign,
  Clock,
  Search,
} from "lucide-react";
import { rawAlerts } from "@/lib/mock-data/home-briefing";

interface CommandPaletteProps {
  onNavigate: (page: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const moduleItems = [
  {
    id: "home",
    label: "院长早报",
    icon: LayoutDashboard,
    keywords: "首页 早报 home briefing",
  },
  {
    id: "policy-intel",
    label: "政策情报",
    icon: FileText,
    keywords: "政策 国家 北京 申报 policy",
  },
  {
    id: "tech-frontier",
    label: "科技前沿",
    icon: Cpu,
    keywords: "技术 科技 AI 前沿 趋势 tech",
  },
  {
    id: "talent-radar",
    label: "人事动态",
    icon: Globe,
    keywords: "人事 动态 人才 领导 变动 高校 政府 personnel",
  },
  {
    id: "university-eco",
    label: "高校生态",
    icon: GraduationCap,
    keywords: "高校 清华 北大 同行 university",
  },
  {
    id: "internal-mgmt",
    label: "院内管理",
    icon: Building,
    keywords: "财务 项目 预算 管理 internal",
  },
  {
    id: "network",
    label: "人脉网络",
    icon: Users,
    keywords: "人脉 关系 联系人 network",
  },
  {
    id: "smart-schedule",
    label: "智能日程",
    icon: Calendar,
    keywords: "日程 会议 邀约 schedule",
  },
];

const quickActions = [
  {
    id: "action-report",
    label: "生成今日工作报告",
    icon: FileText,
    keywords: "报告 report",
  },
  {
    id: "action-schedule",
    label: "查看今日日程",
    icon: Clock,
    keywords: "日程 今天 today",
  },
  {
    id: "action-budget",
    label: "查看预算执行情况",
    icon: DollarSign,
    keywords: "预算 财务 budget",
  },
  {
    id: "action-talent",
    label: "查看最新人事动态",
    icon: UserCheck,
    keywords: "人事 动态 人才 personnel",
  },
  {
    id: "action-trends",
    label: "查看技术趋势简报",
    icon: TrendingUp,
    keywords: "技术 趋势 trend",
  },
];

export default function CommandPalette({
  onNavigate,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen ?? internalOpen;
  const setIsOpen = controlledOnOpenChange ?? setInternalOpen;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setIsOpen]);

  const handleSelect = useCallback(
    (id: string) => {
      setIsOpen(false);
      if (id.startsWith("action-")) {
        // Quick actions map to modules
        const actionMap: Record<string, string> = {
          "action-report": "home",
          "action-schedule": "smart-schedule",
          "action-budget": "internal-mgmt",
          "action-talent": "talent-radar",
          "action-trends": "tech-frontier",
        };
        onNavigate(actionMap[id] || "home");
      } else if (id.startsWith("alert-")) {
        onNavigate("home");
      } else {
        onNavigate(id);
      }
    },
    [onNavigate, setIsOpen],
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden sm:flex h-9 w-72 items-center gap-2 rounded-xl border border-border/50 bg-muted/30 px-3 text-sm text-muted-foreground transition-all duration-200 hover:bg-white hover:shadow-sm hover:border-blue-200"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">全局搜索</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder="搜索模块、告警、快捷操作..." />
        <CommandList>
          <CommandEmpty>未找到相关结果</CommandEmpty>

          <CommandGroup heading="快捷操作">
            {quickActions.map((action) => (
              <CommandItem
                key={action.id}
                value={`${action.label} ${action.keywords}`}
                onSelect={() => handleSelect(action.id)}
              >
                <action.icon className="mr-2 h-4 w-4 text-blue-500" />
                <span>{action.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="导航模块">
            {moduleItems.map((item) => (
              <CommandItem
                key={item.id}
                value={`${item.label} ${item.keywords}`}
                onSelect={() => handleSelect(item.id)}
              >
                <item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="今日告警">
            {rawAlerts.slice(0, 5).map((alert) => (
              <CommandItem
                key={alert.id}
                value={`${alert.title} ${alert.description} ${alert.responsiblePerson || ""}`}
                onSelect={() => handleSelect(`alert-${alert.id}`)}
              >
                <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                <span className="truncate">{alert.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
