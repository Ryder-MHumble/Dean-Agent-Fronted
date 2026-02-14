import type { NotificationItem } from "@/lib/types/app-shell";

export const mockNotifications: NotificationItem[] = [
  {
    title: "舆情激增：负面占比15%",
    time: "10分钟前",
    type: "urgent",
    module: "home",
  },
  {
    title: "科技部AI专项申报截止倒计时",
    time: "30分钟前",
    type: "deadline",
    module: "policy-intel",
  },
  {
    title: "清华AI研究院院长换帅：张亚勤接任",
    time: "1小时前",
    type: "info",
    module: "talent-radar",
  },
  {
    title: "量子计算中心预算超支预警",
    time: "2小时前",
    type: "warning",
    module: "internal-mgmt",
  },
  {
    title: "李张任清华AI副院长",
    time: "3小时前",
    type: "info",
    module: "network",
  },
];
