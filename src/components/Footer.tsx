import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-3">物件情報</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/properties" className="hover:text-white">物件検索</Link></li>
              <li><Link href="/results" className="hover:text-white">売却結果照会</Link></li>
              <li><Link href="/schedule" className="hover:text-white">売却スケジュール</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">サポート</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="hover:text-white">使い方</Link></li>
              <li><Link href="/glossary" className="hover:text-white">用語集</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">注意事項</h3>
            <p className="text-sm leading-relaxed">
              本サイトの情報は参考情報です。正確な情報は各物件の掲載元をご確認ください。
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
          <p>&copy; 2026 不動産物件情報サイト</p>
        </div>
      </div>
    </footer>
  );
}
