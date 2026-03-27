const terms = [
  { term: "売買価格", reading: "ばいばいかかく", description: "物件の販売価格。売主が設定した金額で、交渉により変動する場合があります。" },
  { term: "坪単価", reading: "つぼたんか", description: "1坪（約3.3㎡）あたりの価格。地域の相場を比較する際に使われる指標です。" },
  { term: "建ぺい率", reading: "けんぺいりつ", description: "敷地面積に対する建築面積の割合。用途地域ごとに上限が定められています。" },
  { term: "容積率", reading: "ようせきりつ", description: "敷地面積に対する延床面積の割合。建物の大きさの上限を規定します。" },
  { term: "用途地域", reading: "ようとちいき", description: "都市計画法に基づき、建築できる建物の種類や規模を定めた地域区分。住居系・商業系・工業系に大別されます。" },
  { term: "重要事項説明", reading: "じゅうようじこうせつめい", description: "不動産売買の契約前に、宅建士が買主に対して物件や取引条件の重要事項を説明すること。法律で義務付けられています。" },
  { term: "手付金", reading: "てつけきん", description: "売買契約時に買主が売主に支払う金額。一般的に売買価格の5〜10%程度です。" },
  { term: "仲介手数料", reading: "ちゅうかいてすうりょう", description: "不動産会社に支払う手数料。売買価格の3%+6万円（税別）が上限です。" },
  { term: "抵当権", reading: "ていとうけん", description: "住宅ローンなどの担保として不動産に設定される権利。完済後に抹消手続きが必要です。" },
  { term: "法定地上権", reading: "ほうていちじょうけん", description: "土地と建物の所有者が異なる場合に、建物のために法律上当然に成立する地上権。" },
  { term: "新耐震基準", reading: "しんたいしんきじゅん", description: "1981年（昭和56年）6月1日に施行された建築基準法の耐震基準。震度6強〜7の地震でも倒壊しないことを目標としています。" },
  { term: "瑕疵担保責任", reading: "かしたんぽせきにん", description: "売買した物件に隠れた欠陥があった場合に、売主が負う責任。2020年の民法改正により「契約不適合責任」に変更されました。" },
];

export default function GlossaryPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">用語集</h1>

      <div className="bg-white rounded-lg shadow divide-y">
        {terms.map((item) => (
          <div key={item.term} className="p-4">
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="font-bold text-gray-800">{item.term}</h3>
              <span className="text-xs text-gray-400">（{item.reading}）</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
