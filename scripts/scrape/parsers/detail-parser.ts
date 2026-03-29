import * as cheerio from "cheerio";
import { cleanText } from "../utils/text-utils.js";

export interface RawPropertyData {
  resId: string;
  caseNumber: string | null;
  courtName: string | null;
  propertyTypeText: string | null;
  address: string | null;
  basePriceText: string | null;
  minimumBidPriceText: string | null;
  landAreaText: string | null;
  buildingAreaText: string | null;
  exclusiveAreaText: string | null;
  constructionDateText: string | null;
  structure: string | null;
  floorPlan: string | null;
  zoning: string | null;
  bidStartDate: string | null;
  bidEndDate: string | null;
  openingDate: string | null;
  latitude: number | null;
  longitude: number | null;
  nearestStation: string | null;
  stationDistance: string | null;
}

/**
 * 981.jp uses <th>label</th><td>value</td> table structure.
 * This function finds the first th matching the label and returns its adjacent td text.
 */
function getTableValue($: cheerio.CheerioAPI, label: string): string | null {
  let result: string | null = null;
  $("th").each((_, el) => {
    if (result) return;
    const thText = $(el).text().trim();
    if (thText.includes(label)) {
      const td = $(el).next("td");
      if (td.length) {
        const value = cleanText(td.text());
        if (value) {
          result = value;
        }
      }
    }
  });
  return result;
}

