/**
 * Peyalar Opare : form receiver (Google Apps Script)
 *
 * Saves website form submissions (volunteer, donation confirmation, partner)
 * into a Google Sheet, one tab per form, and emails you a copy.
 *
 * SETUP (about 5 minutes)
 * 1. Create a new Google Sheet named "Peyalar Opare Forms" (logged in as peyalaropare@gmail.com).
 * 2. Extensions > Apps Script. Delete what's there, paste this whole file, Save.
 * 3. Deploy > New deployment > type "Web app".
 *      Execute as: Me
 *      Who has access: Anyone
 *    Click Deploy, allow the permissions, copy the Web app URL.
 * 4. Paste that URL into config.js as formEndpoint: "https://script.google.com/macros/s/.../exec"
 * 5. Upload config.js to GitHub again. Done.
 */

const NOTIFY_EMAIL = "peyalaropare@gmail.com";

function doPost(e) {
  const p = e.parameter || {};
  const form = (p.form || "other").toLowerCase();
  const tabs = { volunteer: "Volunteers", donation: "Donation confirmations", partner: "Partners" };
  const sheetName = tabs[form] || "Other";

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);

  const keys = Object.keys(p).filter(k => k !== "form");
  let headers = sheet.getLastRow() ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
  if (!headers.length) {
    headers = ["received"].concat(keys);
    sheet.appendRow(headers);
  } else {
    keys.forEach(k => {
      if (headers.indexOf(k) === -1) {
        headers.push(k);
        sheet.getRange(1, headers.length).setValue(k);
      }
    });
  }
  const row = headers.map(h => (h === "received" ? new Date() : (p[h] || "")));
  sheet.appendRow(row);

  try {
    const body = keys.map(k => k + ": " + p[k]).join("\n");
    MailApp.sendEmail(NOTIFY_EMAIL, "New " + sheetName.toLowerCase() + " from website", body);
  } catch (err) {}

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
