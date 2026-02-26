# 智策云端 — 院长决策系统

> AI 驱动的研究院院长智能决策辅助平台，整合外部情报、内部管理与行动日程，让院长在碎片化时间内实现全局态势感知与高效决策。

## 功能概览

系统围绕院长日常决策场景，划分为 **8 大功能模块**：

| 模块 | 说明 |
|------|------|
| **院长早报** | 指挥中心首页 — AI 每日综述、聚合指标快捷卡、今日待办议程 |
| **政策情报** | 国家/北京政策订阅流、关键词搜索、分类筛选、政策机会追踪 |
| **科技前沿** | 技术信号流、Master-Detail 详情面板、AI 摘要条、多维排序（热度/缺口/信号） |
| **人事动态** | 人事变动新闻流、人物卡片画像、分类筛选 |
| **高校生态** | 同行动态对标、科研成果追踪、人事与人才变动 |
| **院内管理** | 中心动态、项目督办、学生管理、舆情监测 |
| **人脉网络** | 人事变动感知、关系维护管理、社交行动建议 |
| **智能日程** | 日程总览、邀约评估、冲突化解、活动推荐 |

**全局能力**：
- `Cmd+K` 全局搜索命令面板
- 通知中心（告警/截止日/人事变动）
- 悬浮 AI 秘书对话（Gemini 风格，支持快速操作）
- 移动端底部导航（智能聚合，安全区域适配）
- 骨架屏加载态（8+ 种预设）& 空状态
- 数据新鲜度指示器
- 响应式布局（桌面 ≥768px 侧边栏 / 移动端底部导航）
- 统一 Framer Motion 动画系统（Apple 曲线 + Spring 物理动画）

## 技术栈

