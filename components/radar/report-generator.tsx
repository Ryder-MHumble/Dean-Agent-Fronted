"use client"

import { useState } from "react"
import { FileText, Sparkles, Plus, TrendingUp, DollarSign, Copy, Download, ChevronUp, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StaggerContainer, StaggerItem, AnimatePresence, motion } from "@/components/motion"
import { toast } from "sonner"

const GENERATED_REPORTS: Record<number, string> = {
  0: `**算力基础设施风险评估报告**

一、当前形势
- 美国新一轮出口管制已生效，英伟达A100/H100芯片发货延迟2-3个月
- 国产替代方案（华为昇腾910B）性能达到A100的80%，但生态兼容性不足

二、对我院的影响
- 算力平台二期建设可能延期45天
- 年度算力成本预计增加15-20%
- 3个大模型训练项目进度受影响

三、应对建议
1. 加速国产芯片适配测试（预计2周）
2. 与华为签署战略合作备忘录
3. 申请北京科委算力补贴（匹配度98%）

风险等级：中高 | 建议优先级：紧急`,
  1: `**Q3 人才引进计划报告**

一、目标人才画像
- 具身智能方向：高级研究员2名
- 大模型安全方向：教授级1名
- 算力基础设施：工程师3名

二、重点候选人
1. Dr. Zhang Wei (Stanford) - 明确回国意向，薪酬谈判中
2. Dr. Li Ming (Google DeepMind) - 初步接触，需加强沟通
3. Prof. Wang (MIT) - 已发出邀请，等待回复

三、竞争分析
- 清华AIR本月已引进2名谷歌高级研究员
- 我院薪酬竞争力指数：行业第4（需提升）

四、建议措施
1. 设立专项人才引进基金
2. 优化住房和子女教育配套
3. 加快职称评定绿色通道

预算需求：年度增量 800万 | 建议审批级别：院务会`,
}

function ReportContent({ content }: { content: string }) {
  const lines = content.split("\n")
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const trimmed = line.trim()
        if (!trimmed) return <div key={i} className="h-2" />
        if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
          return (
            <p key={i} className="text-xs font-bold text-foreground pt-1">
              {trimmed.replace(/\*\*/g, "")}
            </p>
          )
        }
        if (/^[一二三四五六七八九十]、/.test(trimmed)) {
          return (
            <p key={i} className="text-[11px] font-semibold text-foreground pt-2">
              {trimmed}
            </p>
          )
        }
        if (trimmed.startsWith("- ")) {
          return (
            <p key={i} className="text-[11px] text-muted-foreground pl-3">
              {trimmed}
            </p>
          )
        }
        if (/^\d+\./.test(trimmed)) {
          return (
            <p key={i} className="text-[11px] text-muted-foreground pl-3">
              {trimmed}
            </p>
          )
        }
        return (
          <p key={i} className="text-[11px] text-muted-foreground font-medium">
            {trimmed}
          </p>
        )
      })}
    </div>
  )
}

interface ReportGeneratorProps {
  type?: "policy" | "tech" | "competitor"
}

