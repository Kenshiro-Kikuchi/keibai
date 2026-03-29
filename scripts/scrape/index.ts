import { BASE_URL, PREFECTURE_CODES, RATE_LIMIT, ITEMS_PER_PAGE } from "./config.js";
import { fetchPage } from "./fetcher.js";
import { parseListPage } from "./parsers/list-parser.js";
import { parseDetailPage } from "./parsers/detail-parser.js";
import { mapProperty, resetPropertyId, type MappedProperty } from "./mappers/property-mapper.js";
import { getAllCourts, resetCourts } from "./mappers/court-mapper.js";
import * as fs from "fs";
import * as path from "path";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function scrapeAllPrefectures(): Promise<MappedProperty[]> {
  const allProperties: MappedProperty[] = [];
  const codes = Object.entries(PREFECTURE_CODES);

  // Allow filtering by CLI args
  const prefectureArg = process.argv.find((a) => a.startsWith("--prefecture="));
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const targetPrefecture = prefectureArg?.split("=")[1];
  const globalLimit = limitArg ? parseInt(limitArg.split("=")[1]) : Infinity;

  const filteredCodes = targetPrefecture
    ? codes.filter(([code]) => code === targetPrefecture)
    : codes;

  console.log(`\n=== 981.jp スクレイピング開始 ===`);
  console.log(`対象: ${filteredCodes.length} 都道府県\n`);

  for (const [code, prefName] of filteredCodes) {
    if (allProperties.length >= globalLimit) break;

    console.log(`[${code}] ${prefName} - 一覧取得中...`);

    try {
      // Fetch list pages for this prefecture
      const propertyIds: string[] = [];
      let pageUrl: string | null =
        `${BASE_URL}/ftl/searchRes.do?s.pr=${code}&s.dispCount=${ITEMS_PER_PAGE}`;

      while (pageUrl) {
        const listHtml = await fetchPage(pageUrl);
        const listResult = parseListPage(listHtml, BASE_URL);

        propertyIds.push(...listResult.propertyIds);
        console.log(
          `  一覧: ${propertyIds.length}件のID取得 (全${listResult.totalCount}件)`
        );

        if (listResult.hasNextPage && listResult.nextPageUrl) {
          pageUrl = listResult.nextPageUrl;
          await delay(RATE_LIMIT.delayBetweenRequests);
        } else {
          pageUrl = null;
        }
      }

      if (propertyIds.length === 0) {
        console.log(`  ${prefName}: 物件なし`);
        continue;
      }

      // Fetch detail pages
      let successCount = 0;
      let errorCount = 0;

      for (const resId of propertyIds) {
        if (allProperties.length >= globalLimit) break;

        try {
          const detailUrl = `${BASE_URL}/ftl/searchRes_detail.do?res.id=${resId}`;
          const detailHtml = await fetchPage(detailUrl);
          const rawData = parseDetailPage(detailHtml, resId);
          const mapped = mapProperty(rawData, prefName);

          if (mapped) {
            allProperties.push(mapped);
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
          console.warn(`  エラー [${resId}]: ${(error as Error).message}`);
        }
      }

      console.log(
        `  ${prefName}: ${successCount}件成功, ${errorCount}件スキップ`
      );

      // Save checkpoint after each prefecture
      saveCheckpoint(allProperties);

      await delay(RATE_LIMIT.delayBetweenPrefectures);
    } catch (error) {
      console.error(`  [${code}] ${prefName} エラー: ${(error as Error).message}`);
    }
  }

  return allProperties;
}

function saveCheckpoint(properties: MappedProperty[]): void {
  const checkpointPath = path.join(
    process.cwd(),
    "scripts/scrape/checkpoint.json"
  );
  fs.writeFileSync(
    checkpointPath,
    JSON.stringify({ count: properties.length, timestamp: new Date().toISOString() }, null, 2)
  );
}

function saveOutput(properties: MappedProperty[]): void {
  const courts = getAllCourts();
  const outputPath = path.join(process.cwd(), "src/lib/scraped-data.json");

  const output = {
    courts,
    properties: properties.map(({ ...p }) => p),
    scrapedAt: new Date().toISOString(),
    totalCount: properties.length,
  };

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf-8");
  console.log(`\n出力: ${outputPath}`);
  console.log(`裁判所: ${courts.length}件`);
  console.log(`物件: ${properties.length}件`);
}

async function main() {
  resetCourts();
  resetPropertyId();

  const startTime = Date.now();
  const properties = await scrapeAllPrefectures();
  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

  console.log(`\n=== スクレイピング完了 (${elapsed}分) ===`);

  if (properties.length === 0) {
    console.error("物件が取得できませんでした。");
    process.exit(1);
  }

  saveOutput(properties);

  // Summary by prefecture
  const byPref = new Map<string, number>();
  for (const p of properties) {
    byPref.set(p.prefecture, (byPref.get(p.prefecture) || 0) + 1);
  }
  console.log("\n--- 都道府県別集計 ---");
  for (const [pref, count] of [...byPref.entries()].sort()) {
    console.log(`  ${pref}: ${count}件`);
  }
}

main().catch((error) => {
  console.error("致命的エラー:", error);
  process.exit(1);
});
