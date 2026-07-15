"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MotionCard } from "@/components/motion";
import type { LucideIcon } from "lucide-react";

export interface SubPageConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  component: React.ComponentType;
  badge?: number;
}

interface ModuleLayoutProps {
  subPages: SubPageConfig[];
  defaultSubPage?: string;
  children?: React.ReactNode;
}

export default function ModuleLayout({
  subPages,
  defaultSubPage,
}: ModuleLayoutProps) {
  const [activeTab, setActiveTab] = useState(
    defaultSubPage || subPages[0]?.id || "",
  );

  return (
    <div className="h-[var(--app-content-height,100dvh)] min-h-0 p-5">
      <MotionCard delay={0} className="h-full min-h-0">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex h-full min-h-0 flex-col gap-4"
        >
          <div className="shrink-0 overflow-x-auto rounded-xl bg-muted/30 p-1">
            <TabsList
              className="grid w-full bg-transparent h-auto gap-1 min-w-max lg:min-w-0"
              style={{
                gridTemplateColumns: `repeat(${subPages.length}, minmax(0, 1fr))`,
              }}
            >
              {subPages.map((page) => {
                const Icon = page.icon;
                return (
                  <TabsTrigger
                    key={page.id}
                    value={page.id}
                    className="flex items-center gap-2 py-2.5 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all"
                  >
                    <Icon className="h-4 w-4" />
                    {page.label}
                    {page.badge !== undefined && page.badge > 0 && (
                      <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-100 px-1.5 text-[10px] font-semibold text-red-600">
                        {page.badge}
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {subPages.map((page) => {
            const Component = page.component;
            return (
              <TabsContent
                key={page.id}
                value={page.id}
                className="mt-0 min-h-0 flex-1"
              >
                <Component />
              </TabsContent>
            );
          })}
        </Tabs>
      </MotionCard>
    </div>
  );
}
