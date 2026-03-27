import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice, formatDate, getPropertyTypeLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const results = await prisma.saleResult.findMany({
    include: {
      property: {
        include: { court: true },
      },
    },
    orderBy: { resultDate: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">売却結果照会</h1>

      {results.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">売却結果はまだありません</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">物件</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">種別</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">売却基準価額</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">落札価額</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">倍率</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">入札数</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">結果日</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link href={`/properties/${result.property.id}`} className="text-blue-600 hover:text-blue-800 text-sm">
                        {result.property.address}
                      </Link>
                      <p className="text-xs text-gray-400">{result.property.court.name}</p>
                    </td>
                    <td className="px-4 py-3 text-sm">{getPropertyTypeLabel(result.property.propertyType)}</td>
                    <td className="px-4 py-3 text-sm text-right">{formatPrice(result.property.basePrice)}</td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-green-600">{formatPrice(result.winningBid)}</td>
                    <td className="px-4 py-3 text-sm text-right">{(result.winningBid / result.property.basePrice).toFixed(2)}倍</td>
                    <td className="px-4 py-3 text-sm text-right">{result.bidCount}件</td>
                    <td className="px-4 py-3 text-sm">{formatDate(result.resultDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
