"use client";

import { usePageUnderDevelopment } from "@/hooks/use-page-under-development";
import SocialActionsView from "@/components/policy/social-actions-view";

export default function SocialActions() {
  const { UnderDevelopmentOverlay } = usePageUnderDevelopment({
    pageName: "社交行动",
  });
  return (
    <>
      <UnderDevelopmentOverlay />
      <SocialActionsView />
    </>
  );
}
