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
    title: "外部领导新增高校领导记录",
    time: "1小时前",
    type: "info",
    module: "talent-radar",
  },
  {
    title: "高校生态信源更新完成",
    time: "2小时前",
    type: "info",
    module: "university-eco",
  },
  {
    title: "社媒情报信号新增",
    time: "3小时前",
    type: "info",
    module: "tech-frontier",
  },
];
