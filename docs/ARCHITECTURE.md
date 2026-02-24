# DeanAgent 项目架构文档

> 完整的项目架构说明文档 | 版本 v1.0.0 | 更新日期: 2026-02-22

## 目录

- [项目概览](#项目概览)
- [架构总览](#架构总览)
- [技术栈详解](#技术栈详解)
- [8大功能模块](#8大功能模块)
- [关键设计模式](#关键设计模式)
- [组件系统](#组件系统)
- [开发工作流](#开发工作流)
- [性能优化](#性能优化)
- [安全考虑](#安全考虑)

---

## 项目概览

**智策云端** 是一个 AI 驱动的研究院院长智能决策辅助平台。

### 核心定位

- **决策中心**: 聚合多源数据,提供决策洞察
- **情报引擎**: 追踪政策、技术、人才、高校动态
- **智能助手**: AI 分析、邀约评估、时间管理
- **指挥平台**: 院内管理、人脉网络、日程协调

### 技术特点

- **现代化框架**: Next.js 16 + React 19 + TypeScript 5.7
- **高性能开发**: Turbopack 构建工具
- **企业级 UI**: shadcn/ui 组件库(49个组件)
- **流畅动画**: Framer Motion 12
- **类型安全**: 全栈 TypeScript 严格模式

---

## 架构总览

### 系统架构

项目采用经典的前端 MVC 分层架构:

```
┌─────────────────────────────────────────┐
│         App Shell (导航层)              │
│   侧边栏 + 顶栏 + 全局搜索 + 通知中心    │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         8 大功能模块 (业务层)            │
│  院长早报 | 政策情报 | 科技前沿 | ...   │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│       共享组件库 (组件层)                │
│  Master-Detail | DataCard | AI面板 ...  │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│       shadcn/ui (基础组件层)            │
│  Button | Input | Dialog | Table ...   │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         数据层 (Mock + Hooks)           │
│  TypeScript Types + Custom Hooks       │
└─────────────────────────────────────────┘
```

### 路由架构

采用 **客户端 SPA 路由** 模式:

- 由 `app/page.tsx` 中的 `activePage` 状态驱动
- 配合 Framer Motion 实现流畅页面转场
- 模块切换无刷新,提升用户体验

```typescript
// 路由流程
AppShell (侧边栏) 
  → onNavigate(pageId) 
  → setActivePage(pageId) 
  → 渲染对应模块组件
```

---

## 技术栈详解

### 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| **Next.js** | 16.1.6 | React 全栈框架,App Router 模式 |
| **React** | 19.2.3 | UI 库,支持并发特性 |
| **TypeScript** | 5.7.3 | 类型系统,严格模式 |
| **Turbopack** | - | 构建工具,比 Webpack 快 700 倍 |

### UI 组件库

| 技术 | 版本 | 用途 |
|------|------|------|
| **shadcn/ui** | - | 组件库(49个组件) |
| **Radix UI** | 多版本 | 无障碍组件原语 |
| **Tailwind CSS** | 3.4.17 | 样式框架 |
| **Framer Motion** | 12.34.0 | 动画库 |
| **Lucide React** | 0.544.0 | 图标库 |

### 数据可视化

| 技术 | 版本 | 用途 |
|------|------|------|
| **Recharts** | 2.15.0 | 图表库 |

### 表单 & 验证

| 技术 | 版本 | 用途 |
|------|------|------|
| **React Hook Form** | 7.54.1 | 表单管理 |
| **Zod** | 3.24.1 | 数据验证 |

### 其他工具库

| 技术 | 版本 | 用途 |
|------|------|------|
| **date-fns** | 4.1.0 | 日期处理 |
| **cmdk** | 1.1.1 | 命令面板 |
| **sonner** | 1.7.1 | Toast 通知 |
| **next-themes** | 0.4.6 | 主题管理 |

---

## 8大功能模块

### 模块总览

| 模块ID | 模块名称 | 子页面数 | 核心功能 |
|--------|---------|---------|---------|
| **home** | 院长早报 | 1 | AI综述、告警、指标卡、时间线 |
| **policy-intel** | 政策情报 | 4 | 政策订阅、机会匹配、追踪、讲话解读 |
| **tech-frontier** | 科技前沿 | 4 | 技术趋势、行业动态、KOL、机会备忘 |
| **talent-radar** | 人才雷达 | 3 | 海归追踪、人才指数、学术流动 |
| **university-eco** | 高校生态 | 3 | 同行对标、科研成果、人事变动 |
| **internal-mgmt** | 院内管理 | 5 | 财务、项目、学生、舆情、绩效 |
| **network** | 人脉网络 | 3 | 人事变动、关系维护、社交建议 |
| **smart-schedule** | 智能日程 | 4 | 日程总览、ROI评估、冲突化解、活动推荐 |

### 1. 院长早报 (home)

**定位**: 指挥中心首页,全局态势感知

**组件结构**:
```
components/modules/home/
└── index.tsx (单页面模块,整合 4 个子组件)
    ├── AI 每日综述
    ├── 必须关注告警
    ├── 聚合指标卡片
    └── 今日时间线
```

**核心功能**:
- AI 每日综述(政策/人才/风险/机会分段)
- 必须关注告警(紧急事项、截止日、人事变动)
- 聚合指标卡(项目进度、财务概览、人才流动、舆情监测)
- 今日时间线(重要会议、政策发布、人事动态)

**数据源**: `lib/mock-data/home-briefing.ts`

---

### 2. 政策情报 (policy-intel)

**定位**: 国家/北京政策追踪,政策机会智能匹配

**子页面结构**:

| 子页面 | 文件 | 说明 |
|--------|------|------|
| 政策订阅流 | policy-feed.tsx | RSS 风格政策聚合流,支持分类筛选、信源过滤 |
| 政策机会匹配 | matching.tsx | AI 匹配院内需求的政策机会,优先级评分 |
| 政策追踪看板 | tracking.tsx | 关注政策的生命周期追踪 |
| 领导讲话解读 | speeches.tsx | 领导讲话要点提取与趋势分析 |

**核心特性**:
- **Master-Detail 模式**: 左侧列表 + 右侧详情面板
- **多维筛选**: 分类(国家/北京/领导讲话) + 信源筛选(hover 下拉)
- **优先级评分**: 基于匹配度、时效性、重要性的综合打分
- **AI 分析**: 每条政策提供 AI 机会洞察

**实现示例**:
```typescript
// components/modules/policy-intel/index.tsx
export default function PolicyIntelModule() {
  const { items, isLoading } = usePolicyFeed();
  const [activeCategory, setActiveCategory] = useState("全部");
  const [selectedSources, setSelectedSources] = useState(new Set());

  const filtered = useMemo(() => {
    let result = items;
    if (category !== "全部") 
      result = result.filter(n => n.category === category);
    if (sources.size > 0) 
      result = result.filter(n => sources.has(n.source));
    return result;
  }, [items, category, sources]);

  return <PolicyFeed items={filtered} />;
}
```

**数据源**: `lib/mock-data/policy-intel.ts`

---

### 3. 科技前沿 (tech-frontier)

**定位**: 技术趋势分析、行业动态、热点话题与 KOL

**子页面**:
- 技术趋势分析 (trends.tsx)
- 行业动态追踪 (industry.tsx)
- KOL & 热点话题 (kol.tsx)
- 机会与备忘 (opportunities.tsx)

**核心特性**:
- 趋势图表: 使用 Recharts 展示技术热度趋势
- KOL 追踪: 关键人物观点聚合
- 热点标签云: 动态展示高频关键词

---

### 4. 人才雷达 (talent-radar)

**定位**: 海外人才回流追踪、人才指数、学术流动分析

**子页面**:
- 海外人才回流追踪 (returnees.tsx)
- 人才指数与趋势 (index-trends.tsx)
- 学术流动分析 (mobility.tsx)

**核心特性**:
- 人才画像: 学术背景、研究方向、影响力指标
- 流动可视化: Sankey 图展示人才流动路径
- 预测模型: 基于历史数据的人才流动预测

---

### 5. 高校生态 (university-eco)

**定位**: 同行动态对标、科研成果追踪、人事人才变动

**子页面**:
- 同行动态对标 (peer-dynamics.tsx)
- 科研成果追踪 (research-tracking.tsx)
- 人事与人才变动 (personnel-talent.tsx)

**核心特性**:
- 对标分析: 多维度对比竞品高校
- 成果监测: 自动抓取高影响力论文
- 人事预警: 关键人才流动提醒

---

### 6. 院内管理 (internal-mgmt)

**定位**: 院内运营的全景监控与管理中枢

**子页面**:
- 财务概览 (finance.tsx)
- 项目督办 (projects.tsx)
- 学生事务 (students.tsx)
- 舆情安全 (sentiment.tsx)
- 中心绩效 (performance.tsx)

**核心特性**:
- 实时仪表盘: 关键指标实时监控
- 进度甘特图: 项目时间线可视化
- 舆情热力图: 舆情分布与趋势

---

### 7. 人脉网络 (network)

**定位**: 人事变动感知、关系维护管理、社交行动建议

**子页面**:
- 人事变动感知 (changes.tsx)
- 关系维护管理 (maintain.tsx)
- 社交行动建议 (actions.tsx)

**核心特性**:
- 关系图谱: D3.js 可视化人脉网络
- 互动日历: 自动记录会面、通话、邮件
- 智能提醒: 生日、节日、任职周年提醒

---

### 8. 智能日程 (smart-schedule)

**定位**: 日程 ROI 评估、邀约智能分析、时间冲突化解

**子页面**:
- 日程总览 (overview.tsx)
- 邀约 ROI 评估 (roi.tsx)
- 时间冲突化解 (conflicts.tsx)
- 活动推荐 (recommendations.tsx)

**核心特性**:
- ROI 算法: 基于人脉价值、议题相关性、时间成本的综合评分
- 冲突检测: 自动识别时间、地点、资源冲突
- 智能推荐: 基于历史偏好的活动推荐引擎

---

## 关键设计模式

### 1. Master-Detail 模式

**定义**: 左侧列表 + 右侧详情面板的经典布局模式

**应用场景**:
- 政策情报 → 政策订阅流
- 高校生态 → 同行动态对标
- 高校生态 → 科研成果追踪
- 高校生态 → 人事与人才变动

**实现组件**: `components/shared/master-detail-view.tsx`

**使用示例**:
```typescript
<MasterDetailView
  masterContent={
    <DateGroupedList
      items={items}
      renderItem={(item) => (
        <DataItemCard
          isSelected={selectedId === item.id}
          onClick={() => setSelectedId(item.id)}
        >
          {/* 列表项内容 */}
        </DataItemCard>
      )}
    />
  }
  detailContent={
    selectedItem && (
      <DetailArticleBody
        title={selectedItem.title}
        source={selectedItem.source}
        url={selectedItem.url}
        date={selectedItem.date}
      >
        {selectedItem.content}
      </DetailArticleBody>
    )
  }
  isDetailOpen={!!selectedItem}
  onDetailClose={() => setSelectedId(null)}
/>
```

**核心特性**:
- **响应式**: 桌面端并排,移动端 Sheet 抽屉
- **自动降级**: 窄屏自动切换为全屏详情
- **可调整**: 使用 `react-resizable-panels` 支持拖拽调整宽度

---

### 2. 日期分组列表

**定义**: 按日期自动分组的列表容器

**实现组件**: `components/shared/date-grouped-list.tsx`

**核心算法**:
```typescript
// lib/group-by-date.ts
export function groupByDate<T>(
  items: T[],
  getDate: (item: T) => Date
): Map<string, T[]> {
  const groups = new Map<string, T[]>();

  for (const item of items) {
    const date = format(getDate(item), 'yyyy-MM-dd');
    if (!groups.has(date)) groups.set(date, []);
    groups.get(date)!.push(item);
  }

  return groups;
}
```

**使用场景**:
- 政策订阅流(按发布日期分组)
- 人才动态(按更新日期分组)
- 高校生态(按事件日期分组)

---

### 3. 数据项卡片

**定义**: 统一的列表项卡片组件,支持选中态、主题色

**实现组件**: `components/shared/data-item-card.tsx`

**主题色配置**:
```typescript
export const accentConfig = {
  violet: { 
    selected: "border-violet-300 bg-violet-50/50 shadow-sm",
    hover: "hover:border-violet-200 hover:shadow-sm",
    title: "group-hover:text-violet-600",
  },
  blue: { ... },
  indigo: { ... },
  purple: { ... },
  green: { ... },
} as const;
```

**配套子组件**:
- `ItemAvatar`: 圆角头像框
- `ItemChevron`: 右箭头图标(hover 动画)

---

### 4. AI 洞察面板

**定义**: 统一的 AI 分析侧边栏,支持 10 种模块主题色

**实现组件**: `components/shared/ai-insight-panel.tsx`

**主题色系统**:
```typescript
const themeConfig = {
  policy: { gradient: "from-violet-600 to-purple-600" },
  tech: { gradient: "from-blue-600 to-cyan-600" },
  talent: { gradient: "from-green-600 to-emerald-600" },
  university: { gradient: "from-indigo-600 to-blue-600" },
  internal: { gradient: "from-amber-600 to-orange-600" },
  network: { gradient: "from-pink-600 to-rose-600" },
  schedule: { gradient: "from-purple-600 to-fuchsia-600" },
  // ...
};
```

**使用场景**: 每个模块详情页提供 AI 分析

---

### 5. 骨架屏加载态

**定义**: 优雅的内容加载占位符

**实现组件**: `components/shared/skeleton-states.tsx`

**预设骨架**:
- `SkeletonMetricCard`: 指标卡骨架
- `SkeletonTableRow`: 表格行骨架
- `SkeletonAIPanel`: AI 面板骨架
- `SkeletonSubPage`: 完整子页面骨架

**使用示例**:
```typescript
export default function PolicyIntelModule() {
  const { items, isLoading } = usePolicyFeed();

  if (isLoading) return <SkeletonSubPage />;

  return <PolicyFeed items={items} />;
}
```

---

### 6. 数据新鲜度指示器

**定义**: 直观展示数据更新时间的小组件

**实现组件**: `components/shared/data-freshness.tsx`

**时效分级**:
```typescript
const status =
  diff < 10 * 60 * 1000 ? 'fresh' :      // 10分钟内: 绿色
  diff < 60 * 60 * 1000 ? 'recent' :     // 1小时内: 蓝色
  diff < 24 * 60 * 60 * 1000 ? 'stale' : // 24小时内: 黄色
  'very-stale';                          // 超过24小时: 红色
```

---

## 组件系统

### 组件层级结构

```
组件库(4 层架构)
│
├── 原子层 - shadcn/ui 基础组件
│   ├── Button
│   ├── Input
│   ├── Badge
│   ├── Card
│   └── ...
│
├── 分子层 - 共享业务组件
│   ├── DataItemCard
│   ├── DataFreshness
│   ├── EmptyState
│   └── SkeletonStates
│
├── 组织层 - 共享布局组件
│   ├── MasterDetailView
│   ├── DateGroupedList
│   ├── CommandPalette
│   └── AIInsightPanel
│
└── 页面层 - 模块组件
    ├── PolicyIntelModule
    ├── TechFrontierModule
    ├── TalentRadarModule
    └── ...
```

### shadcn/ui 组件清单

已安装 **49 个组件**:

| 类别 | 组件 |
|------|------|
| **反馈** | alert、alert-dialog、toast、sonner |
| **表单** | button、input、textarea、checkbox、radio-group、switch、select、slider、calendar、form |
| **导航** | navigation-menu、menubar、breadcrumb、pagination、tabs、command |
| **数据展示** | card、table、avatar、badge、chart、progress、separator |
| **弹窗** | dialog、sheet、drawer、popover、hover-card、tooltip、context-menu、dropdown-menu |
| **布局** | aspect-ratio、scroll-area、resizable、collapsible、accordion、carousel |
| **其他** | label、skeleton、toggle、toggle-group、input-otp |

---

## 开发工作流

### 本地开发流程

```bash
# 1. 安装依赖
npm install --legacy-peer-deps

# 2. 启动开发服务器(Turbopack 模式,端口 8000)
npm start dev

# 3. 访问应用
# http://localhost:8000

# 4. 实时编辑
# 修改代码后,Turbopack 自动热更新
```

### 新增模块流程

#### 流程图

```
创建目录 → 定义类型 → Mock 数据 → 模块组件 → 注册导航 → 添加路由 → 测试
```

#### 详细步骤

**步骤 1: 创建模块目录**

```bash
mkdir components/modules/new-module
touch components/modules/new-module/index.tsx
touch components/modules/new-module/sub-page-a.tsx
```

**步骤 2: 定义 TypeScript 类型**

```typescript
// lib/types/new-module.ts
export interface NewModuleItem {
  id: string;
  title: string;
  date: string;
  category: string;
}

export interface NewModuleState {
  items: NewModuleItem[];
  activeTab: string;
}
```

**步骤 3: 编写 Mock 数据**

```typescript
// lib/mock-data/new-module.ts
import type { NewModuleItem } from '@/lib/types/new-module';

export const mockNewModuleData: NewModuleItem[] = [
  { 
    id: '1', 
    title: 'Sample Item', 
    date: '2026-02-22', 
    category: 'A' 
  },
  // ...更多数据
];
```

**步骤 4: 创建模块组件**

```typescript
// components/modules/new-module/index.tsx
"use client";

import { useState } from "react";
import ModuleLayout from "@/components/module-layout";
import SubPageA from "./sub-page-a";

export default function NewModule() {
  const subPages = [
    { id: "sub-a", label: "子页面A", component: <SubPageA /> },
  ];

  return <ModuleLayout subPages={subPages} />;
}
```

**步骤 5: 注册导航**

```typescript
// lib/mock-data/navigation.ts
import { FileCode } from "lucide-react";

export const navGroups: NavGroup[] = [
  {
    label: "新分组",
    items: [
      { 
        id: "new-module", 
        label: "新模块", 
        icon: FileCode 
      },
    ],
  },
];

export const pageMeta: Record<string, PageMeta> = {
  "new-module": {
    title: "新模块",
    subtitle: "模块说明"
  },
};
```

**步骤 6: 添加路由**

```typescript
// app/page.tsx
import NewModule from "@/components/modules/new-module";

export default function Page() {
  // ...
  return (
    <main>
      {activePage === "new-module" && <NewModule />}
    </main>
  );
}
```

**步骤 7: 测试验证**

- ✅ 检查侧边栏是否显示新模块
- ✅ 点击导航项,确认路由切换
- ✅ 验证子页面 Tab 切换
- ✅ 检查数据加载与渲染

---

### 代码规范

#### TypeScript 规范

```typescript
// ✅ 正确: 严格类型定义
interface PolicyFeedItem {
  id: string;
  title: string;
  date: Date;
  tags: string[];
}

function filterByTags(
  items: PolicyFeedItem[], 
  tags: string[]
): PolicyFeedItem[] {
  return items.filter(item =>
    item.tags.some(tag => tags.includes(tag))
  );
}

// ❌ 错误: 使用 any
function filterItems(items: any[], filter: any) {
  return items.filter(filter);
}
```

#### 组件规范

```typescript
// ✅ 正确: 函数组件 + Props 接口
interface CardProps {
  title: string;
  description?: string;
  onClick?: () => void;
}

export default function Card({ 
  title, 
  description, 
  onClick 
}: CardProps) {
  return (
    <div onClick={onClick}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  );
}

// ❌ 错误: 类组件
class Card extends React.Component {
  render() { /* ... */ }
}
```

#### 样式规范

```typescript
// ✅ 正确: Tailwind 工具类 + cn() 合并
import { cn } from "@/lib/utils";

<button
  className={cn(
    "px-4 py-2 rounded-lg transition-colors",
    isActive 
      ? "bg-blue-500 text-white" 
      : "bg-gray-100 text-gray-700"
  )}
>
  Click Me
</button>

// ❌ 错误: 内联样式
<button style={{ 
  padding: "8px 16px", 
  backgroundColor: isActive ? "blue" : "gray" 
}}>
  Click Me
</button>
```

---

### Git 工作流

```bash
# 1. 创建功能分支
git checkout -b feature/new-module

# 2. 开发 & 提交
git add components/modules/new-module/
git commit -m "feat: add new module with sub-pages"

# 3. 推送分支
git push origin feature/new-module

# 4. 创建 Pull Request
gh pr create --title "feat: add new module" --body "描述..."

# 5. 代码审查通过后合并
git checkout main
git merge feature/new-module
```

---

## 性能优化

### 1. 构建优化

**Turbopack 加速**

Turbopack 比 Webpack 快 **700 倍**,首次启动时间从 10s 降至 1s。

配置方式:
```json
{
  "scripts": {
    "dev": "next dev --turbo --port 8000"
  }
}
```

---

### 2. 组件优化

**React.memo 避免重渲染**

```typescript
import { memo } from "react";

const DataItemCard = memo(({ 
  item, 
  isSelected, 
  onClick 
}: Props) => {
  return (
    <button onClick={onClick}>
      {/* 复杂渲染逻辑 */}
    </button>
  );
});

export default DataItemCard;
```

**useMemo 缓存计算结果**

```typescript
const filteredItems = useMemo(() => {
  return items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [items, searchQuery]);
```

**useCallback 稳定函数引用**

```typescript
const handleItemClick = useCallback((id: string) => {
  setSelectedId(id);
}, []);

return items.map(item => (
  <DataItemCard 
    key={item.id} 
    onClick={() => handleItemClick(item.id)} 
  />
));
```

---

### 3. 图片优化

**Next.js Image 组件**

```typescript
import Image from "next/image";

<Image
  src="/Logo.png"
  alt="智策云端"
  width={48}
  height={48}
  priority  // 首屏图片优先加载
/>
```

优势:
- ✅ 自动 WebP 转换
- ✅ 响应式图片
- ✅ 懒加载(默认)
- ✅ 图片优化压缩

---

### 4. 代码分割

**动态导入**

```typescript
import dynamic from "next/dynamic";

const FloatingAIAssistant = dynamic(
  () => import("@/components/floating-ai-assistant"),
  { ssr: false }  // 客户端渲染
);
```

---

### 5. 数据加载优化

**骨架屏提升感知性能**

```typescript
export default function PolicyIntelModule() {
  const { items, isLoading } = usePolicyFeed();

  if (isLoading) return <SkeletonSubPage />;

  return <PolicyFeed items={items} />;
}
```

---

### 6. 动画性能

**Framer Motion 性能优化**

```typescript
// ✅ 正确: 使用 transform(GPU 加速)
<motion.div
  animate={{ x: 100, scale: 1.2 }}
  transition={{ type: "spring", damping: 20 }}
/>

// ❌ 错误: 使用 top/left(引发 reflow)
<motion.div
  animate={{ top: 100, left: 100 }}
/>
```

---

## 安全考虑

### 1. XSS 防护

**React 自动转义**

```typescript
// ✅ 安全: 自动转义 HTML
<div>{userInput}</div>

// ❌ 危险: 绕过转义
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

**富文本渲染**

```typescript
import DOMPurify from "dompurify";

const sanitizedHtml = DOMPurify.sanitize(userInput);
<div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
```

---

### 2. CSRF 保护

**SameSite Cookie**

```typescript
// next.config.mjs
export default {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};
```

---

### 3. 环境变量

```bash
# .env.local(不提交到 Git)
NEXT_PUBLIC_API_URL=https://api.example.com
API_SECRET_KEY=your-secret-key
```

```typescript
// 访问环境变量
const apiUrl = process.env.NEXT_PUBLIC_API_URL;  // 客户端可访问
const secretKey = process.env.API_SECRET_KEY;    // 仅服务端可访问
```

---

### 4. 依赖安全审计

```bash
# 定期运行安全审计
npm audit

# 自动修复漏洞
npm audit fix
```

---

### 5. 敏感数据处理

```typescript
// ✅ 正确: 不在客户端存储敏感数据
// 使用 HttpOnly Cookie 或服务端 Session

// ❌ 错误: 在 localStorage 存储 Token
localStorage.setItem("authToken", token);
```

---

## 附录

### 常用命令速查

| 命令 | 说明 |
|------|------|
| `npm install --legacy-peer-deps` | 安装依赖 |
| `npm start dev` | 启动开发服务器(端口 8000) |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | ESLint 代码检查 |
| `npm run stop` | 清理端口 3000/8000/8080 |

### 响应式断点

```css
/* globals.css */
@media (max-width: 1024px) {
  /* 平板 */
}

@media (max-width: 768px) {
  /* 移动端 */
}
```

### 主题色系统

| 模块 | 主题色 | Tailwind Class |
|------|--------|----------------|
| 政策情报 | Violet → Purple | from-violet-600 to-purple-600 |
| 科技前沿 | Blue → Cyan | from-blue-600 to-cyan-600 |
| 人才雷达 | Green → Emerald | from-green-600 to-emerald-600 |
| 高校生态 | Indigo → Blue | from-indigo-600 to-blue-600 |
| 院内管理 | Amber → Orange | from-amber-600 to-orange-600 |
| 人脉网络 | Pink → Rose | from-pink-600 to-rose-600 |
| 智能日程 | Purple → Fuchsia | from-purple-600 to-fuchsia-600 |

### 相关资源

- [Next.js 文档](https://nextjs.org/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [Recharts 文档](https://recharts.org)
- [React Hook Form 文档](https://react-hook-form.com)
- [Zod 文档](https://zod.dev)

---

**文档版本**: v1.0.0  
**最后更新**: 2026-02-22  
**维护者**: DeanAgent 开发团队
