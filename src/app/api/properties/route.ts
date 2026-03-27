import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_MIN_LAND_AREA, DEFAULT_MIN_CONSTRUCTION_YEAR, DEFAULT_PER_PAGE } from "@/lib/constants";
import { REGION_PREFECTURES, type Region } from "@/types";
import { Prisma } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const region = searchParams.get("region");
  const prefecture = searchParams.get("prefecture");
  const propertyTypes = searchParams.getAll("propertyType");
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  const landAreaMin = searchParams.get("landAreaMin") || String(DEFAULT_MIN_LAND_AREA);
  const constructionYearMin = searchParams.get("constructionYearMin") || String(DEFAULT_MIN_CONSTRUCTION_YEAR);
  const floorPlans = searchParams.getAll("floorPlan");
  const status = searchParams.get("status");
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || String(DEFAULT_PER_PAGE));

  // Build where clause
  const where: Prisma.PropertyWhereInput = {
    isOwnListing: false, // 常に自社物件を除外
  };

  // Region filter
  if (prefecture) {
    where.prefecture = prefecture;
  } else if (region) {
    const prefectures = REGION_PREFECTURES[region as Region];
    if (prefectures) {
      where.prefecture = { in: prefectures };
    }
  }

  // Property type filter
  if (propertyTypes.length > 0) {
    where.propertyType = { in: propertyTypes };
  }

  // Price filter
  if (priceMin || priceMax) {
    where.basePrice = {};
    if (priceMin) (where.basePrice as Prisma.IntFilter).gte = parseInt(priceMin);
    if (priceMax) (where.basePrice as Prisma.IntFilter).lte = parseInt(priceMax);
  }

  // Land area filter
  if (landAreaMin && parseInt(landAreaMin) > 0) {
    where.OR = [
      { landArea: { gte: parseFloat(landAreaMin) } },
      { propertyType: "apartment", landArea: 0 }, // マンションは土地面積0を許容
    ];
  }

  // Construction year filter
  if (constructionYearMin) {
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
      {
        OR: [
          { constructionYear: { gte: parseInt(constructionYearMin) } },
          { constructionYear: null }, // 土地は建築年なし
        ],
      },
    ];
  }

  // Floor plan filter
  if (floorPlans.length > 0) {
    where.floorPlan = { in: floorPlans };
  }

  // Status filter
  if (status) {
    where.status = status;
  }

  // Sort
  let orderBy: Prisma.PropertyOrderByWithRelationInput;
  switch (sort) {
    case "price_asc":
      orderBy = { basePrice: "asc" };
      break;
    case "price_desc":
      orderBy = { basePrice: "desc" };
      break;
    case "area_desc":
      orderBy = { landArea: "desc" };
      break;
    case "opening_asc":
      orderBy = { openingDate: "asc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: { court: true },
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.property.count({ where }),
  ]);

  return NextResponse.json({
    properties,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  });
}
