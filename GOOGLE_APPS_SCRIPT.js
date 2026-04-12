/*
 * ═══════════════════════════════════════════════════════════
 * Google Apps Script — Gray's Birthday RSVP → Google Sheets
 * ═══════════════════════════════════════════════════════════
 *
 * TWO SHEETS:
 *   "RSVPs"  — the working sheet (source of truth, deletable)
 *   "Log"    — append-only audit trail (never deleted from)
 *
 * SETUP:
 * 1. In your Google Sheet, rename "Sheet1" to "RSVPs"
 * 2. Create a second sheet tab called "Log"
 * 3. Add headers in Row 1 of BOTH sheets:
 *    A1: Timestamp | B1: Name | C1: Attending | D1: Adults
 *    E1: Kids | F1: Child Name/Age | G1: Message
 * 4. Paste this script in Extensions → Apps Script
 * 5. Deploy → Manage deployments → Edit → New version → Deploy
 * ═══════════════════════════════════════════════════════════
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var rsvpSheet = ss.getSheetByName('RSVPs');
    var logSheet = ss.getSheetByName('Log');
    var data = JSON.parse(e.postData.contents);

    // ── DELETE (only from RSVPs, never from Log) ──
    if (data.action === 'delete') {
      var targetName = (data.name || '').trim().toLowerCase();
      var targetAttending = (data.attending || '').trim().toLowerCase();
      var targetAdults = (data.adults || '').trim();
      var targetKids = (data.kids || '').trim();
      var lastRow = rsvpSheet.getLastRow();
      var deleted = false;

      for (var i = lastRow; i >= 2; i--) {
        var rowName = String(rsvpSheet.getRange(i, 2).getValue()).trim().toLowerCase();
        var rowAttending = String(rsvpSheet.getRange(i, 3).getValue()).trim().toLowerCase();
        var rowAdults = String(rsvpSheet.getRange(i, 4).getValue()).trim();
        var rowKids = String(rsvpSheet.getRange(i, 5).getValue()).trim();

        if (rowName === targetName && rowAttending === targetAttending &&
            rowAdults === targetAdults && rowKids === targetKids) {
          rsvpSheet.deleteRow(i);
          deleted = true;
          break;
        }
      }

      return ContentService
        .createTextOutput(JSON.stringify({ status: deleted ? 'ok' : 'not_found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ── ADD RSVP (write to both sheets) ──
    var row = [
      new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }),
      data.name || '',
      data.attending || '',
      data.adults || '',
      data.kids || '',
      data.child || '',
      data.message || ''
    ];

    rsvpSheet.appendRow(row);
    logSheet.appendRow(row);

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
