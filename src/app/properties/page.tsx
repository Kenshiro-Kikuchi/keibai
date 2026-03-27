"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import SearchForm from "@/components/SearchForm";
import PropertyCard from "@/components/PropertyCard";
import Pagination from "@/components/Pagination";
import { SORT_OPTIONS, DEFAULT_PER_PAGE } from "@/lib/constants";

interface PropertyData {
  id: number;
  propertyType: string;
  address: string;
  basePrice: number;
  minimumBidPrice: number;
  landArea: number;
  buildingArea: number | null;
  constructionYear: number | null;
  floorPlan: string | null;
  status: string;
  bidStartDate: string;
  bidEndDate: string;
  openingDate: string;
  court: { name: string };
}

interface ApiResponse {
  properties: PropertyData[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    if (!params.has("sort")) params.set("sort", sort);
    const response = await fetch(`/api/properties?${params.toString()}`);
    const json = await response.json();
    setData(json);
    setLoading(false);
  }, [searchParams, sort]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/properties?${params.toString()}`);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    params.delete("page");
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">物件検索</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <SearchForm />
        </div>

        {/* Results */}
        <div className="flex-1">
          {/* Results header */}
          <div className="bg-white rounded-lg shadow p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              {data ? (
                <>
                  <span className="font-bold text-lg text-blue-600">{data.total}</span> 件の物件が見つかりました
                </>
              ) : (
                "検索中..."
              )}
            </p>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">並び替え:</label>
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Property list */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">検索中...</p>
            </div>
          ) : data && data.properties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              <Pagination
                currentPage={data.page}
                totalPages={data.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p className="text-gray-500 text-lg">条件に一致する物件が見つかりませんでした</p>
              <p className="text-gray-400 text-sm mt-2">検索条件を変更してお試しください</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-center">読み込み中...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}
