/* ============================================
   LEMAIRE CLOTHING - APPRENTICESHIP FORM JS
   ============================================ */

// ---- EmailJS Init ----
(function () {
  emailjs.init('YOUR_EMAILJS_PUBLIC_KEY'); // Replace with your EmailJS public key
})();

// ---- DOM References ----
const formSection = document.getElementById('form-section');
const itemsSection = document.getElementById('items-section');
const conductSection = document.getElementById('conduct-section');
const form = document.getElementById('apprentice-form');
const submitBtn = document.getElementById('submit-form-btn');
const acceptItemsBtn = document.getElementById('accept-items-btn');
const downloadBtn = document.getElementById('download-btn');

let submittedData = {};
let photoBase64 = null;

// ---- Photo Upload Handling ----
const photoInput = document.getElementById('applicantPhoto');
const photoPreview = document.getElementById('photo-preview');
const photoFileName = document.getElementById('photo-file-name');

if (photoInput) {
  photoInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      photoFileName.textContent = file.name;
      const reader = new FileReader();
      reader.onload = function(event) {
        photoBase64 = event.target.result;
        photoPreview.innerHTML = `<img src="${photoBase64}" alt="Applicant Photo">`;
        validateField('applicantPhoto');
      };
      reader.readAsDataURL(file);
    } else {
      photoFileName.textContent = '';
      photoBase64 = null;
      photoPreview.innerHTML = '<span>No photo</span>';
      validateField('applicantPhoto');
    }
  });
}

// ---- Set today's date as default ----
const today = new Date().toISOString().split('T')[0];
document.getElementById('apprenticeDate').value = today;
document.getElementById('guardianDate').value = today;

// ---- Required Fields ----
const requiredFields = [
  'applicantPhoto', 'surname', 'firstName', 'dob', 'nationality', 'district',
  'hometown', 'region', 'lastSchool', 'apprenticeSignature',
  'apprenticeTelephone', 'apprenticeDate',
  'fatherName', 'motherName', 'guardianName', 'relationship',
  'guardianAddress', 'guardianSignature', 'guardianTelephone', 'guardianDate'
];

// ---- Validation ----
function validateField(id) {
  const el = document.getElementById(id);
  const errEl = document.getElementById(id + '-error');
  
  let isValid = true;
  if (id === 'applicantPhoto') {
    isValid = !!photoBase64;
  } else {
    isValid = el.value.trim() !== '';
  }

  if (!isValid) {
    el.classList.add('error');
    if (errEl) { errEl.textContent = 'This field is required'; errEl.classList.add('visible'); }
    return false;
  }
  el.classList.remove('error');
  if (errEl) { errEl.textContent = ''; errEl.classList.remove('visible'); }
  return true;
}

function validateAll() {
  let valid = true;
  requiredFields.forEach(id => { if (!validateField(id)) valid = false; });
  return valid;
}

// Live validation on blur
requiredFields.forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('blur', () => validateField(id));
});

// ---- Collect Form Data ----
function collectData() {
  const fields = [
    'surname', 'firstName', 'otherNames', 'dob', 'nationality',
    'district', 'hometown', 'region', 'religion', 'lastSchool',
    'hobbies', 'apprenticeSignature', 'apprenticeTelephone', 'apprenticeDate',
    'fatherName', 'motherName', 'guardianName', 'relationship',
    'guardianAddress', 'guardianSignature', 'guardianTelephone', 'guardianDate'
  ];
  const data = {};
  fields.forEach(id => { data[id] = document.getElementById(id).value.trim(); });
  data.photo = photoBase64;
  return data;
}

