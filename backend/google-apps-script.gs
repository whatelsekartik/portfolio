/**
 * Guestbook backend for the retro Macintosh portfolio.
 *
 * Paste this into a Google Sheet's Apps Script editor (Extensions > Apps Script),
 * then Deploy > New deployment > Web app:
 *   Execute as: Me        Who has access: Anyone
 * Copy the web app URL (ends in /exec) into src/data/portfolioData.ts -> guestbook.endpoint.
 *
 * Each message is one row: Timestamp | Name | Message | Status.
 * To hide a message from the site, change its Status cell from "visible" to "hidden".
 */

var SHEET_NAME = "Entries";
var MAX_NAME = 40;
var MAX_MESSAGE = 280;
var MAX_SHOWN = 100;

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Timestamp", "Name", "Message", "Status"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

// Visitors' browsers call this to load the messages.
function doGet() {
  var sheet = getSheet_();
  var last = sheet.getLastRow();
  if (last < 2) return json_({ ok: true, entries: [] });

  var rows = sheet.getRange(2, 1, last - 1, 4).getValues();
  var entries = rows
    .filter(function (r) {
      return r[1] && r[2] && String(r[3]).toLowerCase() !== "hidden";
    })
    .map(function (r) {
      return {
        date: Utilities.formatDate(new Date(r[0]), "UTC", "yyyy-MM-dd"),
        name: String(r[1]),
        message: String(r[2]),
      };
    })
    .reverse() // newest first
    .slice(0, MAX_SHOWN);

  return json_({ ok: true, entries: entries });
}

// Visitors' browsers call this to sign the guestbook.
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var p = (e && e.parameter) || {};

    // Hidden "website" field: real people leave it empty, bots fill it in.
    if (p.website) return json_({ ok: true });

    var name = clean_(p.name, MAX_NAME);
    var message = clean_(p.message, MAX_MESSAGE);
    if (!name || !message) {
      return json_({ ok: false, error: "Please enter your name and a message." });
    }

    var sheet = getSheet_();
    var row = sheet.getLastRow() + 1;
    // Plain-text format first, so text like "=1+1" is stored as text and never runs as a formula.
    sheet.getRange(row, 2, 1, 2).setNumberFormat("@").setValues([[name, message]]);
    sheet.getRange(row, 1).setValue(new Date());
    sheet.getRange(row, 4).setValue("visible");
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: "The guestbook is busy. Please try again." });
  } finally {
    lock.releaseLock();
  }
}

function clean_(value, max) {
  return String(value || "")
    .replace(/[\u0000-\u001f]+/g, " ")
    .trim()
    .slice(0, max);
}
