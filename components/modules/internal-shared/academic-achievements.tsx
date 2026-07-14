"use client";

import PaperList from "@/components/modules/papers/paper-list";
import SkillAccessNote from "@/components/shared/skill-access-note";

export default function AcademicAchievementsModule() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f7f8fa] p-4 md:p-6">
      <div className="mb-3 flex justify-end">
        <SkillAccessNote
          label="查询论文作者 Skill"
          href="https://skills.zgci.org/space/global/zgca-paper-author-query"
        />
      </div>
      <PaperList category="achievements" groupByPublicationDate />
    </div>
  );
}
