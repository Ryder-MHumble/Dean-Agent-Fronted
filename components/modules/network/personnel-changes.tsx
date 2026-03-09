"use client";

import { usePageUnderDevelopment } from "@/hooks/use-page-under-development";
import NetworkIntelligenceView from "@/components/policy/network-intelligence-view";

export default function PersonnelChanges() {
  const { UnderDevelopmentOverlay } = usePageUnderDevelopment({
    pageName: "人事变动",
  });
  return (
    <>
      <UnderDevelopmentOverlay />
      <NetworkIntelligenceView />
    </>
  );
}
