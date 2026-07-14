import test from "node:test";
import assert from "node:assert/strict";

import {
  sanitizeExpertRecord,
  sanitizeExpertRecords,
} from "../lib/internal-experts.ts";

test("sanitizeExpertRecord excludes private contact fields", () => {
  const expert = sanitizeExpertRecord({
    姓名: "示例学者",
    工作单位: "示例大学",
    电子邮箱: "private@example.com",
    电话: "13800000000",
    研究领域或研究方向: "人工智能",
  });

  assert.deepEqual(expert, {
    name: "示例学者",
    organization: "示例大学",
    department: "",
    title: "",
    role: "",
    region: "",
    researchAreas: "人工智能",
    discipline: "",
    updatedAt: "",
  });
  assert.doesNotMatch(JSON.stringify(expert), /private@example.com|13800000000/);
});

test("sanitizeExpertRecords maps approved DWS fields and single-select names", () => {
  const experts = sanitizeExpertRecords([
    {
      recordId: "private-record-id",
      cells: {
        tcxby54g21e2aq4gopccb: "示例学者",
        o9l11ngxrd2ikoyunvn7l: "示例大学",
        mq8ijhra85eyzo72sxlmp: "人工智能学院",
        dgblc81wqha6e3wx5bmfo: { id: "private-title-id", name: "教授" },
        m4de73nnwjz2qrfakfkfi: "博士生导师",
        gg8ooqpjhk3x1c6u5z82u: { id: "private-region-id", name: "北京" },
        fxpagnnvs362z2kh87ks1: "人工智能",
        w3d34a2f11t4syyp6f23k: "理论与算法",
        "0ty4y32e5b694b522xzwj": "2026-07-06T00:00:00+08:00",
        unapprovedEmail: "private@example.com",
      },
    },
  ]);

  assert.deepEqual(experts, [
    {
      name: "示例学者",
      organization: "示例大学",
      department: "人工智能学院",
      title: "教授",
      role: "博士生导师",
      region: "北京",
      researchAreas: "人工智能",
      discipline: "理论与算法",
      updatedAt: "2026-07-06T00:00:00+08:00",
    },
  ]);
  assert.doesNotMatch(JSON.stringify(experts), /private|@/);
});
