import Link from "next/link";
import { formatPrice, formatConstructionYear, formatDate, getPropertyTypeLabel, getStatusLabel, getStatusColor, sqmToTsubo } from "@/lib/utils";

interface PropertyCardProps {
  property: {
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
    bidStartDate: string | Date;
    bidEndDate: string | Date;
    openingDate: string | Date;
    court?: { name: string };
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/properties/${property.id}`} className="block">
      <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
        {/* Image placeholder */}
        <div className="bg-gray-200 h-48 flex items-center justify-center relative">
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0-.75 3.75m0 0-.75 3.75" />
          </svg>
          <div className="absolute top-2 left-2">
            <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
              {getPropertyTypeLabel(property.propertyType)}
            </span>
          </div>
          <div className="absolute top-2 right-2">
            <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(property.status)}`}>
              {getStatusLabel(property.status)}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-2">
            <p className="text-sm text-gray-500 truncate">{property.address}</p>
          </div>

          <div className="mb-3">
            <p className="text-xs text-gray-500">売却基準価額</p>
            <p className="text-xl font-bold text-red-600">{formatPrice(property.basePrice)}</p>
            <p className="text-xs text-gray-500">
              買受可能価額: {formatPrice(property.minimumBidPrice)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
            {property.landArea > 0 && (
              <div>
                <span className="text-xs text-gray-400">土地</span>
                <p>{property.landArea}㎡（{sqmToTsubo(property.landArea)}坪）</p>
              </div>
            )}
            {property.buildingArea && (
              <div>
                <span className="text-xs text-gray-400">建物</span>
                <p>{property.buildingArea}㎡（{sqmToTsubo(property.buildingArea)}坪）</p>
              </div>
            )}
            {property.constructionYear && (
              <div>
                <span className="text-xs text-gray-400">建築年</span>
                <p>{formatConstructionYear(property.constructionYear)}</p>
              </div>
            )}
            {property.floorPlan && (
              <div>
                <span className="text-xs text-gray-400">間取り</span>
                <p>{property.floorPlan}</p>
              </div>
            )}
          </div>

          <div className="border-t pt-2 text-xs text-gray-500">
            <p>入札期間: {formatDate(property.bidStartDate)} 〜 {formatDate(property.bidEndDate)}</p>
            <p>開札期日: {formatDate(property.openingDate)}</p>
            {property.court && <p className="mt-1">{property.court.name}</p>}
          </div>
        </div>
      </div>
    </Link>
  );
}
