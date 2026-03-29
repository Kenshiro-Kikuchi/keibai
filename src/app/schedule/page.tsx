import { getScheduleProperties } from "@/lib/data";
import Link from "next/link";
import { formatDate, getPropertyTypeLabel, formatPrice } from "@/lib/utils";

export default function SchedulePage() {
  const properties = getScheduleProperties();

  // Group by opening date
  const grouped = properties.reduce<Record<string, typeof properties>>((acc, prop) => {
    const dateKey = prop.openingDate.split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(prop);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">売却スケジュール</h1>

      {Object.keys(grouped).length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">予定されている売却はありません</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([dateKey, props]) => (
            <div key={dateKey} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-blue-50 px-6 py-3 border-b">
                <h2 className="text-lg font-bold text-blue-900">
                  開札日: {formatDate(dateKey)}
                  <span className="ml-3 text-sm font-normal text-blue-600">{props.length}件</span>
                </h2>
              </div>
              <div className="divide-y">
                {props.map((prop) => (
                  <div key={prop.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex flex-col gap-2">
                      <div>
                        <Link href={`/properties/${prop.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base break-all">
                          {prop.address}
                        </Link>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs sm:text-sm text-gray-500">
                          <span>{getPropertyTypeLabel(prop.propertyType)}</span>
                          <span>{prop.court.name}</span>
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 mt-1">
                          入札: {formatDate(prop.bidStartDate)} 〜 {formatDate(prop.bidEndDate)}
                        </div>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-xs sm:text-sm text-gray-500 mr-2">売却基準価額</span>
                        <span className="text-base sm:text-lg font-bold text-red-600">{formatPrice(prop.basePrice)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
