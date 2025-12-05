/*************************************************
 * HTORI ERP – Full Single Page App
 * - Multi Language (EN / KR / ID)
 * - Stock / Purchase / Outgoing / Production / BOM / Outsourcing
 * - Supplier 관리, Logs, Dashboard 등
 *************************************************/

/*************************************************
 * GLOBAL STATE
 *************************************************/
const LANGS = ["EN", "KR", "ID"];

const state = {
  lang: localStorage.getItem("htori_lang") || "EN",
  page: localStorage.getItem("htori_page") || "dashboard",
};

/*************************************************
 * I18N (다국어)
 *************************************************/
const i18n = {
  EN: {
    appTitle: "HTORI ERP",
    sidebar: {
      dashboard: "Dashboard",
      stock: "Stock",
      purchase: "Purchase",
      outgoing: "Outgoing",
      production: "Production",
      bom: "BOM",
      outsourcing: "Outsourcing",
      finished: "Finished Goods",
      suppliers: "Suppliers",
      employees: "Employees",
      attendance: "Attendance",
      payroll: "Payroll",
      logs: "Logs",
      settings: "Settings",
    },
    pages: {
      dashboardTitle: "Dashboard",
      dashboardDesc: "Factory indicators and charts.",

      stockTitle: "Stock",
      stockDesc: "Raw / semi-finished / finished inventory.",

      purchaseTitle: "Purchase",
      purchaseDesc: "Incoming materials.",
      purchaseFormCodePlaceholder: "Material Code",
      purchaseFormNamePlaceholder: "Material Name",
      purchaseFormQtyPlaceholder: "Qty",

      outgoingTitle: "Outgoing",
      outgoingDesc: "Manual outgoing.",

      productionTitle: "Production",
      productionDesc: "Production and material usage.",

      bomTitle: "BOM",
      bomDesc: "Bill of Materials.",

      outsourcingTitle: "Outsourcing",
      outsourcingDesc: "Out → In with vendor and defect.",
      outsourcingOutTitle: "OUT",
      outsourcingInTitle: "IN",
      outsourcingVendorTitle: "Vendor",
      outsourcingDefectTitle: "Defect",
      outsourcingNoteTitle: "Note",
      outsourcingRegisterBtn: "Register Outsourcing",
      outsourcingTableDate: "Date",
      outsourcingTableUpdated: "Updated",

      finishedTitle: "Finished Goods",
      finishedDesc: "Finished products stock.",

      suppliersTitle: "Supplier Management",
      suppliersDesc: "Add / delete suppliers.",

      logsTitle: "Logs",
      logsDesc: "System activity history.",

      settingsTitle: "Settings",
      settingsDesc: "ERP basic settings.",

      employeesTitle: "Employees",
      employeesDesc: "Employee master data.",
      attendanceTitle: "Attendance",
      attendanceDesc: "Clock-in / Clock-out records.",
      payrollTitle: "Payroll",
      payrollDesc: "Monthly payroll overview.",

      btnRegister: "Register",
      btnDownloadExcel: "Excel Download",
      btnOutgoing: "Outgoing",
      btnSave: "Save",
      btnAdd: "Add",
      btnProduction: "Register Production",
      btnOutsourcing: "Outsourcing Register",

      btnEdit: "Edit",
      btnDelete: "Delete",
    },
  },

  KR: {
    appTitle: "HTORI ERP",
    sidebar: {
      dashboard: "대시보드",
      stock: "재고",
      purchase: "입고",
      outgoing: "출고",
      production: "생산",
      bom: "BOM",
      outsourcing: "외주",
      finished: "완제품",
      suppliers: "공급업체",
      employees: "직원",
      attendance: "근태",
      payroll: "급여",
      logs: "로그",
      settings: "설정",
    },
    pages: {
      dashboardTitle: "대시보드",
      dashboardDesc: "공장 지표 및 그래프.",

      stockTitle: "재고 관리",
      stockDesc: "원자재 / 반제품 / 완제품 재고.",

      purchaseTitle: "입고 관리",
      purchaseDesc: "자재 입고 기록.",
      purchaseFormCodePlaceholder: "자재 코드",
      purchaseFormNamePlaceholder: "자재 이름",
      purchaseFormQtyPlaceholder: "수량",

      outgoingTitle: "출고 관리",
      outgoingDesc: "자재 출고 기록.",

      productionTitle: "생산 관리",
      productionDesc: "생산 및 자재 사용.",

      bomTitle: "BOM 관리",
      bomDesc: "제품별 필요 자재.",

      outsourcingTitle: "외주 관리",
      outsourcingDesc: "외주 출고/입고 및 불량.",
      outsourcingOutTitle: "OUT",
      outsourcingInTitle: "IN",
      outsourcingVendorTitle: "외주 업체",
      outsourcingDefectTitle: "불량",
      outsourcingNoteTitle: "비고",
      outsourcingRegisterBtn: "외주 등록",
      outsourcingTableDate: "날짜",
      outsourcingTableUpdated: "변경일",

      finishedTitle: "완제품 재고",
      finishedDesc: "완제품 재고 현황.",

      suppliersTitle: "공급업체 관리",
      suppliersDesc: "공급업체 추가/삭제.",

      logsTitle: "로그",
      logsDesc: "시스템 작업 기록.",

      settingsTitle: "설정",
      settingsDesc: "기본 설정.",

      employeesTitle: "직원 관리",
      employeesDesc: "직원 기본 정보.",
      attendanceTitle: "근태 관리",
      attendanceDesc: "출근/퇴근 기록.",
      payrollTitle: "급여 관리",
      payrollDesc: "월별 급여 현황.",

      btnRegister: "등록",
      btnDownloadExcel: "Excel 다운로드",
      btnOutgoing: "출고",
      btnSave: "저장",
      btnAdd: "추가",
      btnProduction: "생산 등록",
      btnOutsourcing: "외주 등록",

      btnEdit: "수정",
      btnDelete: "삭제",

    },
  },

  ID: {
    appTitle: "HTORI ERP",
    sidebar: {
      dashboard: "Dashboard",
      stock: "Stok",
      purchase: "Pembelian",
      outgoing: "Pengeluaran",
      production: "Produksi",
      bom: "BOM",
      outsourcing: "Outsourcing",
      finished: "Barang Jadi",
      suppliers: "Pemasok",
      employees: "Karyawan",
      attendance: "Absensi",
      payroll: "Gaji",
      logs: "Log",
      settings: "Pengaturan",
    },
    pages: {
      dashboardTitle: "Dashboard",
      dashboardDesc: "Indikator dan grafik pabrik.",

      stockTitle: "Stok",
      stockDesc: "Stok bahan baku / semi / jadi.",

      purchaseTitle: "Pembelian",
      purchaseDesc: "Data bahan masuk.",
      purchaseFormCodePlaceholder: "Kode Material",
      purchaseFormNamePlaceholder: "Nama Material",
      purchaseFormQtyPlaceholder: "Qty",

      outgoingTitle: "Pengeluaran",
      outgoingDesc: "Data bahan keluar.",

      productionTitle: "Produksi",
      productionDesc: "Produksi & pemakaian bahan.",

      bomTitle: "BOM",
      bomDesc: "Bill of Materials.",

      outsourcingTitle: "Outsourcing",
      outsourcingDesc: "Out → In dengan vendor dan cacat.",
      outsourcingOutTitle: "OUT",
      outsourcingInTitle: "IN",
      outsourcingVendorTitle: "Vendor",
      outsourcingDefectTitle: "Cacat",
      outsourcingNoteTitle: "Catatan",
      outsourcingRegisterBtn: "Daftar Outsourcing",
      outsourcingTableDate: "Tanggal",
      outsourcingTableUpdated: "Diupdate",

      finishedTitle: "Barang Jadi",
      finishedDesc: "Stok barang jadi.",

      suppliersTitle: "Manajemen Supplier",
      suppliersDesc: "Tambah / hapus supplier.",

      logsTitle: "Log",
      logsDesc: "Riwayat aktivitas.",

      settingsTitle: "Pengaturan",
      settingsDesc: "Pengaturan dasar.",

      employeesTitle: "Karyawan",
      employeesDesc: "Data karyawan.",
      attendanceTitle: "Absensi",
      attendanceDesc: "Data masuk / pulang.",
      payrollTitle: "Gaji",
      payrollDesc: "Ringkasan gaji bulanan.",

      btnRegister: "Daftar",
      btnDownloadExcel: "Unduh Excel",
      btnOutgoing: "Pengeluaran",
      btnSave: "Simpan",
      btnAdd: "Tambah",
      btnProduction: "Daftar Produksi",
      btnOutsourcing: "Daftar Outsourcing",
      btnEdit: "Edit",
      btnDelete: "Hapus",

    },
  },
};

