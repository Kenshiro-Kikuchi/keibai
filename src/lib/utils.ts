// 平米から坪への変換
export function sqmToTsubo(sqm: number): string {
  return (sqm * 0.3025).toFixed(1);
}

// 価格フォーマット（万円表示）
export function formatPrice(yen: number): string {
  const man = yen / 10000;
  if (man >= 10000) {
    const oku = Math.floor(man / 10000);
    const remainder = man % 10000;
    if (remainder === 0) return `${oku}億円`;
    return `${oku}億${remainder.toLocaleString()}万円`;
  }
  return `${man.toLocaleString()}万円`;
}

// 西暦から和暦への変換
export function toWareki(year: number): string {
  if (year >= 2019) return `令和${year - 2018}年`;
  if (year >= 1989) return `平成${year - 1988}年`;
  if (year >= 1926) return `昭和${year - 1925}年`;
  if (year >= 1912) return `大正${year - 1911}年`;
  return `明治${year - 1867}年`;
}

// 建築年を「西暦（和暦）」形式で表示
export function formatConstructionYear(year: number | null): string {
  if (!year) return "-";
  return `${year}年（${toWareki(year)}）`;
}

// 日付フォーマット
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

// 物件種別の日本語ラベル
export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    house: "戸建て",
    apartment: "マンション",
    land: "土地",
    other: "その他",
  };
  return labels[type] || type;
}

// ステータスの日本語ラベル
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    bidding: "入札中",
    pre_opening: "開札前",
    sold: "売却済",
    withdrawn: "取下げ",
  };
  return labels[status] || status;
}

// ステータスのカラークラス
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    bidding: "bg-green-100 text-green-800",
    pre_opening: "bg-yellow-100 text-yellow-800",
    sold: "bg-gray-100 text-gray-600",
    withdrawn: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-600";
}
