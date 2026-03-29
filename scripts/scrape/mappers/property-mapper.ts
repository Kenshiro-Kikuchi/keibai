import { RawPropertyData } from "../parsers/detail-parser.js";
import { getOrCreateCourt } from "./court-mapper.js";
import { japaneseEraToYear } from "../utils/date-utils.js";
import {
  parsePrice,
  parseArea,
  extractCity,
  mapPropertyType,
  parseFloors,
  normalizeFloorPlan,
} from "../utils/text-utils.js";

export interface MappedProperty {
  id: number;
  courtId: number;
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

let nextPropertyId = 1;

export function resetPropertyId(): void {
  nextPropertyId = 1;
}

export function mapProperty(
  raw: RawPropertyData,
  prefectureFromSearch: string
): MappedProperty | null {
  // Must have address and price
  if (!raw.address && !raw.basePriceText) {
    return null;
  }

  const address = raw.address || `${prefectureFromSearch}（住所不明）`;
  const prefecture = prefectureFromSearch;
  const city = extractCity(address, prefecture);

  const basePrice = parsePrice(raw.basePriceText || "") || 0;
  if (basePrice === 0) return null;

  const minimumBidPrice = parsePrice(raw.minimumBidPriceText || "") || Math.floor(basePrice * 0.8);
  const propertyType = mapPropertyType(raw.propertyTypeText || "");

  // For apartments, use exclusive area as building area
  let landArea = parseArea(raw.landAreaText || "") || 0;
  let buildingArea = parseArea(raw.buildingAreaText || "") ||
    parseArea(raw.exclusiveAreaText || "") || null;

  // If apartment with no land area, that's fine (shared land)
  if (propertyType === "apartment" && landArea === 0) {
    landArea = 0;
  }

  const constructionYear = japaneseEraToYear(raw.constructionDateText || "");
  const structure = raw.structure || null;
  const floorPlan = normalizeFloorPlan(raw.floorPlan);
  const floors = parseFloors(structure);

  // Determine status from dates
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  let status = "bidding";
  if (raw.bidEndDate && raw.bidEndDate < todayStr) {
    status = "pre_opening";
  }
  if (raw.openingDate && raw.openingDate < todayStr) {
    status = "sold";
  }

  const court = getOrCreateCourt(raw.courtName || "", prefecture);

  return {
    id: nextPropertyId++,
    courtId: court.id,
    caseNumber: raw.caseNumber || `案件番号不明-${raw.resId}`,
    propertyType,
    address,
    prefecture,
    city,
    basePrice,
    minimumBidPrice,
    landArea,
    buildingArea,
    constructionYear,
    structure,
    floorPlan,
    floors,
    zoning: raw.zoning || null,
    bidStartDate: raw.bidStartDate || todayStr,
    bidEndDate: raw.bidEndDate || todayStr,
    openingDate: raw.openingDate || todayStr,
    isOwnListing: false,
    status,
    latitude: raw.latitude,
    longitude: raw.longitude,
    nearestStation: raw.nearestStation || null,
    stationDistance: raw.stationDistance || null,
    createdAt: todayStr,
  };
}
