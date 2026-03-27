"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { REGIONS, REGION_PREFECTURES, FLOOR_PLANS, type Region } from "@/types";
import { DEFAULT_MIN_LAND_AREA, DEFAULT_MIN_CONSTRUCTION_YEAR, PRICE_RANGES, SORT_OPTIONS } from "@/lib/constants";

export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [region, setRegion] = useState(searchParams.get("region") || "");
  const [prefecture, setPrefecture] = useState(searchParams.get("prefecture") || "");
  const [propertyTypes, setPropertyTypes] = useState<string[]>(
    searchParams.getAll("propertyType")
  );
  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") || "");
  const [landAreaMin, setLandAreaMin] = useState(
    searchParams.get("landAreaMin") || String(DEFAULT_MIN_LAND_AREA)
  );
  const [constructionYearMin, setConstructionYearMin] = useState(
    searchParams.get("constructionYearMin") || String(DEFAULT_MIN_CONSTRUCTION_YEAR)
  );
  const [floorPlans, setFloorPlans] = useState<string[]>(
    searchParams.getAll("floorPlan")
  );
  const [status, setStatus] = useState(searchParams.get("status") || "");

  const handlePropertyTypeChange = useCallback((type: string) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }, []);

  const handleFloorPlanChange = useCallback((plan: string) => {
    setFloorPlans((prev) =>
      prev.includes(plan) ? prev.filter((p) => p !== plan) : [...prev, plan]
    );
  }, []);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (region) params.set("region", region);
    if (prefecture) params.set("prefecture", prefecture);
    propertyTypes.forEach((t) => params.append("propertyType", t));
    if (priceMin) params.set("priceMin", priceMin);
    if (priceMax) params.set("priceMax", priceMax);
    if (landAreaMin) params.set("landAreaMin", landAreaMin);
    if (constructionYearMin) params.set("constructionYearMin", constructionYearMin);
    floorPlans.forEach((p) => params.append("floorPlan", p));
    if (status) params.set("status", status);
    router.push(`/properties?${params.toString()}`);
  }, [region, prefecture, propertyTypes, priceMin, priceMax, landAreaMin, constructionYearMin, floorPlans, status, router]);

  const handleReset = useCallback(() => {
    setRegion("");
    setPrefecture("");
    setPropertyTypes([]);
    setPriceMin("");
    setPriceMax("");
    setLandAreaMin(String(DEFAULT_MIN_LAND_AREA));
    setConstructionYearMin(String(DEFAULT_MIN_CONSTRUCTION_YEAR));
    setFloorPlans([]);
    setStatus("");
    router.push("/properties");
  }, [router]);

  const prefectures = region ? REGION_PREFECTURES[region as Region] || [] : [];

  // 建築年の選択肢を生成
  const yearOptions = [];
  for (let y = 2025; y >= 1960; y -= 1) {
    yearOptions.push(y);
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">検索条件</h2>

      {/* 地域 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">地域</label>
        <select
          value={region}
          onChange={(e) => { setRegion(e.target.value); setPrefecture(""); }}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="">すべて</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* 都道府県 */}
      {prefectures.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">都道府県</label>
          <select
            value={prefecture}
            onChange={(e) => setPrefecture(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="">すべて</option>
            {prefectures.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      )}

      {/* 物件種別 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">物件種別</label>
        <div className="space-y-1">
          {[
            { value: "house", label: "戸建て" },
            { value: "apartment", label: "マンション" },
            { value: "land", label: "土地" },
            { value: "other", label: "その他" },
          ].map((type) => (
            <label key={type.value} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={propertyTypes.includes(type.value)}
                onChange={() => handlePropertyTypeChange(type.value)}
                className="rounded border-gray-300"
              />
              {type.label}
            </label>
          ))}
        </div>
      </div>

      {/* 価格帯 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">価格帯</label>
        <div className="flex items-center gap-2">
          <select
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-2 py-2 text-sm"
          >
            {PRICE_RANGES.map((r) => (
              <option key={`min-${r.value}`} value={r.value}>{r.label}</option>
            ))}
          </select>
          <span className="text-gray-500 text-sm">〜</span>
          <select
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-2 py-2 text-sm"
          >
            {PRICE_RANGES.map((r) => (
              <option key={`max-${r.value}`} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 土地面積 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          土地面積（平米以上）
        </label>
        <input
          type="number"
          value={landAreaMin}
          onChange={(e) => setLandAreaMin(e.target.value)}
          placeholder="90"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">デフォルト: {DEFAULT_MIN_LAND_AREA}㎡以上</p>
      </div>

      {/* 建築年 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">建築年（以降）</label>
        <select
          value={constructionYearMin}
          onChange={(e) => setConstructionYearMin(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="">指定なし</option>
          {yearOptions.map((y) => (
            <option key={y} value={y}>{y}年以降</option>
          ))}
        </select>
        <p className="text-xs text-gray-400 mt-1">デフォルト: {DEFAULT_MIN_CONSTRUCTION_YEAR}年以降（新耐震基準）</p>
      </div>

      {/* 間取り */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">間取り</label>
        <div className="grid grid-cols-2 gap-1">
          {FLOOR_PLANS.map((plan) => (
            <label key={plan} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={floorPlans.includes(plan)}
                onChange={() => handleFloorPlanChange(plan)}
                className="rounded border-gray-300"
              />
              {plan}
            </label>
          ))}
        </div>
      </div>

      {/* 入札状況 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">入札状況</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        >
          <option value="">すべて</option>
          <option value="bidding">入札期間中</option>
          <option value="pre_opening">開札前</option>
        </select>
      </div>

      {/* ボタン */}
      <div className="space-y-2">
        <button
          onClick={handleSearch}
          className="w-full bg-blue-600 text-white rounded py-2 px-4 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          検索する
        </button>
        <button
          onClick={handleReset}
          className="w-full bg-gray-100 text-gray-700 rounded py-2 px-4 text-sm hover:bg-gray-200 transition-colors"
        >
          条件をリセット
        </button>
      </div>
    </div>
  );
}
