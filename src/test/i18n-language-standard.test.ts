import { describe, expect, it } from "vitest";
import { dict, hoursSourceNe } from "@/lib/i18n";

const placeholders = (value: string) => (value.match(/\{[A-Za-z0-9_]+\}/g) ?? []).sort();

describe("bilingual interface copy", () => {
  it("keeps English and Nepali translation keys aligned", () => {
    expect(Object.keys(dict.ne).sort()).toEqual(Object.keys(dict.en).sort());
  });

  it("keeps both language values non-empty", () => {
    for (const key of Object.keys(dict.en) as Array<keyof typeof dict.en>) {
      expect(dict.en[key].trim(), `English value for ${String(key)}`).not.toBe("");
      expect(dict.ne[key].trim(), `Nepali value for ${String(key)}`).not.toBe("");
    }
  });

  it("keeps interpolation placeholders aligned", () => {
    for (const key of Object.keys(dict.en) as Array<keyof typeof dict.en>) {
      expect(placeholders(dict.ne[key]), `Nepali placeholders for ${String(key)}`).toEqual(placeholders(dict.en[key]));
    }
  });

  it("avoids em dashes in translated interface copy", () => {
    const copy = [...Object.values(dict.en), ...Object.values(dict.ne), ...Object.values(hoursSourceNe)];
    expect(copy.filter((value) => value.includes("\u2014"))).toEqual([]);
  });
});
