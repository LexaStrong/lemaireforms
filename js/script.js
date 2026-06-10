// ── CONFIGURATION ──
const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL'; // Replace with your deployed Web App URL
const ADMIN_WHATSAPP = '233248293815'; // Admin's WhatsApp number

// ── PHOTO PREVIEW ──
function previewPhoto(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      const preview = document.getElementById('photoPreview');
      preview.src = e.target.result;
      preview.style.display = 'block';
      document.getElementById('photoIcon').style.display = 'none';
      document.getElementById('photoText').style.display = 'none';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// ── MODAL ──
function openModal() { document.getElementById('conductModal').style.display = 'block'; }
function closeModal() { document.getElementById('conductModal').style.display = 'none'; }
document.getElementById('conductModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ── VALIDATION ──
function validate(id, errId, check) {
  const el = document.getElementById(id);
  const err = document.getElementById(errId);
  const ok = check ? check(el) : el.value.trim() !== '';
  el.classList.toggle('invalid', !ok);
  err.style.display = ok ? 'none' : 'block';
  return ok;
}

// ── FORM SUBMIT ──
document.getElementById('registrationForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  // Validate all
  const checks = [
    validate('surname', 'err-surname'),
    validate('firstName', 'err-firstName'),
    validate('dob', 'err-dob'),
    validate('nationality', 'err-nationality'),
    validate('hometown', 'err-hometown'),
    validate('district', 'err-district'),
    validate('region', 'err-region'),
    validate('religion', 'err-religion'),
    validate('lastSchool', 'err-lastSchool'),
    validate('hobbies', 'err-hobbies'),
    validate('telephone', 'err-telephone'),
    validate('signature', 'err-signature'),
    validate('sigDate', 'err-sigDate'),
    validate('fatherName', 'err-fatherName'),
    validate('motherName', 'err-motherName'),
    validate('guardianName', 'err-guardianName'),
    validate('relationship', 'err-relationship'),
    validate('guardianAddress', 'err-guardianAddress'),
    validate('guardianTel', 'err-guardianTel'),
    validate('guardianSignature', 'err-guardianSignature'),
    validate('guardianDate', 'err-guardianDate'),
  ];

  // Photo check
  const photoInput = document.getElementById('photoInput');
  const hasPhoto = photoInput.files && photoInput.files.length > 0;
  document.getElementById('err-photo').style.display = hasPhoto ? 'none' : 'block';
  if (!hasPhoto) document.getElementById('photoArea').style.borderColor = '#e74c3c';

  if (checks.includes(false) || !hasPhoto) {
    document.querySelector('.invalid, [style*="e74c3c"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Show loading
  document.getElementById('loadingOverlay').classList.add('show');

  try {
    // 1. Generate PDF
    const { blob, base64, filename } = await generatePDFContent();
    
    // 2. Collect form data
    const formData = {};
    const inputs = document.querySelectorAll('#registrationForm input, #registrationForm textarea, #registrationForm select');
    inputs.forEach(input => {
      if (input.id && input.type !== 'file') {
        formData[input.id] = input.value;
      }
    });

    // 3. POST to Google Apps Script (email admin + save to Drive)
    if (SCRIPT_URL && SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
      try {
        await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formData, pdfBase64: base64, filename })
        });
      } catch (backendErr) {
        console.warn('Backend submission failed (email/Drive), continuing with PDF download + WhatsApp:', backendErr);
      }
    }

    // 4. Download PDF locally
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    // 4. Setup WhatsApp and show success screen
    setupWhatsApp(formData);
    showSuccess();

  } catch (err) {
    console.error('Submission Error:', err);
    alert('There was an error submitting your form. Please try again or download the PDF manually.');
  } finally {
    document.getElementById('loadingOverlay').classList.remove('show');
  }
});