| 层面 | 技术 |
|------|------|
| 框架 | [Next.js 16](https://nextjs.org/) (Turbopack) |
| 语言 | TypeScript 5.7 |
| UI 组件 | [shadcn/ui](https://ui.shadcn.com/) (50+ 组件) + Radix UI 原语 |
| 样式 | Tailwind CSS 3.4 + tailwindcss-animate |
| 动画 | Framer Motion 12（统一 motion 封装库） |
| 图表 | Recharts 2.15 |
| 图标 | Lucide React |
| 表单 | React Hook Form + Zod 校验 |
| 通知 | Sonner |
| 搜索 | cmdk |

## 快速开始

```bash
# 安装依赖
npm install --legacy-peer-deps

# 启动开发服务器 (默认端口 8080)
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 清理端口
npm run stop
```

访问 `http://localhost:8080` 查看应用。

## 项目结构

```
Dean-Agent/
├── app/                              # Next.js App Router
│   ├── globals.css                   # 全局样式 + 设计 Token（玻璃态/渐变/辉光）
│   ├── layout.tsx                    # 根布局（字体/主题）
│   └── page.tsx                      # 应用入口（路由状态 + 动态导入）
│
├── components/
│   ├── app-shell.tsx                 # 侧边栏导航 + 顶栏（折叠/移动响应/通知中心）
│   ├── floating-ai-assistant.tsx     # 悬浮 AI 秘书对话（快速操作/打字动画）
│   ├── ai-secretary-sidebar.tsx      # AI 秘书侧栏（备用）
│   ├── theme-provider.tsx            # 主题提供者
│   ├── module-layout.tsx             # 模块 Tab 容器（响应式 Tab 滚动）
│   │
│   ├── home/                         # 首页子组件
│   │   ├── aggregated-metric-cards.tsx  # 模块快捷卡片（8 个模块入口卡）
│   │   ├── ai-daily-summary.tsx         # AI 每日综述
│   │   └── today-agenda.tsx             # 今日待办清单
│   │
│   ├── modules/                      # 8 大功能模块
│   │   ├── home/                     # 院长早报（包装 HomeBriefingPage）
│   │   ├── policy-intel/             # 政策情报（搜索 + 分类过滤 + 政策流）
│   │   ├── tech-frontier/            # 科技前沿（Master-Detail + AI 摘要）
│   │   ├── talent-radar/             # 人事动态（人物卡片 + 新闻流）
│   │   ├── university-eco/           # 高校生态（同行对标 + 科研追踪）
│   │   ├── internal-mgmt/            # 院内管理（4 子页）
│   │   ├── network/                  # 人脉网络（3 子页）
│   │   └── smart-schedule/           # 智能日程（4 子页）
│   │
│   ├── pages/                        # 页面级组件
│   │   ├── home-briefing.tsx         # 首页主容器
│   │   ├── dashboard.tsx             # 旧仪表盘
│   │   ├── intelligence/             # 情报综合页（3 Tabs：政策/科技/竞对）
│   │   ├── operations/               # 运营管理（KPI + 绩效 + 项目 + 舆情）
│   │   └── schedule/                 # 日程页（周条 + 时间线 + 详情面板）
│   │
│   ├── radar/                        # 情报雷达组件（被 pages/intelligence 引用）
│   │   ├── policy-opportunity-pool.tsx  # 政策机会池
│   │   ├── technology-trends.tsx        # 技术趋势
│   │   ├── competitor-monitoring.tsx    # 竞对监测
│   │   └── ...
│   │
│   ├── policy/                       # 政策/社交视图组件
│   │   ├── network-intelligence-view.tsx
│   │   └── social-actions-view.tsx
│   │
│   ├── shared/                       # 共享组件
│   │   ├── command-palette.tsx       # Cmd+K 全局搜索
│   │   ├── ai-insight-panel.tsx      # 统一 AI 分析面板（10 种主题色）
│   │   ├── mobile-bottom-nav.tsx     # 移动端底部导航（安全区域适配）
│   │   ├── master-detail-view.tsx    # Master-Detail 布局容器
│   │   ├── skeleton-states.tsx       # 骨架屏（8+ 种预设）
│   │   ├── data-freshness.tsx        # 数据新鲜度指示器
│   │   ├── data-item-card.tsx        # 数据项卡片（支持主题色）
│   │   ├── date-grouped-list.tsx     # 按日期分组列表
│   │   ├── detail-article-body.tsx   # 文章详情 Body
│   │   ├── empty-state.tsx           # 通用空状态
│   │   └── placeholder-page.tsx      # 占位页面
│   │
│   ├── motion/
│   │   └── index.tsx                 # Framer Motion 封装（8 个动画组件导出）
│   │
│   └── ui/                           # shadcn/ui 基础组件 (50+)
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── sheet.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       └── ...
│
├── lib/
│   ├── utils.ts                      # 工具函数（cn 样式合并）
│   ├── api.ts                        # API 调用封装
│   ├── group-by-date.ts              # 日期分组工具
│   ├── priority-scoring.ts           # 优先级评分算法
│   ├── mock-data/                    # Mock 数据层
│   │   ├── navigation.ts             # 导航配置 & 页面元数据
│   │   ├── home-briefing.ts          # 首页数据
│   │   ├── ai-assistant.ts           # AI 助手快速操作 & 响应
│   │   ├── policy-intel.ts           # 政策情报数据
│   │   ├── tech-frontier.ts          # 科技前沿数据
│   │   ├── talent-radar.ts           # 人事动态数据
│   │   ├── university-eco.ts         # 高校生态数据
│   │   ├── internal-mgmt.ts          # 院内管理数据
│   │   ├── network.ts                # 人脉网络数据
│   │   ├── schedule.ts               # 日程数据
│   │   ├── smart-schedule.ts         # 智能日程数据
│   │   ├── operations.ts             # 运营数据
│   │   └── index.ts                  # 统一导出
│   └── types/                        # TypeScript 类型定义（17 个模块）
│       ├── navigation.ts
│       ├── ai-assistant.ts
│       ├── intelligence.ts
│       ├── tech-frontier.ts
│       ├── talent-radar.ts
│       ├── schedule.ts
│       ├── operations.ts
│       └── ...
│
├── hooks/                            # 自定义 Hooks
│   ├── use-breakpoint.ts             # 响应式断点（mobile/tablet/desktop）
│   ├── use-daily-briefing.ts         # 早报数据
│   ├── use-policy-opportunities.ts   # 政策数据
│   ├── use-personnel-news.ts         # 人员动态数据
│   ├── use-detail-view.ts            # Master-Detail 状态
│   └── ...
│
├── docs/                             # 项目文档
│   ├── ARCHITECTURE.md               # 完整架构文档
│   └── ...
│
├── tailwind.config.ts                # Tailwind 配置
├── tsconfig.json                     # TypeScript 配置
├── deploy.sh                         # 部署脚本
└── package.json
```

## 架构设计

### 路由模式

采用客户端 SPA 路由，由 `app/page.tsx` 中的 `activePage` 状态驱动模块切换，配合 Framer Motion 页面转场动画。所有模块通过 `dynamic()` 懒加载，使用 `PageLoadingSkeleton` 作为 loading fallback：

```
AppShell (侧边栏/底部导航) → onNavigate → activePage → dynamic(模块组件)
```

### 模块组织

每个功能模块遵循统一结构：

```
modules/{module-name}/
├── index.tsx          # 模块入口（注册子页面 Tab，使用 ModuleLayout）
├── sub-page-a.tsx     # 子页面 A
└── sub-page-b.tsx     # 子页面 B
```

子页面通过 `ModuleLayout` 组件以 Tab 形式组织，共享一致的交互模式。

### 数据层

当前使用 Mock 数据层（`lib/mock-data/`），所有数据结构已通过 `lib/types/` 定义 TypeScript 接口。`lib/api.ts` 提供 API 调用封装层，为后续接入真实 API 做好准备。

### 动画系统

统一的 `components/motion/index.tsx` 封装库，导出 8 个动画组件：

| 组件 | 用途 |
|------|------|
| `MotionCard` | 滚动进入淡入滑上（支持 up/left/right 方向） |
| `StaggerContainer` | 交错动画协调器 |
| `StaggerItem` | 单项动画定义 |
| `MotionPage` | 页面级进出动画 |
| `AnimatedNumber` | 数字计数动画（0→target） |
| `MotionNumber` | 带前缀/后缀的数字动画 |
| `ExpandableSection` | 高度折叠/展开动画 |
| `PageLoadingSkeleton` | 全页骨架屏 |

### 共享组件

| 组件 | 用途 |
|------|------|
| `AIInsightPanel` | 统一 AI 分析面板，支持 10 种模块主题色 |
| `CommandPalette` | Cmd+K 全局搜索，索引所有 Mock 数据 |
| `MobileBottomNav` | 移动端底部导航（智能分组/安全区域适配） |
| `MasterDetailView` | 左列表+右详情布局，移动端自动切换 Sheet |
| `SkeletonStates` | 8+ 种骨架屏预设 |
| `EmptyState` | 空状态提示（图标+标题+说明+CTA） |
| `DataFreshness` | 数据新鲜度指示器，按时间梯度着色 |
| `DataItemCard` | 统一列表项卡片，支持主题色选中态 |
| `DateGroupedList` | 按日期自动分组的列表容器 |

## 开发指南

### 新增模块

1. 在 `components/modules/` 下创建模块目录
2. 创建 `index.tsx` 注册子页面配置（使用 `ModuleLayout`）
3. 在 `lib/types/` 中定义 TypeScript 类型
4. 在 `lib/mock-data/` 中添加 Mock 数据
5. 在 `lib/mock-data/navigation.ts` 中添加导航项
6. 在 `app/page.tsx` 中添加 `dynamic()` 条件渲染

### 新增子页面

1. 在对应模块目录下创建子页面组件
2. 在模块 `index.tsx` 的 `subPages` 数组中注册
3. 使用 `AIInsightPanel` 提供 AI 分析侧边栏
4. 使用 `DataFreshness` 标注数据更新时间
5. 使用 `SkeletonStates` 处理加载态

### 代码规范

- TypeScript 严格类型，优先函数组件 + Hooks
- Tailwind CSS 工具类优先，遵循 shadcn/ui 设计系统
- 组件单一职责，复杂逻辑提取为自定义 Hook
- 局部状态 `useState`，副作用 `useEffect`，复杂状态 `useReducer`
- 动画使用 `components/motion/index.tsx` 封装组件，勿直接使用裸 `motion.div`

## 部署

| 服务 | 地址 |
|------|------|
| 前端 | http://43.98.254.243:8080/ |
| 后端 API | http://43.98.254.243:8001/ |
| API 文档 | http://43.98.254.243:8001/docs |

```bash
# 运行部署脚本
bash deploy.sh
```

## 许可证

私有项目，仅限内部使用。