// ---- Switch Sections ----
function showSection(section) {
  [formSection, itemsSection, conductSection].forEach(s => s.classList.remove('active'));
  section.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---- Send Email via EmailJS ----
async function sendEmail(data) {
  const templateParams = {
    to_email: 'iamlexastrong@gmail.com',
    subject: `New Apprenticeship Application – ${data.firstName} ${data.surname}`,
    message: buildEmailBody(data)
  };
  try {
    // Uses EmailJS service. Replace SERVICE_ID and TEMPLATE_ID with yours.
    await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
    return true;
  } catch (err) {
    console.warn('EmailJS send failed, falling back to mailto:', err);
    fallbackMailto(data);
    return true;
  }
}

function buildEmailBody(d) {
  return `
===== APPRENTICESHIP APPLICATION =====
LEMAIRE CLOTHING – PERSONAL RECORD FORM
Date Submitted: ${new Date().toLocaleDateString()}

--- SECTION A: APPRENTICE ---
Photo: [Uploaded & Included in PDF]
Surname: ${d.surname}
First Name: ${d.firstName}
Other Names: ${d.otherNames || 'N/A'}
Date of Birth: ${d.dob}
Nationality: ${d.nationality}
District: ${d.district}
Hometown: ${d.hometown}
Region: ${d.region}
Religious Denomination: ${d.religion || 'N/A'}
Last School Attended: ${d.lastSchool}
Hobbies/Interests: ${d.hobbies || 'N/A'}
Signature: ${d.apprenticeSignature}
Telephone: ${d.apprenticeTelephone}
Date: ${d.apprenticeDate}

--- SECTION B: PARENT/GUARDIAN ---
Father's Full Name: ${d.fatherName}
Mother's Full Name: ${d.motherName}
Guardian's Full Name: ${d.guardianName}
Relationship: ${d.relationship}
Permanent Address: ${d.guardianAddress}
Guardian Signature: ${d.guardianSignature}
Telephone: ${d.guardianTelephone}
Date: ${d.guardianDate}

--- FEE BREAKDOWN ---
Apprenticeship Fee: GHS 3,000
Uniform: GHS 1,200
Late Fee: GHS 800
Total: GHS 5,000
======================================`;
}

function fallbackMailto(d) {
  const subject = encodeURIComponent(`Apprenticeship Application – ${d.firstName} ${d.surname}`);
  const body = encodeURIComponent(buildEmailBody(d));
  window.open(`mailto:iamlexastrong@gmail.com?subject=${subject}&body=${body}`, '_blank');
}

// ---- Form Submit ----
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateAll()) {
    const firstErr = document.querySelector('.form-group input.error, .form-group textarea.error');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  submittedData = collectData();

  // Show loading
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').style.display = 'none';
  submitBtn.querySelector('.btn-icon').style.display = 'none';
  submitBtn.querySelector('.btn-loader').style.display = 'inline-flex';

  await sendEmail(submittedData);

  // Restore button then move on
  submitBtn.disabled = false;
  submitBtn.querySelector('.btn-text').style.display = '';
  submitBtn.querySelector('.btn-icon').style.display = '';
  submitBtn.querySelector('.btn-loader').style.display = 'none';

  showSection(itemsSection);
});

// ---- Accept Items → Show Conduct ----
acceptItemsBtn.addEventListener('click', () => showSection(conductSection));

// ---- PDF Download ----
downloadBtn.addEventListener('click', () => generatePDF());

