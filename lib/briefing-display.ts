import type { BriefingSegment } from "@/components/home/ai-daily-summary";
import type { MetricCardData } from "@/components/home/aggregated-metric-cards";

const textReplacements: [RegExp, string][] = [
  [/院领导/g, "负责人"],
  [/院长[，,、：:]/g, ""],
  [/院长/g, "负责人"],
  [/我院/g, "本机构"],
  [/研究院/g, "本机构"],
  [/提示/g, "信息"],
  [/人事动态/g, "外部领导"],
  [/人事变动/g, "领导记录"],
];

function normalizeText(text: string): string {
  return textReplacements.reduce(
    (value, [pattern, replacement]) => value.replace(pattern, replacement),
    text,
  );
}

export function normalizeBriefingParagraphs(
  paragraphs: BriefingSegment[][],
): BriefingSegment[][] {
  return paragraphs.map((segments) =>
    segments.map((segment) => {
      if (typeof segment === "string") {
        return normalizeText(segment);
      }

      const normalizedSegment = {
        ...segment,
        text: normalizeText(segment.text),
      };
      if (segment.contentSnippet) {
        normalizedSegment.contentSnippet = normalizeText(segment.contentSnippet);
      }
      return normalizedSegment;
    }),
  );
}

export function normalizeMetricCards(cards: MetricCardData[]): MetricCardData[] {
  return cards.map((card) => {
    if (card.id !== "talent-radar") return card;

    return {
      ...card,
      title: "外部领导",
      metrics: card.metrics.map((metric) => ({
        ...metric,
        label: normalizeText(metric.label),
      })),
    };
  });
}
