const ERA_OFFSETS: Record<string, number> = {
  明治: 1867,
  大正: 1911,
  昭和: 1925,
  平成: 1988,
  令和: 2018,
  M: 1867,
  T: 1911,
  S: 1925,
  H: 1988,
  R: 2018,
};

export function japaneseEraToYear(text: string): number | null {
  if (!text) return null;

  // "昭和59年10月" or "平成12年" pattern
  const eraMatch = text.match(/(明治|大正|昭和|平成|令和)(\d+)年/);
  if (eraMatch) {
    const offset = ERA_OFFSETS[eraMatch[1]];
    return offset + parseInt(eraMatch[2]);
  }

  // "S59" or "R06" pattern
  const shortMatch = text.match(/([MTSH R])(\d+)/);
  if (shortMatch) {
    const offset = ERA_OFFSETS[shortMatch[1]];
    if (offset) return offset + parseInt(shortMatch[2]);
  }

  // "1984" or "1984年" pattern
  const yearMatch = text.match(/(\d{4})/);
  if (yearMatch) {
    return parseInt(yearMatch[1]);
  }

  return null;
}

export function parseDateString(text: string): string | null {
  if (!text) return null;

  // "2026/04/02" pattern
  const slashMatch = text.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
  if (slashMatch) {
    const [, y, m, d] = slashMatch;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  // "令和8年4月2日" pattern
  const eraDateMatch = text.match(/(明治|大正|昭和|平成|令和)(\d+)年(\d+)月(\d+)日/);
  if (eraDateMatch) {
    const year = ERA_OFFSETS[eraDateMatch[1]] + parseInt(eraDateMatch[2]);
    return `${year}-${eraDateMatch[3].padStart(2, "0")}-${eraDateMatch[4].padStart(2, "0")}`;
  }

  return null;
}
