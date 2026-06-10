# Lemaire Clothing Ventures — Apprentice Registration Portal

A premium, dark-themed apprentice registration form for **Lemaire Clothing Ventures**, a tailoring facility based in Konongo–Odumase A/A, Ashanti Region, Ghana.

## ✨ Features

- **Multi-step registration form** with real-time validation
- **Passport photo upload** with live preview
- **Automatic PDF generation** — a styled, branded PDF record is generated client-side using jsPDF
- **WhatsApp submission** — opens WhatsApp with a pre-filled message to the admin (`+233248293815`) containing the applicant's key details
- **Google Apps Script backend** — submits form data + PDF to a backend that:
  - Saves the PDF to Google Drive
  - Logs submission details to a Google Sheet
  - Emails the admin with the PDF attached
- **Code of Conduct modal** — displays facility rules and regulations
- **Items checklist** — shows required items the apprentice must bring upon enrollment
- **Responsive design** — works across desktop and mobile devices

## 📁 Project Structure

```
lm-apprentice-form/
├── index.html              # Main HTML (form, success screen, modal)
├── css/
│   └── style.css           # All styles (dark theme, gold accents)
├── js/
│   └── script.js           # Form logic, PDF generation, WhatsApp integration
├── backend/
│   └── code.gs             # Google Apps Script backend (email + Drive + Sheets)
└── README.md
```

## 🚀 Setup & Deployment

### Frontend (Static Site)

The frontend is pure HTML/CSS/JS with no build step. Host it on any static hosting provider:

- **GitHub Pages** — push to a repo and enable Pages
- **Netlify / Vercel** — drag and drop the project folder
- **Any web server** — just serve the files as-is

### Backend (Google Apps Script)

1. Go to [Google Apps Script](https://script.google.com/)
2. Create a new project named **"Lemaire Apprentice Backend"**
3. Delete any default code in `Code.gs` and paste the contents of `backend/code.gs`
4. The admin email is pre-configured to `joeljoejolemaire@gmail.com`
5. *(Optional)* Set a `FOLDER_ID` in the script to save PDFs to a specific Google Drive folder
6. Click **Deploy → New Deployment**
7. Select Type: **Web App**
8. Set **Execute as**: Me
9. Set **Who has access**: Anyone
10. Click **Deploy** and authorize the required permissions
11. Copy the generated **Web App URL**
12. Open `js/script.js` and replace `'YOUR_GOOGLE_APPS_SCRIPT_URL'` with the copied URL

### WhatsApp Configuration

The WhatsApp number is pre-configured in `js/script.js`:

```js
const ADMIN_WHATSAPP = '233248293815';
```

To change it, update the number (use country code without the `+`).

## 📋 Submission Flow

1. Applicant fills out the registration form (personal info + guardian info)
2. On submit, the form:
   - **Validates** all required fields
   - **Generates** a branded PDF with all form data and the passport photo
   - **Downloads** the PDF to the applicant's device
   - **Sends** the data + PDF to the Google Apps Script backend (email + Drive backup)
   - **Redirects** to WhatsApp with a pre-filled message for the admin
3. The applicant attaches the downloaded PDF in the WhatsApp chat

## 🛠 Dependencies

| Dependency | Source | Purpose |
|---|---|---|
| [jsPDF](https://github.com/parallax/jsPDF) | CDN | Client-side PDF generation |
| [Google Fonts](https://fonts.google.com/) | CDN | Cormorant Garamond + Josefin Sans |

No `npm install` or build tools required.

## 📄 License

Private project for Lemaire Clothing Ventures.
