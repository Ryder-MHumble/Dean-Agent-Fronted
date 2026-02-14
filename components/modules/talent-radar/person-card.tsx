"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ArrowRight } from "lucide-react";
import type { PersonProfile } from "@/lib/types/talent-radar";

interface PersonCardProps {
  profile: PersonProfile;
  compact?: boolean;
}

export default function PersonCard({ profile, compact = false }: PersonCardProps) {
  return (
    <Card className={compact ? "border bg-muted/20" : "shadow-card"}>
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="flex items-start gap-3">
          <div
            className={`flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 font-bold shrink-0 ${
              compact ? "h-10 w-10 text-sm" : "h-12 w-12 text-base"
            }`}
          >
            {profile.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold ${compact ? "text-sm" : "text-base"}`}>
              {profile.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Building2 className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {profile.organization}
              </span>
              <span className="text-xs font-medium">{profile.title}</span>
            </div>
            {profile.previousOrganization && (
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
                <span>
                  {profile.previousOrganization} {profile.previousTitle}
                </span>
                <ArrowRight className="h-3 w-3" />
                <span className="text-foreground">
                  {profile.organization} {profile.title}
                </span>
              </div>
            )}
            {profile.field && (
              <Badge variant="secondary" className="text-[10px] mt-1.5">
                {profile.field}
              </Badge>
            )}
            {profile.background && !compact && (
              <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                {profile.background}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
