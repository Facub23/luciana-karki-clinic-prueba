/* eslint-disable @typescript-eslint/no-unused-vars */

var SHEET_NAME = "Leads";

var HEADERS = [
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
  "ID"
];

function doPost(e) {
  try {
    var sheet = getOrCreateSheet();
    ensureHeaders(sheet);

    var payload = JSON.parse(e.postData.contents || "{}");
    var row = buildRow(payload);

    sheet.appendRow(row);

    return jsonResponse({
      ok: true
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: String(error)
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
    payload.id || ""
  ];
}

function getOrCreateSheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(SHEET_NAME);

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

  var lastColumn = Math.max(sheet.getLastColumn(), 1);
  var currentHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
  var missingHeaders = [];

  for (var i = 0; i < HEADERS.length; i++) {
    if (currentHeaders.indexOf(HEADERS[i]) === -1) {
      missingHeaders.push(HEADERS[i]);
    }
  }

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

  var headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setFontWeight("bold");
  headerRange.setBackground("#f7dfe7");

  sheet.autoResizeColumns(1, sheet.getLastColumn());
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON
  );
}
