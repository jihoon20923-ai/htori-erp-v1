/*************************************************
 * HTORI ERP - CLEAN STABLE SINGLE FILE VERSION
 *************************************************/

/* =========================
   GLOBAL STATE
========================= */
const LANGS = ["EN", "KR", "ID"];

const state = {
  lang: localStorage.getItem("htori_lang") || "EN",
  page: localStorage.getItem("htori_page") || "dashboard",
};

/* =========================
   I18N
========================= */
const i18n = {
  EN: { appTitle: "HTORI ERP", pages: { btnEdit: "Edit", btnDelete: "Delete", btnRegister: "Register", btnAdd: "Add", btnDownloadExcel: "Excel Download" } },
  KR: { appTitle: "HTORI ERP", pages: { btnEdit: "수정", btnDelete: "삭제", btnRegister: "등록", btnAdd: "추가", btnDownloadExcel: "엑셀 다운로드" } },
  ID: { appTitle: "HTORI ERP", pages: { btnEdit: "Edit", btnDelete: "Hapus", btnRegister: "Daftar", btnAdd: "Tambah", btnDownloadExcel: "Unduh Excel" } },
};

/* =========================
   STORAGE HELPERS
========================= */
const get = (k, d = []) => JSON.parse(localStorage.getItem(k) || JSON.stringify(d));
const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));

/* =========================
   SUPPLIER
========================= */
function getSuppliers() { return get("suppliers"); }
function saveSuppliers(v) { set("suppliers", v); }

function addSupplier() {
  const name = document.getElementById("newSupplier").value.trim();
  if (!name) return alert("Supplier name required");
  const list = getSuppliers();
  if (list.some(s => s.name === name)) return alert("Already exists");
  list.push({ name });
  saveSuppliers(list);
  renderSupplierPage();
}

function deleteSupplier(name) {
  let list = getSuppliers().filter(s => s.name !== name);
  saveSuppliers(list);
  renderSupplierPage();
}

function renderSupplierPage() {
  const tbody = document.getElementById("supplierTableBody");
  if (!tbody) return;
  const t = i18n[state.lang].pages;
  tbody.innerHTML = "";
  getSuppliers().forEach(s => {
    tbody.innerHTML += `
      <tr>
        <td>${s.name}</td>
        <td>
          <button onclick="deleteSupplier('${s.name}')">${t.btnDelete}</button>
        </td>
      </tr>`;
  });
}

/* =========================
   STOCK
========================= */
function getStock() { return get("stock"); }
function saveStock(v) { set("stock", v); }

function editStockQty(code) {
  let stock = getStock();
  let item = stock.find(i => i.code === code);
  if (!item) return alert("Not found");
  const n = Number(prompt("New Qty", item.qty));
  if (isNaN(n)) return;
  item.qty = n;
  saveStock(stock);
  renderStockPage();
}

function renderStockPage() {
  const tbody = document.getElementById("stockTableBody");
  if (!tbody) return;
  const t = i18n[state.lang].pages;
  tbody.innerHTML = "";
  getStock().forEach(i => {
    tbody.innerHTML += `
      <tr>
        <td>${i.code}</td>
        <td>${i.name}</td>
        <td>${i.qty}</td>
        <td><button onclick="editStockQty('${i.code}')">${t.btnEdit}</button></td>
      </tr>`;
  });
}

/* =========================
   PRODUCTION
========================= */
function getProduction() { return get("production"); }
function saveProduction(v) { set("production", v); }

function onProduction() {
  const product = document.getElementById("prodProduct").value;
  const qty = Number(document.getElementById("prodQty").value);
  if (!product || !qty) return alert("Input required");

  const list = getProduction();
  list.push({
    date: new Date().toLocaleDateString(),
    product,
    qty,
    updated: new Date().toLocaleString(),
  });

  saveProduction(list);
  renderProductionPage();
}

function editProduction(index) {
  let list = getProduction();
  let p = list[index];
  const n = Number(prompt("New Qty", p.qty));
  if (isNaN(n)) return;
  p.qty = n;
  p.updated = new Date().toLocaleString();
  saveProduction(list);
  renderProductionPage();
}

