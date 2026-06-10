/**
 * GOOGLE APPS SCRIPT BACKEND
 * 
 * DESCRIPTION:
 * This script handles form submissions from the Apprentice Registration Portal.
 * It saves the PDF to Google Drive, logs details to a Sheet, and emails the Admin.
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Go to https://script.google.com/
 * 2. Create a new project named "Lemaire Apprentice Backend".
 * 3. Delete any code in Code.gs and paste this code.
 * 4. Replace the placeholders for ADMIN_EMAIL and ADMIN_WHATSAPP.
 * 5. Click "Deploy" > "New Deployment".
 * 6. Select Type: "Web App".
 * 7. Set "Execute as": Me.
 * 8. Set "Who has access": "Anyone".
 * 9. Click "Deploy" and Authorize permissions.
 * 10. Copy the "Web App URL" and paste it into js/script.js.
 */

const ADMIN_EMAIL = 'joeljoejolemaire@gmail.com';
const FOLDER_ID = ''; // Optional: Enter a Google Drive Folder ID to store PDFs

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { formData, pdfBase64, filename } = data;

    // 1. Log to Google Sheet (Optional: Creates a sheet if not exists)
    logToSheet(formData);

    // 2. Save PDF to Google Drive
    const folder = FOLDER_ID ? DriveApp.getFolderById(FOLDER_ID) : DriveApp.getRootFolder();
    const pdfBlob = Utilities.newBlob(Utilities.base64Decode(pdfBase64), 'application/pdf', filename);
    const file = folder.createFile(pdfBlob);

    // 3. Send Email to Admin
    sendAdminEmail(formData, pdfBlob, file.getUrl());

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Submission processed successfully',
      fileUrl: file.getUrl()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function logToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.create('Apprentice Submissions');
  let sheet = ss.getSheetByName('Submissions');
  if (!sheet) {
    sheet = ss.insertSheet('Submissions');
    const headers = Object.keys(data);
    sheet.appendRow([...headers, 'Timestamp']);
  }
  const values = Object.values(data);
  sheet.appendRow([...values, new Date()]);
}

function sendAdminEmail(data, attachment, driveUrl) {
  const subject = `New Apprentice Registration: ${data.firstName} ${data.surname}`;
  let body = `New submission received.\n\n`;
  
  for (const [key, value] of Object.entries(data)) {
    body += `${key}: ${value}\n`;
  }
  
  body += `\nGoogle Drive Backup: ${driveUrl}`;

  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: subject,
    body: body,
    attachments: [attachment]
  });
}
