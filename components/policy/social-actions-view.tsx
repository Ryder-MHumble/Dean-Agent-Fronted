"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import {
  Heart,
  Gift,
  UserCheck,
  Calendar,
  MessageSquare,
  Sparkles,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ---------------------
// Types
// ---------------------
type CategoryType = "congratulate" | "visit" | "thank" | "care";

interface SocialTask {
  id: string;
  group: "urgent" | "routine";
  initials: string;
  avatarColor: string;
  name: string;
  title: string;
  reason: string;
  category: CategoryType;
  categoryLabel: string;
  dueDate: string;
  aiDraft: boolean;
}

// ---------------------
// Mock Data
// ---------------------
const socialTasks: SocialTask[] = [
  {
    id: "1",
    group: "urgent",
    initials: "JC",
    avatarColor: "bg-green-500",
    name: "陈 静",
    title: "恭喜陈静院士当选",
    reason: "新晋中科院院士",
    category: "congratulate",
    categoryLabel: "恭喜",
    dueDate: "建议今日内",
    aiDraft: true,
  },
  {
    id: "2",
    group: "urgent",
    initials: "LZ",
    avatarColor: "bg-blue-500",
    name: "李 张",
    title: "拜访清华AI副院长李张",
    reason: "新任清华AI副院长，需建立合作关系",
    category: "visit",
    categoryLabel: "拜访",
    dueDate: "本周内",
    aiDraft: false,
  },
  {
    id: "3",
    group: "routine",
    initials: "WQ",
    avatarColor: "bg-amber-500",
    name: "王 强",
    title: "感谢王强教授推荐函",
    reason: "为我院3名博士生撰写推荐函",
    category: "thank",
    categoryLabel: "感谢",
    dueDate: "本周内",
    aiDraft: true,
  },
  {
    id: "4",
    group: "routine",
    initials: "SH",
    avatarColor: "bg-violet-500",
    name: "孙 华",
    title: "关怀孙华教授手术恢复",
    reason: "上月接受手术，目前恢复中",
    category: "care",
    categoryLabel: "关怀",
    dueDate: "下周",
    aiDraft: false,
  },
  {
    id: "5",
    group: "routine",
    initials: "ZM",
    avatarColor: "bg-teal-500",
    name: "周 敏",
    title: "恭喜周敏教授论文获奖",
    reason: "ACL 2024最佳论文",
    category: "congratulate",
    categoryLabel: "恭喜",
    dueDate: "本周内",
    aiDraft: true,
  },
];

const recentActivities = [
  {
    date: "11/10",
    action: "发送祝贺信",
    person: "陈静",
    category: "congratulate" as CategoryType,
  },
  {
    date: "11/08",
    action: "拜访",
    person: "王教授",
    category: "visit" as CategoryType,
  },
  {
    date: "11/05",
    action: "发送感谢信",
    person: "李明",
    category: "thank" as CategoryType,
  },
  {
    date: "11/03",
    action: "慰问电话",
    person: "赵老师",
    category: "care" as CategoryType,
  },
  {
    date: "10/30",
    action: "祝贺论文发表",
    person: "周敏",
    category: "congratulate" as CategoryType,
  },
];

// ---------------------
// Category styling map
// ---------------------
const categoryStyles: Record<CategoryType, { bg: string; text: string }> = {
  congratulate: { bg: "bg-green-100", text: "text-green-700" },
  visit: { bg: "bg-blue-100", text: "text-blue-700" },
  thank: { bg: "bg-amber-100", text: "text-amber-700" },
  care: { bg: "bg-violet-100", text: "text-violet-700" },
};

const categoryIcons: Record<CategoryType, React.ReactNode> = {
  congratulate: <Gift className="h-3.5 w-3.5" />,
  visit: <UserCheck className="h-3.5 w-3.5" />,
  thank: <MessageSquare className="h-3.5 w-3.5" />,
  care: <Heart className="h-3.5 w-3.5" />,
};

// ---------------------
// Calendar helper
// ---------------------
function getCalendarData() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();

  // Dates with scheduled social actions (mock)
  const markedDates: Record<number, CategoryType> = {
    3: "visit",
    8: "congratulate",
    12: "thank",
    15: "care",
    20: "congratulate",
    25: "visit",
  };

  const monthNames = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ];

  return {
    year,
    month,
    firstDay,
    daysInMonth,
    today,
    markedDates,
    monthName: monthNames[month],
  };
}

