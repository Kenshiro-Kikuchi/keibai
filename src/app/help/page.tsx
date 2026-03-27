export default function HelpPage() {
  const steps = [
    {
      title: "1. 物件を探す",
      description: "トップページの地域マップまたは検索フォームから、希望する条件で物件を検索します。地域、価格帯、面積、建築年などの条件で絞り込みが可能です。",
    },
    {
      title: "2. 物件詳細を確認する",
      description: "気になる物件をクリックすると、詳細情報を確認できます。物件の基本情報、価格、所在地、間取りなどを閲覧できます。",
    },
    {
      title: "3. 物件資料を確認する",
      description: "物件に関する資料（物件明細書・現況調査報告書・評価書など）が公開されている場合は、詳細ページから確認できます。",
    },
    {
      title: "4. お問い合わせ・申し込み",
      description: "気になる物件が見つかったら、掲載元にお問い合わせください。物件の見学や購入手続きについてご案内いたします。",
    },
    {
      title: "5. 契約・引渡し",
      description: "条件が合意に至れば、売買契約を締結し、代金の支払い・所有権移転登記を経て物件の引渡しとなります。",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">使い方ガイド</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">物件購入の流れ</h2>
        <div className="space-y-6">
          {steps.map((step) => (
            <div key={step.title} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {step.title.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-yellow-800 mb-2">ご注意</h2>
        <ul className="text-sm text-yellow-700 space-y-2 list-disc list-inside">
          <li>物件によっては内覧ができない場合があります</li>
          <li>物件の状態は現況渡しとなる場合があります</li>
          <li>占有者がいる場合、明渡し手続きが必要な場合があります</li>
          <li>本サイトの情報は参考です。正確な情報は掲載元でご確認ください</li>
        </ul>
      </div>
    </div>
  );
}
