import { PREFECTURE_TO_REGION } from "../config.js";

export interface CourtData {
  id: number;
  name: string;
  region: string;
  prefecture: string;
}

const courtRegistry = new Map<string, CourtData>();
let nextCourtId = 1;

export function getOrCreateCourt(courtName: string, prefecture: string): CourtData {
  const key = courtName || `${prefecture}地方裁判所`;

  if (courtRegistry.has(key)) {
    return courtRegistry.get(key)!;
  }

  const region = PREFECTURE_TO_REGION[prefecture] || "関東";
  const court: CourtData = {
    id: nextCourtId++,
    name: key,
    region,
    prefecture,
  };

  courtRegistry.set(key, court);
  return court;
}

export function getAllCourts(): CourtData[] {
  return Array.from(courtRegistry.values());
}

export function resetCourts(): void {
  courtRegistry.clear();
  nextCourtId = 1;
}
