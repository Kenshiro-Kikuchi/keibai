/**
 * JSONベースのデータソース
 * Vercelサーバーレス環境でSQLiteが使えないため、
 * 静的JSONデータでAPIを提供する
 */

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

const courts: Court[] = [
  { id: 1, name: "東京地方裁判所", region: "関東", prefecture: "東京都" },
  { id: 2, name: "横浜地方裁判所", region: "関東", prefecture: "神奈川県" },
  { id: 3, name: "さいたま地方裁判所", region: "関東", prefecture: "埼玉県" },
  { id: 4, name: "千葉地方裁判所", region: "関東", prefecture: "千葉県" },
  { id: 5, name: "大阪地方裁判所", region: "近畿", prefecture: "大阪府" },
  { id: 6, name: "名古屋地方裁判所", region: "東海", prefecture: "愛知県" },
  { id: 7, name: "福岡地方裁判所", region: "九州・沖縄", prefecture: "福岡県" },
  { id: 8, name: "札幌地方裁判所", region: "北海道", prefecture: "北海道" },
  { id: 9, name: "仙台地方裁判所", region: "東北", prefecture: "宮城県" },
  { id: 10, name: "広島地方裁判所", region: "中国", prefecture: "広島県" },
];

function getCourt(id: number): Court {
  return courts.find((c) => c.id === id)!;
}

