import type {
  PolicyTrackingItem,
  PolicyMatchItem,
} from "@/lib/types/policy-tracking";

export const policyData: PolicyTrackingItem[] = [
  {
    id: "1",
    level: "national",
    agency: "科技部",
    agencyColor: "bg-blue-100 text-blue-700",
    date: "2023-11-14",
    title: "关于印发《科技伦理治理指南(2023年修订)》的通知",
    description:
      "科技部发布了关于生成式AI伦理、数据隐私标准和跨境数据传输协议的更新指南。",
    impact: "高影响",
    impactColor: "bg-red-100 text-red-700",
    actionLabel: "AI 影响分析",
    insights: [
      {
        label: "直接行动",
        color: "text-green-600",
        text: '需要立即审查我院"Lab B"数据协议。Q4项目资金可能取决于合规性。',
      },
      {
        label: "提示",
        color: "text-yellow-600",
        text: "第4.2条暗示更严格的国际合作限制，未经事先批准不得进行。",
      },
    ],
    tags: ["#AI伦理", "#合规"],
    sourceUrl:
      "https://www.most.gov.cn/xxgk/xinxifenlei/fdzdgknr/fgzc/gfxwj/gfxwj2023/202311/t20231114_example.htm",
  },
  {
    id: "2",
    level: "beijing",
    agency: "发改委",
    agencyColor: "bg-green-100 text-green-700",
    date: "2023-11-13",
    title: "北京市高级别自动驾驶试点区发展规划",
    insights: [
      {
        label: "机遇",
        color: "text-blue-600",
        text: '为交通系统部门开辟了新的市政拨款窗口。与当前"智慧城市"计划一致。',
      },
    ],
    sourceUrl:
      "https://fgw.beijing.gov.cn/fgwzc/zcjd/202311/t20231113_example.htm",
  },
  {
    id: "3",
    level: "national",
    agency: "教育部",
    agencyColor: "bg-purple-100 text-purple-700",
    date: "2023-11-12",
    title: "关于加强高校基础研究人才培养的通知",
    description: "关于博士项目资助分配的一般性政策更新。",
    sourceUrl:
      "https://www.moe.gov.cn/srcsite/A22/s7065/202311/t20231112_example.htm",
  },
  {
    id: "4",
    level: "beijing",
    agency: "北京科委",
    agencyColor: "bg-amber-100 text-amber-700",
    date: "2023-11-11",
    title: "北京算力基础设施补贴政策发布",
    description:
      "面向高校和科研院所的算力基础设施建设补贴，与我院算力平台二期高度匹配。",
    impact: "高影响",
    impactColor: "bg-red-100 text-red-700",
    actionLabel: "组织申报",
    insights: [
      {
        label: "机遇",
        color: "text-green-600",
        text: "匹配度98%，预估资金规模500-1000万，建议紧急组织申报。",
      },
    ],
    tags: ["#算力", "#补贴"],
    sourceUrl: "https://kw.beijing.gov.cn/art/2023/11/11/art_example.html",
  },
];

export const policyMatchData: PolicyMatchItem[] = [
  {
    id: "m1",
    title: "算力基础设施补贴",
    matchScore: 98,
    funding: "500-1000万",
    daysRemaining: 12,
  },
  {
    id: "m2",
    title: "AI伦理合规专项",
    matchScore: 85,
    funding: "200-500万",
    daysRemaining: 25,
  },
  {
    id: "m3",
    title: "基础研究人才计划",
    matchScore: 72,
    funding: "100-300万",
    daysRemaining: 40,
  },
];
