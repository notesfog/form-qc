/* =============================
   QC Laptop — app.js
   ============================= */

// ---- Data Definitions ----

const FISIK_ITEMS = [
  { no: 1,  label: "Body / Casing",      opts: ["Normal", "Abnormal"] },
  { no: 2,  label: "Layar (LCD)",         opts: ["Normal", "Abnormal"] },
  { no: 3,  label: "Keyboard",            opts: ["Normal", "Abnormal"] },
  { no: 4,  label: "Touchpad",            opts: ["Normal", "Abnormal"] },
  { no: 5,  label: "Engsel Laptop",       opts: ["Normal", "Abnormal"] },
  { no: 6,  label: "Port USB",            opts: ["Normal", "Abnormal"] },
  { no: 7,  label: "Port HDMI / VGA",     opts: ["Normal", "Abnormal", "-"] },
  { no: 8,  label: "Port Audio",          opts: ["Normal", "Abnormal"] },
  { no: 9,  label: "Kamera (Webcam)",     opts: ["Normal", "Abnormal"] },
  { no: 10, label: "Speaker",             opts: ["Normal", "Abnormal"] },
];

const SISTEM_ITEMS = [
  { no: 1,  label: "Booting Normal",          opts: ["Normal", "Abnormal"] },
  { no: 2,  label: "Login OS",                opts: ["Normal", "Abnormal"] },
  { no: 3,  label: "Touchpad Responsif",      opts: ["Normal", "Abnormal"] },
  { no: 4,  label: "Audio Output",            opts: ["Normal", "Abnormal"] },
  { no: 5,  label: "Kamera Berfungsi",        opts: ["Normal", "Abnormal"] },
  { no: 6,  label: "Port USB Read/Write",     opts: ["Normal", "Abnormal"] },
  { no: 7,  label: "HDMI Output",             opts: ["Normal", "Abnormal", "-"] },
  { no: 8,  label: "Koneksi WiFi",            opts: ["On", "Off"] },
  { no: 9,  label: "Bluetooth",               opts: ["On", "Off"] },
  { no: 10, label: "Keyboard Input",          opts: ["On", "Off"] },
];

const SOFTWARE_ITEMS = [
  { no: 1, label: "OS Activated",                    opts: ["Ready", "Tidak Ready", "-"] },
  { no: 2, label: "Driver Lengkap",                  opts: ["Ready", "Tidak Ready", "-"] },
  { no: 3, label: "Microsoft Office",                opts: ["Ready", "Tidak Ready", "-"] },
  { no: 4, label: "Browser (Chrome/Edge)",           opts: ["Ready", "Tidak Ready", "-"] },
  { no: 5, label: "Antivirus",                       opts: ["Ready", "Tidak Ready", "-"] },
  { no: 6, label: "Aplikasi Tambahan",               opts: ["Ready", "Tidak Ready", "-"] },
  { no: 7, label: "Update Windows",                  opts: ["Ready", "Tidak Ready", "-"] },
  { no: 8, label: "Setting User (Default/Custom)",   opts: ["Default", "Custom", "-"] },
];

const AKSESORI_ITEMS = ["Charger", "Mouse", "Tas Laptop", "Kabel LAN", "Lainnya"];

// ---- State ----

const state = {
  fisik:     {},
  sistem:    {},
  software:  {},
  aksesori:  {},
  conclusion: null,
};

// ---- Option Button Styling ----

/**
 * Maps an option value to a CSS class suffix.
 * "positive" = green, "negative" = red, "neutral" = gray
 */
function getOptClass(opt) {
  const v = opt.toLowerCase();
  if (["normal", "on", "ready", "default", "custom"].includes(v)) return "active-pos";
  if (["abnormal", "off", "tidak ready"].includes(v))              return "active-neg";
  if (v === "-")                                                     return "active-neutral";
  return "";
}

// ---- Render Checklist Table ----

function renderTable(tbodyId, items, stateKey) {
  const tbody = document.getElementById(tbodyId);
  items.forEach((item) => {
    const tr = document.createElement("tr");

    const optsHtml = item.opts
      .map(
        (opt) =>
          `<button class="opt-btn" data-key="${stateKey}" data-no="${item.no}" data-val="${opt}">${opt}</button>`
      )
      .join("");

    tr.innerHTML = `
      <td>${item.no}</td>
      <td>${item.label}</td>
      <td><div class="opt-group">${optsHtml}</div></td>
    `;
    tbody.appendChild(tr);
  });
}

// ---- Render Aksesori ----

function renderAksesori() {
  const grid = document.getElementById("aksesori-grid");
  AKSESORI_ITEMS.forEach((name) => {
    state.aksesori[name] = "tidak";

    const div = document.createElement("div");
    div.className = "aks-item";
    div.innerHTML = `
      <div class="aks-label">${name}</div>
      <div class="aks-toggle">
        <button class="aks-btn" data-aks="${name}" data-val="ya">Ya</button>
        <button class="aks-btn" data-aks="${name}" data-val="tidak">Tidak</button>
      </div>
    `;
    grid.appendChild(div);
  });
}

