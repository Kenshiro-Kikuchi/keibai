import { getPropertyById } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatPrice, formatConstructionYear, formatDate, getPropertyTypeLabel, getStatusLabel, getStatusColor, sqmToTsubo } from "@/lib/utils";

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) notFound();

  const property = getPropertyById(id) as any;
  if (!property) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-blue-600">トップ</Link>
        <span className="mx-2">/</span>
        <Link href="/properties" className="hover:text-blue-600">物件検索</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">物件詳細</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded">
            {getPropertyTypeLabel(property.propertyType)}
          </span>
          <span className={`text-sm font-medium px-3 py-1 rounded ${getStatusColor(property.status)}`}>
            {getStatusLabel(property.status)}
          </span>
          <span className="text-sm text-gray-500">{property.caseNumber}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{property.address}</h1>
        <p className="text-sm text-gray-500">{property.court.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image placeholder */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="bg-gray-200 h-64 flex items-center justify-center">
              <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6v12.75A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
          </div>

          {/* Property specs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">物件情報</h2>
            <table className="w-full">
              <tbody className="divide-y">
                <tr><td className="py-3 text-sm text-gray-500 w-32">所在地</td><td className="py-3 text-sm font-medium">{property.address}</td></tr>
                <tr><td className="py-3 text-sm text-gray-500">物件種別</td><td className="py-3 text-sm">{getPropertyTypeLabel(property.propertyType)}</td></tr>
                {property.landArea > 0 && <tr><td className="py-3 text-sm text-gray-500">土地面積</td><td className="py-3 text-sm">{property.landArea}㎡（{sqmToTsubo(property.landArea)}坪）</td></tr>}
                {property.buildingArea && <tr><td className="py-3 text-sm text-gray-500">建物面積</td><td className="py-3 text-sm">{property.buildingArea}㎡（{sqmToTsubo(property.buildingArea)}坪）</td></tr>}
                {property.constructionYear && <tr><td className="py-3 text-sm text-gray-500">建築年</td><td className="py-3 text-sm">{formatConstructionYear(property.constructionYear)}</td></tr>}
                {property.structure && <tr><td className="py-3 text-sm text-gray-500">構造</td><td className="py-3 text-sm">{property.structure}</td></tr>}
                {property.floorPlan && <tr><td className="py-3 text-sm text-gray-500">間取り</td><td className="py-3 text-sm">{property.floorPlan}</td></tr>}
                {property.floors && <tr><td className="py-3 text-sm text-gray-500">階数</td><td className="py-3 text-sm">{property.floors}階</td></tr>}
                {property.zoning && <tr><td className="py-3 text-sm text-gray-500">用途地域</td><td className="py-3 text-sm">{property.zoning}</td></tr>}
                {property.nearestStation && <tr><td className="py-3 text-sm text-gray-500">最寄り駅</td><td className="py-3 text-sm">{property.nearestStation} {property.stationDistance}</td></tr>}
              </tbody>
            </table>
          </div>

          {/* 3点セット */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">物件資料</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "物件明細書", desc: "不動産の表示、権利関係、占有状況" },
                { name: "現況調査報告書", desc: "現況地目、建物構造、占有者情報" },
                { name: "評価書", desc: "周辺環境、評価額、算出根拠" },
              ].map((doc) => (
                <div key={doc.name} className="border rounded-lg p-4 text-center">
                  <svg className="w-10 h-10 mx-auto text-red-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  <p className="font-medium text-sm mb-1">{doc.name}</p>
                  <p className="text-xs text-gray-400 mb-2">{doc.desc}</p>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">PDF準備中</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">価格情報</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-500">売却基準価額</p>
              <p className="text-2xl font-bold text-red-600">{formatPrice(property.basePrice)}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">買受可能価額</p>
              <p className="text-xl font-bold text-gray-800">{formatPrice(property.minimumBidPrice)}</p>
            </div>
            {property.saleResult && (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">落札価額</p>
                <p className="text-xl font-bold text-green-600">{formatPrice(property.saleResult.winningBid)}</p>
                <p className="text-sm text-gray-500 mt-1">入札数: {property.saleResult.bidCount}件</p>
                <p className="text-sm text-gray-500">落札倍率: {(property.saleResult.winningBid / property.basePrice).toFixed(2)}倍</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">スケジュール</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">入札期間</p>
                <p className="text-sm font-medium">{formatDate(property.bidStartDate)} 〜 {formatDate(property.bidEndDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">開札期日</p>
                <p className="text-sm font-medium">{formatDate(property.openingDate)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">掲載元情報</h2>
            <p className="text-sm font-medium">{property.court.name}</p>
            <p className="text-sm text-gray-500 mt-1">物件番号: {property.caseNumber}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
