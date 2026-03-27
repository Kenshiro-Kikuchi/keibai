import { NextRequest, NextResponse } from "next/server";
import { properties } from "@/lib/data";
import { DEFAULT_MIN_LAND_AREA, DEFAULT_MIN_CONSTRUCTION_YEAR, DEFAULT_PER_PAGE } from "@/lib/constants";
import { REGION_PREFECTURES, type Region } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const region = searchParams.get("region");
  const prefecture = searchParams.get("prefecture");
  const propertyTypes = searchParams.getAll("propertyType");
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  const landAreaMin = parseFloat(searchParams.get("landAreaMin") || String(DEFAULT_MIN_LAND_AREA));
  const constructionYearMin = parseInt(searchParams.get("constructionYearMin") || String(DEFAULT_MIN_CONSTRUCTION_YEAR));
  const floorPlans = searchParams.getAll("floorPlan");
  const status = searchParams.get("status");
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || String(DEFAULT_PER_PAGE));

  let filtered = properties.filter((p) => !p.isOwnListing);

  // Region
  if (prefecture) {
    filtered = filtered.filter((p) => p.prefecture === prefecture);
  } else if (region) {
    const prefectures = REGION_PREFECTURES[region as Region];
    if (prefectures) {
      filtered = filtered.filter((p) => prefectures.includes(p.prefecture));
    }
  }

  // Property type
  if (propertyTypes.length > 0) {
    filtered = filtered.filter((p) => propertyTypes.includes(p.propertyType));
  }

  // Price
  if (priceMin) filtered = filtered.filter((p) => p.basePrice >= parseInt(priceMin));
  if (priceMax) filtered = filtered.filter((p) => p.basePrice <= parseInt(priceMax));

  // Land area (マンションは土地面積0を許容)
  if (landAreaMin > 0) {
    filtered = filtered.filter(
      (p) => p.landArea >= landAreaMin || (p.propertyType === "apartment" && p.landArea === 0)
    );
  }

  // Construction year (土地は建築年なし)
  if (constructionYearMin) {
    filtered = filtered.filter(
      (p) => (p.constructionYear && p.constructionYear >= constructionYearMin) || p.constructionYear === null
    );
  }

  // Floor plan
  if (floorPlans.length > 0) {
    filtered = filtered.filter((p) => p.floorPlan && floorPlans.includes(p.floorPlan));
  }

  // Status
  if (status) {
    filtered = filtered.filter((p) => p.status === status);
  }

  // Sort
  switch (sort) {
    case "price_asc":
      filtered.sort((a, b) => a.basePrice - b.basePrice);
      break;
    case "price_desc":
      filtered.sort((a, b) => b.basePrice - a.basePrice);
      break;
    case "area_desc":
      filtered.sort((a, b) => b.landArea - a.landArea);
      break;
    case "opening_asc":
      filtered.sort((a, b) => a.openingDate.localeCompare(b.openingDate));
      break;
    default:
      filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return NextResponse.json({
    properties: paginated,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  });
}
