"use client";

import SkillAccessNote from "@/components/shared/skill-access-note";
import IntelligencePageShell from "@/components/shared/intelligence-page-shell";
import AcademicAchievementList from "./academic-achievement-list";

export default function AcademicAchievementsModule() {
  return (
    <IntelligencePageShell>
      <AcademicAchievementList
        accessNote={
          <SkillAccessNote
            label="配置论文作者查询 skill"
            href="https://skills.zgci.org/space/global/zgca-paper-author-query"
          />
        }
      />
    </IntelligencePageShell>
  );
}
