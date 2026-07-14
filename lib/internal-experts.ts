export interface InternalExpert {
  name: string;
  organization: string;
  department: string;
  title: string;
  role: string;
  region: string;
  researchAreas: string;
  discipline: string;
  updatedAt: string;
}

type UnknownRecord = Record<string, unknown>;

const FIELD_KEYS = {
  name: ["姓名", "tcxby54g21e2aq4gopccb"],
  organization: ["工作单位", "o9l11ngxrd2ikoyunvn7l"],
  department: ["院系部门", "mq8ijhra85eyzo72sxlmp"],
  title: ["职称", "dgblc81wqha6e3wx5bmfo"],
  role: ["职务", "m4de73nnwjz2qrfakfkfi"],
  region: ["地区", "gg8ooqpjhk3x1c6u5z82u"],
  researchAreas: ["研究领域或研究方向", "fxpagnnvs362z2kh87ks1"],
  discipline: ["学科方向", "w3d34a2f11t4syyp6f23k"],
  updatedAt: ["更新时间", "0ty4y32e5b694b522xzwj"],
} as const;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toText(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (isRecord(value) && typeof value.name === "string") {
    return value.name;
  }

  return "";
}

function readApprovedField(
  source: UnknownRecord,
  keys: readonly [string, string],
): string {
  return toText(source[keys[0]] ?? source[keys[1]]);
}

export function sanitizeExpertRecord(record: unknown): InternalExpert {
  const input = isRecord(record) ? record : {};
  const source = isRecord(input.cells) ? input.cells : input;

  return {
    name: readApprovedField(source, FIELD_KEYS.name),
    organization: readApprovedField(source, FIELD_KEYS.organization),
    department: readApprovedField(source, FIELD_KEYS.department),
    title: readApprovedField(source, FIELD_KEYS.title),
    role: readApprovedField(source, FIELD_KEYS.role),
    region: readApprovedField(source, FIELD_KEYS.region),
    researchAreas: readApprovedField(source, FIELD_KEYS.researchAreas),
    discipline: readApprovedField(source, FIELD_KEYS.discipline),
    updatedAt: readApprovedField(source, FIELD_KEYS.updatedAt),
  };
}

export function sanitizeExpertRecords(records: unknown[]): InternalExpert[] {
  return records.map(sanitizeExpertRecord);
}
