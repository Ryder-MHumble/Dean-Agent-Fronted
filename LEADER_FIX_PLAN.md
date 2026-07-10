# 领导画像修复 + 前端优化方案

## 项目：Dean-Agent-Fronted
## 仓库路径：/home/ubuntu/workspace/Dean-Agent-Fronted
## 后端API：http://10.1.132.21:8001

---

## 一、问题清单与修复方案

### 问题1：已免职领导显示在列表中

**根因**：`components/modules/talent-radar/index.tsx` 第149行，`useLeaders` 默认 `status: "all"`，导致已离任领导也显示在列表中。

**修复**：
- 默认 status 改为 `"current"`
- 筛选器中增加 status 下拉（现任/离任/全部），默认"现任"
- 列表中对于有离任记录的领导，在职务后面加灰色标记"(已离任)"或类似标识

**具体改动文件**：
- `components/modules/talent-radar/index.tsx`：新增 status state + Select 组件，默认 current
- `hooks/use-leaders.ts`：默认 status 从 `"all"` 改为 `"current"`

### 问题2：点击领导行无法展开详情

**根因**：表格行没有交互逻辑，没有详情展开组件。数据已全部就绪（experiences, appointment_events, leader_details.text, source_refs）。

**修复**：
- 点击表格行 → 打开侧边抽屉（Sheet/Drawer）展示详情
- 详情内容包括：
  1. 基本信息区：姓名、性别、当前职务、所属机构
  2. 履历时间线：experiences 按 start_date 倒序，每条显示 职务@机构、任职时间范围（start_date→end_date 或 "至今"）
  3. 任免事件：appointment_events 按日期倒序，每条显示 任命/免去 + 职务@机构 + 日期 + 来源链接
  4. 简介：leader_details.text 或 leader_details.summary
  5. 来源引用：source_refs 列表

**具体改动文件**：
- `components/modules/talent-radar/index.tsx`：新增 `LeaderDetailSheet` 组件，点击行时打开
- 使用项目已有的 `Sheet` 组件（检查 components/ui/sheet.tsx 是否存在）

### 问题3：列表没有渲染领导头像

**根因**：后端数据中 `leader_details.media.avatar_url` 已有头像 URL（同济8位领导全部有），但前端没有渲染。

**修复**：
- 从 `leader.leader_details.media.avatar_url` 取头像 URL
- 表格"姓名"列：有头像→显示圆形头像（32x32），无头像→显示当前的 UserRound 占位图标
- 头像加载失败时 fallback 到 UserRound 图标

**具体改动文件**：
- `components/modules/talent-radar/index.tsx`：修改姓名列渲染逻辑
- 可能需要新增一个 `Avatar` 组件或使用 next/image

### 问题4（后端）：latest_source_url 指向免职通知而非现任职位来源

**根因**：`leader_profile_store.py` 中 `latest_source_url` 取最近一条 appointment_event 的 source_url，对于郑庆华来说就是 2025-04-28 的免去通知。

**修复方向**（后端，不在本次 Codex 范围内，先记录）：
- 对于有在任 experience 的领导，`latest_source_url` 应优先取在任 experience 的 source_url
- 或在前端详情中分别展示"现任来源"和"最近任免"

---

## 二、技术约束

1. **项目路径**：`/home/ubuntu/workspace/Dean-Agent-Fronted`
2. **构建命令**：`npm run build`
3. **部署命令**：`./deploy.sh restart`（在项目根目录执行）
4. **后端API地址**：`http://10.1.132.21:8001`（已在 lib/api.ts 中配置）
5. **框架**：Next.js 16 + TypeScript + Tailwind CSS + shadcn/ui
6. **只改 talent-radar 模块**，不要碰其他模块的代码
7. **不要修改后端代码**

## 三、数据结构参考

### LeaderProfile（来自 API /api/leaders）

```typescript
interface LeaderProfile {
  id: string;
  name: string;
  gender?: string | null;
  leader_domain: "government" | "university" | "mixed";
  current_positions?: string;
  current_orgs?: string;
  appointment_events: LeaderEvent[];
  experiences: LeaderExperience[];
  source_refs: LeaderSourceRef[];
  leader_details: {
    text?: string;
    summary?: string;
    media?: { avatar_url?: string };
    basic_info?: { gender?: string; party?: string; ethnicity?: string };
    quality?: { needs_review?: boolean };
    // ...其他字段
  };
  latest_event_date?: string | null;
  latest_source_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}
```

### LeaderExperience
```typescript
{
  position?: string;
  organization?: string;
  start_date?: string | null;
  end_date?: string | null;  // null = 至今/在任
  source_url?: string;
  end_source_url?: string;   // 离任来源
  bio?: string;
  intro_lines?: string[];
  profile_url?: string;
}
```

### LeaderEvent
```typescript
{
  name?: string;
  action?: string;     // "任命" 或 "免去"
  position?: string;
  organization?: string;
  event_date?: string;
  source_url?: string;
  source_title?: string;
  raw_sentence?: string;
}
```

## 四、验收标准

1. 打开领导画像页面，默认只显示现任领导（status=current）
2. 可以通过筛选器切换到"离任"或"全部"
3. 郑庆华在"现任"列表中仍出现（因为他还是同济党委书记），但他的校长职务已显示为已结束
4. 点击任意领导行，侧边抽屉弹出详情
5. 详情包含：履历时间线、任免事件、简介、来源
6. 有头像的领导显示头像，没有的显示占位图标
7. 构建无报错，部署成功
