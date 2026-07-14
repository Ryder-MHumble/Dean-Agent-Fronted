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
      className="inline-flex items-center gap-1 text-xs font-medium text-[#1a3a5c] underline-offset-4 hover:underline"
    >
      {label}
      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  );
}
