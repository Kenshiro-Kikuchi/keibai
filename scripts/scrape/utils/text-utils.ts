function toHalfWidth(text: string): string {
  return text
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[Ａ-Ｚ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[ａ-ｚ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/．/g, ".")
    .replace(/，/g, ",")
    .replace(/　/g, " ");
}

export function parsePrice(text: string): number | null {
  if (!text) return null;

  const half = toHalfWidth(text);
  const cleaned = half.replace(/[^\d,]/g, "").replace(/,/g, "");
  if (!cleaned) return null;

  const value = parseInt(cleaned);
  return isNaN(value) ? null : value;
}

export function parseArea(text: string): number | null {
  if (!text) return null;

  const half = toHalfWidth(text);
  // Match patterns like "120.50m²" or "120.5㎡" or "299.69m2"
  const match = half.match(/([\d,.]+)\s*[m㎡²]/);
  if (!match) return null;

  const value = parseFloat(match[1].replace(/,/g, ""));
  return isNaN(value) ? null : value;
}

export function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function extractCity(address: string, prefecture: string): string {
  const withoutPref = address.replace(prefecture, "");
  // Match city/ward/town/village patterns
  const cityMatch = withoutPref.match(
    /^(.+?[市区町村])/
  );
  return cityMatch ? cityMatch[1] : withoutPref.split(/\d/)[0] || "";
}

export function mapPropertyType(typeText: string): string {
  if (!typeText) return "other";
  if (typeText.includes("マンション") || typeText.includes("区分所有")) return "apartment";
  if (typeText.includes("戸建") || typeText.includes("一戸建")) return "house";
  if (typeText.includes("土地")) return "land";
  return "other";
}

export function parseFloors(structure: string | null): number | null {
  if (!structure) return null;
  const match = structure.match(/(\d+)階建/);
  return match ? parseInt(match[1]) : null;
}

export function normalizeFloorPlan(text: string | null): string | null {
  if (!text) return null;
  // Convert full-width to half-width
  let cleaned = text
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[Ａ-Ｚ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[ａ-ｚ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/\s+/g, "")
    .toUpperCase();

  if (cleaned.includes("ワンルーム") || cleaned.includes("ルーム") || cleaned === "1R") return "1R";
  // Match patterns like "3LDK", "2DK", "1K"
  const match = cleaned.match(/(\d+)\s*([RLDK]+)/);
  if (match) return `${match[1]}${match[2]}`;
  return text.trim() || null;
}
