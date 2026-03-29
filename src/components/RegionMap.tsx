"use client";

import Link from "next/link";

const regions = [
  "北海道",
  "東北",
  "北陸・甲信越",
  "関東",
  "東海",
  "近畿",
  "中国",
  "四国",
  "九州・沖縄",
];

export default function RegionMap() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        地域から探す
      </h2>
      <div className="flex flex-wrap justify-center gap-3">
        {regions.map((region) => (
          <Link
            key={region}
            href={`/properties?region=${encodeURIComponent(region)}`}
            className="flex items-center justify-center bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 hover:border-blue-600 rounded-lg p-3 transition-colors whitespace-nowrap w-[calc(33.333%-0.5rem)]"
          >
            <span className="font-medium text-xs sm:text-sm">
              {region}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
