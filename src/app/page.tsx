import Link from "next/link";
import { getPropertyCount, getLatestProperties } from "@/lib/data";
import RegionMap from "@/components/RegionMap";
import PropertyCard from "@/components/PropertyCard";

export default function HomePage() {
  const totalCount = getPropertyCount();
  const latestProperties = getLatestProperties(6);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-blue-900 text-white rounded-lg p-4 sm:p-8 mb-8 text-center">
        <h1 className="text-xl sm:text-3xl font-bold mb-2">不動産物件情報</h1>
        <p className="text-sm sm:text-base text-blue-200 mb-4">全国の不動産物件を簡単検索</p>
        <p className="text-lg sm:text-2xl font-bold whitespace-nowrap">
          現在 <span className="text-yellow-300">{totalCount}</span> 件の物件を公開中
        </p>
        <Link
          href="/properties"
          className="inline-block mt-4 bg-white text-blue-900 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
        >
          物件を検索する
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Region map */}
        <div className="lg:col-span-1">
          <RegionMap />

          {/* お知らせ */}
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">お知らせ</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="text-gray-400 whitespace-nowrap">2026/03/19</span>
                <span>サイトをリニューアルしました</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gray-400 whitespace-nowrap">2026/03/15</span>
                <span>新着物件の通知機能を追加しました</span>
              </li>
              <li className="flex gap-3">
                <span className="text-gray-400 whitespace-nowrap">2026/03/01</span>
                <span>検索条件の保存機能を追加しました</span>
              </li>
            </ul>
          </div>
        </div>

        {/* New properties */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">新着物件</h2>
            <Link href="/properties" className="text-blue-600 hover:text-blue-800 text-sm">
              すべて見る &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
