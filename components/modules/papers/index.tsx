"use client";

import SkillAccessNote from "@/components/shared/skill-access-note";
import PaperList from "./paper-list";

export default function PapersModule() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f7f8fa] p-4 md:p-6">
      <div className="mb-3 flex justify-end">
        <SkillAccessNote
          label="接入情报引擎 Skill"
          href="https://skills.zgci.org/space/global/intelligence-engine-api"
        />
      </div>
      <PaperList />
    </div>
  );
}