// ---------------------
// Task Card Component
// ---------------------
function TaskCard({ task }: { task: SocialTask }) {
  const style = categoryStyles[task.category];

  return (
    <Card
      className={cn(
        "shadow-card hover:shadow-card-hover rounded-xl border-0 transition-all duration-300 hover:-translate-y-0.5",
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback
              className={cn(
                task.avatarColor,
                "text-white text-xs font-semibold",
              )}
            >
              {task.initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-semibold leading-tight truncate">
                {task.title}
              </h4>
              <Badge
                className={cn(
                  "shrink-0 text-[10px] px-1.5 py-0 border-0",
                  style.bg,
                  style.text,
                )}
              >
                {task.categoryLabel}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {task.reason}
            </p>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {task.dueDate}
                </span>
                {task.aiDraft && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                    <Sparkles className="h-3 w-3" />
                    AI已草拟
                  </span>
                )}
              </div>

              <Button
                size="sm"
                className="h-7 text-xs px-3"
                onClick={() =>
                  toast.success(`已执行: ${task.title}`, {
                    description: `针对${task.name}的${task.categoryLabel}行动已启动`,
                  })
                }
              >
                执行
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------
// Calendar Component
// ---------------------
function SocialCalendar() {
  const { year, monthName, firstDay, daysInMonth, today, markedDates } =
    getCalendarData();
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  const cells: React.ReactNode[] = [];

  // Empty cells for days before the 1st
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className="h-7" />);
  }

  // Day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === today;
    const markedCategory = markedDates[day];

    cells.push(
      <div
        key={day}
        className={cn(
          "h-7 flex flex-col items-center justify-center rounded-md text-xs relative",
          isToday && "bg-primary text-primary-foreground font-bold",
        )}
      >
        {day}
        {markedCategory && (
          <span
            className={cn(
              "absolute bottom-0.5 h-1 w-1 rounded-full",
              categoryStyles[markedCategory].bg.replace("100", "500"),
            )}
          />
        )}
      </div>,
    );
  }

  return (
    <Card className="shadow-card hover:shadow-card-hover rounded-xl border-0 transition-all">
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          社交日历
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {year}年 {monthName}
        </p>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {weekDays.map((wd) => (
            <div
              key={wd}
              className="h-6 flex items-center justify-center text-[10px] font-medium text-muted-foreground"
            >
              {wd}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">{cells}</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["congratulate", "visit", "thank", "care"] as CategoryType[]).map(
            (cat) => {
              const labels: Record<CategoryType, string> = {
                congratulate: "恭喜",
                visit: "拜访",
                thank: "感谢",
                care: "关怀",
              };
              return (
                <div
                  key={cat}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground"
                >
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      categoryStyles[cat].bg.replace("100", "500"),
                    )}
                  />
                  {labels[cat]}
                </div>
              );
            },
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------
// Recent Activity Component
// ---------------------
function RecentActivityLog() {
  return (
    <Card className="shadow-card hover:shadow-card-hover rounded-xl border-0 transition-all">
      <CardHeader className="pb-2 px-4 pt-4">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          最近社交记录
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-2.5">
          {recentActivities.map((activity, idx) => {
            const style = categoryStyles[activity.category];
            return (
              <div key={idx} className="flex items-center gap-2.5 text-xs">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                    style.bg,
                    style.text,
                  )}
                >
                  {categoryIcons[activity.category]}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-muted-foreground">{activity.date}</span>
                  <span className="mx-1">{activity.action}</span>
                  <span className="text-muted-foreground">&rarr;</span>
                  <span className="ml-1 font-medium">{activity.person}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------
// Main Component
// ---------------------
export default function SocialActionsView() {
  const urgentTasks = socialTasks.filter((t) => t.group === "urgent");
  const routineTasks = socialTasks.filter((t) => t.group === "routine");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left column: Social task cards */}
      <div className="col-span-1 lg:col-span-8 space-y-5">
        {/* Urgent Actions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="text-sm font-semibold">紧急行动</h3>
            <Badge className="text-[10px] px-1.5 py-0 border-0 bg-amber-100 text-amber-700">
              {urgentTasks.length}
            </Badge>
          </div>
          <StaggerContainer className="grid grid-cols-2 gap-3">
            {urgentTasks.map((task) => (
              <StaggerItem key={task.id}>
                <div className="rounded-xl bg-amber-50/30 p-2">
                  <TaskCard task={task} />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Routine Actions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold">常规行动</h3>
            <Badge className="text-[10px] px-1.5 py-0 border-0 bg-muted text-muted-foreground">
              {routineTasks.length}
            </Badge>
          </div>
          <StaggerContainer className="grid grid-cols-2 gap-3">
            {routineTasks.map((task) => (
              <StaggerItem key={task.id}>
                <TaskCard task={task} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* Right column: Calendar + Recent Activity */}
      <div className="col-span-1 lg:col-span-4 space-y-4">
        <StaggerContainer staggerDelay={0.12}>
          <StaggerItem>
            <SocialCalendar />
          </StaggerItem>
          <StaggerItem className="mt-4">
            <RecentActivityLog />
          </StaggerItem>
        </StaggerContainer>
      </div>
    </div>
  );
}
