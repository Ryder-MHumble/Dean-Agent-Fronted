import type { Metadata } from "next";
import PolicyIntelPreview from "@/components/policy-intel-preview/policy-intel-preview";

export const metadata: Metadata = {
  title: "政策情报预览",
  description: "政策情报高密度工作台预览",
};

export default function PolicyIntelPreviewPage() {
  return <PolicyIntelPreview />;
}
