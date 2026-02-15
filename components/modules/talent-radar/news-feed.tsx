"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ChevronRight, Calendar } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import MasterDetailView from "@/components/shared/master-detail-view";
import { useDetailView } from "@/hooks/use-detail-view";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import PersonCard from "./person-card";
import type { PersonnelNewsItem } from "@/lib/types/talent-radar";

const categoryConfig: Record<string, { color: string; bg: string }> = {
  政府人事: { color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  高校人事: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  人才要闻: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
};

const importanceConfig: Record<string, string> = {
  重要: "bg-red-500",
  关注: "bg-amber-400",
  一般: "bg-gray-300",
};

function groupByDate(
  items: PersonnelNewsItem[],
): { label: string; items: PersonnelNewsItem[] }[] {
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date();
  const dayOfWeek = now.getDay() || 7;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek + 1);
  const weekStartStr = weekStart.toISOString().slice(0, 10);

  const groups = [
    { label: "今天", items: items.filter((i) => i.date === today) },
    {
      label: "本周",
      items: items.filter((i) => i.date < today && i.date >= weekStartStr),
    },
    { label: "更早", items: items.filter((i) => i.date < weekStartStr) },
  ];
  return groups.filter((g) => g.items.length > 0);
}

interface NewsFeedProps {
  items: PersonnelNewsItem[];
}

export default function NewsFeed({ items }: NewsFeedProps) {
  const { selectedItem, open, close, isOpen } = useDetailView<PersonnelNewsItem>();
  const groups = groupByDate(items);

  if (items.length === 0) {
    return (
      <Card className="shadow-card">
        <CardContent className="p-8 text-center text-muted-foreground text-sm">
          暂无匹配的人事动态
        </CardContent>
      </Card>
    );
  }

  return (
    <MasterDetailView
      isOpen={isOpen}
      onClose={close}
      detailHeader={
        selectedItem
          ? {
              title: (
                <h2 className="text-lg font-semibold leading-snug">
                  {selectedItem.title}
                </h2>
              ),
              subtitle: (
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedItem.source} &middot; {selectedItem.date}
                </p>
              ),
            }
          : undefined
      }
      detailContent={
        selectedItem && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  categoryConfig[selectedItem.category]?.bg,
                  categoryConfig[selectedItem.category]?.color,
                )}
              >
                {selectedItem.category}
              </Badge>
              <Badge
                variant="outline"
                className={cn("text-xs", {
                  "bg-red-50 text-red-700 border-red-200":
                    selectedItem.importance === "重要",
                  "bg-amber-50 text-amber-700 border-amber-200":
                    selectedItem.importance === "关注",
                  "bg-gray-50 text-gray-700 border-gray-200":
                    selectedItem.importance === "一般",
                })}
              >
                {selectedItem.importance}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedItem.summary}
            </p>
            {selectedItem.sourceUrl && (
              <a
                href={selectedItem.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                查看原始报道
              </a>
            )}
            {selectedItem.personProfile && (
              <PersonCard profile={selectedItem.personProfile} compact />
            )}
            {selectedItem.relevanceNote && (
              <div className="rounded-lg bg-muted/50 border p-3">
                <span className="text-xs font-medium text-foreground">
                  与我院相关
                </span>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {selectedItem.relevanceNote}
                </p>
              </div>
            )}
          </div>
        )
      }
      detailFooter={
        selectedItem && (
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => {
                toast.success("已标记为重点关注");
                close();
              }}
            >
              标记关注
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.success("已推送至人脉网络")}
            >
              推送至人脉
            </Button>
          </div>
        )
      }
    >
      <div className="space-y-4">
        {groups.map((group) => (
          <Card key={group.label} className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {group.label}
                </CardTitle>
                <Badge variant="secondary" className="text-[10px]">
                  {group.items.length}条
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <StaggerContainer>
                {group.items.map((item) => (
                  <StaggerItem key={item.id}>
                    <button
                      type="button"
                      className={cn(
                        "w-full flex items-start gap-3 p-3 rounded-lg transition-colors group cursor-pointer text-left",
                        selectedItem?.id === item.id
                          ? "bg-blue-50/80 border-l-2 border-blue-500"
                          : "hover:bg-muted/30",
                      )}
                      onClick={() => open(item)}
                    >
                      <span
                        className={cn(
                          "mt-1.5 h-2 w-2 rounded-full shrink-0",
                          importanceConfig[item.importance],
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] shrink-0",
                              categoryConfig[item.category]?.bg,
                              categoryConfig[item.category]?.color,
                            )}
                          >
                            {item.category}
                          </Badge>
                          <span className="text-sm font-medium group-hover:text-blue-600 transition-colors line-clamp-1">
                            {item.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {item.summary}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[10px] text-muted-foreground">
                            {item.source}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {item.date}
                          </span>
                          {item.people.slice(0, 3).map((p) => (
                            <Badge
                              key={p}
                              variant="secondary"
                              className="text-[9px] px-1.5 py-0"
                            >
                              {p}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
                    </button>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </CardContent>
          </Card>
        ))}
      </div>
    </MasterDetailView>
  );
}
