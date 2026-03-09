"use client";

import { usePageUnderDevelopment } from "@/hooks/use-page-under-development";
import SchedulePage from "@/components/pages/schedule";

export default function ScheduleOverview() {
  const { UnderDevelopmentOverlay } = usePageUnderDevelopment({
    pageName: "日程总览",
  });
  return (
    <>
      <UnderDevelopmentOverlay />
      <SchedulePage />
    </>
  );
}
