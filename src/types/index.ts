export type PropertyType = "house" | "apartment" | "land" | "other";
export type PropertyStatus = "bidding" | "pre_opening" | "sold" | "withdrawn";

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  house: "戸建て",
  apartment: "マンション",
  land: "土地",
  other: "その他",
};

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
  bidding: "入札中",
  pre_opening: "開札前",
  sold: "売却済",
  withdrawn: "取下げ",
};

export const REGIONS = [
  "北海道",
  "東北",
  "北陸・甲信越",
  "関東",
  "東海",
  "近畿",
  "中国",
  "四国",
  "九州・沖縄",
] as const;

export type Region = (typeof REGIONS)[number];

export const REGION_PREFECTURES: Record<Region, string[]> = {
  北海道: ["北海道"],
  東北: ["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
  "北陸・甲信越": ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県"],
  関東: ["東京都", "神奈川県", "埼玉県", "千葉県", "茨城県", "栃木県", "群馬県"],
  東海: ["愛知県", "岐阜県", "静岡県", "三重県"],
  近畿: ["大阪府", "京都府", "兵庫県", "奈良県", "滋賀県", "和歌山県"],
  中国: ["広島県", "岡山県", "山口県", "島根県", "鳥取県"],
  四国: ["香川県", "愛媛県", "徳島県", "高知県"],
  "九州・沖縄": ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"],
};

export const FLOOR_PLANS = ["1R", "1K", "1LDK", "2LDK", "3LDK", "4LDK以上"] as const;

export interface SearchParams {
  region?: string;
  prefecture?: string;
  propertyType?: string[];
  priceMin?: number;
  priceMax?: number;
  landAreaMin?: number;
  landAreaMax?: number;
  constructionYearMin?: number;
  floorPlan?: string[];
  status?: string;
  sort?: string;
  page?: number;
  perPage?: number;
}
