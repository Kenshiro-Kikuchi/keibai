const faqs = [
  {
    question: "掲載物件は誰でも購入できますか？",
    answer: "はい、原則として誰でも購入可能です。法人でも個人でも購入いただけます。物件によって条件が異なる場合がありますので、詳細は掲載元にご確認ください。",
  },
  {
    question: "購入にはどのくらいの費用が必要ですか？",
    answer: "物件価格のほか、仲介手数料、登記費用、不動産取得税、印紙税などの諸費用がかかります。一般的に物件価格の5〜10%程度の諸経費を見込んでおくとよいでしょう。",
  },
  {
    question: "物件の内覧はできますか？",
    answer: "多くの物件で内覧が可能です。物件詳細ページから掲載元にお問い合わせいただき、見学の日程を調整してください。一部内覧できない物件もあります。",
  },
  {
    question: "住宅ローンは使えますか？",
    answer: "はい、多くの金融機関で住宅ローンが利用可能です。事前審査を通過しておくとスムーズに契約手続きが進みます。詳しくは金融機関にご相談ください。",
  },
  {
    question: "購入後の手続きはどうなりますか？",
    answer: "売買契約締結後、住宅ローンの本審査・契約を経て、決済日に代金の支払いと所有権移転登記を行います。その後、物件の引渡しとなります。",
  },
  {
    question: "占有者がいる場合はどうすればよいですか？",
    answer: "賃借人がいる場合は、賃貸借契約の引継ぎが必要になることがあります。詳しくは物件詳細の権利関係をご確認のうえ、専門家にご相談ください。",
  },
  {
    question: "デフォルトの検索条件について教えてください",
    answer: "本サイトでは、土地面積90㎡以上、建築年1983年（昭和58年）以降をデフォルトの検索条件としています。1983年以降は新耐震基準（1981年施行）を満たす建物がほぼ対象となるためです。これらの条件は検索フォームから自由に変更できます。",
  },
  {
    question: "自社掲載物件とは何ですか？",
    answer: "当社が直接取り扱っている物件です。自社掲載物件は検索結果には表示されません。",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">よくある質問（FAQ）</h1>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4">
              <h3 className="font-bold text-gray-800 flex items-start gap-3">
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded flex-shrink-0">Q</span>
                {faq.question}
              </h3>
              <div className="mt-3 ml-8">
                <p className="text-sm text-gray-600 leading-relaxed flex items-start gap-3">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded flex-shrink-0">A</span>
                  <span>{faq.answer}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
