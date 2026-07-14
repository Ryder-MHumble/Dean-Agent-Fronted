import { ExternalLink } from "lucide-react";

interface SkillAccessNoteProps {
  label: string;
  href: string;
}

export default function SkillAccessNote({
  label,
  href,
}: SkillAccessNoteProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-[#1a3a5c] hover:bg-slate-50"
    >
      {label}
      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  );
}
