/**
 * 社交平台统一配置
 * 提取自 components/modules/internal-mgmt/sentiment-monitor.tsx
 */

export interface PlatformConfig {
  label: string;
  logoUrl: string;
  color: string;
  bgColor: string;
}

export const PLATFORM_CONFIG: Record<string, PlatformConfig> = {
  xhs: {
    label: "小红书",
    logoUrl: "/logos/xhs.svg",
    color: "text-red-600",
    bgColor: "bg-red-50 border-red-200",
  },
  dy: {
    label: "抖音",
    logoUrl: "/logos/douyin.svg",
    color: "text-gray-800",
    bgColor: "bg-gray-100 border-gray-300",
  },
  bili: {
    label: "哔哩哔哩",
    logoUrl: "/logos/bilibili.svg",
    color: "text-sky-600",
    bgColor: "bg-sky-50 border-sky-200",
  },
  weibo: {
    label: "微博",
    logoUrl: "/logos/weibo.svg",
    color: "text-orange-600",
    bgColor: "bg-orange-50 border-orange-200",
  },
};

const DEFAULT_PLATFORM: PlatformConfig = {
  label: "",
  logoUrl: "",
  color: "text-gray-600",
  bgColor: "bg-gray-50 border-gray-200",
};

export function getPlatformConfig(code: string): PlatformConfig {
  return PLATFORM_CONFIG[code] ?? { ...DEFAULT_PLATFORM, label: code };
}
