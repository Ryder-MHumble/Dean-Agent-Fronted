"use client";

import { AlertTriangle, TrendingUp, Clock, Share2, BookmarkIcon, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function NewsFeed() {
  return (
    <Card className="col-span-full">
      <CardContent className="p-0">
        <Tabs defaultValue="tech" className="w-full">
          <div className="flex items-center justify-between border-b px-5 pt-4 pb-0 overflow-x-auto">
            <TabsList className="h-auto bg-transparent p-0 shrink-0">
              <TabsTrigger
                value="ops"
                className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-0 text-sm data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none whitespace-nowrap"
              >
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-blue-500" />
                <span className="hidden sm:inline">{"内部运营监控"}</span>
                <span className="sm:hidden">{"运营"}</span>
              </TabsTrigger>
              <TabsTrigger
                value="tech"
                className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-0 text-sm data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none whitespace-nowrap"
              >
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-green-500" />
                <span className="hidden sm:inline">{"全球科技情报"}</span>
                <span className="sm:hidden">{"科技"}</span>
              </TabsTrigger>
            </TabsList>
            <button type="button" className="text-xs text-blue-500 hover:underline shrink-0 ml-3 pb-3">
              <span className="hidden sm:inline">{"查看所有来源"}</span>
              <span className="sm:hidden">{"全部"}</span>
            </button>
          </div>

          <TabsContent value="tech" className="mt-0 p-5">
            <div className="space-y-5">
              <div className="overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white">
                <Badge className="bg-blue-500 text-[10px] text-white hover:bg-blue-500">{"重大突破"}</Badge>
                <h3 className="mt-3 text-lg font-semibold leading-snug">
                  {"DeepMind 发布 AlphaFold 更新：蛋白质折叠预测准确率突破 98.5%"}
                </h3>
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {"2 小时前"}
                  </span>
                  <span>{"自然 (Nature) 期刊"}</span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button type="button" className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white">
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button type="button" className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white">
                    <BookmarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 rounded-xl border border-border bg-white p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {"YL"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{"Yann LeCun (杨立昆)"}</span>
                    <span className="text-xs text-muted-foreground">{"@ylecun"}</span>
                    <div className="h-3.5 w-3.5 rounded-full bg-blue-500 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="h-2 w-2 text-white" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-foreground leading-relaxed">
                    {"大型语言模型(LLM)的未来不仅仅在于参数规模的扩大，更在于建立世界模型和推理能力。"}
                    <span className="text-blue-500">{" #AI #机器学习"}</span>
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{"1.2k"}</span>
                    <span>{"405 转发"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{"生物科技 IPO 趋势上扬"}</span>
                    <span className="text-xs text-muted-foreground">{"1小时前"}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{"市场分析 . 第三季度简报"}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge variant="secondary" className="bg-green-50 text-[10px] text-green-700">{"纳斯达克: GINK +4.2%"}</Badge>
                    <Badge variant="secondary" className="bg-green-50 text-[10px] text-green-700">{"纽交所: RXRX +2.1%"}</Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ops" className="mt-0 p-5">
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50/50 p-4">
                <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">{"大模型基座项目采购审批延期15天"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{"卡点：采购审批停滞于李某某处，建议直接施压"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50/50 p-4">
                <Shield className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">{"量子计算中心二期设备到货"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{"预计下周完成安装调试，项目进展正常"}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
