/* eslint-disable @typescript-eslint/no-unused-vars */

const SHEET_NAME = "Leads";

function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    const payload = JSON.parse(e.postData.contents || "{}");

    sheet.appendRow([
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
    ]);

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

function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
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
    ]);
  }

  return sheet;
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
