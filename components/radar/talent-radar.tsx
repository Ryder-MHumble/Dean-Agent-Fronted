"use client"

import { Globe, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TalentRadarProps {
  type?: "policy" | "tech" | "competitor"
}

export default function TalentRadar({ type = "policy" }: TalentRadarProps) {
  const getTitleByType = () => {
    switch (type) {
      case "policy":
        return "政策相关人才雷达"
      case "tech":
        return "技术领域人才雷达"
      case "competitor":
        return "竞对机构人才雷达"
      default:
        return "全球人才回流雷达"
    }
  }
  const scholars = [
    {
      name: "刘凯文 博士",
      field: "计算机视觉",
      institution: "斯坦福大学",
      hIndex: 48,
      returnIntent: "high",
      change: 3,
      changeDir: "up" as const,
    },
    {
      name: "金莎拉 教授",
      field: "NLP / Transformer",
      institution: "DeepMind (伦敦)",
      hIndex: 62,
      returnIntent: "medium",
      change: 0,
      changeDir: "none" as const,
    },
    {
      name: "M. 拉赫曼 博士",
      field: "机器人学",
      institution: "卡内基梅隆 (CMU)",
      hIndex: 35,
      returnIntent: "low",
      change: 1,
      changeDir: "down" as const,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-500" />
          <h2 className="text-base font-semibold text-foreground">
            {getTitleByType()}
          </h2>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-foreground/90"
          >
            地图视图
          </button>
          <button
            type="button"
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50"
          >
            列表视图
          </button>
        </div>
      </div>

      {/* Map placeholder */}
      <Card className="shadow-card hover:shadow-card-hover transition-all rounded-xl border-0">
        <CardContent className="p-0">
          <div className="relative h-48 overflow-hidden rounded-t-xl bg-gradient-to-br from-slate-100 to-blue-50">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 800 400"
                className="h-full w-full opacity-20"
                fill="none"
              >
                <ellipse
                  cx="400"
                  cy="200"
                  rx="350"
                  ry="150"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-slate-400"
                />
                <ellipse
                  cx="400"
                  cy="200"
                  rx="250"
                  ry="100"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-slate-400"
                />
              </svg>
            </div>
            {/* Dots on map */}
            <div className="absolute left-[35%] top-[40%] flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white shadow-lg">
              84
            </div>
            <div className="absolute left-[60%] top-[30%] flex h-6 w-6 items-center justify-center rounded-full bg-blue-400 text-[10px] font-bold text-white shadow">
              32
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 p-4">
            <div className="text-center">
              <p className="text-xs text-blue-600">已追踪学者</p>
              <p className="text-xl font-bold text-foreground">1,248</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-green-600">高回国意向</p>
              <p className="text-xl font-bold text-foreground">42</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scholar Table */}
      <Card className="shadow-card hover:shadow-card-hover transition-all rounded-xl border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              回国意向监控列表
            </CardTitle>
            <button
              type="button"
              className="text-xs text-blue-500 hover:underline transition-colors"
            >
              查看全部
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-[11px] text-muted-foreground">
                  <th className="pb-2 font-medium">学者姓名</th>
                  <th className="pb-2 font-medium">所属机构</th>
                  <th className="pb-2 font-medium text-center">H-INDEX</th>
                  <th className="pb-2 font-medium">回国意向</th>
                  <th className="pb-2 font-medium text-center">排名变动</th>
                </tr>
              </thead>
              <tbody>
                  {scholars.map((s) => (
                      <tr key={s.name} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                              {s.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-foreground">
                                {s.name}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {s.field}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-xs text-muted-foreground">
                          {s.institution}
                        </td>
                        <td className="py-3 text-center text-xs font-medium text-foreground">
                          {s.hIndex}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={`h-full rounded-full ${
                                  s.returnIntent === "high"
                                    ? "bg-red-500 w-[80%]"
                                    : s.returnIntent === "medium"
                                      ? "bg-blue-500 w-[50%]"
                                      : "bg-slate-400 w-[25%]"
                                }`}
                              />
                            </div>
                            <span
                              className={`text-[10px] font-medium ${
                                s.returnIntent === "high"
                                  ? "text-red-600"
                                  : s.returnIntent === "medium"
                                    ? "text-blue-600"
                                    : "text-slate-500"
                              }`}
                            >
                              {s.returnIntent === "high"
                                ? "高"
                                : s.returnIntent === "medium"
                                  ? "中"
                                  : "低"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          {s.changeDir === "up" && (
                            <div className="flex items-center justify-center gap-0.5 text-green-600">
                              <ArrowUpRight className="h-3.5 w-3.5" />
                              <span className="text-xs font-medium">{s.change}</span>
                            </div>
                          )}
                          {s.changeDir === "down" && (
                            <div className="flex items-center justify-center gap-0.5 text-red-600">
                              <ArrowDownRight className="h-3.5 w-3.5" />
                              <span className="text-xs font-medium">{s.change}</span>
                            </div>
                          )}
                          {s.changeDir === "none" && (
                            <Minus className="mx-auto h-4 w-4 text-muted-foreground" />
                          )}
                        </td>
                      </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