export function parseDetailPage(html: string, resId: string): RawPropertyData {
  const $ = cheerio.load(html);

  // --- Address ---
  // First "所在地・交通" section has the full address in first <th>所在地</th><td>...</td>
  let address: string | null = null;
  $("h2").each((_, h2) => {
    if (address) return;
    if ($(h2).text().includes("所在地・交通")) {
      const table = $(h2).next(".detail-box").find("table").first();
      table.find("th").each((_, th) => {
        if (address) return;
        if ($(th).text().trim() === "所在地") {
          const td = $(th).next("td");
          if (td.length) {
            address = cleanText(td.text());
          }
        }
      });
    }
  });

  // --- Nearest Station ---
  let nearestStation: string | null = null;
  let stationDistance: string | null = null;
  const transportValue = getTableValue($, "評価書上の交通");
  if (transportValue) {
    // Convert full-width to half-width for matching
    const halfTransport = transportValue
      .replace(/[０-９]/g, (c: string) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
      .replace(/．/g, ".");

    const stationMatch = halfTransport.match(/「([^」]+)」駅/);
    if (stationMatch) {
      nearestStation = `${stationMatch[1]}駅`;
    }
    const distMatch = halfTransport.match(/徒歩約?(\d+)分/);
    if (distMatch) {
      stationDistance = `徒歩${distMatch[1]}分`;
    } else {
      const meterMatch = halfTransport.match(/約([\d,]+)\s*[mｍ]/);
      if (meterMatch) {
        const meters = parseInt(meterMatch[1].replace(/,/g, ""));
        stationDistance = `徒歩${Math.ceil(meters / 80)}分`;
      }
    }
  }

  // --- Coordinates ---
  let latitude: number | null = null;
  let longitude: number | null = null;
  // Look in all links and iframes for map coordinates
  const mapElements = $('a[href*="maps"], iframe[src*="maps"], a[href*="google"], [data-lat], [data-lng]');
  mapElements.each((_, el) => {
    if (latitude) return;
    const href = $(el).attr("href") || $(el).attr("src") || "";
    // Patterns: @35.599,139.674 or q=35.599,139.674 or ll=35.599,139.674
    const coordPatterns = [
      /@([\d.]+),([\d.]+)/,
      /[?&]q=([\d.]+),([\d.]+)/,
      /[?&]ll=([\d.]+),([\d.]+)/,
      /center=([\d.]+),([\d.]+)/,
    ];
    for (const pattern of coordPatterns) {
      const match = href.match(pattern);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        if (lat > 20 && lat < 50 && lng > 120 && lng < 155) {
          latitude = lat;
          longitude = lng;
        }
        return;
      }
    }
  });

  // Also search in script tags for map initialization
  if (!latitude) {
    $("script").each((_, el) => {
      if (latitude) return;
      const scriptText = $(el).html() || "";
      const latMatch = scriptText.match(/(?:lat|latitude)\s*[:=]\s*([\d.]+)/);
      const lngMatch = scriptText.match(/(?:lng|longitude|lon)\s*[:=]\s*([\d.]+)/);
      if (latMatch && lngMatch) {
        const lat = parseFloat(latMatch[1]);
        const lng = parseFloat(lngMatch[1]);
        if (lat > 20 && lat < 50 && lng > 120 && lng < 155) {
          latitude = lat;
          longitude = lng;
        }
      }
    });
  }

  // --- Case Number (from 裁判所・入札期間情報 section) ---
  let caseNumber: string | null = null;
  const caseValue = getTableValue($, "事件番号");
  if (caseValue) {
    const match = caseValue.match(/((?:令和|平成|昭和)\d+年[（(][ケヌ][）)]\s*第?\d+号)/);
    caseNumber = match ? match[1] : caseValue;
  }

  // --- Court Name ---
  const courtName = getTableValue($, "管轄裁判所");

  // --- Bid Dates ---
  let bidStartDate: string | null = null;
  let bidEndDate: string | null = null;
  const bidPeriod = getTableValue($, "入札期間");
  if (bidPeriod) {
    const match = bidPeriod.match(/([\d/]+)\s*[～〜~-]\s*([\d/]+)/);
    if (match) {
      bidStartDate = match[1].replace(/\//g, "-");
      bidEndDate = match[2].replace(/\//g, "-");
    }
  }

  let openingDate: string | null = null;
  const openingValue = getTableValue($, "開札期日");
  if (openingValue) {
    const match = openingValue.match(/([\d/]+)/);
    if (match) {
      openingDate = match[1].replace(/\//g, "-");
    }
  }

  // --- Prices (from 数値情報 section) ---
  let basePriceText: string | null = null;
  let minimumBidPriceText: string | null = null;

  // sell-price element contains base price
  const sellPrice = $(".sell-price strong").first().text().trim();
  if (sellPrice) {
    basePriceText = sellPrice;
  } else {
    // Fallback to table
    basePriceText = getTableValue($, "売却基準価額");
  }
  minimumBidPriceText = getTableValue($, "買受可能価額");

  // --- Property Info (from 物件情報 section) ---
  // Property type - get from page title which is most reliable
  let propertyTypeText: string | null = null;
  const pageTitle = $("title").text();
  if (pageTitle.includes("マンション") || pageTitle.includes("区分所有")) {
    propertyTypeText = "マンション";
  } else if (pageTitle.includes("戸建") || pageTitle.includes("一戸建")) {
    propertyTypeText = "戸建て";
  } else if (pageTitle.includes("土地")) {
    propertyTypeText = "土地";
  } else {
    // Fallback to table
    propertyTypeText = getTableValue($, "種別");
  }

  // Land area
  const landAreaText = getTableValue($, "土地面積（登記）");

  // Building area / Exclusive area
  const buildingAreaText = getTableValue($, "床面積（登記）");
  const exclusiveAreaText = getTableValue($, "専有面積（登記）");

  // Structure
  const structure = getTableValue($, "構造（登記）");

  // Floor plan
  const floorPlan = getTableValue($, "間取り");

  // Zoning
  const zoning = getTableValue($, "用途地域");

  // Construction date
  const constructionDateText = getTableValue($, "築年月");

  return {
    resId,
    caseNumber,
    courtName,
    propertyTypeText,
    address,
    basePriceText,
    minimumBidPriceText,
    landAreaText,
    buildingAreaText,
    exclusiveAreaText,
    constructionDateText,
    structure,
    floorPlan,
    zoning,
    bidStartDate,
    bidEndDate,
    openingDate,
    latitude,
    longitude,
    nearestStation,
    stationDistance,
  };
}