// ---- Event Delegation ----

// Checklist option buttons
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".opt-btn");
  if (!btn) return;

  const { key, no, val } = btn.dataset;
  state[key][no] = val;

  // Reset all sibling buttons then mark active
  btn.closest(".opt-group").querySelectorAll(".opt-btn").forEach((b) => {
    b.className = "opt-btn";
  });
  btn.className = `opt-btn ${getOptClass(val)}`;

  updateProgress();
});

// Aksesori toggle buttons
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".aks-btn");
  if (!btn) return;

  const { aks, val } = btn.dataset;
  state.aksesori[aks] = val;

  btn.closest(".aks-toggle").querySelectorAll(".aks-btn").forEach((b) => {
    b.className = "aks-btn";
  });

  if (val === "ya") btn.className = "aks-btn active-ya";

  updateProgress();
});

// ---- Conclusion ----

function setConclusion(el) {
  document.querySelectorAll(".concl-btn").forEach((b) => {
    b.className = "concl-btn";
  });
  const val = el.dataset.val;
  state.conclusion = val;
  el.className = `concl-btn sel-${val}`;
  updateProgress();
}

// Expose globally for onclick attributes in HTML
window.setConclusion = setConclusion;

// ---- Progress ----

function updateProgress() {
  const totalChecks =
    FISIK_ITEMS.length + SISTEM_ITEMS.length + SOFTWARE_ITEMS.length;

  const filled =
    Object.keys(state.fisik).length +
    Object.keys(state.sistem).length +
    Object.keys(state.software).length;

  const infoFilled = ["namaPenyewa", "brand", "serial"].filter(
    (id) => document.getElementById(id).value.trim() !== ""
  ).length;

  const conclFilled = state.conclusion ? 1 : 0;

  const total = totalChecks + 3 + 1;
  const done  = filled + infoFilled + conclFilled;
  const pct   = Math.round((done / total) * 100);

  document.getElementById("prog").style.width = pct + "%";
  document.getElementById("progress-label").textContent = `Kelengkapan: ${pct}%`;
}

// Attach progress listeners to required text inputs
["namaPenyewa", "brand", "serial"].forEach((id) => {
  document.getElementById(id).addEventListener("input", updateProgress);
});

// ---- Reset Form ----

function resetForm() {
  if (!confirm("Reset semua data form? Tindakan ini tidak bisa dibatalkan.")) return;

  // Clear text inputs
  document.querySelectorAll("input, textarea").forEach((el) => {
    el.value = "";
  });

  // Reset option buttons
  document.querySelectorAll(".opt-btn").forEach((b) => {
    b.className = "opt-btn";
  });

  // Reset aksesori buttons
  document.querySelectorAll(".aks-btn").forEach((b) => {
    b.className = "aks-btn";
  });

  // Reset conclusion buttons
  document.querySelectorAll(".concl-btn").forEach((b) => {
    b.className = "concl-btn";
  });

  // Reset state
  ["fisik", "sistem", "software", "aksesori"].forEach((key) => {
    state[key] = {};
  });
  state.conclusion = null;

  // Re-init aksesori state
  AKSESORI_ITEMS.forEach((name) => {
    state.aksesori[name] = "tidak";
  });

  updateProgress();
}

window.resetForm = resetForm;

// ---- Helpers ----

function getVal(id) {
  return document.getElementById(id)?.value?.trim() || "—";
}

function stateLabel(key, no) {
  return state[key][no] || "—";
}

function aksLabel(name) {
  return state.aksesori[name] === "ya" ? "Ya" : "Tidak";
}

const CONCLUSION_LABELS = {
  siap:  "Siap Digunakan",
  perlu: "Perlu Perbaikan",
  tidak: "Tidak Layak Pakai",
};

// ---- Print / PDF ----

