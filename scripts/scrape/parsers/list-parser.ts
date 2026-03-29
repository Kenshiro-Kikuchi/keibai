import * as cheerio from "cheerio";

export interface ListResult {
  propertyIds: string[];
  totalCount: number;
  hasNextPage: boolean;
  nextPageUrl: string | null;
}

export function parseListPage(html: string, baseUrl: string): ListResult {
  const $ = cheerio.load(html);
  const propertyIds: string[] = [];

  // Extract property IDs from detail links
  $('a[href*="searchRes_detail.do?res.id="]').each((_, el) => {
    const href = $(el).attr("href") || "";
    const match = href.match(/res\.id=(\d+)/);
    if (match && !propertyIds.includes(match[1])) {
      propertyIds.push(match[1]);
    }
  });

  // Extract total count - look for "XX件" pattern
  let totalCount = 0;
  const bodyText = $("body").text();
  const countMatch = bodyText.match(/(\d+)\s*件/);
  if (countMatch) {
    totalCount = parseInt(countMatch[1]);
  }

  // Check for next page link
  let hasNextPage = false;
  let nextPageUrl: string | null = null;

  $('a[href*="page="]').each((_, el) => {
    const href = $(el).attr("href") || "";
    const text = $(el).text().trim();
    // Look for "次へ" (next) or ">" link
    if (text === "次へ" || text === ">" || text === "»" || text.includes("次")) {
      hasNextPage = true;
      nextPageUrl = href.startsWith("http") ? href : `${baseUrl}${href}`;
    }
  });

  return { propertyIds, totalCount, hasNextPage, nextPageUrl };
}
