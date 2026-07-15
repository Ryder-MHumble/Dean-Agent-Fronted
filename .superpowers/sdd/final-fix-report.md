# 政策情报预览最终审查修复报告

## 修复范围

- 详情字段严格映射：AI 摘要仅使用 `trim(aiInsight) || trim(summary)`，政策解读仅使用 `trim(detail)`，政策原文仅使用 `trim(content)`。
- 详情模块常驻：缺失内容显示中文空态，包含空标签状态。
- 影响范围仅展示真实字段：`matchScore`、`relevance`、`importance`；前两项仅在字段存在时显示。
- 筛选事件在更新筛选状态前同步执行 `setPage(1)`；翻页回调只更新页码；删除筛选依赖的分页重置 effect。

## RED 证据

首次运行：

```text
node --test tests/policy-preview.test.mjs tests/policy-preview-route.test.mjs
tests 20, pass 16, fail 4, exit 1
```

失败项与缺失行为一致：

- `policy detail uses strict section mapping and keeps every section mounted`
- `policy detail shows only real impact fields`
- `filter callbacks reset pagination before updating filter state`
- `getPolicyPreviewDetailSections trims fields without cross-section fallbacks`

复核规格后补充标签常驻空态测试：

```text
node --test tests/policy-preview-route.test.mjs
tests 13, pass 12, fail 1, exit 1
```

唯一失败项为详情缺少 `暂无政策标签` 空态。

## GREEN 证据

```text
node --test tests/policy-preview.test.mjs tests/policy-preview-route.test.mjs
tests 20, pass 20, fail 0, exit 0
```

## 最终验证

```text
node --test tests/*.test.mjs
tests 118, pass 118, fail 0, exit 0

npx tsc --noEmit
exit 0

npm run build
compiled successfully; /policy-intel-preview generated as a static route; exit 0

git diff --check
exit 0
```

Node 测试仍输出仓库既有的 `MODULE_TYPELESS_PACKAGE_JSON` 警告；本次未修改 `package.json`，没有新增依赖，也没有测试失败。

## 提交

实现提交：`859558a466b2d1a00a4497734c050fcf9105686c`

报告文件单独提交，避免报告内容与其自身提交 SHA 形成不可自指关系；报告提交 SHA 在最终任务交付中记录。
