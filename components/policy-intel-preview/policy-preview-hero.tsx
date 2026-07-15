import Image from "next/image";
import { formatPolicyPreviewTimestamp } from "@/lib/policy-preview";
import styles from "./policy-intel-preview.module.css";

interface PolicyPreviewHeroProps {
  total: number;
  opportunityCount: number;
  sourceCount: number;
  generatedAt: string | null;
}

export default function PolicyPreviewHero({
  total,
  opportunityCount,
  sourceCount,
  generatedAt,
}: PolicyPreviewHeroProps) {
  const metrics = [
    { label: "政策总量", value: total.toLocaleString("zh-CN") },
    { label: "政策机会", value: opportunityCount.toLocaleString("zh-CN") },
    { label: "全量信源", value: sourceCount.toLocaleString("zh-CN") },
    { label: "数据更新", value: formatPolicyPreviewTimestamp(generatedAt) },
  ];

  return (
    <header className={styles.hero}>
      <Image
        src="/images/policy-intel-preview-banner.png"
        alt="蓝紫色智能政策情报分析图形"
        fill
        priority
        className={styles.heroImage}
        sizes="(max-width: 767px) 100vw, 1800px"
      />
      <div className={styles.heroContent}>
        <h1>
          洞悉政策风向
          <span>把握未来机遇</span>
        </h1>
        <p className={styles.heroSubtitle}>国家政策 · 北京政策 · 领导讲话 · 政策机会</p>
        <dl className={styles.metrics}>
          {metrics.map((metric) => (
            <div className={styles.metric} key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
