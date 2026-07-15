"use client";

import SkillAccessNote from "@/components/shared/skill-access-note";
import AcademicAchievementList from "./academic-achievement-list";

export default function AcademicAchievementsModule() {
  return (
    <div className="h-[var(--app-content-height,100dvh)] overflow-hidden bg-[#f7f8fa] px-5 pb-1 pt-5">
      <AcademicAchievementList
        accessNote={
          <SkillAccessNote
            label="配置论文作者查询 skill"
            href="https://skills.zgci.org/space/global/zgca-paper-author-query"
          />
        }
      />
    </div>
  );
}