function renderProductionPage() {
  const tbody = document.getElementById("prodTableBody");
  if (!tbody) return;
  const t = i18n[state.lang].pages;
  tbody.innerHTML = "";
  getProduction().forEach((p, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${p.date}</td>
        <td>${p.product}</td>
        <td>${p.qty}</td>
        <td>${p.updated}</td>
        <td><button onclick="editProduction(${i})">${t.btnEdit}</button></td>
      </tr>`;
  });
}

/* =========================
   CSV DOWNLOAD
========================= */
function downloadCSV(filename, headers, rows) {
  let csv = headers.join(",") + "\n";
  rows.forEach(r => csv += r.join(",") + "\n");
  const blob = new Blob([csv]);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

function downloadProductionCSV() {
  const list = getProduction();
  downloadCSV("production.csv", ["Date","Product","Qty","Updated"],
    list.map(p => [p.date,p.product,p.qty,p.updated]));
}

/* =========================
   EXCEL UPLOAD
========================= */
function handleExcelUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  alert("Excel Selected: " + file.name);
}
window.handleExcelUpload = handleExcelUpload;

/* =========================
   PAGE TEMPLATES
========================= */
const PageTemplates = {
  dashboard() {
    return `<h2>Dashboard</h2>`;
  },

  stock() {
    return `
      <h2>Stock</h2>
      <table class="erp-table">
        <thead><tr><th>Code</th><th>Name</th><th>Qty</th><th>Edit</th></tr></thead>
        <tbody id="stockTableBody"></tbody>
      </table>`;
  },

  production() {
    return `
      <h2>Production</h2>
      <div class="form-row">
        <input id="prodProduct" placeholder="Product">
        <input id="prodQty" type="number" placeholder="Qty">
        <button onclick="onProduction()">Register</button>
        <button onclick="downloadProductionCSV()">Excel</button>
      </div>
      <table class="erp-table">
        <thead><tr><th>Date</th><th>Product</th><th>Qty</th><th>Updated</th><th>Edit</th></tr></thead>
        <tbody id="prodTableBody"></tbody>
      </table>`;
  },

  suppliers() {
    return `
      <h2>Suppliers</h2>
      <input id="newSupplier" placeholder="Supplier Name">
      <button onclick="addSupplier()">Add</button>
      <table class="erp-table">
        <thead><tr><th>Name</th><th>Delete</th></tr></thead>
        <tbody id="supplierTableBody"></tbody>
      </table>`;
  }

/***********************
 * SETTINGS
 ***********************/

const PageTemplates = {
  dashboard(lang) {
    return `<h2>Dashboard</h2>`;
  },

  stock(lang) {
    return `<h2>Stock</h2>`;
  },

  suppliers(lang) {
    return `<h2>Suppliers</h2>`;
  },

  settings(lang) {
    const t = i18n[lang].pages;

    return `
      <h2>${t.settingsTitle}</h2>

      <div class="settings-section">
        <h3>Backup & Restore</h3>

        <button onclick="backupToFile()" class="btn-primary">
          Backup Download
        </button>

        <label for="restoreFile" class="btn-secondary" style="cursor:pointer;">
          Load Backup File
        </label>

        <input id="restoreFile" type="file"
               accept="application/json"
               style="display:none;"
               onchange="restoreFromFile(event)">
      </div>

      <div class="settings-section">
        <h3>Excel Upload</h3>

        <label for="excelFile" class="btn-secondary" style="cursor:pointer;">
          Excel 파일 선택
        </label>

        <input id="excelFile" type="file"
               style="display:none;"
               onchange="handleExcelUpload(event)">
      </div>
    `;
  }
};  // ✅ 이 줄 반드시 필요함 (PageTemplates 종료)







/* =========================
   RENDER ENGINE
========================= */
function renderContent() {
  const page = PageTemplates[state.page] || PageTemplates.dashboard;
  document.getElementById("content").innerHTML = page();

  if (state.page === "stock") renderStockPage();
  if (state.page === "production") renderProductionPage();
  if (state.page === "suppliers") renderSupplierPage();
}

function renderHeader() {
  document.querySelector(".logo").textContent = i18n[state.lang].appTitle;
}

function rerenderAll() {
  renderHeader();
  renderContent();
}

/* =========================
   NAVIGATION + LANGUAGE
========================= */
function setLanguage(lang) {
  state.lang = lang;
  localStorage.setItem("htori_lang", lang);
  rerenderAll();
}

function loadPage(page) {
  state.page = page;
  localStorage.setItem("htori_page", page);
  rerenderAll();
}

window.setLanguage = setLanguage;
window.loadPage = loadPage;
window.onProduction = onProduction;
window.editProduction = editProduction;
window.downloadProductionCSV = downloadProductionCSV;
window.addSupplier = addSupplier;
window.deleteSupplier = deleteSupplier;
window.editStockQty = editStockQty;

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  rerenderAll();

  document.querySelectorAll(".sidebar li").forEach(li => {
    li.addEventListener("click", () => {
      loadPage(li.dataset.page);
    });
  });
});
PageTemplates.production = function (lang) {
  const t = i18n[lang].pages;

  return `
    <h2>${t.productionTitle}</h2>
    <p>${t.productionDesc}</p>

    <div class="form-row">
      <input id="prodProduct" placeholder="Product Code">
      <input id="prodQty" type="number" placeholder="Qty">

      <button onclick="onProduction()" class="btn-primary">
        ${t.btnProduction}
      </button>

      <button onclick="downloadProductionCSV()" class="btn-secondary">
        ${t.btnDownloadExcel}
      </button>
    </div>

    <table class="erp-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Product</th>
          <th>Qty</th>
          <th>Updated</th>
          <th>${t.btnEdit}</th>
        </tr>
      </thead>
      <tbody id="prodTableBody"></tbody>
    </table>
  `;
};


function getProduction() {
  return JSON.parse(localStorage.getItem("production") || "[]");
}

function saveProduction(list) {
  localStorage.setItem("production", JSON.stringify(list));
}

function onProduction() {
  const product = document.getElementById("prodProduct").value.trim();
  const qtyStr = document.getElementById("prodQty").value.trim();
  const qty = Number(qtyStr);

  if (!product || !qty) {
    alert("Product와 수량을 입력하세요.");
    return;
  }

  const bomList = getBomForProduct(product);
  if (bomList.length === 0) {
    alert("해당 제품의 BOM이 없습니다.");
    return;
  }

  let stock = getStock();

  // ✅ BOM 기준 자재 재고 체크
  for (const b of bomList) {
    const need = b.qty * qty;
    const mat = stock.find(s => s.code === b.matCode);
    if (!mat || mat.qty < need) {
      alert(`재고 부족: ${b.matCode} / 필요:${need}, 현재:${mat ? mat.qty : 0}`);
      return;
    }
  }

  // ✅ 자재 재고 차감
  bomList.forEach(b => {
    const need = b.qty * qty;
    const mat = stock.find(s => s.code === b.matCode);
    mat.qty -= need;
    mat.lastUpdate = new Date().toLocaleString();
  });

  // ✅ 완제품 재고 증가
  let fg = stock.find(s => s.code === product);
  if (!fg) {
    stock.push({
      code: product,
      name: product,
      qty,
      minQty: 0,
      unit: "SET",
      lastUpdate: new Date().toLocaleString()
    });
  } else {
    fg.qty += qty;
    fg.lastUpdate = new Date().toLocaleString();
  }

  saveStock(stock);

  const list = getProduction();
  list.push({
    date: new Date().toLocaleDateString(),
    product,
    qty,
    updated: new Date().toLocaleString()
  });

  saveProduction(list);

  alert("✅ 생산 등록 완료");
  loadPage("production");
}
function renderProductionPage() {
  const tbody = document.getElementById("prodTableBody");
  if (!tbody) return;

  const list = getProduction();
  tbody.innerHTML = "";

  list.forEach((p, idx) => {
    tbody.innerHTML += `
      <tr>
        <td>${p.date}</td>
        <td>${p.product}</td>
        <td>${p.qty}</td>
        <td>${p.updated}</td>
        <td>
          <button class="btn-mini" onclick="editProduction(${idx})">
            ${i18n[state.lang].pages.btnEdit}
          </button>
        </td>
      </tr>
    `;
  });
}
function downloadProductionCSV() {
  const list = getProduction();

  const headers = ["Date", "Product", "Qty", "Updated"];
  const rows = list.map(p => [
    p.date,
    p.product,
    p.qty,
    p.updated
  ]);

  downloadCSV("production.csv", headers, rows);
}
// ============================
// ✅ 전역(Global) 바인딩 (버튼 작동 핵심)
// ============================

window.setLanguage = setLanguage;
window.loadPage = loadPage;

window.backupToFile = backupToFile;
window.restoreFromFile = restoreFromFile;

window.onPurchase = onPurchase;
window.onOutgoing = onOutgoing;
window.onProduction = onProduction;
window.onOutsourcing = onOutsourcing;

window.saveBOMItem = saveBOMItem;

window.editStockQty = editStockQty;
window.editPurchase = editPurchase;
window.editProduction = editProduction;

window.downloadPurchaseCSV = downloadPurchaseCSV;
window.downloadOutgoingCSV = downloadOutgoingCSV;
window.downloadProductionCSV = downloadProductionCSV;

window.addSupplier = addSupplier;
window.deleteSupplier = deleteSupplier;

window.handleExcelUpload = handleExcelUpload;

window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