// ── GENERATE PDF CONTENT ──
async function generatePDFContent() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210, margin = 20;
  let y = 20;

  const g = id => document.getElementById(id).value.trim();
  const gold = [201, 168, 76];
  const dark = [30, 30, 30];
  const light = [240, 235, 220];

  // Background
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, 210, 297, 'F');

  // Header bar
  doc.setFillColor(...dark);
  doc.rect(0, 0, 210, 48, 'F');
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.5);
  doc.line(margin, 50, W - margin, 50);

  // Logo text
  doc.setTextColor(...gold);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('LEMAIRE CLOTHING VENTURES', W / 2, 14, { align: 'center' });
  doc.setFontSize(6);
  doc.text('KONONGO — ODUMASE A/A · ASHANTI / GHANA', W / 2, 20, { align: 'center' });
  doc.setFontSize(5);
  doc.text('ELEGANCE COLLECTION', W / 2, 26, { align: 'center' });

  doc.setTextColor(...light);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PERSONAL RECORD FORM', W / 2, 36, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...gold);
  doc.text('TO BE COMPLETED AND RETURNED TO MASTER', W / 2, 43, { align: 'center' });

  y = 58;

  // Try to embed photo
  const photoInput = document.getElementById('photoInput');
  if (photoInput.files && photoInput.files[0]) {
    try {
      const imgData = await fileToBase64(photoInput.files[0]);
      const imgType = photoInput.files[0].type.includes('png') ? 'PNG' : 'JPEG';
      doc.addImage(imgData, imgType, W - margin - 30, 55, 28, 34);
      doc.setDrawColor(...gold);
      doc.setLineWidth(0.3);
      doc.rect(W - margin - 30, 55, 28, 34);
      doc.setFontSize(5);
      doc.setTextColor(...gold);
      doc.text('PASSPORT PHOTO', W - margin - 16, 93, { align: 'center' });
    } catch (err) {}
  }

  // Section A
  sectionHeader(doc, 'SECTION A — APPRENTICE INFORMATION', y, gold, dark, light, W, margin);
  y += 12;

  const fieldsA = [
    ['Surname', g('surname')],
    ['First Name', g('firstName')],
    ['Other Names', g('otherNames') || '—'],
    ['Date of Birth', g('dob')],
    ['Nationality', g('nationality')],
    ['Hometown', g('hometown')],
    ['District', g('district')],
    ['Region', g('region')],
    ['Religious Denomination', g('religion')],
    ['Last School Attended & Form Completed', g('lastSchool')],
    ['Hobbies / Interests', g('hobbies')],
    ['Telephone', g('telephone')],
    ['Signature', g('signature')],
    ['Date', g('sigDate')],
  ];

  for (const [label, value] of fieldsA) {
    if (y > 260) { doc.addPage(); bgPage(doc); y = 20; }
    y = fieldRow(doc, label, value, y, margin, W, gold, light, dark);
  }

  y += 8;
  if (y > 255) { doc.addPage(); bgPage(doc); y = 20; }

  // Section B
  sectionHeader(doc, 'SECTION B — PARENT / GUARDIAN INFORMATION', y, gold, dark, light, W, margin);
  y += 12;

  const fieldsB = [
    ["Father's Full Name", g('fatherName')],
    ["Mother's Full Name", g('motherName')],
    ["Full Name of Guardian", g('guardianName')],
    ["Relationship with Apprentice", g('relationship')],
    ["Permanent Address of Guardian", g('guardianAddress')],
    ["Guardian's Telephone", g('guardianTel')],
    ["Guardian's Signature", g('guardianSignature')],
    ["Date", g('guardianDate')],
  ];

  for (const [label, value] of fieldsB) {
    if (y > 260) { doc.addPage(); bgPage(doc); y = 20; }
    y = fieldRow(doc, label, value, y, margin, W, gold, light, dark);
  }

  y += 14;
  if (y > 265) { doc.addPage(); bgPage(doc); y = 20; }

  doc.setDrawColor(...gold);
  doc.setLineWidth(0.3);
  doc.line(margin, y, W - margin, y);
  y += 5;
  doc.setFontSize(6);
  doc.setTextColor(...gold);
  doc.text('LEMAIRE CLOTHING VENTURES — ELEGANCE COLLECTION', W / 2, y + 2, { align: 'center' });
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, W / 2, y + 7, { align: 'center' });

  const name = `${g('surname')}_${g('firstName')}`.replace(/\s+/g, '_').toUpperCase();
  const filename = `Lemaire_Apprentice_${name}.pdf`;
  
  const blob = doc.output('blob');
  const base64 = doc.output('datauristring').split(',')[1];

  return { blob, base64, filename };
}

// ── WHATSAPP HELPER ──
function setupWhatsApp(data) {
  const message = `Hello Admin, I have just submitted my Apprentice Registration form.%0A%0A*Details:*%0A- Name: ${data.firstName} ${data.surname}%0A- Date of Birth: ${data.dob}%0A- Hometown: ${data.hometown}%0A- District: ${data.district}%0A- Region: ${data.region}%0A- Phone: ${data.telephone}%0A- Guardian: ${data.guardianName} (${data.relationship})%0A- Guardian Phone: ${data.guardianTel}%0A%0AThe PDF copy of the full form has been downloaded. I will send it to you shortly.`;
  const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${message}`;
  
  const btn = document.getElementById('whatsappBtn');
  if (btn) btn.href = url;
}

// ── UTILITIES ──
function bgPage(doc) {
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, 210, 297, 'F');
}

function sectionHeader(doc, text, y, gold, dark, light, W, margin) {
  doc.setFillColor(...dark);
  doc.rect(margin, y, W - margin * 2, 8, 'F');
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin, y + 8);
  doc.setTextColor(...gold);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text(text, margin + 3, y + 5.5);
}

function fieldRow(doc, label, value, y, margin, W, gold, light, dark) {
  doc.setFillColor(28, 28, 28);
  doc.rect(margin, y, W - margin * 2, 10, 'F');
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...gold);
  doc.text(label.toUpperCase(), margin + 3, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...light);
  doc.setFontSize(8);
  const lines = doc.splitTextToSize(value || '—', W - margin * 2 - 70);
  if (lines.length > 1) {
    const extra = (lines.length - 1) * 4;
    doc.setFillColor(28, 28, 28);
    doc.rect(margin, y, W - margin * 2, 10 + extra, 'F');
    doc.setFontSize(6);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...gold);
    doc.text(label.toUpperCase(), margin + 3, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...light);
    doc.setFontSize(8);
    doc.text(lines, W - margin - 2, y + 4, { align: 'right', maxWidth: W - margin * 2 - 60 });
    return y + 12 + extra;
  }
  doc.text(lines[0] || '—', W - margin - 2, y + 7, { align: 'right' });
  return y + 12;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function showSuccess() {
  document.getElementById('form-screen').style.display = 'none';
  document.getElementById('success-screen').style.display = 'block';
  document.getElementById('step1').classList.remove('active');
  document.getElementById('step1').classList.add('done');
  document.getElementById('step2').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
