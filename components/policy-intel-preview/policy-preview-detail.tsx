import { ChevronLeft, ExternalLink } from "lucide-react";
import { getPolicyPreviewScore } from "@/lib/policy-preview";
import type { PolicyFeedItem } from "@/lib/types/policy-intel";
import styles from "./policy-intel-preview.module.css";

interface PolicyPreviewDetailProps {
  item: PolicyFeedItem | null;
  onBack: () => void;
}

export default function PolicyPreviewDetail({
  item,
  onBack,
}: PolicyPreviewDetailProps) {
  if (!item) {
    return (
      <div className={styles.detailEmptyState}>
        <button type="button" className={styles.mobileBack} onClick={onBack}>
          <ChevronLeft aria-hidden="true" />
          返回政策列表
        </button>
        <p>暂无可展示的政策详情</p>
      </div>
    );
  }

  const source = item.sourceName ?? item.source_name ?? item.source;
  const hasScore = item.matchScore != null || item.relevance != null;
  const score = getPolicyPreviewScore(item);
  const scoreLabel = item.matchScore != null ? "政策匹配度" : "政策相关度";
  const hasImpactData =
    hasScore || item.funding != null || item.daysLeft != null;

  return (
    <div className={styles.detail}>
      <div className={styles.detailBody}>
        <button type="button" className={styles.mobileBack} onClick={onBack}>
          <ChevronLeft aria-hidden="true" />
          返回政策列表
        </button>

        <header className={styles.detailHeader}>
          <div className={styles.detailChips}>
            <span>{item.category}</span>
            <span>{item.importance}</span>
          </div>
          <h2>{item.title}</h2>
          <div className={styles.detailMeta}>
            <span>{source}</span>
            <time dateTime={item.date}>{item.date}</time>
            {hasScore ? (
              <span>
                {scoreLabel} {score}
              </span>
            ) : null}
            {item.sourceUrl ? (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                查看政策原文
                <ExternalLink aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </header>

        <section className={styles.detailSection}>
          <h3>AI 摘要</h3>
          <p>{item.summary || "暂无政策摘要"}</p>
        </section>

        <section className={styles.detailSection}>
          <h3>政策要点</h3>
          {item.signals && item.signals.length > 0 ? (
            <ul>
              {item.signals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
          ) : (
            <p className={styles.detailEmptyCopy}>暂无结构化政策要点</p>
          )}
        </section>

        <section className={styles.detailSection}>
          <h3>政策解读</h3>
          <p>{item.aiInsight || "暂无政策解读"}</p>
        </section>

        <section className={styles.detailSection}>
          <h3>政策原文</h3>
          <p>{item.content || item.detail || "暂无可展示的政策正文"}</p>
        </section>

        {item.tags.length > 0 ? (
          <div className={styles.detailTags} aria-label="政策标签">
            {item.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        ) : null}
      </div>

      <aside className={styles.infoRail} aria-label="政策信息侧栏">
        <section className={styles.infoSection}>
          <h3>政策信息</h3>
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
            {item.leader ? (
              <div>
                <dt>讲话领导</dt>
                <dd>{item.leader}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className={styles.infoSection}>
          <h3>影响范围</h3>
          {hasImpactData ? (
            <div className={styles.impactData}>
              {hasScore ? (
                <div>
                  <span>
                    {scoreLabel}
                    <strong>{score}</strong>
                  </span>
                  <div
                    className={styles.impactTrack}
                    role="progressbar"
                    aria-label={scoreLabel}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={score}
                  >
                    <i
                      style={{
                        width: `${Math.min(100, Math.max(0, score))}%`,
                      }}
                    />
                  </div>
                </div>
              ) : null}
              {item.funding ? (
                <p>
                  <span>明确资金范围</span>
                  <strong>{item.funding}</strong>
                </p>
              ) : null}
              {item.daysLeft != null ? (
                <p>
                  <span>申报剩余时间</span>
                  <strong>{item.daysLeft} 天</strong>
                </p>
              ) : null}
            </div>
          ) : (
            <p className={styles.infoEmptyCopy}>暂无明确影响范围数据</p>
          )}
        </section>

        <section className={styles.infoSection}>
          <h3>相关附件</h3>
          <p className={styles.infoEmptyCopy}>当前政策未提供可下载附件</p>
        </section>
      </aside>
    </div>
  );
}