const propertiesRaw = [
  { id: 1, courtId: 1, caseNumber: "令和6年(ケ)第1234号", propertyType: "house", address: "東京都世田谷区成城1丁目1-1", prefecture: "東京都", city: "世田谷区", basePrice: 35000000, minimumBidPrice: 28000000, landArea: 120.5, buildingArea: 95.2, constructionYear: 1995, structure: "木造2階建", floorPlan: "4LDK", floors: 2, zoning: "第一種低層住居専用地域", bidStartDate: "2026-04-01", bidEndDate: "2026-04-08", openingDate: "2026-04-15", isOwnListing: false, status: "bidding", latitude: 35.6384, longitude: 139.5982, nearestStation: "成城学園前駅", stationDistance: "徒歩8分", createdAt: "2026-03-15" },
  { id: 2, courtId: 1, caseNumber: "令和6年(ケ)第1235号", propertyType: "apartment", address: "東京都練馬区光が丘3丁目2-5", prefecture: "東京都", city: "練馬区", basePrice: 18500000, minimumBidPrice: 14800000, landArea: 0, buildingArea: 72.4, constructionYear: 1988, structure: "鉄筋コンクリート造", floorPlan: "3LDK", floors: 8, zoning: "第一種中高層住居専用地域", bidStartDate: "2026-04-01", bidEndDate: "2026-04-08", openingDate: "2026-04-15", isOwnListing: false, status: "bidding", latitude: 35.7594, longitude: 139.6316, nearestStation: "光が丘駅", stationDistance: "徒歩5分", createdAt: "2026-03-14" },
  { id: 3, courtId: 2, caseNumber: "令和6年(ケ)第567号", propertyType: "house", address: "神奈川県横浜市青葉区美しが丘2丁目3-10", prefecture: "神奈川県", city: "横浜市青葉区", basePrice: 42000000, minimumBidPrice: 33600000, landArea: 150.3, buildingArea: 110.8, constructionYear: 2001, structure: "軽量鉄骨造2階建", floorPlan: "4LDK", floors: 2, zoning: "第一種低層住居専用地域", bidStartDate: "2026-04-05", bidEndDate: "2026-04-12", openingDate: "2026-04-19", isOwnListing: false, status: "bidding", latitude: 35.5689, longitude: 139.5583, nearestStation: "たまプラーザ駅", stationDistance: "徒歩12分", createdAt: "2026-03-13" },
  { id: 4, courtId: 3, caseNumber: "令和6年(ケ)第890号", propertyType: "house", address: "埼玉県さいたま市浦和区常盤5丁目1-8", prefecture: "埼玉県", city: "さいたま市浦和区", basePrice: 28000000, minimumBidPrice: 22400000, landArea: 100.2, buildingArea: 85.6, constructionYear: 1990, structure: "木造2階建", floorPlan: "3LDK", floors: 2, zoning: "第一種住居地域", bidStartDate: "2026-03-25", bidEndDate: "2026-04-01", openingDate: "2026-04-08", isOwnListing: false, status: "bidding", latitude: 35.8617, longitude: 139.6573, nearestStation: "北浦和駅", stationDistance: "徒歩10分", createdAt: "2026-03-12" },
  { id: 5, courtId: 4, caseNumber: "令和6年(ケ)第345号", propertyType: "land", address: "千葉県柏市柏の葉4丁目5-1", prefecture: "千葉県", city: "柏市", basePrice: 15000000, minimumBidPrice: 12000000, landArea: 200.0, buildingArea: null, constructionYear: null, structure: null, floorPlan: null, floors: null, zoning: "第一種住居地域", bidStartDate: "2026-04-10", bidEndDate: "2026-04-17", openingDate: "2026-04-24", isOwnListing: false, status: "bidding", latitude: 35.8917, longitude: 139.9465, nearestStation: "柏の葉キャンパス駅", stationDistance: "徒歩15分", createdAt: "2026-03-11" },
  { id: 6, courtId: 5, caseNumber: "令和6年(ケ)第2001号", propertyType: "house", address: "大阪府吹田市千里山東2丁目4-3", prefecture: "大阪府", city: "吹田市", basePrice: 32000000, minimumBidPrice: 25600000, landArea: 130.0, buildingArea: 100.5, constructionYear: 1998, structure: "木造2階建", floorPlan: "4LDK", floors: 2, zoning: "第一種低層住居専用地域", bidStartDate: "2026-04-01", bidEndDate: "2026-04-08", openingDate: "2026-04-15", isOwnListing: false, status: "bidding", latitude: 34.7736, longitude: 135.4917, nearestStation: "千里山駅", stationDistance: "徒歩7分", createdAt: "2026-03-10" },
  { id: 7, courtId: 6, caseNumber: "令和6年(ケ)第789号", propertyType: "apartment", address: "愛知県名古屋市千種区覚王山通8丁目2-1", prefecture: "愛知県", city: "名古屋市千種区", basePrice: 22000000, minimumBidPrice: 17600000, landArea: 0, buildingArea: 80.3, constructionYear: 2005, structure: "鉄筋コンクリート造", floorPlan: "3LDK", floors: 10, zoning: "商業地域", bidStartDate: "2026-04-03", bidEndDate: "2026-04-10", openingDate: "2026-04-17", isOwnListing: false, status: "bidding", latitude: 35.1643, longitude: 136.9510, nearestStation: "覚王山駅", stationDistance: "徒歩3分", createdAt: "2026-03-09" },
  { id: 8, courtId: 7, caseNumber: "令和6年(ケ)第456号", propertyType: "house", address: "福岡県福岡市早良区西新3丁目5-7", prefecture: "福岡県", city: "福岡市早良区", basePrice: 25000000, minimumBidPrice: 20000000, landArea: 110.0, buildingArea: 90.0, constructionYear: 1992, structure: "木造2階建", floorPlan: "3LDK", floors: 2, zoning: "第一種住居地域", bidStartDate: "2026-04-01", bidEndDate: "2026-04-08", openingDate: "2026-04-15", isOwnListing: false, status: "bidding", latitude: 33.5813, longitude: 130.3564, nearestStation: "西新駅", stationDistance: "徒歩6分", createdAt: "2026-03-08" },
  { id: 9, courtId: 8, caseNumber: "令和6年(ケ)第111号", propertyType: "house", address: "北海道札幌市中央区宮の森1条10丁目1-1", prefecture: "北海道", city: "札幌市中央区", basePrice: 20000000, minimumBidPrice: 16000000, landArea: 180.5, buildingArea: 120.3, constructionYear: 1985, structure: "木造2階建", floorPlan: "4LDK", floors: 2, zoning: "第一種低層住居専用地域", bidStartDate: "2026-04-05", bidEndDate: "2026-04-12", openingDate: "2026-04-19", isOwnListing: false, status: "bidding", latitude: 43.0554, longitude: 141.3241, nearestStation: "西28丁目駅", stationDistance: "徒歩15分", createdAt: "2026-03-07" },
  { id: 10, courtId: 9, caseNumber: "令和6年(ケ)第222号", propertyType: "house", address: "宮城県仙台市青葉区上杉2丁目3-5", prefecture: "宮城県", city: "仙台市青葉区", basePrice: 18000000, minimumBidPrice: 14400000, landArea: 95.0, buildingArea: 75.2, constructionYear: 1987, structure: "木造2階建", floorPlan: "3LDK", floors: 2, zoning: "第一種住居地域", bidStartDate: "2026-04-01", bidEndDate: "2026-04-08", openingDate: "2026-04-15", isOwnListing: false, status: "bidding", latitude: 38.2689, longitude: 140.8713, nearestStation: "北四番丁駅", stationDistance: "徒歩5分", createdAt: "2026-03-06" },
  { id: 11, courtId: 1, caseNumber: "令和6年(ケ)第9999号", propertyType: "house", address: "東京都渋谷区恵比寿1丁目1-1", prefecture: "東京都", city: "渋谷区", basePrice: 50000000, minimumBidPrice: 40000000, landArea: 100.0, buildingArea: 80.0, constructionYear: 2000, structure: "鉄筋コンクリート造", floorPlan: "3LDK", floors: 3, zoning: "商業地域", bidStartDate: "2026-04-01", bidEndDate: "2026-04-08", openingDate: "2026-04-15", isOwnListing: true, status: "bidding", latitude: 35.6467, longitude: 139.7100, nearestStation: "恵比寿駅", stationDistance: "徒歩3分", createdAt: "2026-03-05" },
  { id: 12, courtId: 1, caseNumber: "令和6年(ケ)第1111号", propertyType: "house", address: "東京都板橋区大山町1-2-3", prefecture: "東京都", city: "板橋区", basePrice: 12000000, minimumBidPrice: 9600000, landArea: 80.0, buildingArea: 65.0, constructionYear: 1975, structure: "木造2階建", floorPlan: "3DK", floors: 2, zoning: "第一種住居地域", bidStartDate: "2026-04-01", bidEndDate: "2026-04-08", openingDate: "2026-04-15", isOwnListing: false, status: "bidding", latitude: 35.7518, longitude: 139.7065, nearestStation: "大山駅", stationDistance: "徒歩5分", createdAt: "2026-03-04" },
  { id: 13, courtId: 2, caseNumber: "令和6年(ケ)第2222号", propertyType: "house", address: "神奈川県川崎市中原区新丸子1-1-1", prefecture: "神奈川県", city: "川崎市中原区", basePrice: 22000000, minimumBidPrice: 17600000, landArea: 60.0, buildingArea: 55.0, constructionYear: 1995, structure: "木造2階建", floorPlan: "2LDK", floors: 2, zoning: "第一種住居地域", bidStartDate: "2026-04-01", bidEndDate: "2026-04-08", openingDate: "2026-04-15", isOwnListing: false, status: "bidding", latitude: 35.5764, longitude: 139.6594, nearestStation: "新丸子駅", stationDistance: "徒歩3分", createdAt: "2026-03-03" },
  { id: 14, courtId: 10, caseNumber: "令和6年(ケ)第333号", propertyType: "house", address: "広島県広島市中区白島北町1-2", prefecture: "広島県", city: "広島市中区", basePrice: 16000000, minimumBidPrice: 12800000, landArea: 105.0, buildingArea: 82.0, constructionYear: 1993, structure: "木造2階建", floorPlan: "3LDK", floors: 2, zoning: "第一種住居地域", bidStartDate: "2026-04-10", bidEndDate: "2026-04-17", openingDate: "2026-04-24", isOwnListing: false, status: "bidding", latitude: 34.4048, longitude: 132.4649, nearestStation: "白島駅", stationDistance: "徒歩7分", createdAt: "2026-03-02" },
  { id: 15, courtId: 5, caseNumber: "令和6年(ケ)第2010号", propertyType: "apartment", address: "大阪府大阪市北区天神橋6丁目5-3", prefecture: "大阪府", city: "大阪市北区", basePrice: 15000000, minimumBidPrice: 12000000, landArea: 0, buildingArea: 65.0, constructionYear: 1990, structure: "鉄筋コンクリート造", floorPlan: "2LDK", floors: 12, zoning: "商業地域", bidStartDate: "2026-04-05", bidEndDate: "2026-04-12", openingDate: "2026-04-19", isOwnListing: false, status: "bidding", latitude: 34.7127, longitude: 135.5122, nearestStation: "天神橋筋六丁目駅", stationDistance: "徒歩2分", createdAt: "2026-03-01" },
  { id: 16, courtId: 1, caseNumber: "令和5年(ケ)第500号", propertyType: "house", address: "東京都杉並区荻窪3丁目1-5", prefecture: "東京都", city: "杉並区", basePrice: 30000000, minimumBidPrice: 24000000, landArea: 115.0, buildingArea: 90.5, constructionYear: 1997, structure: "木造2階建", floorPlan: "3LDK", floors: 2, zoning: "第一種低層住居専用地域", bidStartDate: "2026-01-15", bidEndDate: "2026-01-22", openingDate: "2026-01-29", isOwnListing: false, status: "sold", latitude: 35.7040, longitude: 139.6199, nearestStation: "荻窪駅", stationDistance: "徒歩8分", createdAt: "2026-01-10" },
  { id: 17, courtId: 2, caseNumber: "令和5年(ケ)第600号", propertyType: "apartment", address: "神奈川県横浜市中区山下町100", prefecture: "神奈川県", city: "横浜市中区", basePrice: 20000000, minimumBidPrice: 16000000, landArea: 0, buildingArea: 70.0, constructionYear: 2003, structure: "鉄筋コンクリート造", floorPlan: "2LDK", floors: 15, zoning: "商業地域", bidStartDate: "2026-02-01", bidEndDate: "2026-02-08", openingDate: "2026-02-15", isOwnListing: false, status: "sold", latitude: 35.4427, longitude: 139.6530, nearestStation: "元町・中華街駅", stationDistance: "徒歩5分", createdAt: "2026-01-25" },
];

// courtを結合したプロパティ一覧
export const properties: Property[] = propertiesRaw.map((p) => ({
  ...p,
  court: getCourt(p.courtId),
}));

export const saleResults: SaleResult[] = [
  { id: 1, propertyId: 16, property: properties.find((p) => p.id === 16)!, winningBid: 35500000, bidCount: 5, resultDate: "2026-01-29" },
  { id: 2, propertyId: 17, property: properties.find((p) => p.id === 17)!, winningBid: 24000000, bidCount: 3, resultDate: "2026-02-15" },
];

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
