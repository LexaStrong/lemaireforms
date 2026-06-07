# Lemaire Clothing Apprenticeship Submission Form

A modern, dynamic, and multi-step digital application form designed specifically for the Lemaire Clothing Apprenticeship Programme.

## 🌟 Features

- **Multi-Step Flow**: Seamlessly guides applicants through the Personal Record Form, Required Items & Fees acknowledgment, and the Code of Conduct.
- **Premium UI/UX**: Dark-themed aesthetic featuring gold accents, subtle glassmorphism effects, and smooth micro-animations for a high-end brand feel.
- **Photo Upload**: Allows applicants to upload a clear face picture with a live preview before submission.
- **Digital Signatures**: Custom signature inputs that render the applicant's typed name in elegant cursive writing.
- **Instant PDF Generation**: Automatically generates a highly formatted, downloadable PDF containing all submitted personal data, the applicant's photo, the brand logo, fee breakdown, and the full code of conduct.
- **Direct Email Submission**: Uses EmailJS to directly email the submitted application data to the administrator (`iamlexastrong@gmail.com`). Includes an automatic `mailto:` fallback if EmailJS is not configured.
- **Fully Responsive**: Optimized for perfect usability across desktop, tablet, and mobile devices.

## 🛠️ Technology Stack

- **HTML5**: Semantic structure and layout.
- **CSS3 (Vanilla)**: Custom properties, Flexbox/Grid layouts, and CSS animations. No external frameworks used.
- **JavaScript (Vanilla)**: Form validation, state management, file handling, and API integration.
- **[html2pdf.js](https://ekoopmans.github.io/html2pdf.js/)**: Client-side conversion of HTML to PDF.
- **[EmailJS](https://www.emailjs.com/)**: Client-side email dispatching without a backend server.

## 🚀 Running Locally

You do not need a build step or Node.js environment to run this project. Simply serve the directory using any basic web server to avoid CORS issues when generating the PDF.

Using Python (Recommended):
```bash
# Navigate to the project directory
cd "lemaire submission form"

# Start a local web server
python3 -m http.server 8090
```

Then, open your browser and navigate to `http://localhost:8090`.

## 📧 EmailJS Setup (Required for direct emails)

Currently, the form is set up with placeholders for EmailJS. To enable direct email delivery in the background (preventing the fallback to the user's default email app):

1. Go to [EmailJS](https://www.emailjs.com/) and create a free account.
2. Add an **Email Service** (e.g., connect your Gmail account).
3. Create an **Email Template** with the following variable in the body: `{{{message}}}`.
4. Open `script.js` in your code editor.
5. Replace the placeholder values at the top of the file:
   - Replace `'YOUR_EMAILJS_PUBLIC_KEY'` (around line 7).
   - Replace `'YOUR_SERVICE_ID'` (around line 128).
   - Replace `'YOUR_TEMPLATE_ID'` (around line 128).

## 📁 Project Structure

- `index.html`: The main markup file containing the 3-step form.
- `style.css`: The central stylesheet for the entire application.
- `script.js`: Handles validation, file reading, EmailJS dispatch, and PDF generation.
- `logo.png`: The Joejo Lemaire brand logo used in the header and PDF.
# lemaireforms
