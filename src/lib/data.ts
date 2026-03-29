/**
 * JSONベースのデータソース
 * 981.jpからスクレイピングした実データを使用
 */

import scrapedData from "./scraped-data.json";

export interface Court {
  id: number;
  name: string;
  region: string;
  prefecture: string;
}

export interface Property {
  id: number;
  courtId: number;
  court: Court;
  caseNumber: string;
  propertyType: string;
  address: string;
  prefecture: string;
  city: string;
  basePrice: number;
  minimumBidPrice: number;
  landArea: number;
  buildingArea: number | null;
  constructionYear: number | null;
  structure: string | null;
  floorPlan: string | null;
  floors: number | null;
  zoning: string | null;
  bidStartDate: string;
  bidEndDate: string;
  openingDate: string;
  isOwnListing: boolean;
  status: string;
  latitude: number | null;
  longitude: number | null;
  nearestStation: string | null;
  stationDistance: string | null;
  createdAt: string;
}

export interface SaleResult {
  id: number;
  propertyId: number;
  property: Property;
  winningBid: number;
  bidCount: number;
  resultDate: string;
}

const courts: Court[] = scrapedData.courts as Court[];

function getCourt(id: number): Court {
  return courts.find((c) => c.id === id) || { id, name: "不明", region: "関東", prefecture: "東京都" };
}

// courtを結合したプロパティ一覧
export const properties: Property[] = (scrapedData.properties as Array<Omit<Property, "court">>).map((p) => ({
  ...p,
  court: getCourt(p.courtId),
}));

// スクレイピングデータには売却結果は含まれないため空配列
export const saleResults: SaleResult[] = [];

// ---- クエリ関数 ----

export function getPropertyCount(excludeOwn = true): number {
  return properties.filter(
    (p) => (!excludeOwn || !p.isOwnListing) && p.status !== "withdrawn"
  ).length;
}

export function getLatestProperties(limit = 6): Property[] {
  return properties
    .filter((p) => !p.isOwnListing && p.status === "bidding")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export function getPropertyById(id: number): Property | undefined {
  const prop = properties.find((p) => p.id === id);
  if (!prop) return undefined;
  const result = saleResults.find((r) => r.propertyId === id);
  return { ...prop, saleResult: result } as Property & { saleResult?: SaleResult };
}

export function getSaleResults(): SaleResult[] {
  return saleResults.sort((a, b) => b.resultDate.localeCompare(a.resultDate));
}

export function getScheduleProperties(): Property[] {
  return properties
    .filter((p) => !p.isOwnListing && (p.status === "bidding" || p.status === "pre_opening"))
    .sort((a, b) => a.openingDate.localeCompare(b.openingDate));
}
