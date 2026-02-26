# DeanAgent 项目架构文档

> 完整的项目架构说明文档 | 版本 v2.0.0 | 更新日期: 2026-02-26

## 目录

- [项目概览](#项目概览)
- [架构总览](#架构总览)
- [技术栈详解](#技术栈详解)
- [8大功能模块](#8大功能模块)
- [关键设计模式](#关键设计模式)
- [组件系统](#组件系统)
- [动画系统](#动画系统)
- [数据层](#数据层)
- [响应式策略](#响应式策略)
- [设计系统](#设计系统)
- [开发工作流](#开发工作流)
- [性能优化](#性能优化)
- [安全考虑](#安全考虑)
- [部署](#部署)

---

## 项目概览

**智策云端** 是一个 AI 驱动的研究院院长智能决策辅助平台。

### 核心定位

- **决策中心**: 聚合多源数据，提供决策洞察
- **情报引擎**: 追踪政策、技术、人才、高校动态
- **智能助手**: AI 秘书对话、邀约评估、时间管理
- **指挥平台**: 院内管理、人脉网络、日程协调

### 技术特点

- **现代化框架**: Next.js 16 + React 19 + TypeScript 5.7
- **高性能构建**: Turbopack（比 Webpack 快 700 倍）
- **企业级 UI**: shadcn/ui 组件库（50+ 组件）+ Radix UI 原语
- **流畅动画**: Framer Motion 12 统一封装（Apple 曲线 + Spring 物理）
- **类型安全**: 全栈 TypeScript 严格模式（17 个类型模块）

---

## 架构总览

### 系统架构

项目采用分层架构，从顶部导航层到基础数据层：

```
┌──────────────────────────────────────────────────────────┐
│              导航层 (App Shell)                           │
│  侧边栏(桌面) / 底部导航(移动) / 顶栏 / 通知 / AI助手     │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│              8 大功能模块 (业务层)                        │
│  院长早报 | 政策情报 | 科技前沿 | 人事动态              │
│  高校生态 | 院内管理 | 人脉网络 | 智能日程              │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│              共享组件库 (组件层)                          │
│  Master-Detail | AIInsightPanel | MobileBottomNav       │
│  SkeletonStates | DateGroupedList | DataItemCard        │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│              动画系统 (motion/)                           │
│  MotionCard | StaggerContainer | AnimatedNumber         │
│  MotionPage | ExpandableSection | PageLoadingSkeleton   │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│              shadcn/ui 基础组件层                         │
│  Button | Input | Dialog | Table | Sheet | ...         │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│              数据层 (lib/)                                │
│  TypeScript Types (17模块) | Mock Data | Custom Hooks   │
│  API封装 | 日期分组 | 优先级评分算法                     │
└──────────────────────────────────────────────────────────┘
```

### 路由架构

采用 **客户端 SPA 路由** 模式，所有模块通过 `dynamic()` 懒加载：

```typescript
// app/page.tsx
const HomeModule = dynamic(() => import("@/components/modules/home"), {
  loading: () => <PageLoadingSkeleton />,
});

// 路由流程
AppShell/MobileBottomNav
  → onNavigate(pageId)
  → setActivePage(pageId)
  → dynamic(对应模块组件)
```

**激活的 8 个路由**:

| 路由 ID | 模块组件 | 动态导入路径 |
|---------|---------|------------|
| `home` | HomeModule | `modules/home` |
| `policy-intel` | PolicyIntelModule | `modules/policy-intel` |
| `tech-frontier` | TechFrontierModule | `modules/tech-frontier` |
| `talent-radar` | TalentRadarModule | `modules/talent-radar` |
| `university-eco` | UniversityEcoModule | `modules/university-eco` |
| `internal-mgmt` | InternalMgmtModule | `modules/internal-mgmt` |
| `network` | NetworkModule | `modules/network` |
| `smart-schedule` | SmartScheduleModule | `modules/smart-schedule` |

---

## 技术栈详解

### 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| **Next.js** | 16.1.6 | React 全栈框架，App Router 模式 |
| **React** | 19.2.3 | UI 库，支持并发特性 |
| **TypeScript** | 5.7.3 | 类型系统，严格模式 |
| **Turbopack** | — | 构建工具，比 Webpack 快 700 倍 |

### UI 组件库

| 技术 | 版本 | 用途 |
|------|------|------|
| **shadcn/ui** | — | 组件库（50+ 组件） |
| **Radix UI** | 多版本 | 无障碍组件原语 |
| **Tailwind CSS** | 3.4.17 | 样式框架 |
| **Framer Motion** | 12.34.0 | 动画库（统一封装） |
| **Lucide React** | 0.544.0 | 图标库 |

### 数据可视化

| 技术 | 版本 | 用途 |
|------|------|------|
| **Recharts** | 2.15.0 | 图表库（KPI/趋势/舆情） |

### 表单 & 验证

| 技术 | 版本 | 用途 |
|------|------|------|
| **React Hook Form** | 7.54.1 | 表单管理 |
| **Zod** | 3.24.1 | 数据验证 |

### 其他工具库

| 技术 | 版本 | 用途 |
|------|------|------|
| **date-fns** | 4.1.0 | 日期处理 |
| **cmdk** | 1.1.1 | 命令面板（Cmd+K） |
| **sonner** | 1.7.1 | Toast 通知 |
| **next-themes** | 0.4.6 | 主题管理 |

---

## 8大功能模块

### 模块总览

| 模块ID | 模块名称 | 子页面数 | 核心功能 |
|--------|---------|---------|---------|
| `home` | 院长早报 | 1 | AI综述、模块快捷卡片、今日待办 |
| `policy-intel` | 政策情报 | 1+筛选 | 政策订阅流、关键词搜索、5分类筛选 |
| `tech-frontier` | 科技前沿 | 1(M-D) | 信号流、Master-Detail详情、AI摘要、多维排序 |
| `talent-radar` | 人事动态 | 1+筛选 | 人物卡片、新闻流、分类筛选 |
| `university-eco` | 高校生态 | 2 | 同行对标、科研成果追踪 |
| `internal-mgmt` | 院内管理 | 4 | 中心动态、项目督办、学生管理、舆情监测 |
| `network` | 人脉网络 | 3 | 人事变动、关系维护、社交行动 |
| `smart-schedule` | 智能日程 | 4 | 日程总览、邀约评估、冲突化解、活动推荐 |

---

### 1. 院长早报 (home)

**定位**: 指挥中心首页，全局态势感知

**组件结构**:

```
components/modules/home/
└── index.tsx                    → 包装 HomeBriefingPage

components/pages/home-briefing.tsx   → 主容器

components/home/
├── ai-daily-summary.tsx         → AI 每日综述面板
├── aggregated-metric-cards.tsx  → 8 个模块快捷卡片（点击导航）
└── today-agenda.tsx             → 今日待办清单
```

**核心功能**:

- AI 每日综述（可折叠的分段摘要）
- 聚合指标卡片（8 个模块的关键指标，点击快速导航）
- 今日待办议程（按时间排序的事项列表）

**数据源**: `lib/mock-data/home-briefing.ts`

---

### 2. 政策情报 (policy-intel)

**定位**: 国家/北京政策订阅，政策机会追踪

**组件结构**:

```
components/modules/policy-intel/
├── index.tsx                    → 搜索框 + 分类 Tab + PolicyFeed
└── policy-feed.tsx              → 政策条目列表（卡片式）
```

**核心特性**:

- 关键词实时搜索（标题/内容）
- 5 个分类 Tab 筛选（全部/国家政策/北京政策/科技政策/经费政策）
- 数据新鲜度提示（`DataFreshness` 组件）
- 每条政策显示来源、日期、匹配度

**数据源**: `lib/mock-data/policy-intel.ts`

---

### 3. 科技前沿 (tech-frontier)

**定位**: 技术信号追踪，Master-Detail 详情浏览

**组件结构**:

```
components/modules/tech-frontier/
├── index.tsx               → 路由入口
├── tech-frontier-page.tsx  → 主容器（MasterDetailView 集成）
├── signal-feed.tsx         → 技术信号流列表
├── ai-briefing-bar.tsx     → 顶部 AI 摘要条
├── kpi-strip.tsx           → KPI 数据条带
├── memo-strip.tsx          → 备忘录条
├── topic-card.tsx          → 话题卡片
└── detail-panels.tsx       → 详情面板（4 种类型）
```

**核心特性**:

- Master-Detail 布局（信号流 + 详情面板）
- 多维排序：热度 / 缺口度 / 信号强度
- AI 摘要条（顶部滚动式摘要）
- 4 种详情面板类型：论文/专利/新闻/分析
- `ExpandableSection` 折叠展开动画

**数据源**: `lib/mock-data/tech-frontier.ts`

---

### 4. 人事动态 (talent-radar)

**定位**: 学界人才动态追踪

**组件结构**:

```
components/modules/talent-radar/
├── index.tsx           → 搜索 + 分类过滤 + 内容渲染
├── person-card.tsx     → 人物卡片（头像/机构/研究方向）
└── news-feed.tsx       → 人才动态新闻流
```

**核心特性**:

- 双视图：人物卡片（卡片网格）/ 新闻流（列表）
- 分类筛选：海归人才 / 职位变动 / 科研合作 / 奖项荣誉
- 人物卡片含影响力指标

**数据源**: `lib/mock-data/talent-radar.ts`

---

### 5. 高校生态 (university-eco)

**定位**: 同行机构动态对标，科研成果追踪

**组件结构**:

```
components/modules/university-eco/
├── index.tsx                → ModuleLayout，2 个子页面
├── peer-dynamics.tsx        → 同行动态对标
└── research-tracking.tsx    → 科研成果追踪
```

**数据源**: `lib/mock-data/university-eco.ts`

---

### 6. 院内管理 (internal-mgmt)

**定位**: 院内运营全景监控

**组件结构**:

```
components/modules/internal-mgmt/
├── index.tsx                → ModuleLayout，4 个子页面
├── center-updates.tsx       → 中心动态公告
├── project-supervision.tsx  → 项目督办进度
├── student-mgmt.tsx         → 学生事务管理
└── sentiment-monitor.tsx    → 舆情监测
```

**`pages/operations/` 仪表盘综合视图**:

```
components/pages/operations/
├── index.tsx               → 网格布局主容器
├── kpi-summary-cards.tsx   → KPI 摘要卡片行
├── center-performance.tsx  → 中心绩效分析图表
├── project-info-table.tsx  → 项目信息表格
├── sentiment-center.tsx    → 舆情监测图表
├── project-timeline.tsx    → 项目时间线
└── approval-tasks.tsx      → 待审批任务列表
```

**数据源**: `lib/mock-data/internal-mgmt.ts`, `lib/mock-data/operations.ts`

---

### 7. 人脉网络 (network)

**定位**: 人事变动感知，关系维护管理

**组件结构**:

```
components/modules/network/
├── index.tsx               → ModuleLayout，3 个子页面
├── personnel-changes.tsx   → 人事变动感知
├── relationship-mgmt.tsx   → 关系维护管理
└── social-actions.tsx      → 社交行动建议
```

**数据源**: `lib/mock-data/network.ts`

---

### 8. 智能日程 (smart-schedule)

**定位**: 日程 ROI 评估，时间冲突化解

**组件结构**:

```
components/modules/smart-schedule/
├── index.tsx               → ModuleLayout，4 个子页面
├── schedule-overview.tsx   → 日程总览（周视图 + 时间线）
├── invitation-eval.tsx     → 邀约 ROI 评估
├── conflict-resolver.tsx   → 时间冲突化解
└── activity-recommend.tsx  → 活动推荐（含冲突检测）
```

**`pages/schedule/` 轻量级日历视图**:

```
components/pages/schedule/
├── index.tsx           → 主页面（周条 + 时间线 + 详情）
├── week-strip.tsx      → 周选择条（7天快速切换）
├── timeline-row.tsx    → 每日时间线行
└── detail-panel.tsx    → 事件详情面板（移动端 Sheet）
```

**核心特性**:

- ROI 算法：基于人脉价值 × 议题相关性 ÷ 时间成本
- 冲突检测：自动识别时间、地点冲突
- 周条快速切换：7 天横向滑动选择

**数据源**: `lib/mock-data/smart-schedule.ts`, `lib/mock-data/schedule.ts`

---

## 关键设计模式

### 1. ModuleLayout 模式

**定义**: 统一的子页面 Tab 管理容器

**应用**: 高校生态（2页）、院内管理（4页）、人脉网络（3页）、智能日程（4页）

```typescript
// components/modules/internal-mgmt/index.tsx
export default function InternalMgmtModule() {
  const subPages = [
    { id: "center-updates", label: "中心动态", component: <CenterUpdates /> },
    { id: "projects", label: "项目督办", component: <ProjectSupervision /> },
    { id: "students", label: "学生管理", component: <StudentMgmt /> },
    { id: "sentiment", label: "舆情监测", component: <SentimentMonitor /> },
  ];
  return <ModuleLayout subPages={subPages} />;
}
```

---

### 2. Master-Detail 模式

**定义**: 左侧列表 + 右侧详情面板的经典布局

**应用场景**: 科技前沿模块

**实现组件**: `components/shared/master-detail-view.tsx`

```typescript
<MasterDetailView
  masterContent={
    <DateGroupedList
      items={signals}
      renderItem={(item) => (
        <DataItemCard
          isSelected={selectedId === item.id}
          onClick={() => setSelectedId(item.id)}
        />
      )}
    />
  }
  detailContent={selectedItem && <DetailPanels item={selectedItem} />}
  isDetailOpen={!!selectedItem}
  onDetailClose={() => setSelectedId(null)}
/>
```

**响应式行为**:

- 桌面（≥768px）：左右并排，支持拖拽调整比例
- 移动（<768px）：选中后全屏 Sheet 抽屉

---

### 3. 日期分组列表

**定义**: 按日期自动分组的列表容器

**实现**: `components/shared/date-grouped-list.tsx` + `lib/group-by-date.ts`

**应用场景**: 政策情报订阅流、人才动态新闻流、科技信号流

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

---

### 4. AI 洞察面板

**定义**: 统一的 AI 分析侧边栏，支持 10 种模块主题色

**实现**: `components/shared/ai-insight-panel.tsx`

**主题色系统**:

| 模块 | 渐变色 |
|------|--------|
| 政策情报 | violet → purple |
| 科技前沿 | blue → cyan |
| 人才雷达 | green → emerald |
| 高校生态 | indigo → blue |
| 院内管理 | amber → orange |
| 人脉网络 | pink → rose |
| 智能日程 | purple → fuchsia |

---

### 5. 悬浮 AI 秘书

**定义**: 全局悬浮的 AI 对话助手（Gemini 风格）

**实现**: `components/floating-ai-assistant.tsx`

**核心特性**:

- 悬浮按钮：脉冲动画 + 未读通知徽章
- 聊天面板：最小化 / 全屏（移动端）切换
- 快速操作：横向滚动菜单（日程查看/报告生成/数据分析等）
- 消息类型：User（蓝色右对齐）/ AI（灰色左对齐 + Bot 头像）
- 打字动画：三点 Bounce 指示器
- 输入框：自动调整高度（Shift+Enter 换行，Enter 发送）

**数据源**: `lib/mock-data/ai-assistant.ts`（快速操作 + `getAIResponse()`）

---

### 6. 骨架屏加载态

**实现**: `components/shared/skeleton-states.tsx`

**预设骨架（8+ 种）**:

| 骨架名称 | 用途 |
|---------|------|
| `SkeletonMetricCard` | 指标卡骨架 |
| `SkeletonTableRow` | 表格行骨架 |
| `SkeletonAIPanel` | AI 面板骨架 |
| `SkeletonSubPage` | 完整子页面骨架 |
| `SkeletonListItem` | 列表项骨架 |
| `SkeletonCard` | 通用卡片骨架 |
| `PageLoadingSkeleton` | 路由切换全页骨架 |

---

### 7. 数据新鲜度指示器

**实现**: `components/shared/data-freshness.tsx`

**时效分级**:

```
< 10 分钟  → 绿色（fresh）
< 1 小时   → 蓝色（recent）
< 24 小时  → 黄色（stale）
≥ 24 小时  → 红色（very-stale）
```

---

## 组件系统

### 4 层组件架构

```
原子层 — shadcn/ui 基础组件 (50+)
  Button | Input | Badge | Card | Dialog | Sheet | Table | Tabs ...

分子层 — 共享业务组件
  DataItemCard | DataFreshness | EmptyState | SkeletonStates
  DateGroupedList | DetailArticleBody

组织层 — 共享布局组件
  MasterDetailView | CommandPalette | AIInsightPanel | MobileBottomNav

页面层 — 模块组件
  HomeModule | PolicyIntelModule | TechFrontierModule ...
```

### 共享组件清单

| 组件 | 文件 | 用途 |
|------|------|------|
| `AIInsightPanel` | `shared/ai-insight-panel.tsx` | 统一 AI 分析面板，10 种主题色 |
| `CommandPalette` | `shared/command-palette.tsx` | Cmd+K 全局搜索 |
| `MobileBottomNav` | `shared/mobile-bottom-nav.tsx` | 移动端底部导航 |
| `MasterDetailView` | `shared/master-detail-view.tsx` | 左列表+右详情布局 |
| `SkeletonStates` | `shared/skeleton-states.tsx` | 8+ 种骨架屏 |
| `EmptyState` | `shared/empty-state.tsx` | 空状态占位 |
| `DataFreshness` | `shared/data-freshness.tsx` | 数据新鲜度指示器 |
| `DataItemCard` | `shared/data-item-card.tsx` | 统一列表项卡片 |
| `DateGroupedList` | `shared/date-grouped-list.tsx` | 按日期分组列表 |
| `DetailArticleBody` | `shared/detail-article-body.tsx` | 文章详情 Body |

### 移动端底部导航

**实现**: `components/shared/mobile-bottom-nav.tsx`

**导航分组映射**:

| 底部标签 | 对应页面 |
|---------|---------|
| 首页 | `home` |
| 情报 | `policy-intel` / `tech-frontier` / `talent-radar` / `university-eco` |
| 管理 | `internal-mgmt` |
| 日程 | `smart-schedule` |
| 更多 | `network` + 其他（展开 Modal） |

**特性**:

- 仅移动端显示（`md:hidden`）
- 固定底部，`env(safe-area-inset-bottom)` 刘海屏适配
- "更多"点击展开 Modal + Overlay

### shadcn/ui 组件清单

已安装 **50+ 个组件**:

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

## 动画系统

### 统一封装库

**位置**: `components/motion/index.tsx`

所有动画通过此封装库统一管理，禁止在业务组件中直接使用裸 `motion.div`。

### 导出的 8 个动画组件

| 组件 | 说明 |
|------|------|
| `MotionCard` | 滚动进入淡入滑上，支持 up/left/right 方向 |
| `StaggerContainer` | 容器级交错动画协调器 |
| `StaggerItem` | 单项动画定义 |
| `MotionPage` | 页面级进出动画（wait 模式） |
| `AnimatedNumber` | 数字计数动画（0 → target） |
| `MotionNumber` | 带前缀/后缀的数字动画 |
| `ExpandableSection` | 高度折叠/展开动画 |
| `PageLoadingSkeleton` | 路由切换全页骨架 |

### 动画 Token

```typescript
// 缓动曲线
EASE_OUT_EXPO = [0.16, 1, 0.3, 1]   // Apple 风格曲线
EASE_SPRING   = { stiffness: 300, damping: 30 }

// 持续时间
DURATION = {
  micro:  0.15,   // 微交互
  fast:   0.20,   // 快速反馈
  normal: 0.30,   // 标准动画
  slow:   0.45,   // 复杂动画
  page:   0.35,   // 页面转场
}
```

### 使用规范

```typescript
// ✅ 正确：使用封装组件
import { MotionCard, StaggerContainer, StaggerItem } from "@/components/motion";

<StaggerContainer>
  {items.map(item => (
    <StaggerItem key={item.id}>
      <MotionCard direction="up">
        <DataItemCard {...item} />
      </MotionCard>
    </StaggerItem>
  ))}
</StaggerContainer>

// ❌ 避免：直接使用裸 motion.div
<motion.div animate={{ opacity: 1 }} />
```

---

## 数据层

### TypeScript 类型系统（17 个模块）

```
lib/types/
├── navigation.ts        # NavGroup, NavItem, PageMeta
├── ai-assistant.ts      # ChatMessage, QuickAction
├── app-shell.ts         # AppShellData, Notification
├── intelligence.ts      # PolicyFeed, TechSignal
├── policy-intel.ts      # PolicyFeedItem, PolicyFeedCategory
├── tech-frontier.ts     # TechTopic, Signal, DetailTarget
├── talent-radar.ts      # PersonnelNews, PersonnelNewsCategory
├── university-eco.ts    # PeerDynamic, ResearchItem
├── schedule.ts          # Event, ScheduleEvent
├── smart-schedule.ts    # ScheduleEvent（扩展）
├── internal-mgmt.ts     # CenterUpdate, ProjectItem
├── network.ts           # NetworkNews, Personnel
├── operations.ts        # KPIData, ProjectInfo
├── personnel-intel.ts   # PersonnelIntel
├── policy-tracking.ts   # PolicyTracking
└── index.ts             # 统一导出
```

### Mock 数据层（15 个文件）

```
lib/mock-data/
├── navigation.ts        # navGroups（4分组/8模块）, pageMeta
├── ai-assistant.ts      # quickActions, initialMessage, getAIResponse()
├── home-briefing.ts     # mockAgendaItems, metricCards
├── policy-intel.ts      # policyItems, categories
├── tech-frontier.ts     # mockTechTopics, signals, opportunities
├── talent-radar.ts      # personnelNews, categories
├── university-eco.ts    # researchItems, peerDynamics
├── internal-mgmt.ts     # projectData, sentimentData
├── network.ts           # networkNews, personnel
├── schedule.ts          # EVENTS, UPCOMING_EVENTS
├── smart-schedule.ts    # scheduleEvents, conflicts
├── operations.ts        # kpiData, projectInfo
├── app-shell.ts         # mockNotifications（5条）
├── intelligence.ts      # （旧，保留兼容）
└── index.ts             # 统一导出
```

### 业务工具库

| 文件 | 说明 |
|------|------|
| `lib/api.ts` | API 调用封装（后端接入准备） |
| `lib/group-by-date.ts` | 按日期分组工具函数 |
| `lib/priority-scoring.ts` | 优先级评分算法（匹配度×时效性×重要性） |
| `lib/utils.ts` | `cn()` 样式合并等通用工具 |

### 自定义 Hooks

| Hook | 说明 |
|------|------|
| `use-breakpoint.ts` | 响应式断点检测（mobile/tablet/desktop） |
| `use-daily-briefing.ts` | 早报数据获取 |
| `use-policy-opportunities.ts` | 政策数据获取 |
| `use-personnel-news.ts` | 人员动态数据获取 |
| `use-detail-view.ts` | Master-Detail 状态管理 |

---

## 响应式策略

### 断点划分

| 断点 | 值 | 布局变化 |
|------|-----|---------|
| 默认（移动） | < 768px | 底部导航 + 全屏内容区 |
| `md` | ≥ 768px | 侧边栏（220px） + 内容区 |
| `lg` | ≥ 1024px | 三列布局生效 |
| `xl` | ≥ 1280px | 最大内容宽度 |

### 导航切换逻辑

```
< 768px (md)
  → 隐藏侧边栏（app-shell.tsx）
  → 显示底部导航（mobile-bottom-nav.tsx）
  → 内容区 pb-20（为底部导航留空间）
  → AI 助手定位 bottom-20（避免被底部栏遮挡）

≥ 768px (md)
  → 显示侧边栏（折叠 70px / 展开 220px）
  → 隐藏底部导航
  → 内容区 margin-left 随侧边栏宽度调整
```

### Master-Detail 响应式

```
≥ 768px → 左列表 + 右详情并排显示
< 768px → 点击列表项后，详情以 Sheet 全屏抽屉弹出
```

---

## 设计系统

### 色彩 Token（HSL 变量）

```css
/* app/globals.css */

/* 主色 */
--primary: 263 70% 58%;    /* Violet */
--secondary: 240 12% 95%;  /* Slate */
--accent: 188 72% 42%;     /* Cyan */

/* 图表色 */
--chart-1: 263 70% 58%;    /* Violet */
--chart-2: 188 72% 42%;    /* Cyan */
--chart-3: 310 60% 55%;    /* Magenta */
--chart-4: 43 87% 62%;     /* Amber */
--chart-5: 142 65% 46%;    /* Green */
```

### 特效类

| 类名 | 效果 |
|------|------|
| `.glass-card` | 白色玻璃态（72% 透明度 + blur 12px） |
| `.glass-violet` | Violet 玻璃态（6% 透明度 + blur） |
| `.bg-gradient-aurora` | Violet→Cyan 柔和背景渐变 |
| `.bg-gradient-primary` | Violet→Cyan 强渐变 |
| `.text-gradient` | 文本渐变效果 |
| `.glow-violet` | Violet 辉光阴影 |
| `.glow-cyan` | Cyan 辉光阴影 |
| `.glow-amber` | Amber 辉光阴影 |
| `.sidebar-active-bg` | 侧边栏激活项渐变背景 |
| `.font-tabular` | 等宽数字字体 |

### 模块主题色映射

| 模块 | 主题色 | Tailwind Class |
|------|--------|----------------|
| 政策情报 | Violet → Purple | `from-violet-600 to-purple-600` |
| 科技前沿 | Blue → Cyan | `from-blue-600 to-cyan-600` |
| 人事动态 | Green → Emerald | `from-green-600 to-emerald-600` |
| 高校生态 | Indigo → Blue | `from-indigo-600 to-blue-600` |
| 院内管理 | Amber → Orange | `from-amber-600 to-orange-600` |
| 人脉网络 | Pink → Rose | `from-pink-600 to-rose-600` |
| 智能日程 | Purple → Fuchsia | `from-purple-600 to-fuchsia-600` |

---

## 开发工作流

### 新增模块（完整步骤）

**步骤 1：创建模块目录**

```bash
mkdir components/modules/new-module
touch components/modules/new-module/index.tsx
touch components/modules/new-module/sub-page-a.tsx
```

**步骤 2：定义 TypeScript 类型**

```typescript
// lib/types/new-module.ts
export interface NewModuleItem {
  id: string;
  title: string;
  date: string;
  category: string;
}
```

**步骤 3：编写 Mock 数据**

```typescript
// lib/mock-data/new-module.ts
import type { NewModuleItem } from '@/lib/types/new-module';

export const mockNewModuleData: NewModuleItem[] = [
  { id: '1', title: 'Sample Item', date: '2026-02-26', category: 'A' },
];
```

**步骤 4：创建模块组件**

```typescript
// components/modules/new-module/index.tsx
"use client";

import ModuleLayout from "@/components/module-layout";
import SubPageA from "./sub-page-a";

export default function NewModule() {
  const subPages = [
    { id: "sub-a", label: "子页面A", component: <SubPageA /> },
  ];
  return <ModuleLayout subPages={subPages} />;
}
```

**步骤 5：注册导航**

```typescript
// lib/mock-data/navigation.ts
export const navGroups: NavGroup[] = [
  {
    label: "新分组",
    items: [{ id: "new-module", label: "新模块", icon: FileCode }],
  },
];

export const pageMeta: Record<string, PageMeta> = {
  "new-module": { title: "新模块", subtitle: "模块说明" },
};
```

**步骤 6：动态导入路由**

```typescript
// app/page.tsx
const NewModule = dynamic(
  () => import("@/components/modules/new-module"),
  { loading: () => <PageLoadingSkeleton /> }
);

// 在渲染逻辑中添加
{activePage === "new-module" && <NewModule />}
```

**步骤 7：更新移动端底部导航**

在 `components/shared/mobile-bottom-nav.tsx` 中，将新模块添加到对应的底部导航分组。

**步骤 8：验证**

- ✅ 侧边栏显示新模块导航项
- ✅ 移动端底部导航正确分组
- ✅ 路由切换正常
- ✅ 骨架屏 loading 正常
- ✅ 子页面 Tab 切换正常

### 代码规范

#### TypeScript

```typescript
// ✅ 严格类型定义
interface PolicyFeedItem {
  id: string;
  title: string;
  date: Date;
  tags: string[];
}

// ❌ 禁止 any
function filterItems(items: any[], filter: any) { ... }
```

#### 组件

```typescript
// ✅ 函数组件 + Props 接口
interface CardProps {
  title: string;
  description?: string;
  onClick?: () => void;
}

export default function Card({ title, description, onClick }: CardProps) {
  return <div onClick={onClick}><h3>{title}</h3></div>;
}
```

#### 样式

```typescript
// ✅ Tailwind + cn() 合并
import { cn } from "@/lib/utils";

<button className={cn(
  "px-4 py-2 rounded-lg transition-colors",
  isActive ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
)}>
  Click Me
</button>
```

### Git 工作流

```bash
git checkout -b feature/new-module
git add components/modules/new-module/
git commit -m "feat: add new-module with sub-pages"
git push origin feature/new-module
gh pr create --title "feat: add new module" --body "..."
```

---

## 性能优化

### 1. 路由级别代码分割

所有模块通过 `dynamic()` 懒加载，首屏仅加载 AppShell 和首页模块：

```typescript
const TechFrontierModule = dynamic(
  () => import("@/components/modules/tech-frontier"),
  { loading: () => <PageLoadingSkeleton /> }
);
```

### 2. 组件优化

```typescript
// React.memo 避免重渲染
const DataItemCard = memo(({ item, isSelected, onClick }: Props) => { ... });

// useMemo 缓存过滤结果
const filteredItems = useMemo(() =>
  items.filter(item => item.title.includes(query)),
  [items, query]
);

// useCallback 稳定函数引用
const handleClick = useCallback((id: string) => setSelectedId(id), []);
```

### 3. 骨架屏提升感知性能

```typescript
export default function PolicyIntelModule() {
  const { items, isLoading } = usePolicyFeed();
  if (isLoading) return <SkeletonSubPage />;
  return <PolicyFeed items={items} />;
}
```

### 4. Turbopack 开发加速

```json
{
  "scripts": {
    "dev": "next dev --turbo --port 8080"
  }
}
```

### 5. Framer Motion GPU 加速

```typescript
// ✅ 使用 transform（GPU 加速）
<motion.div animate={{ x: 100, scale: 1.2 }} />

// ❌ 避免 top/left（引发 reflow）
<motion.div animate={{ top: 100, left: 100 }} />
```

---

## 安全考虑

### XSS 防护

```typescript
// ✅ React 自动转义（安全）
<div>{userInput}</div>

// ❌ 绕过转义（危险）
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// 富文本必须使用 DOMPurify
import DOMPurify from "dompurify";
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
```

### 环境变量

```bash
# .env.local（不提交到 Git）
NEXT_PUBLIC_API_URL=http://43.98.254.243:8001
API_SECRET_KEY=your-secret-key
```

### 依赖审计

```bash
npm audit
npm audit fix
```

---

## 部署

### 部署环境

| 服务 | 地址 |
|------|------|
| 前端 | `http://43.98.254.243:8080/` |
| 后端 API | `http://43.98.254.243:8001/` |
| API 文档 | `http://43.98.254.243:8001/docs` |

### 服务器路径

| 项目 | 路径 |
|------|------|
| 前端 | `/home/ecs-user/Dean-Agent-Project/Dean-Agent-Fronted` |
| 后端 | `/home/ecs-user/Dean-Agent-Project/DeanAgent-Backend` |

### 部署命令

```bash
bash deploy.sh
```

### 常用命令速查

| 命令 | 说明 |
|------|------|
| `npm install --legacy-peer-deps` | 安装依赖 |
| `npm run dev` | 启动开发服务器（Turbopack，端口 8080） |
| `npm run build` | 构建生产版本 |
| `npm start` | 启动生产服务器 |
| `npm run lint` | ESLint 代码检查 |
| `npm run stop` | 清理端口 3000/8000/8080 |

---

### 相关资源

- [Next.js 文档](https://nextjs.org/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [Recharts 文档](https://recharts.org)

---

**文档版本**: v2.0.0
**最后更新**: 2026-02-26
**维护者**: DeanAgent 开发团队
