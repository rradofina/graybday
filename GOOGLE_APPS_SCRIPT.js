/*
 * ═══════════════════════════════════════════════════════════
 * Google Apps Script — Gray's Birthday RSVP → Google Sheets
 * ═══════════════════════════════════════════════════════════
 *
 * SETUP INSTRUCTIONS:
 *
 * 1. Create a new Google Sheet at https://sheets.google.com
 *    - Name it: "Gray's Birthday RSVP"
 *    - In Row 1, add these headers:
 *      A1: Timestamp | B1: Name | C1: Attending | D1: Adults
 *      E1: Kids | F1: Child Name/Age | G1: Message
 *
 * 2. Go to Extensions → Apps Script
 *
 * 3. Delete any existing code and paste THIS ENTIRE FILE
 *
 * 4. Click Deploy → Manage deployments → Edit → New version → Deploy
 *
 * IMPORTANT: If you update this script, you must select
 * "New version" when editing the deployment, not just save.
 * ═══════════════════════════════════════════════════════════
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Delete action — match by name + attending to find the correct row
    if (data.action === 'delete') {
      var targetName = (data.name || '').trim().toLowerCase();
      var targetAttending = (data.attending || '').trim().toLowerCase();
      var targetAdults = (data.adults || '').trim();
      var targetKids = (data.kids || '').trim();
      var lastRow = sheet.getLastRow();
      var deleted = false;

      // Search from bottom to top so row numbers stay valid
      for (var i = lastRow; i >= 2; i--) {
        var rowName = String(sheet.getRange(i, 2).getValue()).trim().toLowerCase();
        var rowAttending = String(sheet.getRange(i, 3).getValue()).trim().toLowerCase();
        var rowAdults = String(sheet.getRange(i, 4).getValue()).trim();
        var rowKids = String(sheet.getRange(i, 5).getValue()).trim();

        if (rowName === targetName && rowAttending === targetAttending &&
            rowAdults === targetAdults && rowKids === targetKids) {
          sheet.deleteRow(i);
          deleted = true;
          break;
        }
      }

      return ContentService
        .createTextOutput(JSON.stringify({ status: deleted ? 'ok' : 'not_found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Default: add RSVP
    sheet.appendRow([
      new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }),
      data.name || '',
      data.attending || '',
      data.adults || '',
      data.kids || '',
      data.child || '',
      data.message || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'RSVP endpoint is live' }))
    .setMimeType(ContentService.MimeType.JSON);
}