export default function ReportGenerator({ type = "policy" }: ReportGeneratorProps) {
  const [generatedReports, setGeneratedReports] = useState<Record<number, boolean>>({})
  const [loadingReports, setLoadingReports] = useState<Record<number, boolean>>({})

  const getTitleByType = () => {
    switch (type) {
      case "policy":
        return "政策报告生成"
      case "tech":
        return "技术报告生成"
      case "competitor":
        return "竞对报告生成"
      default:
        return "内部报告生成器"
    }
  }
  const topics = [
    {
      title: "算力基础设施风险评估",
      desc: "触发原因：新的出口管制新闻及英伟达发货延迟。",
    },
    {
      title: "Q3 人才引进计划",
      desc: "触发原因：欧盟区出现高\"回国意向\"指标。",
    },
  ]

  const handleGenerateReport = (index: number, title: string) => {
    if (generatedReports[index]) {
      // Already generated, toggle collapse/expand
      setGeneratedReports((prev) => {
        const next = { ...prev }
        delete next[index]
        return next
      })
      return
    }

    setLoadingReports((prev) => ({ ...prev, [index]: true }))
    toast.loading(`正在生成「${title}」报告...`, { id: `report-${index}` })

    setTimeout(() => {
      setLoadingReports((prev) => {
        const next = { ...prev }
        delete next[index]
        return next
      })
      setGeneratedReports((prev) => ({ ...prev, [index]: true }))
      toast.success(`「${title}」报告已生成`, { id: `report-${index}` })
    }, 1500)
  }

  const handleCopy = (index: number) => {
    const content = GENERATED_REPORTS[index]
    if (content) {
      navigator.clipboard.writeText(content.replace(/\*\*/g, ""))
      toast.success("报告内容已复制到剪贴板")
    }
  }

  const handleExportPDF = (index: number, title: string) => {
    toast.success(`「${title}」PDF导出已开始，请稍候...`)
  }

  const handleCreateCustom = () => {
    toast.success("自定义报告主题已创建")
  }

  return (
    <div className="space-y-4">
      {/* AI Report Generator */}
      <Card className="shadow-card hover:shadow-card-hover transition-all rounded-xl border border-blue-100/50 bg-blue-50/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-semibold text-foreground">
                {getTitleByType()}
              </span>
            </div>
            <Badge className="bg-blue-500 text-white text-[10px] hover:bg-blue-500 border-0">
              AI 助手
            </Badge>
          </div>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            基于本周监测到的{" "}
            <span className="font-semibold text-foreground">142</span>
            {" "}个信号，AI建议以下董事会报告主题：
          </p>

          <StaggerContainer>
            <div className="mt-4 space-y-3">
              {topics.map((topic, index) => (
                <StaggerItem key={topic.title}>
                  <div className="rounded-lg border border-border/50 bg-white p-3 shadow-sm hover:shadow-md transition-all">
                    <p className="text-xs font-semibold text-foreground">
                      {topic.title}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {topic.desc}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleGenerateReport(index, topic.title)}
                      disabled={loadingReports[index]}
                      className="mt-2 flex items-center gap-1.5 rounded-md border border-border/50 px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingReports[index] ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Sparkles className="h-3 w-3" />
                      )}
                      {loadingReports[index]
                        ? "生成中..."
                        : generatedReports[index]
                          ? "收起"
                          : "起草报告"}
                    </button>

                    <AnimatePresence initial={false}>
                      {generatedReports[index] && GENERATED_REPORTS[index] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/50 p-3">
                            <ReportContent content={GENERATED_REPORTS[index]} />
                            <div className="mt-3 flex items-center gap-2 pt-2 border-t border-blue-100">
                              <button
                                type="button"
                                onClick={() => handleCopy(index)}
                                className="flex items-center gap-1.5 rounded-md bg-white border border-border/50 px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              >
                                <Copy className="h-3 w-3" />
                                复制到剪贴板
                              </button>
                              <button
                                type="button"
                                onClick={() => handleExportPDF(index, topic.title)}
                                className="flex items-center gap-1.5 rounded-md bg-white border border-border/50 px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              >
                                <Download className="h-3 w-3" />
                                导出PDF
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setGeneratedReports((prev) => {
                                    const next = { ...prev }
                                    delete next[index]
                                    return next
                                  })
                                }
                                className="ml-auto flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                              >
                                <ChevronUp className="h-3 w-3" />
                                收起
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

          <button
            type="button"
            onClick={handleCreateCustom}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border/50 py-2.5 text-xs text-muted-foreground transition-colors hover:bg-white hover:text-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            创建自定义主题
          </button>
        </CardContent>
      </Card>

      {/* Market Dynamics */}
      <Card className="shadow-card hover:shadow-card-hover transition-all rounded-xl border-0">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <CardTitle className="text-sm font-semibold">
              市场动态
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="mt-2">
            <p className="text-xs text-muted-foreground">本周融资总额</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">
                $4.5亿
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50">
                <DollarSign className="h-4 w-4 text-green-500" />
              </div>
            </div>
          </div>

          <StaggerContainer>
            <div className="mt-4 space-y-3">
              <StaggerItem>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Anthropic
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      与AWS的新合作细节...
                    </p>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-[10px] border-0">
                    D轮
                  </Badge>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Cohere
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      消息透露2024年底...
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[10px] border-0">
                    IPO传闻
                  </Badge>
                </div>
              </StaggerItem>
            </div>
          </StaggerContainer>
        </CardContent>
      </Card>
    </div>
  )
}
