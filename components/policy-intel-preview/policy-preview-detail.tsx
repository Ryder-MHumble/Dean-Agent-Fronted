import { ExternalLink } from "lucide-react";
import {
  IntelligenceDetailHeader,
  IntelligenceSection,
} from "@/components/shared/intelligence-detail";
import {
  getPolicyPreviewDetailSections,
  getPolicyPreviewScore,
  normalizeExternalPolicyUrl,
} from "@/lib/policy-preview";
import type { PolicyFeedItem } from "@/lib/types/policy-intel";
import styles from "./policy-intel-preview.module.css";

interface PolicyPreviewDetailProps {
  item: PolicyFeedItem | null;
}

function getPolicySource(item: PolicyFeedItem) {
  return (
    item.sourceName?.trim() ||
    item.source_name?.trim() ||
    item.source.trim() ||
    "--"
  );
}

export function PolicyPreviewDetailHeader({ item }: { item: PolicyFeedItem }) {
  const source = getPolicySource(item);
  const sourceUrl = normalizeExternalPolicyUrl(item.sourceUrl);
  const hasScore = item.matchScore != null || item.relevance != null;
  const score = getPolicyPreviewScore(item);
  const scoreLabel = item.matchScore != null ? "政策匹配度" : "政策相关度";

  return (
    <IntelligenceDetailHeader
      badges={
        <div className={styles.detailChips}>
          <span>{item.category}</span>
          <span>{item.importance}</span>
        </div>
      }
      title={item.title}
      meta={
        <div className={styles.detailMeta}>
          <span>{source}</span>
          <time dateTime={item.date}>{item.date}</time>
          {hasScore ? (
            <span>
              {scoreLabel} {score}
            </span>
          ) : null}
          {sourceUrl ? (
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
              查看政策原文
              <ExternalLink aria-hidden="true" />
            </a>
          ) : null}
        </div>
      }
    />
  );
}

export default function PolicyPreviewDetail({ item }: PolicyPreviewDetailProps) {
  if (!item) {
    return (
      <div className={styles.detailEmptyState}>
        <p>暂无可展示的政策详情</p>
      </div>
    );
  }

  const source = getPolicySource(item);
  const funding = item.funding?.trim() || null;
  const leader = item.leader?.trim() || null;
  const detailSections = getPolicyPreviewDetailSections(item);

  return (
    <div className={styles.detail}>
      <div className={styles.detailBody}>
        <IntelligenceSection title="AI 摘要">
          <p>{detailSections.aiSummary || "暂无政策摘要"}</p>
        </IntelligenceSection>

        <IntelligenceSection title="政策要点">
          {item.signals && item.signals.length > 0 ? (
            <ul>
              {item.signals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          ) : (
            <p className={styles.detailEmptyCopy}>暂无结构化政策要点</p>
          )}
        </IntelligenceSection>

        <IntelligenceSection title="政策解读">
          <p>{detailSections.interpretation || "暂无政策解读"}</p>
        </IntelligenceSection>

        <IntelligenceSection title="政策原文">
          <p>
            {detailSections.originalContent || "暂无可展示的政策正文"}
          </p>
        </IntelligenceSection>

        <IntelligenceSection title="标签">
          {item.tags.length > 0 ? (
            <div className={styles.detailTags} aria-label="政策标签">
              {item.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          ) : (
            <p className={styles.detailEmptyCopy}>暂无政策标签</p>
          )}
        </IntelligenceSection>
      </div>

      <aside className={styles.infoRail} aria-label="政策信息侧栏">
        <IntelligenceSection title="政策信息" className={styles.infoSection}>
          <dl>
            <div>
              <dt>发布来源</dt>
              <dd>{source}</dd>
            </div>
            <div>
              <dt>发布日期</dt>
              <dd>{item.date}</dd>
            </div>
            <div>
              <dt>政策分类</dt>
              <dd>{item.category}</dd>
            </div>
            <div>
              <dt>重要程度</dt>
              <dd>{item.importance}</dd>
            </div>
            {leader ? (
              <div>
                <dt>讲话领导</dt>
                <dd>{leader}</dd>
              </div>
            ) : null}
            <div>
              <dt>资金范围</dt>
              <dd>{funding ?? "--"}</dd>
            </div>
            <div>
              <dt>申报剩余时间</dt>
              <dd>{item.daysLeft != null ? `${item.daysLeft} 天` : "--"}</dd>
            </div>
          </dl>
        </IntelligenceSection>

        <IntelligenceSection title="影响范围" className={styles.infoSection}>
          <dl className={styles.impactList}>
            {item.matchScore != null ? (
              <div>
                <dt>政策匹配度</dt>
                <dd>
                  <span
                    className={styles.impactTrack}
                    role="progressbar"
                    aria-label="政策匹配度"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={item.matchScore}
                  >
                    <i
                      style={{
                        width: `${Math.min(100, Math.max(0, item.matchScore))}%`,
                      }}
                    />
                  </span>
                  <strong>{item.matchScore}</strong>
                </dd>
              </div>
            ) : null}
            {item.relevance != null ? (
              <div>
                <dt>内容相关度</dt>
                <dd>
                  <span
                    className={styles.impactTrack}
                    role="progressbar"
                    aria-label="内容相关度"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={item.relevance}
                  >
                    <i
                      style={{
                        width: `${Math.min(100, Math.max(0, item.relevance))}%`,
                      }}
                    />
                  </span>
                  <strong>{item.relevance}</strong>
                </dd>
              </div>
            ) : null}
            <div>
              <dt>重要程度</dt>
              <dd>{item.importance}</dd>
            </div>
          </dl>
        </IntelligenceSection>

        <IntelligenceSection title="相关附件" className={styles.infoSection}>
          <p className={styles.infoEmptyCopy}>当前政策未提供可下载附件</p>
        </IntelligenceSection>
      </aside>
    </div>
  );
}
