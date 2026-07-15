"use client";

import SkillAccessNote from "@/components/shared/skill-access-note";
import PaperList from "./paper-list";

export default function PapersModule() {
  return (
    <div className="h-[var(--app-content-height,100dvh)] overflow-hidden bg-[#f7f8fa] px-5 pb-1 pt-5">
      <PaperList
        accessNote={
          <SkillAccessNote
            label="接入情报引擎 skill"
            href="https://skills.zgci.org/space/global/intelligence-engine-api"
          />
        }
      />
    </div>
  );
}
