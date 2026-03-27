// デフォルトフィルタ値
export const DEFAULT_MIN_LAND_AREA = 90; // 平米
export const DEFAULT_MIN_CONSTRUCTION_YEAR = 1983; // 昭和58年（新耐震基準考慮）

// ページネーション
export const DEFAULT_PER_PAGE = 20;
export const PER_PAGE_OPTIONS = [20, 50, 100];

// 価格帯選択肢（万円）
export const PRICE_RANGES = [
  { label: "指定なし", value: "" },
  { label: "500万円", value: "5000000" },
  { label: "1,000万円", value: "10000000" },
  { label: "1,500万円", value: "15000000" },
  { label: "2,000万円", value: "20000000" },
  { label: "3,000万円", value: "30000000" },
  { label: "5,000万円", value: "50000000" },
  { label: "1億円", value: "100000000" },
];

// ソートオプション
export const SORT_OPTIONS = [
  { label: "新着順", value: "newest" },
  { label: "価格が安い順", value: "price_asc" },
  { label: "価格が高い順", value: "price_desc" },
  { label: "面積が広い順", value: "area_desc" },
  { label: "開札日が近い順", value: "opening_asc" },
];