function printForm() {
  
  const conclText = state.conclusion
    ? CONCLUSION_LABELS[state.conclusion]
    : "Belum ditentukan";

  const today = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const fisikRows = FISIK_ITEMS.map(
    (i) => `<tr><td>${i.no}</td><td>${i.label}</td><td>${stateLabel("fisik", i.no)}</td></tr>`
  ).join("");

  const sistemRows = SISTEM_ITEMS.map(
    (i) => `<tr><td>${i.no}</td><td>${i.label}</td><td>${stateLabel("sistem", i.no)}</td></tr>`
  ).join("");

  const softwareRows = SOFTWARE_ITEMS.map(
    (i) => `<tr><td>${i.no}</td><td>${i.label}</td><td>${stateLabel("software", i.no)}</td></tr>`
  ).join("");

  const aksRows = AKSESORI_ITEMS.map(
    (name) => `<tr><td>${name}</td><td>${aksLabel(name)}</td></tr>`
  ).join("");

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Form QC Laptop — ${getVal("namaPenyewa")}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 12px; color: #111; padding: 28px; max-width: 750px; margin: 0 auto; }
    h1 { font-size: 16px; font-weight: 700; margin-bottom: 2px; }
    .meta { font-size: 11px; color: #777; margin-bottom: 16px; }
    h2 { font-size: 12px; font-weight: 700; background: #f0f0f0; padding: 5px 8px; margin: 16px 0 6px; border-left: 3px solid #185FA5; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
    th, td { border: 1px solid #ddd; padding: 5px 8px; text-align: left; }
    th { background: #f7f7f7; font-weight: 600; font-size: 11px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 20px; margin-bottom: 6px; }
    .info-row { display: flex; gap: 8px; padding: 3px 0; border-bottom: 1px solid #f0f0f0; }
    .info-key { color: #555; min-width: 140px; font-weight: 500; }
    .catatan-box { border: 1px solid #ddd; padding: 10px; min-height: 60px; white-space: pre-wrap; font-size: 12px; }
    .concl-box { border: 2px solid #333; text-align: center; padding: 12px; font-size: 15px; font-weight: 700; margin-top: 10px; }
    .sign-row { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 36px; }
    .sign-box { border-top: 1px solid #111; padding-top: 4px; text-align: center; font-size: 11px; }
    .sign-space { height: 56px; }
    @media print { body { padding: 0; } @page { margin: 20mm; } }
  </style>
</head>
<body>

  <h1>Form Quality Control (QC) Laptop</h1>
  <p class="meta">Dicetak: ${today}</p>

  <h2>Informasi Penyewaan</h2>
  <div class="info-grid">
    <div class="info-row"><span class="info-key">Nama Penyewa</span><span>${getVal("namaPenyewa")}</span></div>
    <div class="info-row"><span class="info-key">Perusahaan / Instansi</span><span>${getVal("perusahaan")}</span></div>
    <div class="info-row"><span class="info-key">Tanggal Sewa</span><span>${getVal("tglSewa")}</span></div>
    <div class="info-row"><span class="info-key">Tanggal Pengembalian</span><span>${getVal("tglKembali")}</span></div>
    <div class="info-row"><span class="info-key">PIC / Teknisi QC</span><span>${getVal("pic")}</span></div>
  </div>

  <h2>Identitas Perangkat</h2>
  <div class="info-grid">
    <div class="info-row"><span class="info-key">Merk / Brand</span><span>${getVal("brand")}</span></div>
    <div class="info-row"><span class="info-key">Tipe / Model</span><span>${getVal("model")}</span></div>
    <div class="info-row"><span class="info-key">Serial Number</span><span>${getVal("serial")}</span></div>
    <div class="info-row"><span class="info-key">Asset Code</span><span>${getVal("asset")}</span></div>
    <div class="info-row"><span class="info-key">Processor</span><span>${getVal("cpu")}</span></div>
    <div class="info-row"><span class="info-key">RAM</span><span>${getVal("ram")}</span></div>
    <div class="info-row"><span class="info-key">Storage (SSD/HDD)</span><span>${getVal("storage")}</span></div>
    <div class="info-row"><span class="info-key">VGA / GPU</span><span>${getVal("gpu")}</span></div>
    <div class="info-row"><span class="info-key">Sistem Operasi</span><span>${getVal("os")}</span></div>
    <div class="info-row"><span class="info-key">IP Address</span><span>${getVal("ip")}</span></div>
  </div>

  <h2>Checklist Kondisi Fisik</h2>
  <table>
    <thead><tr><th>No</th><th>Komponen</th><th>Status</th></tr></thead>
    <tbody>${fisikRows}</tbody>
  </table>

  <h2>Checklist Fungsi Sistem</h2>
  <table>
    <thead><tr><th>No</th><th>Pengujian</th><th>Status</th></tr></thead>
    <tbody>${sistemRows}</tbody>
  </table>

  <h2>Checklist Software &amp; Konfigurasi</h2>
  <table>
    <thead><tr><th>No</th><th>Item</th><th>Status</th></tr></thead>
    <tbody>${softwareRows}</tbody>
  </table>

  <h2>Aksesoris yang Disertakan</h2>
  <table>
    <thead><tr><th>Item</th><th>Keterangan</th></tr></thead>
    <tbody>${aksRows}</tbody>
  </table>

  <h2>Catatan / Temuan</h2>
  <div class="catatan-box">${document.getElementById("catatan").value || "—"}</div>

  <h2>Kesimpulan QC</h2>
  <div class="concl-box">${conclText}</div>

</body>
</html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 500);
}

window.printForm = printForm;

// ---- Init ----

renderTable("fisik-body",    FISIK_ITEMS,    "fisik");
renderTable("sistem-body",   SISTEM_ITEMS,   "sistem");
renderTable("software-body", SOFTWARE_ITEMS, "software");
renderAksesori();
