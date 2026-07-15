"use client";

import SkillAccessNote from "@/components/shared/skill-access-note";
import IntelligencePageShell from "@/components/shared/intelligence-page-shell";
import PaperList from "./paper-list";

export default function PapersModule() {
  return (
    <IntelligencePageShell>
      <PaperList
        accessNote={
          <SkillAccessNote
            label="接入情报引擎 skill"
            href="https://skills.zgci.org/space/global/intelligence-engine-api"
          />
        }
      />
    </IntelligencePageShell>
  );
}
