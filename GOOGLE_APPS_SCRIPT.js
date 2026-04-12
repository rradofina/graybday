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
 * 4. Click Deploy → New deployment
 *    - Type: Web app
 *    - Description: RSVP handler
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    - Click Deploy
 *
 * 5. Copy the Web app URL
 *
 * IMPORTANT: If you update this script, you must create a
 * NEW deployment (Deploy → New deployment), not just save.
 * ═══════════════════════════════════════════════════════════
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

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
