# Task 3 工程报告

## 状态

已将三个占位页替换为可导航的数据页：前沿论文、两院学术成果、两院专家库。

## RED 证据

1. 首次运行 `node --test tests/intelligence-pages.test.mjs tests/navigation-config.test.mjs`：8 项中 4 项失败。失败原因是动态模块与页面文件不存在、专家快照不存在、页面仍使用 `PlaceholderPage`。
2. 更正专家数据地址后运行 `node --test tests/intelligence-pages.test.mjs`：4 项中 1 项失败。失败原因是实现仍使用旧学者地址。
3. 自审补充无入场隐藏契约后运行 `node --test tests/intelligence-pages.test.mjs`：4 项中 1 项失败。失败原因是三个数据页仍位于 `MotionPage` 的 `opacity: 0` 入场包装内。

## GREEN 证据

- `node --test tests/intelligence-pages.test.mjs tests/navigation-config.test.mjs`：9/9 通过，0 失败。
- `node --test tests/*.test.mjs`：48/48 通过，0 失败（最终路由静态调整前；调整后的关联测试已单独复验）。
- `git diff --check`：通过。
- 本地服务 `http://127.0.0.1:8000` 返回 HTTP 200。

## 实现摘要

- `app/page.tsx` 注册三个动态模块并移除对应占位分支；三个报告页绕过会隐藏内容的入场动画，其他旧页面保持原行为。
- 论文列表使用 `usePaperFeed()`，提供全部、顶刊、顶会、ArXiv 分类，每页固定 20 条；行内显示标题、作者、刊会/年份、两行摘要、来源类型和原始链接。
- 学术成果页复用论文列表，固定 `achievements` 查询并按发表日期分组。
- 专家页读取空脱敏快照，显示规定的 8 列、同步状态、精确学者地址和专家推荐 Skill 地址。
- 新增共享 `SkillAccessNote`，并加入三个必需 Skill URL 的静态契约测试。

## 自审

- 页面背景仅使用 `#f7f8fa` 与白色，无渐变、噪点、玻璃效果、Hero、营销文案或 CTA。
- 页面没有 H1；可见标题均为紧凑报告字号。
- 除任务明确要求的 `ArXiv` 与 `Skill` 名称外，界面标签为中文。
- 没有嵌套卡片；筛选、列表/表格、分页为并列数据区域。
- 空专家快照严格为 `{ "syncedAt": "", "items": [] }`，未写入联系人或其他敏感字段。
- 未修改或回退工作区中其他任务的未提交内容。

## 关注项

- `npx tsc --noEmit` 被仓库既有的 7 个类型错误阻塞：`components/motion/index.tsx` 6 处 easing 类型错误，`components/ui/calendar.tsx` 1 处 `IconLeft` API 类型错误。TypeScript 输出未包含 Task 3 文件。
- 专家快照保持为空，按计划由 Task 4 生成脱敏实时数据。
- 提交：`feat: add paper and internal data pages`（哈希见任务交接）。

## 评审修复记录

### RED

- `node --test tests/intelligence-pages.test.mjs`：7 项中 3 项失败，分别命中缺少 `overflow-x-auto`、数据面板未使用 `rounded-xl + shadow-sm`、Skill/学者链接仍为带框控件、分类仍显示 `ArXiv`。
- `npx tsc --noEmit --incremental false`：失败，复现 `components/motion/index.tsx` 6 处 easing 数组类型错误和 `components/ui/calendar.tsx` 的无效 `IconLeft` 自定义组件错误。
- easing 元组修复后再次运行 TypeScript：失败，暴露 Framer Motion 12 不支持 `transition.exit` 的兼容错误。

### GREEN

- Node `v22.22.3`：`node --test tests/intelligence-pages.test.mjs tests/navigation-config.test.mjs` 12/12 通过，0 失败。
- `npx tsc --noEmit --incremental false`：退出 0，无错误输出。
- 专家表外层启用移动端横向滚动；Skill 与学者地址改为无边框元数据链接；报告数据面板统一为 12px 圆角与轻阴影；论文分类显示为“预印本”。
- Framer Motion easing 使用四元 cubic-bezier 元组，react-day-picker `9.14.0` 使用 `Chevron({ orientation })` 自定义组件接口。
- 本节结果取代上文关于 `ArXiv` 可见标签和 TypeScript 门禁阻塞的旧状态。
- 提交：`fix: complete intelligence report surfaces`（哈希见任务交接）。
