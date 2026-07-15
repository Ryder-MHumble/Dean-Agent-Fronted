import Image from "next/image";
import { formatPolicyPreviewTimestamp } from "@/lib/policy-preview";
import styles from "./policy-intel-preview.module.css";

interface PolicyPreviewHeroProps {
  total: number | null;
  opportunityCount: number | null;
  sourceCount: number | null;
  generatedAt: string | null;
}

function formatCount(value: number | null) {
  return value === null ? "--" : value.toLocaleString("zh-CN");
}

export default function PolicyPreviewHero({
  total,
  opportunityCount,
  sourceCount,
  generatedAt,
}: PolicyPreviewHeroProps) {
  const metrics = [
    { label: "政策总量", value: formatCount(total) },
    { label: "政策机会", value: formatCount(opportunityCount) },
    { label: "政策信源", note: "国家/北京", value: formatCount(sourceCount) },
    { label: "数据更新", value: formatPolicyPreviewTimestamp(generatedAt) },
  ];

  return (
    <header className={styles.hero}>
      <div className={styles.heroContent}>
        <h1>
          洞悉政策风向
          <span>把握未来机遇</span>
        </h1>
        <p className={styles.heroSubtitle}>国家政策 · 北京政策 · 领导讲话 · 政策机会</p>
        <dl className={styles.metrics}>
          {metrics.map((metric) => (
            <div className={styles.metric} key={metric.label}>
              <dt>
                {metric.label}
                {metric.note ? <small>{metric.note}</small> : null}
              </dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className={styles.heroArt} aria-hidden="true">
        <Image
          src="/images/policy-intel-preview-banner.png"
          alt=""
          fill
          priority
          className={styles.heroImage}
          sizes="(max-width: 767px) 100vw, 920px"
        />
      </div>
    </header>
  );
}
