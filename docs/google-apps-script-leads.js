/* eslint-disable @typescript-eslint/no-unused-vars */

const SHEET_NAME = "Leads";

const HEADERS = [
  "Fecha",
  "Nombre",
  "Telefono",
  "Tratamiento",
  "Pagina",
  "Landing page",
  "Referrer",
  "Mensaje",
  "Origen",
  "UTM source",
  "UTM medium",
  "UTM campaign",
  "UTM term",
  "UTM content",
  "IP",
  "User Agent",
  "ID",
];

function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    ensureHeaders(sheet);

    const payload = JSON.parse(e.postData.contents || "{}");
    const row = buildRow(payload);

    sheet.appendRow(row);

    return jsonResponse({
      ok: true,
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: String(error),
    });
  }
}

function buildRow(payload) {
  return [
    payload.createdAt || new Date().toISOString(),
    payload.name || "",
    payload.phone || "",
    payload.treatment || "",
    payload.page || "",
    payload.landingPage || "",
    payload.referrer || "",
    payload.message || "",
    payload.source || "",
    payload.utmSource || "",
    payload.utmMedium || "",
    payload.utmCampaign || "",
    payload.utmTerm || "",
    payload.utmContent || "",
    payload.ip || "",
    payload.userAgent || "",
    payload.id || "",
  ];
}

function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  return sheet;
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    freezeAndStyleHeaders(sheet);
    return;
  }

  const currentHeaders = sheet
    .getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1))
    .getValues()[0]
    .map(String);

  const missingHeaders = HEADERS.filter(
    (header) => !currentHeaders.includes(header),
  );

  if (missingHeaders.length === 0) {
    freezeAndStyleHeaders(sheet);
    return;
  }

  sheet
    .getRange(1, currentHeaders.length + 1, 1, missingHeaders.length)
    .setValues([missingHeaders]);

  freezeAndStyleHeaders(sheet);
}

function freezeAndStyleHeaders(sheet) {
  sheet.setFrozenRows(1);

  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#f7dfe7");

  sheet.autoResizeColumns(1, sheet.getLastColumn());
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