function generatePDF() {
  const d = submittedData;
  const tpl = document.getElementById('pdf-template');
  tpl.innerHTML = `
<div class="pdf-container" style="font-family:Helvetica,Arial,sans-serif;color:#1a1a1a;padding:40px;max-width:700px;background:#fff;">
  <div style="text-align:center;border-bottom:3px double #333;padding-bottom:20px;margin-bottom:30px;position:relative;">
    <img src="logo.png" style="width:60px;height:60px;object-fit:contain;margin-bottom:10px;" alt="Logo">
    <h1 style="font-size:22px;text-transform:uppercase;letter-spacing:3px;margin:0 0 4px;">Lemaire Clothing</h1>
    <h2 style="font-size:16px;font-weight:normal;color:#555;margin:0 0 4px;">Apprenticeship Agreement</h2>
    <p style="font-size:11px;color:#888;margin:0;">Personal Record Form</p>
    <div style="position:absolute;top:0;right:0;width:80px;height:80px;border:1px solid #ccc;border-radius:4px;overflow:hidden;">
      <img src="${d.photo}" style="width:100%;height:100%;object-fit:cover;" alt="Applicant Photo">
    </div>
  </div>

  <div style="font-size:14px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;border-bottom:2px solid #c9a55c;padding-bottom:6px;margin:24px 0 14px;color:#333;">Section A – Apprentice Details</div>
  ${pdfField('Surname', d.surname)}
  ${pdfField('First Name', d.firstName)}
  ${pdfField('Other Names', d.otherNames || 'N/A')}
  ${pdfField('Date of Birth', d.dob)}
  ${pdfField('Nationality', d.nationality)}
  ${pdfField('District', d.district)}
  ${pdfField('Hometown', d.hometown)}
  ${pdfField('Region', d.region)}
  ${pdfField('Religious Denomination', d.religion || 'N/A')}
  ${pdfField('Last School Attended', d.lastSchool)}
  ${pdfField('Hobbies / Interests', d.hobbies || 'N/A')}
  ${pdfField('Telephone', d.apprenticeTelephone)}
  ${pdfField('Date', d.apprenticeDate)}

  <div style="display:flex;justify-content:flex-start;margin-top:16px;">
    <div style="text-align:center;">
      <div style="font-family:'Dancing Script',cursive;font-size:20px;border-bottom:1px solid #333;padding-bottom:4px;min-width:180px;">${esc(d.apprenticeSignature)}</div>
      <div style="font-size:10px;color:#888;margin-top:4px;">Apprentice's Signature</div>
    </div>
  </div>

  <div style="font-size:14px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;border-bottom:2px solid #c9a55c;padding-bottom:6px;margin:28px 0 14px;color:#333;">Section B – Parent / Guardian Details</div>
  ${pdfField("Father's Full Name", d.fatherName)}
  ${pdfField("Mother's Full Name", d.motherName)}
  ${pdfField("Guardian's Full Name", d.guardianName)}
  ${pdfField('Relationship with Apprentice', d.relationship)}
  ${pdfField('Permanent Address', d.guardianAddress)}
  ${pdfField('Telephone', d.guardianTelephone)}
  ${pdfField('Date', d.guardianDate)}

  <div style="display:flex;justify-content:flex-start;margin-top:16px;">
    <div style="text-align:center;">
      <div style="font-family:'Dancing Script',cursive;font-size:20px;border-bottom:1px solid #333;padding-bottom:4px;min-width:180px;">${esc(d.guardianSignature)}</div>
      <div style="font-size:10px;color:#888;margin-top:4px;">Guardian's Signature</div>
    </div>
  </div>

  <div style="font-size:14px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;border-bottom:2px solid #c9a55c;padding-bottom:6px;margin:28px 0 14px;color:#333;">Fee Information</div>
  <table style="width:100%;border-collapse:collapse;font-size:12px;margin:12px 0;">
    <tr><th style="padding:8px 12px;text-align:left;border:1px solid #ddd;background:#f5f0e5;">Description</th><th style="padding:8px 12px;text-align:right;border:1px solid #ddd;background:#f5f0e5;">Amount</th></tr>
    <tr><td style="padding:8px 12px;border:1px solid #ddd;">Apprenticeship Fee (Principal)</td><td style="padding:8px 12px;text-align:right;border:1px solid #ddd;">GHS 3,000</td></tr>
    <tr><td style="padding:8px 12px;border:1px solid #ddd;">Uniform</td><td style="padding:8px 12px;text-align:right;border:1px solid #ddd;">GHS 1,200</td></tr>
    <tr><td style="padding:8px 12px;border:1px solid #ddd;">Late Fee (woamantɛm Nsa)</td><td style="padding:8px 12px;text-align:right;border:1px solid #ddd;">GHS 800</td></tr>
    <tr style="font-weight:bold;border-top:2px solid #c9a55c;"><td style="padding:8px 12px;border:1px solid #ddd;font-size:13px;">Total</td><td style="padding:8px 12px;text-align:right;border:1px solid #ddd;font-size:13px;">GHS 5,000</td></tr>
  </table>

  <div style="font-size:14px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;border-bottom:2px solid #c9a55c;padding-bottom:6px;margin:28px 0 14px;color:#333;">Code of Conduct for Apprentices</div>

  ${conductBlock('Hours of Work', `You shall be required to work from <b>7:00 AM</b> in the morning to <b>8:00 PM</b> in the evening per day and six days in a week depending on the facility's shift system.<br><b>Public Holidays</b> – Public holidays are not regarded as such for the facility but off-days will be enjoyed by apprentices as and when it is appropriate and communicated by your Master.`)}

  ${conductBlock('Confidential Information', `During your apprenticeship with the facility you will devote your whole time, attention and skills to the best of your ability for the enhancement of the facility.<br>You must always maintain the highest degree of confidential information relating to the business/facility which may be known to you or confided in you by any means.`)}

  ${conductBlock('Caution', `You should not receive any payments/gifts from any clients/customer without the consent and concurrence of the Master.<br>Breach of any of the clauses above, you will first be entitled to a fair hearing by Master of the facility, if found guilty then will render you liable to summary dismissal, in addition to any other remedy the company may have against you in law court.`)}

  ${conductBlock('Vacation of Post', `If you absent yourself from duty without permission from Master for a period amounting to five (5) working days, it simply means that you have automatically vacated your post with the facility.`)}

  ${conductBlock('Discipline', `<ul style="padding-left:20px;margin:4px 0 8px;line-height:1.6;font-size:11px;color:#444;">
    <li>If you commit an act of indiscipline, you shall be subjected to disciplinary action by the Master.</li>
    <li>You shall be given the opportunity to exonerate yourself in writing within 48hrs after being queried.</li>
    <li>Where the answer to the query is not satisfactory, you shall be given a warning in writing.</li>
    <li>Where two (2) warning letters are issued within 12 months, your 3rd warning letter shall terminate your contract.</li>
  </ul>`)}

  ${conductBlock('Acts That Amount to Summary Dismissal', `You shall be summarily dismissed for:<ul style="padding-left:20px;margin:4px 0 8px;line-height:1.6;font-size:11px;color:#444;">
    <li>Proven dishonesty or fraud, theft or stealing.</li><li>Vacation of post.</li>
    <li>Acts not in conformity with rules and regulations.</li><li>Wilful refusal to obey legitimate instructions.</li>
    <li>Persistent drunkenness.</li><li>Negligent of duty.</li><li>Absenteeism.</li></ul>`)}

  ${conductBlock('Grievances Procedure', `<ul style="padding-left:20px;margin:4px 0 8px;line-height:1.6;font-size:11px;color:#444;">
    <li>Report to your immediate Chief Apprentice.</li>
    <li>If not satisfied, take the matter to the Master for a final decision.</li></ul>`)}

  ${conductBlock('Offences and Punishment', `<ul style="padding-left:20px;margin:4px 0 8px;line-height:1.6;font-size:11px;color:#444;">
    <li><b>Conversion of facility property</b> – gross misconduct, summary dismissal.</li>
    <li><b>Fraudulent claim or receipts</b> – gross misconduct, summary dismissal.</li>
    <li><b>Selling the facility's property and services.</b></li>
    <li><b>Alcoholic drinks on duty</b> – summary dismissal.</li></ul>`)}

  ${conductBlock('Neglect of Duty', `Workers guilty of gross neglect of duties without lawful excuse will be liable to summary dismissal.`)}
  ${conductBlock('Quarreling or Brawling', `It is an offence to quarrel or brawl whilst on duty. Punishment: warning letter or suspension.`)}
  ${conductBlock('Fighting', `It is an offence carrying the penalty of summary dismissal to fight during working hours.`)}
  ${conductBlock('Sexual Misconduct', `Withdrawal from the facility.`)}

  <div style="text-align:center;margin-top:30px;padding-top:16px;border-top:2px solid #333;font-size:10px;color:#888;">
    &copy; ${new Date().getFullYear()} Lemaire Clothing — Apprenticeship Programme, Konongo, Ghana
  </div>
</div>`;

  tpl.style.display = 'block';
  const opt = {
    margin: [10, 10, 10, 10],
    filename: `Lemaire_Apprenticeship_${d.surname}_${d.firstName}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };
  html2pdf().set(opt).from(tpl.firstElementChild).save().then(() => { tpl.style.display = 'none'; });
}

function pdfField(label, value) {
  return `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px dotted #ddd;font-size:12px;">
    <span style="color:#555;font-weight:600;">${esc(label)}</span>
    <span style="color:#1a1a1a;text-align:right;max-width:55%;">${esc(value)}</span>
  </div>`;
}

function conductBlock(title, html) {
  return `<div style="margin-bottom:14px;">
    <div style="font-size:13px;font-weight:bold;margin:12px 0 6px;color:#333;">${title}</div>
    <div style="font-size:11px;color:#444;line-height:1.6;">${html}</div>
  </div>`;
}

function esc(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}