/*************************************************
 * MENU ORDER (사이드바 순서)
 *************************************************/
const MENU_ORDER = [
  "dashboard",
  "stock",
  "purchase",
  "outgoing",
  "production",
  "bom",
  "outsourcing",
  "finished",
  "suppliers",
  "employees",
  "attendance",
  "payroll",
  "logs",
  "settings",
];

/*************************************************
 * COMMON HELPERS
 *************************************************/
function writeLog(action, detail) {
  const logs = getLogs();
  logs.unshift({
    time: new Date().toLocaleString(),
    action,
    detail,
  });
  saveLogs(logs);
}

/* CSV 다운로드 (Excel로 열 수 있음) */
function downloadCSV(filename, headers, rows) {
  let csv = "";
  if (headers && headers.length) csv += headers.join(",") + "\n";
  rows.forEach((r) => {
    csv += r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/*************************************************
 * LOGS MODULE
 *************************************************/
function getLogs() {
  return JSON.parse(localStorage.getItem("logs") || "[]");
}
function saveLogs(list) {
  localStorage.setItem("logs", JSON.stringify(list));
}
function renderLogsPage() {
  const tbody = document.getElementById("logsTableBody");
  if (!tbody) return;
  const logs = getLogs();
  tbody.innerHTML = "";
  logs.forEach((l) => {
    tbody.innerHTML += `
      <tr>
        <td>${l.time}</td>
        <td>${l.action}</td>
        <td>${l.detail}</td>
      </tr>
    `;
  });
}

/*************************************************
 * SUPPLIER MODULE
 *************************************************/
function getSuppliers() {
  let raw = JSON.parse(localStorage.getItem("suppliers") || "[]");

  // 예전 버전 호환 (문자열만 있던 경우)
  raw = raw.map((old) => ({
    name: old.name || old,
    vendorName: old.vendorName || "",
    contactPerson: old.contactPerson || "",
    email: old.email || "",
    address: old.address || "",
    phone: old.phone || "",
    bankName: old.bankName || "",
    bankAccount: old.bankAccount || "",
    bankHolder: old.bankHolder || "",
  }));

  return raw;
}

function saveSuppliers(list) {
  localStorage.setItem("suppliers", JSON.stringify(list));
}

// 기본 Supplier 등록
(function initSuppliers() {
  let s = getSuppliers();
  if (s.length === 0) {
    s = [
      {
        name: "Supplier A",
        vendorName: "",
        contactPerson: "",
        email: "",
        address: "",
        phone: "",
        bankName: "",
        bankAccount: "",
        bankHolder: "",
      },
      {
        name: "Supplier B",
        vendorName: "",
        contactPerson: "",
        email: "",
        address: "",
        phone: "",
        bankName: "",
        bankAccount: "",
        bankHolder: "",
      },
    ];
    saveSuppliers(s);
  }
})();

function getSupplierStats(name) {
  const purchase = JSON.parse(localStorage.getItem("purchase") || "[]");
  let totalQty = 0;
  let totalAmount = 0;

  purchase.forEach((p) => {
    if (p.supplier === name) {
      totalQty += Number(p.qty) || 0;
      totalAmount += (Number(p.qty) || 0) * (Number(p.price) || 0);
    }
  });

  return { totalQty, totalAmount };
}

function renderSupplierPage() {
  const tbody = document.getElementById("supplierTableBody");
  if (!tbody) return;

  const list = getSuppliers();
  tbody.innerHTML = "";

  list.forEach((s) => {
    const stat = getSupplierStats(s.name);

    tbody.innerHTML += `
      <tr>
        <td>${s.name}</td>
        <td>${s.vendorName}</td>
        <td>${s.contactPerson}</td>
        <td>${s.email}</td>
        <td>${s.address}</td>
        <td>${s.phone}</td>
        <td>
          ${s.bankName}<br>
          ${s.bankAccount}<br>
          ${s.bankHolder}
        </td>
        <td>${stat.totalQty}</td>
        <td>${stat.totalAmount.toLocaleString()}</td>
        <td>
   <button class="btn-mini" onclick="deleteSupplier('${s.name}')">
    ${i18n[state.lang].pages.btnDelete}
</button>

    `;
  });
}

function addSupplier() {
  const name = document.getElementById("newSupplier").value.trim();
  const vendorName = document.getElementById("supplierVendorName").value.trim();
  const contactPerson = document.getElementById("supplierContact").value.trim();
  const email = document.getElementById("supplierEmail").value.trim();
  const address = document.getElementById("supplierAddress").value.trim();
  const phone = document.getElementById("supplierPhone").value.trim();
  const bankName = document.getElementById("supplierBankName").value.trim();
  const bankAccount = document.getElementById("supplierBankAccount").value.trim();
  const bankHolder = document.getElementById("supplierBankHolder").value.trim();

  if (!name) return alert("공급업체명을 입력하세요.");

  const list = getSuppliers();
  if (list.some((s) => s.name === name)) {
    return alert("이미 존재하는 공급업체입니다.");
  }

  list.push({
    name,
    vendorName,
    contactPerson,
    email,
    address,
    phone,
    bankName,
    bankAccount,
    bankHolder,
  });

  saveSuppliers(list);
  writeLog("SUPPLIER ADD", name);

  [
    "newSupplier",
    "supplierVendorName",
    "supplierContact",
    "supplierEmail",
    "supplierAddress",
    "supplierPhone",
    "supplierBankName",
    "supplierBankAccount",
    "supplierBankHolder",
  ].forEach((id) => (document.getElementById(id).value = ""));

  renderSupplierPage();
}

function deleteSupplier(nameOverride) {
  const name =
    nameOverride || document.getElementById("newSupplier").value.trim();
  if (!name)
    return alert(
      "삭제할 공급업체명을 입력하거나 테이블의 삭제 버튼을 사용하세요."
    );

  let list = getSuppliers();
  if (!list.some((s) => s.name === name))
    return alert("해당 공급업체가 없습니다.");

  list = list.filter((s) => s.name !== name);
  saveSuppliers(list);
  writeLog("SUPPLIER DELETE", name);

  renderSupplierPage();
}

/*************************************************
 * STOCK MODULE
 *************************************************/
function getStock() {
  return JSON.parse(localStorage.getItem("stock") || "[]");
}
function saveStock(s) {
  localStorage.setItem("stock", JSON.stringify(s));
}

function updateStock(code, name, qty) {
  let s = getStock();
  qty = Number(qty);
  const now = new Date().toLocaleString();
  let item = s.find((i) => i.code === code);
  if (item) {
    item.qty += qty;
    item.lastUpdate = now;
  } else {
    s.push({
      code,
      name,
      qty,
      defect: 0,
      minQty: 0,
      unit: "SET",
      lastUpdate: now,
    });
  }
  saveStock(s);
}

function editStockQty(code) {
  let s = getStock();
  let i = s.find((x) => x.code === code);
  if (!i) return alert("재고 없음.");
  const newQtyStr = prompt("새 수량:", i.qty);
  if (newQtyStr === null) return;
  const n = Number(newQtyStr);
  if (isNaN(n) || n < 0) return alert("올바른 수량 아님.");
  i.qty = n;
  i.lastUpdate = new Date().toLocaleString();
  saveStock(s);
  writeLog("STOCK EDIT", `${code} → ${n}`);
  loadPage("stock");
}

function renderStockPage() {
  const tbody = document.getElementById("stockTableBody");
  if (!tbody) return;
  const stock = getStock();
  tbody.innerHTML = "";
  stock.forEach((i) => {
    tbody.innerHTML += `
      <tr>
        <td>${i.code}</td>
        <td>${i.name}</td>
        <td>${i.qty}</td>
        <td>${i.defect || 0}</td>
        <td>${i.minQty || 0}</td>
        <td>${i.unit || "SET"}</td>
        <td>${i.lastUpdate || ""}</td>
        <td><button class="btn-mini" onclick="editStockQty('${i.code}')">
    ${i18n[state.lang].pages.btnEdit}
</button></td>
    `;
  });
}

/* 불량 수량을 stock 항목에 누적 */
function addDefectToStock(code, defectQty) {
  defectQty = Number(defectQty);
  if (!defectQty || defectQty <= 0) return;

  let s = getStock();
  let item = s.find((i) => i.code === code);
  if (!item) return;
  const now = new Date().toLocaleString();

  item.defect = (item.defect || 0) + defectQty;
  item.lastUpdate = now;

  saveStock(s);
}
/*************************************************
 * PURCHASE MODULE
 *************************************************/
function getPurchase() {
  return JSON.parse(localStorage.getItem("purchase") || "[]");
}
function savePurchase(list) {
  localStorage.setItem("purchase", JSON.stringify(list));
}

function onPurchase() {
  const code = document.getElementById("pCode").value.trim();
  const name = document.getElementById("pName").value.trim();
  const qtyStr = document.getElementById("pQty").value.trim();
  const priceStr = document.getElementById("pPrice").value.trim();
  const currency = document.getElementById("pCurrency").value.trim();
  const supplier = document.getElementById("pSupplier").value.trim();

  const qty = Number(qtyStr);
  const price = Number(priceStr);

  if (!code || !name || !qty || !price) {
    return alert("모든 값을 입력하세요.");
  }

  updateStock(code, name, qty);
  writeLog("PURCHASE", `${supplier} / ${code} ${qty} EA @ ${price} ${currency}`);

  const list = getPurchase();
  list.push({
    date: new Date().toLocaleDateString(),
    supplier,
    code,
    name,
    qty,
    price,
    currency,
    updated: new Date().toLocaleString()
  });
  savePurchase(list);

  alert("입고 완료!");
  loadPage("purchase");
}

function renderPurchasePage() {
  const tbody = document.getElementById("purchaseTableBody");
  if (!tbody) return;
  const list = getPurchase();
  tbody.innerHTML = "";

  list.forEach((p, idx) => {
    tbody.innerHTML += `
      <tr>
        <td>${p.date}</td>
        <td>${p.supplier}</td>
        <td>${p.code}</td>
        <td>${p.name}</td>
        <td>${p.qty}</td>
        <td>${p.price}</td>
        <td>${p.currency}</td>
        <td>${p.updated}</td>
    <td><button class="btn-mini" onclick="editStockQty('${i.code}')">
    ${i18n[state.lang].pages.btnEdit}
</button></td>

    `;
  });
}

function editPurchase(index) {
  let list = getPurchase();
  let p = list[index];

  const newQtyStr = prompt("새 수량:", p.qty);
  const newPriceStr = prompt("새 단가:", p.price);
  if (newQtyStr === null || newPriceStr === null) return;

  const newQty = Number(newQtyStr);
  const newPrice = Number(newPriceStr);
  if (isNaN(newQty) || newQty <= 0 || isNaN(newPrice) || newPrice <= 0) {
    return alert("올바른 숫자를 입력하세요.");
  }

  const diff = newQty - p.qty;

  // 재고 처리
  let stock = getStock();
  let item = stock.find((i) => i.code === p.code);

  if (!item && diff < 0) return alert("재고 부족");

  if (!item) {
    updateStock(p.code, p.name, diff);
  } else {
    item.qty += diff;
    item.lastUpdate = new Date().toLocaleString();
    saveStock(stock);
  }

  p.qty = newQty;
  p.price = newPrice;
  p.updated = new Date().toLocaleString();
  savePurchase(list);

  writeLog("PURCHASE EDIT", `${p.code} qty->${newQty}, price->${newPrice}`);
  loadPage("purchase");
}

function downloadPurchaseCSV() {
  const list = getPurchase();
  const headers = [
    "Date","Supplier","Code","Name",
    "Qty","Price","Currency","Updated"
  ];
  const rows = list.map(p => [
    p.date,p.supplier,p.code,p.name,
    p.qty,p.price,p.currency,p.updated
  ]);

  downloadCSV("purchase.csv", headers, rows);
}
/*************************************************
 * OUTGOING MODULE
 *************************************************/
function getOutgoing() {
  return JSON.parse(localStorage.getItem("outgoing") || "[]");
}
function saveOutgoing(list) {
  localStorage.setItem("outgoing", JSON.stringify(list));
}

function onOutgoing() {
  const code = document.getElementById("oCode").value.trim();
  const name = document.getElementById("oName").value.trim();
  const qtyStr = document.getElementById("oQty").value.trim();
  const qty = Number(qtyStr);

  if (!code || !name || !qty) return alert("모두 입력하세요.");

  let stock = getStock();
  let item = stock.find(i => i.code === code);
  if (!item) return alert("해당 재고 없음.");
  if (item.qty < qty) return alert("재고 부족.");

  // 출고
  item.qty -= qty;
  item.lastUpdate = new Date().toLocaleString();
  saveStock(stock);

  const list = getOutgoing();
  list.push({
    date: new Date().toLocaleDateString(),
    code,
    name,
    qty,
    updated: new Date().toLocaleString()
  });

  saveOutgoing(list);
  writeLog("OUTGOING", `${code} ${qty} 출고`);

  alert("출고 완료!");
  loadPage("outgoing");
}

function renderOutgoingPage() {
  const tbody = document.getElementById("outgoingTableBody");
  if (!tbody) return;

  const list = getOutgoing();
  tbody.innerHTML = "";

  list.forEach(o => {
    tbody.innerHTML += `
      <tr>
        <td>${o.date}</td>
        <td>${o.code}</td>
        <td>${o.name}</td>
        <td>${o.qty}</td>
        <td>${o.updated}</td>
      </tr>
    `;
  });
}

function downloadOutgoingCSV() {
  const list = getOutgoing();
  const headers = ["Date","Code","Name","Qty","Updated"];
  const rows = list.map(o => [o.date,o.code,o.name,o.qty,o.updated]);

  downloadCSV("outgoing.csv", headers, rows);
}
/*************************************************
 * BOM MODULE
 *************************************************/
function getBOM() {
  return JSON.parse(localStorage.getItem("bom") || "[]");
}
function saveBOMData(bom) {
  localStorage.setItem("bom", JSON.stringify(bom));
}

function saveBOMItem() {
  const product = document.getElementById("bomProduct").value.trim();
  const matCode = document.getElementById("bomMatCode").value.trim();
  const matName = document.getElementById("bomMatName").value.trim();
  const qtyStr = document.getElementById("bomQty").value.trim();
  const qty = Number(qtyStr);

  if (!product || !matCode || !matName || !qty) {
    return alert("모두 입력.");
  }

  const bom = getBOM();
  bom.push({
    product,
    matCode,
    matName,
    qty,
    updated: new Date().toLocaleString(),
  });

  saveBOMData(bom);
  writeLog("BOM ADD", `${product} / ${matCode} × ${qty}`);

  alert("BOM 저장 완료.");
  loadPage("bom");
}

function getBomForProduct(product) {
  return getBOM().filter(b => b.product === product);
}

function renderBOMPage() {
  const tbody = document.getElementById("bomTableBody");
  if (!tbody) return;

  const bom = getBOM();
  tbody.innerHTML = "";

  bom.forEach(b => {
    tbody.innerHTML += `
      <tr>
        <td>${b.product}</td>
        <td>${b.matCode}</td>
        <td>${b.matName}</td>
        <td>${b.qty}</td>
        <td>${b.updated}</td>
      </tr>
    `;
  });
}
/*************************************************
 * PRODUCTION MODULE
 *************************************************/
function getProduction() {
  return JSON.parse(localStorage.getItem("production") || "[]");
}
function saveProduction(list) {
  localStorage.setItem("production", JSON.stringify(list));
}

function runProduction(product, qty) {
  qty = Number(qty);
  if (!product || !qty) return false;

  const bomList = getBomForProduct(product);
  if (bomList.length === 0) {
    alert("BOM 없음.");
    return false;
  }

  let stock = getStock();

  // 재고 확인
  for (const b of bomList) {
    const need = b.qty * qty;
    const mat = stock.find(s => s.code === b.matCode);
    if (!mat || mat.qty < need) {
      alert(`재고 부족: ${b.matCode} / 필요:${need}, 현재:${mat ? mat.qty : 0}`);
      return false;
    }
  }

  // 자재 차감
  bomList.forEach(b => {
    const need = b.qty * qty;
    const mat = stock.find(s => s.code === b.matCode);
    mat.qty -= need;
    mat.lastUpdate = new Date().toLocaleString();
  });

  // 완제품 증가
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
  return true;
}

function onProduction() {
  const product = document.getElementById("prodProduct").value.trim();
  const qtyStr = document.getElementById("prodQty").value.trim();
  const qty = Number(qtyStr);

  if (!product || !qty) return alert("모두 입력.");

  const ok = runProduction(product, qty);
  if (!ok) return;

  const list = getProduction();
  list.push({
    date: new Date().toLocaleDateString(),
    product,
    qty,
    updated: new Date().toLocaleString()
  });

  saveProduction(list);
  writeLog("PRODUCTION", `${product} ${qty} 생산`);

  alert("생산 등록 완료.");
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
       <td><button class="btn-mini" onclick="editStockQty('${i.code}')">
    ${i18n[state.lang].pages.btnEdit}
</button></td>

    `;
  });
}
function editProduction(index) {
  let list = getProduction();
  let p = list[index];

  const newQtyStr = prompt("새 생산 수량:", p.qty);
  if (newQtyStr === null) return;

  const newQty = Number(newQtyStr);
  if (isNaN(newQty) || newQty <= 0) {
    return alert("올바른 수량이 아닙니다.");
  }

  const diff = newQty - p.qty;
  if (diff === 0) return;

  let stock = getStock();
  const bomList = getBomForProduct(p.product);
  if (bomList.length === 0) return alert("BOM이 없습니다.");

  if (diff > 0) {
    // 추가 생산 → 자재 차감
    for (const b of bomList) {
      const need = b.qty * diff;
      const mat = stock.find(s => s.code === b.matCode);
      if (!mat || mat.qty < need) {
        return alert(`재고 부족: ${b.matCode} 필요:${need}, 현재:${mat ? mat.qty : 0}`);
      }
    }

    bomList.forEach(b => {
      const need = b.qty * diff;
      const mat = stock.find(s => s.code === b.matCode);
      mat.qty -= need;
      mat.lastUpdate = new Date().toLocaleString();
    });

    let fg = stock.find(s => s.code === p.product);
    fg.qty += diff;
    fg.lastUpdate = new Date().toLocaleString();

  } else {
    // 생산 감소 → 자재 환불
    const backDiff = -diff;

    bomList.forEach(b => {
      const back = b.qty * backDiff;
      let mat = stock.find(s => s.code === b.matCode);

      if (!mat) {
        stock.push({
          code: b.matCode,
          name: b.matName,
          qty: back,
          minQty: 0,
          unit: "SET",
          lastUpdate: new Date().toLocaleString(),
        });
      } else {
        mat.qty += back;
        mat.lastUpdate = new Date().toLocaleString();
      }
    });

    let fg = stock.find(s => s.code === p.product);
    fg.qty -= backDiff;
    if (fg.qty < 0) fg.qty = 0;
    fg.lastUpdate = new Date().toLocaleString();
  }

  saveStock(stock);

  p.qty = newQty;
  p.updated = new Date().toLocaleString();
  saveProduction(list);

  writeLog("PRODUCTION EDIT", `${p.product} → ${newQty}`);

  loadPage("production");
}

/*************************************************
 * OUTSOURCING MODULE
 *************************************************/
function getVendors() {
  return JSON.parse(localStorage.getItem("vendors") || "[]");
}
function saveVendors(list) {
  localStorage.setItem("vendors", JSON.stringify(list));
}

// 기본 vendor 생성
(function initVendors() {
  let v = getVendors();
  if (v.length === 0) {
    v = ["Vendor A", "Vendor B", "Vendor C"];
    saveVendors(v);
  }
})();

function getOutsourcing() {
  return JSON.parse(localStorage.getItem("outsourcing") || "[]");
}
function saveOutsourcing(list) {
  localStorage.setItem("outsourcing", JSON.stringify(list));
}

function onOutsourcing() {
  const outCode = document.getElementById("outOutCode").value.trim();
  const outName = document.getElementById("outOutName").value.trim();
  const outQtyStr = document.getElementById("outOutQty").value.trim();

  const inCode = document.getElementById("outInCode").value.trim();
  const inName = document.getElementById("outInName").value.trim();
  const inQtyStr = document.getElementById("outInQty").value.trim();

  const defectStr = document.getElementById("outDefectQty").value.trim();
  const vendor = document.getElementById("outVendor").value.trim();
  const note = document.getElementById("outNote").value.trim();

  const outQty = Number(outQtyStr);
  const inQty = Number(inQtyStr);
  const defect = Number(defectStr) || 0;

  if (!outCode || !outName || !outQty)
    return alert("OUT 정보를 모두 입력하세요.");
  if (!inCode || !inName)
    return alert("IN 정보를 모두 입력하세요.");

  let stock = getStock();
  let outItem = stock.find(i => i.code === outCode);

  if (!outItem || outItem.qty < outQty)
    return alert("출고 재고 부족.");

  // OUT 재고 차감
  outItem.qty -= outQty;
  outItem.lastUpdate = new Date().toLocaleString();

  // IN 재고 증가
  let inItem = stock.find(i => i.code === inCode);
  if (!inItem) {
    stock.push({
      code: inCode,
      name: inName,
      qty: inQty,
      defect: 0,
      minQty: 0,
      unit: "SET",
      lastUpdate: new Date().toLocaleString()
    });
  } else {
    inItem.qty += inQty;
    inItem.lastUpdate = new Date().toLocaleString();
  }

  saveStock(stock);

  // 불량 누적
  if (defect > 0) addDefectToStock(inCode, defect);

  const now = new Date().toLocaleString();
  const list = getOutsourcing();

  list.push({
    date: new Date().toLocaleDateString(),
    outCode,
    outName,
    outQty,
    inCode,
    inName,
    inQty,
    defect,
    vendor,
    note,
    updated: now
  });

  saveOutsourcing(list);
  writeLog(
    "OUTSOURCING",
    `OUT:${outCode} → IN:${inCode}, 불량:${defect}, vendor:${vendor}`
  );

  alert("외주 등록 완료.");
  loadPage("outsourcing");
}

function renderOutsourcingPage() {
  const tbody = document.getElementById("outsourcingTableBody");
  if (!tbody) return;

  const list = getOutsourcing();
  tbody.innerHTML = "";

  list.forEach(r => {
    tbody.innerHTML += `
      <tr>
        <td>${r.date}</td>
        <td>${r.outCode}</td>
        <td>${r.outName}</td>
        <td>${r.outQty}</td>
        <td>${r.inCode}</td>
        <td>${r.inName}</td>
        <td>${r.inQty}</td>
        <td>${r.defect}</td>
        <td>${r.vendor}</td>
        <td>${r.note}</td>
        <td>${r.updated}</td>
      </tr>
    `;
  });
}
/*************************************************
 * FINISHED GOODS (VC* 코드만)
 *************************************************/
function renderFGPage() {
  const tbody = document.getElementById("fgTableBody");
  if (!tbody) return;

  const stock = getStock().filter(i => i.code.startsWith("VC"));
  tbody.innerHTML = "";

  stock.forEach(i => {
    tbody.innerHTML += `
      <tr>
        <td>${i.code}</td>
        <td>${i.name}</td>
        <td>${i.qty}</td>
        <td><button class="btn-mini" onclick="editStockQty('${i.code}')">수정</button></td>
      </tr>
    `;
  });
}
/*************************************************
 * DASHBOARD
 *************************************************/
function getDashboardStats() {
  const stock = getStock();
  const prod = getProduction();
  const out = getOutsourcing();

  const totalRaw = stock
    .filter(i => !i.code.startsWith("VC"))
    .reduce((a, b) => a + Number(b.qty || 0), 0);

  const totalFinished = stock
    .filter(i => i.code.startsWith("VC"))
    .reduce((a, b) => a + Number(b.qty || 0), 0);

  const today = new Date().toLocaleDateString();
  const todayProd = prod
    .filter(p => p.date === today)
    .reduce((a, b) => a + Number(b.qty || 0), 0);

  const totalOutQty = out.reduce((a, b) => a + Number(b.outQty || 0), 0);
  const totalDefect = out.reduce((a, b) => a + Number(b.defect || 0), 0);

  const defectRate =
    totalOutQty === 0 ? 0 : Math.round((totalDefect / totalOutQty) * 100);

  return { totalRaw, totalFinished, todayProd, defectRate };
}

function getLastNDaysLabels(n) {
  const labels = [];
  const base = new Date();

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString());
  }
  return labels;
}

function aggregateDaily(list, days) {
  const labels = getLastNDaysLabels(days);
  const map = {};
  labels.forEach(l => (map[l] = 0));

  list.forEach(item => {
    if (map[item.date] != null) {
      map[item.date] += Number(item.qty) || 0;
    }
  });

  return labels.map(l => map[l]);
}

let dashboardCharts = [];

function destroyDashboardCharts() {
  dashboardCharts.forEach(c => c.destroy());
  dashboardCharts = [];
}

function renderDashboardPage() {
  const stat = getDashboardStats();

  const sRaw = document.getElementById("dashRaw");
  const sFin = document.getElementById("dashFinished");
  const sToday = document.getElementById("dashTodayProd");
  const sDef = document.getElementById("dashDefect");

  if (sRaw) sRaw.textContent = stat.totalRaw;
  if (sFin) sFin.textContent = stat.totalFinished;
  if (sToday) sToday.textContent = stat.todayProd;
  if (sDef) sDef.textContent = stat.defectRate + "%";

  destroyDashboardCharts();

  const purchases = getPurchase();
  const outgoings = getOutgoing();
  const productions = getProduction();

  const labels = getLastNDaysLabels(7);
  const pData = aggregateDaily(purchases, 7);
  const oData = aggregateDaily(outgoings, 7);
  const prData = aggregateDaily(productions, 7);

  const ctxP = document.getElementById("chartPurchase");
  const ctxO = document.getElementById("chartOutgoing");
  const ctxPr = document.getElementById("chartProduction");

  if (ctxP) {
    dashboardCharts.push(
      new Chart(ctxP, {
        type: "bar",
        data: { labels, datasets: [{ label: "Purchase Qty", data: pData }] }
      })
    );
  }

  if (ctxO) {
    dashboardCharts.push(
      new Chart(ctxO, {
        type: "bar",
        data: { labels, datasets: [{ label: "Outgoing Qty", data: oData }] }
      })
    );
  }

  if (ctxPr) {
    dashboardCharts.push(
      new Chart(ctxPr, {
        type: "bar",
        data: { labels, datasets: [{ label: "Production Qty", data: prData }] }
      })
    );
  }
}
/*************************************************
 * PAGE TEMPLATES (정상 구조)
 *************************************************/
const PageTemplates = {

  /***********************
   * DASHBOARD
   ***********************/
  dashboard(lang) {
    const t = i18n[lang].pages;
    return `
      <h2>${t.dashboardTitle}</h2>
      <p>${t.dashboardDesc}</p>

      <div class="cards">
        <div class="card"><div class="label">Raw Material</div><div id="dashRaw" class="value">0</div></div>
        <div class="card"><div class="label">Finished Goods</div><div id="dashFinished" class="value">0</div></div>
        <div class="card"><div class="label">Today Production</div><div id="dashTodayProd" class="value">0</div></div>
        <div class="card"><div class="label">Defect Rate</div><div id="dashDefect" class="value">0%</div></div>
      </div>

      <div class="chart-grid">
        <div><h3>Purchase (7 days)</h3><canvas id="chartPurchase"></canvas></div>
        <div><h3>Outgoing (7 days)</h3><canvas id="chartOutgoing"></canvas></div>
        <div><h3>Production (7 days)</h3><canvas id="chartProduction"></canvas></div>
      </div>
    `;
  },


  /***********************
   * STOCK
   ***********************/
  stock(lang) {
    const t = i18n[lang].pages;
    return `
      <h2>${t.stockTitle}</h2>
      <p>${t.stockDesc}</p>

      <table class="erp-table">
        <thead>
          <tr>
            <th>Code</th><th>Name</th><th>Qty</th>
            <th>Defect</th><th>Min</th><th>Unit</th>
            <th>Updated</th><th>Edit</th>
          </tr>
        </thead>
        <tbody id="stockTableBody"></tbody>
      </table>
    `;
  },


  /***********************
   * PURCHASE
   ***********************/
  purchase(lang) {
    const t = i18n[lang].pages;
    const suppliers = getSuppliers();
    return `
      <h2>${t.purchaseTitle}</h2>
      <p>${t.purchaseDesc}</p>

      <div class="form-row">
        <input id="pCode" placeholder="${t.purchaseFormCodePlaceholder}">
        <input id="pName" placeholder="${t.purchaseFormNamePlaceholder}">
        <input id="pQty" type="number" placeholder="${t.purchaseFormQtyPlaceholder}">
        <input id="pPrice" type="number" placeholder="Unit Price">

        <select id="pCurrency">
          <option value="USD">USD</option>
          <option value="IDR">IDR</option>
          <option value="KRW">KRW</option>
        </select>

        <select id="pSupplier">
          ${suppliers.map(s => `<option value="${s.name}">${s.name}</option>`).join("")}
        </select>

        <button onclick="onPurchase()" class="btn-primary">${t.btnRegister}</button>
        <button onclick="downloadPurchaseCSV()" class="btn-secondary">${t.btnDownloadExcel}</button>
      </div>

      <table class="erp-table">
        <thead>
          <tr>
            <th>Date</th><th>Supplier</th><th>Code</th><th>Name</th>
            <th>Qty</th><th>Price</th><th>Cur</th><th>Updated</th><th>Edit</th>
          </tr>
        </thead>
        <tbody id="purchaseTableBody"></tbody>
      </table>
    `;
  },


  /***********************
   * OUTGOING
   ***********************/
  outgoing(lang) {
    const t = i18n[lang].pages;
    return `
      <h2>${t.outgoingTitle}</h2>
      <p>${t.outgoingDesc}</p>

      <div class="form-row">
        <input id="oCode" placeholder="Code">
        <input id="oName" placeholder="Name">
        <input id="oQty" type="number" placeholder="Qty">

        <button onclick="onOutgoing()" class="btn-primary">${t.btnOutgoing}</button>
        <button onclick="downloadOutgoingCSV()" class="btn-secondary">${t.btnDownloadExcel}</button>
      </div>

      <table class="erp-table">
        <thead>
          <tr>
            <th>Date</th><th>Code</th><th>Name</th><th>Qty</th><th>Updated</th>
          </tr>
        </thead>
        <tbody id="outgoingTableBody"></tbody>
      </table>
    `;
  },


  /***********************
   * PRODUCTION
   ***********************/
  production(lang) {
    const t = i18n[lang].pages;
    return `
      <h2>${t.productionTitle}</h2>
      <p>${t.productionDesc}</p>

      <div class="form-row">
        <input id="prodProduct" placeholder="Product Code">
        <input id="prodQty" type="number" placeholder="Qty">

        <button onclick="onProduction()" class="btn-primary">${t.btnProduction}</button>
        <button onclick="downloadProductionCSV()" class="btn-secondary">${t.btnDownloadExcel}</button>
      </div>

      <table class="erp-table">
        <thead>
          <tr><th>Date</th><th>Product</th><th>Qty</th><th>Updated</th><th>Edit</th></tr>
        </thead>
        <tbody id="prodTableBody"></tbody>
      </table>
    `;
  },


  /***********************
   * BOM
   ***********************/
  bom(lang) {
    const t = i18n[lang].pages;
    return `
      <h2>${t.bomTitle}</h2>
      <p>${t.bomDesc}</p>

      <div class="form-row">
        <input id="bomProduct" placeholder="Product">
        <input id="bomMatCode" placeholder="Material Code">
        <input id="bomMatName" placeholder="Material Name">
        <input id="bomQty" type="number" placeholder="Qty per product">
        <button onclick="saveBOMItem()" class="btn-primary">Save BOM</button>
      </div>

      <table class="erp-table">
        <thead>
          <tr><th>Product</th><th>MatCode</th><th>MatName</th><th>Qty</th><th>Updated</th></tr>
        </thead>
        <tbody id="bomTableBody"></tbody>
      </table>
    `;
  },


  /***********************
   * OUTSOURCING
   ***********************/
  outsourcing(lang) {
    const t = i18n[lang].pages;
    const vendors = getVendors();
    return `
      <h2>${t.outsourcingTitle}</h2>
      <p>${t.outsourcingDesc}</p>

      <div class="form-row">
        <h3>OUT</h3>
        <input id="outOutCode" placeholder="Out Code">
        <input id="outOutName" placeholder="Out Name">
        <input id="outOutQty" type="number" placeholder="Qty Out">

        <h3>IN</h3>
        <input id="outInCode" placeholder="In Code">
        <input id="outInName" placeholder="In Name">
        <input id="outInQty" type="number" placeholder="Qty In">

        <h3>Defect</h3>
        <input id="outDefectQty" type="number" placeholder="Defect">

        <h3>Vendor</h3>
        <select id="outVendor">
          ${vendors.map(v => `<option value="${v}">${v}</option>`).join("")}
        </select>

        <h3>Note</h3>
        <input id="outNote" placeholder="Note">

        <button onclick="onOutsourcing()" class="btn-primary">${t.outsourcingRegisterBtn}</button>
      </div>

      <table class="erp-table">
        <thead>
          <tr>
            <th>${t.outsourcingTableDate}</th>
            <th>OutCode</th><th>OutName</th><th>QtyOut</th>
            <th>InCode</th><th>InName</th><th>QtyIn</th>
            <th>${t.outsourcingDefectTitle}</th>
            <th>${t.outsourcingVendorTitle}</th>
            <th>${t.outsourcingNoteTitle}</th>
            <th>${t.outsourcingTableUpdated}</th>
          </tr>
        </thead>
        <tbody id="outsourcingTableBody"></tbody>
      </table>
    `;
  },


  /***********************
   * FINISHED GOODS
   ***********************/
  finished(lang) {
    const t = i18n[lang].pages;
    return `
      <h2>${t.finishedTitle}</h2>
      <p>${t.finishedDesc}</p>

      <table class="erp-table">
        <thead>
          <tr><th>Code</th><th>Name</th><th>Qty</th><th>Edit</th></tr>
        </thead>
        <tbody id="fgTableBody"></tbody>
      </table>
    `;
  },


  /***********************
   * SUPPLIERS
   ***********************/
  suppliers(lang) {
    const t = i18n[lang].pages;
    return `
      <h2>${t.suppliersTitle}</h2>
      <p>${t.suppliersDesc}</p>

      <div class="form-row">
        <input id="newSupplier" placeholder="Supplier Name">
        <input id="supplierVendorName" placeholder="Vendor Name">
        <input id="supplierContact" placeholder="Contact">
        <input id="supplierEmail" placeholder="Email">
        <input id="supplierAddress" placeholder="Address">
        <input id="supplierPhone" placeholder="Phone">
        <input id="supplierBankName" placeholder="Bank Name">
        <input id="supplierBankAccount" placeholder="Account Number">
        <input id="supplierBankHolder" placeholder="Account Holder">

        <button onclick="addSupplier()" class="btn-primary">${t.btnAdd}</button>
      </div>

      <table class="erp-table">
        <thead>
          <tr>
            <th>Supplier</th><th>Vendor</th><th>Contact</th><th>Email</th>
            <th>Address</th><th>Phone</th><th>Bank Info</th>
            <th>Total Qty</th><th>Total Amount</th><th>Edit</th>
          </tr>
        </thead>
        <tbody id="supplierTableBody"></tbody>
      </table>
    `;
  },


  /***********************
   * EMPLOYEES
   ***********************/
  employees(lang) {
    return `<h2>Employees</h2><p>Coming soon.</p>`;
  },


  /***********************
   * ATTENDANCE
   ***********************/
  attendance(lang) {
    return `<h2>Attendance</h2><p>Coming soon.</p>`;
  },


  /***********************
   * PAYROLL
   ***********************/
  payroll(lang) {
    return `<h2>Payroll</h2><p>Coming soon.</p>`;
  },


  /***********************
   * LOGS
   ***********************/
  logs(lang) {
    return `
      <h2>Logs</h2>
      <table class="erp-table">
        <thead>
          <tr><th>Time</th><th>Action</th><th>Detail</th></tr>
        </thead>
        <tbody id="logsTableBody"></tbody>
      </table>
    `;
  },


  /***********************
   * SETTINGS
   ***********************/
 /***********************
 * SETTINGS (완성본)
 ***********************/
settings(lang) {
  const t = i18n[lang].pages;
  return `
    <h2>${t.settingsTitle}</h2>
    <p>${t.settingsDesc}</p>

    <!-- =======================
         Backup & Restore
    ======================== -->
    <div class="settings-section">
      <h3>Backup & Restore</h3>
      <p>현재 ERP 데이터를 JSON 파일로 저장하거나 불러올 수 있습니다.</p>

      <div class="settings-btn-row">
        <button onclick="backupToFile()" class="btn-primary">Backup Download</button>

        <label for="restoreFile" class="btn-secondary" style="cursor:pointer;">
          Load Backup File
        </label>
        <input id="restoreFile" type="file" accept="application/json"
               style="display:none;" onchange="restoreFromFile(event)">
      </div>
    </div>

    <div class="hr-divider"></div>

    <!-- =======================
         Excel Upload
    ======================== -->
    <div class="settings-section">
      <h3>Excel Upload</h3>
      <p>
        엑셀(.xlsx, .xlsm) 파일을 업로드하여
        <b>Stock / Purchase / Production / BOM</b> 데이터를 자동 변환할 수 있습니다.
      </p>

      <label for="excelUpload" class="btn-secondary" style="padding:10px; cursor:pointer;">
        Excel 파일 선택
      </label>

 <input type="file" id="excelFile" onchange="handleExcelUpload(event)">

             style="display:none;" onchange="handleExcelUpload(event)">
    </div>
  `;
}



/*************************************************
 * EXCEL IMPORT (XLSX)
 *************************************************/
function handleExcelUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetNames = workbook.SheetNames;
    alert("불러온 시트: " + sheetNames.join(", "));

    if (workbook.Sheets["STOCK"]) {
      const json = XLSX.utils.sheet_to_json(workbook.Sheets["STOCK"]);
      alert("STOCK 변환 완료: " + json.length + "개 항목");
    }
  };

  reader.readAsArrayBuffer(file);
}

/*************************************************
 * RENDERING ENGINE
 *************************************************/
function renderContent() {
  const lang = state.lang;
  const page = state.page || "dashboard";

  const contentEl = document.getElementById("content");
  const tmpl = PageTemplates[page] || PageTemplates.dashboard;

  contentEl.innerHTML = tmpl(lang);

  if (page === "stock") renderStockPage();
  else if (page === "purchase") renderPurchasePage();
  else if (page === "outgoing") renderOutgoingPage();
  else if (page === "production") renderProductionPage();
  else if (page === "bom") renderBOMPage();
  else if (page === "outsourcing") renderOutsourcingPage();
  else if (page === "finished") renderFGPage();
  else if (page === "suppliers") renderSupplierPage();
  else if (page === "logs") renderLogsPage();
  else if (page === "dashboard") renderDashboardPage();
}

function renderSidebar() {
  const items = document.querySelectorAll(".sidebar li");
  items.forEach((li) => {
    const pageId = li.dataset.page;
    li.classList.toggle("active", state.page === pageId);
  });
}

function renderHeader() {
  const logoEl = document.querySelector(".logo");
  if (logoEl) logoEl.textContent = i18n[state.lang].appTitle || "HTORI ERP";
}

function rerenderAll() {
  renderHeader();
  renderSidebar();
  renderContent();
}
/*************************************************
 * NAVIGATION / LANGUAGE
 *************************************************/
function setLanguage(lang) {
  if (!LANGS.includes(lang)) return;
  state.lang = lang;
  localStorage.setItem("htori_lang", lang);
  rerenderAll();
}

function loadPage(pageId) {
  state.page = pageId;
  localStorage.setItem("htori_page", pageId);
  rerenderAll();

  // 모바일: 메뉴 자동 닫기
  closeSidebar();
}

/*************************************************
 * MOBILE SIDEBAR TOGGLE & CLOSE OUTSIDE
 *************************************************/
function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("active");
}
function closeSidebar() {
  document.querySelector(".sidebar").classList.remove("active");
}
window.toggleSidebar = toggleSidebar;

/* 화면 밖 클릭 시 사이드바 닫기 */
document.addEventListener("click", (e) => {
  const sidebar = document.querySelector(".sidebar");

  if (!sidebar.contains(e.target) &&
      !e.target.classList.contains("mobile-menu-btn")) {
    sidebar.classList.remove("active");
  }
});
/*************************************************
 * INITIALIZE
 *************************************************/
document.addEventListener("DOMContentLoaded", () => {
  rerenderAll();
});
/*************************************************
 * BACKUP & RESTORE (LOCAL STORAGE)
 *************************************************/

// 전체 localStorage 저장 → JSON 파일로 백업
function backupToFile() {
  const data = JSON.stringify(localStorage, null, 2);
  const blob = new Blob([data], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "HTORI_backup.json";
  link.click();

  URL.revokeObjectURL(link.href);
}

// JSON 파일 → localStorage 로 복원
function restoreFromFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const json = JSON.parse(e.target.result);

      // 기존 localStorage 삭제 후 전체 복원
      localStorage.clear();
      for (let key in json) {
        localStorage.setItem(key, json[key]);
      }

      alert("복원 완료! 페이지가 새로고침됩니다.");
      location.reload();
    } catch (err) {
      console.error(err);
      alert("JSON 파일이 잘못되었습니다.");
    }
  };

  reader.readAsText(file);
}

/*************************************************
 * EXCEL UPLOAD 핸들러 (Stub)
 * - 지금은 '파일 선택됨' 알림만 띄우고
 *   나중에 실제 importExcel 로 연결할 수 있음
 *************************************************/


window.handleExcelUpload = handleExcelUpload;

// ============================
// 전역(Global) 바인딩
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
window.editProduction = editProduction;   // ★ 이게 반드시 있어야 함

window.downloadPurchaseCSV = downloadPurchaseCSV;
window.downloadOutgoingCSV = downloadOutgoingCSV;
window.downloadProductionCSV = downloadProductionCSV;

window.addSupplier = addSupplier;
window.deleteSupplier = deleteSupplier;

window.importExcel = importExcel;
window.handleExcelUpload = handleExcelUpload;

window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;

window.renderStockTable = renderStockTable;

// 햄버거 버튼
window.toggleSidebar = toggleSidebar;

/*************************************************
 * SIDEBAR 클릭 이벤트 바인딩
 *************************************************/
document.addEventListener("DOMContentLoaded", () => {
  // 사이드바 메뉴 클릭하면 loadPage 호출
  const menuItems = document.querySelectorAll(".sidebar li");
  menuItems.forEach((li) => {
    li.addEventListener("click", () => {
      const page = li.getAttribute("data-page");
      if (page) {
        loadPage(page);
      }
    });
  });
});

/*************************************************
 * 화면 밖 클릭 시 모바일 사이드바 닫기
 *************************************************/
document.addEventListener("click", (e) => {
  const sidebar = document.querySelector(".sidebar");
  const menuBtn = document.querySelector(".mobile-menu-btn");

  if (!sidebar) return;

  // 사이드바 자체를 클릭한 경우는 무시
  if (sidebar.contains(e.target)) return;

  // 햄버거 버튼을 클릭한 경우도 무시
  if (menuBtn && menuBtn.contains(e.target)) return;

  // 그 외 바깥 영역 클릭 시 닫기
  sidebar.classList.remove("active");
});
function renderStockTable() {
  const tbody = document.getElementById("stockTableBody");
  if (!tbody) return;

  const stock = getStock();
  tbody.innerHTML = "";

  stock.forEach((i) => {
    tbody.innerHTML += `
      <tr>
        <td>${i.code}</td>
        <td>${i.name}</td>
        <td>${i.qty}</td>
        <td>${i.defect || 0}</td>
        <td>${i.minQty || 0}</td>
        <td>${i.unit || "SET"}</td>
        <td>${i.lastUpdate || ""}</td>
        <td><button class="btn-mini" onclick="editStockQty('${i.code}')">수정</button></td>
      </tr>
    `;
  });
}
function downloadProductionCSV() {
  const list = getProduction();

  const headers = ["Date", "Product", "Qty", "Updated"];
  const rows = list.map((p) => [
    p.date,
    p.product,
    p.qty,
    p.updated,
  ]);

  downloadCSV("production.csv", headers, rows);
}
