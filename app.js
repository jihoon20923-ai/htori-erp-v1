/***************************
 * FIREBASE INIT
 ***************************/
var firebaseConfig = {
  apiKey: "AIzaSyDwiTlPtoXraEtA7TzTctdH6DJS6gdSEGQ",
  authDomain: "htori-erp-3c22b.firebaseapp.com",
  databaseURL: "https://htori-erp-3c22b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "htori-erp-3c22b",
  storageBucket: "htori-erp-3c22b.firebasestorage.app",
  messagingSenderId: "975336397666",
  appId: "1:975336397666:web:ae45a471e51bf71e9dea3b"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/***************************
 * GLOBAL STATE
 ***************************/
let currentUser = null;
let currentLang = localStorage.getItem("htori_lang") || "EN";
let currentPage = "dashboard";
let employeesCache = [];

/***************************
 * I18N
 ***************************/
const T = {
  EN: {
    appTitle: "HTORI Realtime ERP",
    loginTitle: "HTORI ERP LOGIN",
    loginBtn: "LOGIN",
    logoutBtn: "Logout",
    userLabel: "User",
    menu: {
      dashboard: "Dashboard",
      employee: "Employees",
      worklog: "Worklog",
      production: "Production",
      stock: "Stock",
      order: "Orders",
      outsourcing: "Outsourcing",
      mrp: "MRP / Purchase",
      reports: "Reports",
      settings: "Settings"
    },
    // 공통 라벨
    memo: "Memo",
    save: "Save",
    cancel: "Cancel",
    add: "Add",
    actions: "Actions",
    // 페이지별
    dashboardTitle: "Dashboard (v1 skeleton)",
    employeeTitle: "Employee Management",
    worklogTitle: "Worklog (Time / Piece)",
    productionTitle: "Production",
    stockTitle: "Stock & Receiving",
    orderTitle: "Orders",
    outsourcingTitle: "Outsourcing",
    mrpTitle: "MRP / Purchase Planning",
    reportsTitle: "Reports & Profit",
    settingsTitle: "Settings"
  },
  KR: {
    appTitle: "HTORI 실시간 ERP",
    loginTitle: "HTORI ERP 로그인",
    loginBtn: "로그인",
    logoutBtn: "로그아웃",
    userLabel: "사용자",
    menu: {
      dashboard: "대시보드",
      employee: "직원 관리",
      worklog: "근무 / 생산 입력",
      production: "생산 현황",
      stock: "재고 / 입고",
      order: "주문",
      outsourcing: "외주 관리",
      mrp: "MRP / 발주",
      reports: "손익 리포트",
      settings: "설정"
    },
    memo: "메모",
    save: "저장",
    cancel: "취소",
    add: "추가",
    actions: "관리",
    dashboardTitle: "대시보드 (v1 기본)",
    employeeTitle: "직원 관리",
    worklogTitle: "근무 / 생산 입력",
    productionTitle: "생산 현황",
    stockTitle: "재고 / 입고",
    orderTitle: "주문 관리",
    outsourcingTitle: "외주 관리",
    mrpTitle: "MRP / 구매 계획",
    reportsTitle: "손익 / 리포트",
    settingsTitle: "설정"
  },
  ID: {
    appTitle: "HTORI ERP Realtime",
    loginTitle: "Login HTORI ERP",
    loginBtn: "MASUK",
    logoutBtn: "Keluar",
    userLabel: "User",
    menu: {
      dashboard: "Dasbor",
      employee: "Karyawan",
      worklog: "Kerja / Produksi",
      production: "Produksi",
      stock: "Stok / Receiving",
      order: "Pesanan",
      outsourcing: "Outsourcing",
      mrp: "MRP / Pembelian",
      reports: "Laporan",
      settings: "Pengaturan"
    },
    memo: "Catatan",
    save: "Simpan",
    cancel: "Batal",
    add: "Tambah",
    actions: "Aksi",
    dashboardTitle: "Dasbor (v1)",
    employeeTitle: "Manajemen Karyawan",
    worklogTitle: "Input Kerja / Produksi",
    productionTitle: "Produksi",
    stockTitle: "Stok & Receiving",
    orderTitle: "Pesanan",
    outsourcingTitle: "Outsourcing",
    mrpTitle: "MRP / Rencana Pembelian",
    reportsTitle: "Laporan & Profit",
    settingsTitle: "Pengaturan"
  }
};

function getText(key) {
  return T[currentLang][key] || key;
}

/***************************
 * LOGIN & USER INIT
 ***************************/
// 최초 1회 admin 보장
db.ref("users").once("value").then(snap => {
  if (!snap.exists()) {
    db.ref("users").push({
      id: "admin",
      pw: "1234",
      name: "Master",
      role: "master"
    });
  }
});

function login() {
  const id = document.getElementById("loginId").value.trim();
  const pw = document.getElementById("loginPw").value.trim();
  if (!id || !pw) return;

  db.ref("users").once("value").then(snap => {
    const val = snap.val() || {};
    const list = Object.values(val);
    const found = list.find(u => u.id === id && u.pw === pw);
    if (!found) {
      alert("LOGIN FAIL");
      return;
    }

    currentUser = found;
    localStorage.setItem("htori_user", JSON.stringify(found));

    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    applyLanguage();
    renderSidebar();
    setPage("dashboard");
    renderUserLabel();
    subscribeEmployeesCache();
  });
}

function tryAutoLogin() {
  const saved = localStorage.getItem("htori_user");
  if (!saved) return;
  try {
    const u = JSON.parse(saved);
    if (!u || !u.id) return;
    currentUser = u;
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    applyLanguage();
    renderSidebar();
    setPage("dashboard");
    renderUserLabel();
    subscribeEmployeesCache();
  } catch(e) {}
}

function logout() {
  localStorage.removeItem("htori_user");
  currentUser = null;
  document.getElementById("app").classList.add("hidden");
  document.getElementById("loginBox").classList.remove("hidden");
}

/***************************
 * LANGUAGE
 ***************************/
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("htori_lang", lang);
  applyLanguage();
  if (currentUser) {
    renderSidebar();
    setPage(currentPage);
    renderUserLabel();
  }
}

function applyLanguage() {
  const t = T[currentLang];
  document.getElementById("loginTitle").innerText = t.loginTitle;
  document.getElementById("loginBtnText").innerText = t.loginBtn;
  document.getElementById("appTitle").innerText = t.appTitle;
  const logoutBtnText = document.getElementById("logoutBtnText");
  if (logoutBtnText) logoutBtnText.innerText = t.logoutBtn;
}

/***************************
 * SIDEBAR & NAVIGATION
 ***************************/
function renderUserLabel() {
  const el = document.getElementById("currentUserLabel");
  if (!currentUser) {
    el.innerText = "";
    return;
  }
  const t = T[currentLang];
  el.innerText = `${t.userLabel}: ${currentUser.name} (${currentUser.role})`;
}

function renderSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.innerHTML = "";
  if (!currentUser) return;
  const t = T[currentLang].menu;

  // 권한별 메뉴
  let pages = [];
  if (currentUser.role === "master") {
    pages = [
      "dashboard","employee","worklog","production",
      "stock","order","outsourcing","mrp","reports","settings"
    ];
  } else if (currentUser.role === "production") {
    pages = ["dashboard","worklog","production","stock","reports"];
  } else if (currentUser.role === "sales") {
    pages = ["dashboard","order","reports"];
  } else {
    pages = ["dashboard"];
  }

  pages.forEach(p => {
    const btn = document.createElement("button");
    btn.className = "sidebar-btn" + (currentPage === p ? " active" : "");
    btn.innerText = t[p] || p;
    btn.onclick = () => {
      setPage(p);
    };
    sidebar.appendChild(btn);
  });
}

function setPage(page) {
  currentPage = page;
  const content = document.getElementById("content");
  const t = T[currentLang];

  // 사이드바 active 업데이트
  const sidebar = document.getElementById("sidebar");
  Array.from(sidebar.getElementsByClassName("sidebar-btn")).forEach(btn => {
    btn.classList.remove("active");
    if (btn.innerText === (t.menu[page] || page)) {
      btn.classList.add("active");
    }
  });

  if (page === "dashboard") renderDashboard(content);
  else if (page === "employee") renderEmployeePage(content);
  else if (page === "worklog") renderWorklogPage(content);
  else if (page === "production") renderProductionPage(content);
  else if (page === "stock") renderStockPage(content);
  else if (page === "order") renderOrderPage(content);
  else if (page === "outsourcing") renderOutsourcingPage(content);
  else if (page === "mrp") renderMRPPage(content);
  else if (page === "reports") renderReportsPage(content);
  else if (page === "settings") renderSettingsPage(content);
}

/***************************
 * DASHBOARD (SKELETON)
 ***************************/
function renderDashboard(root) {
  const t = T[currentLang];
  root.innerHTML = `
    <div class="page-title">${t.dashboardTitle}</div>
    <div class="card">
      <h3>Today / This Month (placeholder)</h3>
      <p>이 영역은 나중에 매출, 순이익, 공정 효율 등 지표를 연동.</p>
    </div>
  `;
}

/***************************
 * EMPLOYEE MODULE
 ***************************/
function subscribeEmployeesCache() {
  db.ref("employees").on("value", snap => {
    const val = snap.val() || {};
    employeesCache = Object.keys(val).map(k => ({ key: k, ...val[k] }));
    if (currentPage === "employee") {
      renderEmployeePage(document.getElementById("content"));
    }
  });
}

function renderEmployeePage(root) {
  const t = T[currentLang];
  root.innerHTML = `
    <div class="page-title">${t.employeeTitle}</div>

    <div class="card">
      <h3>Employee Input</h3>
      <div class="form-row">
        <div class="form-field">
          <label>ID</label>
          <input id="empIdInput" />
        </div>
        <div class="form-field">
          <label>Name</label>
          <input id="empNameInput" />
        </div>
        <div class="form-field">
          <label>Nationality</label>
          <select id="empNationInput">
            <option value="ID">ID</option>
            <option value="KR">KR</option>
            <option value="US">US</option>
          </select>
        </div>
        <div class="form-field">
          <label>Process</label>
          <select id="empProcessInput">
            <option value="">-</option>
            ${Array.from({length:14}).map((_,i)=>`<option value="${i+1}">${i+1}</option>`).join("")}
          </select>
        </div>
        <div class="form-field">
          <label>Job</label>
          <select id="empJobInput">
            <option value="operator">Operator</option>
            <option value="qc">QC</option>
            <option value="manager">Manager</option>
            <option value="office">Office</option>
          </select>
        </div>
        <div class="form-field">
          <label>Status</label>
          <select id="empStatusInput">
            <option value="active">Active</option>
            <option value="leave">Leave</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-field">
          <label>Contract Type (PKWTT / PKWT)</label>
          <select id="empContractTypeInput">
            <option value="PKWTT">PKWTT</option>
            <option value="PKWT">PKWT</option>
            <option value="Daily">Daily</option>
            <option value="Outsource">Outsource</option>
          </select>
        </div>
        <div class="form-field">
          <label>Join Date</label>
          <input id="empJoinDateInput" type="date" />
        </div>
        <div class="form-field">
          <label>Contract Start</label>
          <input id="empContractStartInput" type="date" />
        </div>
        <div class="form-field">
          <label>Contract End</label>
          <input id="empContractEndInput" type="date" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-field">
          <label>Base Salary (Monthly)</label>
          <input id="empBaseSalaryInput" type="number" min="0" />
        </div>
        <div class="form-field">
          <label>Hourly Wage</label>
          <input id="empHourlyWageInput" type="number" min="0" />
        </div>
        <div class="form-field">
          <label>Piece Rate (per unit)</label>
          <input id="empPieceRateInput" type="number" min="0" />
        </div>
        <div class="form-field">
          <label>Currency</label>
          <select id="empCurrencyInput">
            <option value="IDR">IDR</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-field">
          <label>Bank Name</label>
          <input id="empBankNameInput" />
        </div>
        <div class="form-field">
          <label>Bank Account</label>
          <input id="empBankAccountInput" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-field" style="flex:1 1 100%">
          <label>${T[currentLang].memo}</label>
          <textarea id="empMemoInput"></textarea>
        </div>
      </div>

      <button class="btn-primary" onclick="saveEmployee()">${T[currentLang].save}</button>
    </div>

    <div class="card">
      <h3>Employee List</h3>
      <div class="table-wrapper">
        <table class="erp-table">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Proc</th><th>Job</th><th>Type</th>
              <th>Status</th><th>Base</th><th>Hr</th><th>Pc</th><th>${T[currentLang].actions}</th>
            </tr>
          </thead>
          <tbody id="empTableBody"></tbody>
        </table>
      </div>
    </div>
  `;

  const tbody = document.getElementById("empTableBody");
  tbody.innerHTML = "";
  employeesCache.forEach(emp => {
    const tr = document.createElement("tr");
    let statusLabel = emp.status || "active";
    let statusClass = "status-active";
    if (emp.status === "leave") statusClass = "status-leave";
    if (emp.status === "terminated") statusClass = "status-terminated";

    tr.innerHTML = `
      <td>${emp.empId || ""}</td>
      <td>${emp.name || ""}</td>
      <td>${emp.process || ""}</td>
      <td>${emp.job || ""}</td>
      <td>${emp.contractType || ""}</td>
      <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
      <td>${emp.salaryBase || 0}</td>
      <td>${emp.salaryHourly || 0}</td>
      <td>${emp.salaryPiece || 0}</td>
      <td>
        <button class="btn-secondary btn-sm" onclick="loadEmployeeToForm('${emp.key}')">Edit</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function saveEmployee() {
  const emp = {
    empId: document.getElementById("empIdInput").value.trim(),
    name: document.getElementById("empNameInput").value.trim(),
    nation: document.getElementById("empNationInput").value,
    process: document.getElementById("empProcessInput").value,
    job: document.getElementById("empJobInput").value,
    status: document.getElementById("empStatusInput").value,
    contractType: document.getElementById("empContractTypeInput").value,
    joinDate: document.getElementById("empJoinDateInput").value,
    contractStart: document.getElementById("empContractStartInput").value,
    contractEnd: document.getElementById("empContractEndInput").value,
    salaryBase: Number(document.getElementById("empBaseSalaryInput").value || 0),
    salaryHourly: Number(document.getElementById("empHourlyWageInput").value || 0),
    salaryPiece: Number(document.getElementById("empPieceRateInput").value || 0),
    salaryCurrency: document.getElementById("empCurrencyInput").value,
    bankName: document.getElementById("empBankNameInput").value.trim(),
    bankAccount: document.getElementById("empBankAccountInput").value.trim(),
    memo: document.getElementById("empMemoInput").value.trim()
  };

  if (!emp.empId || !emp.name) {
    alert("ID / Name required");
    return;
  }

  // 이미 존재하면 업데이트, 아니면 push
  const existing = employeesCache.find(e => e.empId === emp.empId);
  if (existing) {
    db.ref("employees/" + existing.key).set(emp);
  } else {
    db.ref("employees").push(emp);
  }

  alert("Employee Saved");
}

function loadEmployeeToForm(key) {
  const emp = employeesCache.find(e => e.key === key);
  if (!emp) return;

  document.getElementById("empIdInput").value = emp.empId || "";
  document.getElementById("empNameInput").value = emp.name || "";
  document.getElementById("empNationInput").value = emp.nation || "ID";
  document.getElementById("empProcessInput").value = emp.process || "";
  document.getElementById("empJobInput").value = emp.job || "operator";
  document.getElementById("empStatusInput").value = emp.status || "active";
  document.getElementById("empContractTypeInput").value = emp.contractType || "PKWTT";
  document.getElementById("empJoinDateInput").value = emp.joinDate || "";
  document.getElementById("empContractStartInput").value = emp.contractStart || "";
  document.getElementById("empContractEndInput").value = emp.contractEnd || "";
  document.getElementById("empBaseSalaryInput").value = emp.salaryBase || "";
  document.getElementById("empHourlyWageInput").value = emp.salaryHourly || "";
  document.getElementById("empPieceRateInput").value = emp.salaryPiece || "";
  document.getElementById("empCurrencyInput").value = emp.salaryCurrency || "IDR";
  document.getElementById("empBankNameInput").value = emp.bankName || "";
  document.getElementById("empBankAccountInput").value = emp.bankAccount || "";
  document.getElementById("empMemoInput").value = emp.memo || "";
}

/***************************
 * WORKLOG (TIME / PIECE)
 ***************************/
function renderWorklogPage(root) {
  const t = T[currentLang];
  root.innerHTML = `
    <div class="page-title">${t.worklogTitle}</div>

    <div class="card">
      <h3>Worklog Input (Time / Piece)</h3>
      <div class="form-row">
        <div class="form-field">
          <label>Date</label>
          <input id="wlDate" type="date" />
        </div>
        <div class="form-field">
          <label>Employee</label>
          <select id="wlEmp">
            <option value="">-</option>
            ${employeesCache.map(e=>`<option value="${e.empId}">${e.empId} - ${e.name}</option>`).join("")}
          </select>
        </div>
        <div class="form-field">
          <label>Process</label>
          <select id="wlProcess">
            <option value="">-</option>
            ${Array.from({length:14}).map((_,i)=>`<option value="${i+1}">${i+1}</option>`).join("")}
          </select>
        </div>
        <div class="form-field">
          <label>Type</label>
          <select id="wlType">
            <option value="hour">Hour</option>
            <option value="piece">Piece</option>
            <option value="both">Both</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-field">
          <label>Work Hours</label>
          <input id="wlHours" type="number" min="0" />
        </div>
        <div class="form-field">
          <label>Hourly Rate</label>
          <input id="wlHourlyRate" type="number" min="0" />
        </div>
        <div class="form-field">
          <label>Qty</label>
          <input id="wlQty" type="number" min="0" />
        </div>
        <div class="form-field">
          <label>Piece Rate</label>
          <input id="wlPieceRate" type="number" min="0" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-field" style="flex:1 1 100%">
          <label>${t.memo}</label>
          <textarea id="wlMemo"></textarea>
        </div>
      </div>

      <button class="btn-primary" onclick="saveWorklog()">${t.save}</button>
    </div>

    <div class="card">
      <h3>Recent Worklogs</h3>
      <div class="table-wrapper">
        <table class="erp-table">
          <thead>
            <tr>
              <th>Date</th><th>Emp</th><th>Proc</th><th>Type</th>
              <th>Hours</th><th>HrRate</th><th>Qty</th><th>PcRate</th><th>Memo</th>
            </tr>
          </thead>
          <tbody id="wlTableBody"></tbody>
        </table>
      </div>
    </div>
  `;

  db.ref("worklogs").limitToLast(100).once("value").then(snap => {
    const val = snap.val() || {};
    const list = Object.values(val);
    const tbody = document.getElementById("wlTableBody");
    tbody.innerHTML = "";
    list.forEach(w => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${w.date || ""}</td>
        <td>${w.empId || ""}</td>
        <td>${w.process || ""}</td>
        <td>${w.type || ""}</td>
        <td>${w.hours || 0}</td>
        <td>${w.hourlyRate || 0}</td>
        <td>${w.qty || 0}</td>
        <td>${w.pieceRate || 0}</td>
        <td>${w.memo || ""}</td>
      `;
      tbody.appendChild(tr);
    });
  });
}

function saveWorklog() {
  const w = {
    date: document.getElementById("wlDate").value,
    empId: document.getElementById("wlEmp").value,
    process: document.getElementById("wlProcess").value,
    type: document.getElementById("wlType").value,
    hours: Number(document.getElementById("wlHours").value || 0),
    hourlyRate: Number(document.getElementById("wlHourlyRate").value || 0),
    qty: Number(document.getElementById("wlQty").value || 0),
    pieceRate: Number(document.getElementById("wlPieceRate").value || 0),
    memo: document.getElementById("wlMemo").value.trim(),
    createdBy: currentUser ? currentUser.id : "",
    createdAt: new Date().toISOString()
  };
  if (!w.date || !w.empId) {
    alert("Date / Employee required");
    return;
  }
  db.ref("worklogs").push(w);
  alert("Worklog Saved");
}

/***************************
 * PRODUCTION (SIMPLE)
 ***************************/
function renderProductionPage(root) {
  const t = T[currentLang];
  root.innerHTML = `
    <div class="page-title">${t.productionTitle}</div>

    <div class="card">
      <h3>Production Input</h3>
      <div class="form-row">
        <div class="form-field">
          <label>Date</label>
          <input id="prdDate" type="date" />
        </div>
        <div class="form-field">
          <label>Process</label>
          <select id="prdProcess">
            <option value="">-</option>
            ${Array.from({length:14}).map((_,i)=>`<option value="${i+1}">${i+1}</option>`).join("")}
          </select>
        </div>
        <div class="form-field">
          <label>Product Code</label>
          <input id="prdCode" />
        </div>
        <div class="form-field">
          <label>Qty</label>
          <input id="prdQty" type="number" min="0" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <label>Defect Qty</label>
          <input id="prdDefect" type="number" min="0" />
        </div>
        <div class="form-field" style="flex:1 1 100%">
          <label>${t.memo}</label>
          <textarea id="prdMemo"></textarea>
        </div>
      </div>
      <button class="btn-primary" onclick="saveProduction()">${t.save}</button>
    </div>

    <div class="card">
      <h3>Recent Production</h3>
      <div class="table-wrapper">
        <table class="erp-table">
          <thead>
            <tr>
              <th>Date</th><th>Proc</th><th>Code</th><th>Qty</th><th>Defect</th><th>Memo</th>
            </tr>
          </thead>
          <tbody id="prdTableBody"></tbody>
        </table>
      </div>
    </div>
  `;

  db.ref("productions").limitToLast(100).once("value").then(snap => {
    const val = snap.val() || {};
    const list = Object.values(val);
    const tbody = document.getElementById("prdTableBody");
    tbody.innerHTML = "";
    list.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.date || ""}</td>
        <td>${p.process || ""}</td>
        <td>${p.code || ""}</td>
        <td>${p.qty || 0}</td>
        <td>${p.defect || 0}</td>
        <td>${p.memo || ""}</td>
      `;
      tbody.appendChild(tr);
    });
  });
}

function saveProduction() {
  const p = {
    date: document.getElementById("prdDate").value,
    process: document.getElementById("prdProcess").value,
    code: document.getElementById("prdCode").value.trim(),
    qty: Number(document.getElementById("prdQty").value || 0),
    defect: Number(document.getElementById("prdDefect").value || 0),
    memo: document.getElementById("prdMemo").value.trim(),
    createdBy: currentUser ? currentUser.id : "",
    createdAt: new Date().toISOString()
  };
  if (!p.date || !p.code) {
    alert("Date / Code required");
    return;
  }
  db.ref("productions").push(p);
  alert("Production Saved");
}

/***************************
 * STOCK & RECEIVING
 ***************************/
function renderStockPage(root) {
  const t = T[currentLang];
  root.innerHTML = `
    <div class="page-title">${t.stockTitle}</div>

    <div class="card">
      <h3>Receiving</h3>
      <div class="form-row">
        <div class="form-field">
          <label>Date</label>
          <input id="rcvDate" type="date" />
        </div>
        <div class="form-field">
          <label>Vendor</label>
          <input id="rcvVendor" />
        </div>
        <div class="form-field">
          <label>Method</label>
          <select id="rcvMethod">
            <option value="SEA">SEA</option>
            <option value="AIR">AIR</option>
          </select>
        </div>
        <div class="form-field">
          <label>Code</label>
          <input id="rcvCode" />
        </div>
        <div class="form-field">
          <label>Name</label>
          <input id="rcvName" />
        </div>
        <div class="form-field">
          <label>Qty</label>
          <input id="rcvQty" type="number" min="0" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-field" style="flex:1 1 100%">
          <label>${t.memo}</label>
          <textarea id="rcvMemo"></textarea>
        </div>
      </div>
      <button class="btn-primary" onclick="saveReceiving()">${t.save}</button>
    </div>

    <div class="card">
      <h3>Current Stock</h3>
      <div class="table-wrapper">
        <table class="erp-table">
          <thead>
            <tr>
              <th>Code</th><th>Name</th><th>Qty</th><th>Last Update</th>
            </tr>
          </thead>
          <tbody id="stockTableBody"></tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <h3>Receiving Log (최근 100건)</h3>
      <div class="table-wrapper">
        <table class="erp-table">
          <thead>
            <tr>
              <th>Date</th><th>Vendor</th><th>Method</th><th>Code</th><th>Name</th><th>Qty</th><th>Memo</th>
            </tr>
          </thead>
          <tbody id="rcvTableBody"></tbody>
        </table>
      </div>
    </div>
  `;

  // Stock subscribe
  db.ref("stock").on("value", snap => {
    const val = snap.val() || {};
    const list = Object.values(val);
    const tbody = document.getElementById("stockTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    list.forEach(s => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${s.code || ""}</td>
        <td>${s.name || ""}</td>
        <td>${s.qty || 0}</td>
        <td>${s.lastUpdate || ""}</td>
      `;
      tbody.appendChild(tr);
    });
  });

  db.ref("receivings").limitToLast(100).once("value").then(snap => {
    const val = snap.val() || {};
    const list = Object.values(val);
    const tbody = document.getElementById("rcvTableBody");
    tbody.innerHTML = "";
    list.forEach(r => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.date || ""}</td>
        <td>${r.vendor || ""}</td>
        <td>${r.method || ""}</td>
        <td>${r.code || ""}</td>
        <td>${r.name || ""}</td>
        <td>${r.qty || 0}</td>
        <td>${r.memo || ""}</td>
      `;
      tbody.appendChild(tr);
    });
  });
}

function saveReceiving() {
  const r = {
    date: document.getElementById("rcvDate").value,
    vendor: document.getElementById("rcvVendor").value.trim(),
    method: document.getElementById("rcvMethod").value,
    code: document.getElementById("rcvCode").value.trim(),
    name: document.getElementById("rcvName").value.trim(),
    qty: Number(document.getElementById("rcvQty").value || 0),
    memo: document.getElementById("rcvMemo").value.trim(),
    createdBy: currentUser ? currentUser.id : "",
    createdAt: new Date().toISOString()
  };
  if (!r.date || !r.code) {
    alert("Date / Code required");
    return;
  }

  // receiving log
  db.ref("receivings").push(r);

  // stock update
  db.ref("stock").once("value").then(snap => {
    const val = snap.val() || {};
    const list = Object.keys(val).map(k => ({ key: k, ...val[k] }));
    const found = list.find(s => s.code === r.code);
    if (found) {
      const newQty = Number(found.qty || 0) + r.qty;
      db.ref("stock/" + found.key).set({
        code: r.code,
        name: r.name || found.name,
        qty: newQty,
        lastUpdate: new Date().toLocaleString()
      });
    } else {
      db.ref("stock").push({
        code: r.code,
        name: r.name,
        qty: r.qty,
        lastUpdate: new Date().toLocaleString()
      });
    }
  });

  alert("Receiving Saved");
}

/***************************
 * ORDERS (SIMPLE)
 ***************************/
function renderOrderPage(root) {
  const t = T[currentLang];
  root.innerHTML = `
    <div class="page-title">${t.orderTitle}</div>

    <div class="card">
      <h3>Order Input</h3>
      <div class="form-row">
        <div class="form-field">
          <label>Order No</label>
          <input id="ordNo" />
        </div>
        <div class="form-field">
          <label>Buyer</label>
          <input id="ordBuyer" />
        </div>
        <div class="form-field">
          <label>Product Code</label>
          <input id="ordCode" />
        </div>
        <div class="form-field">
          <label>Qty</label>
          <input id="ordQty" type="number" min="0" />
        </div>
        <div class="form-field">
          <label>Unit Price</label>
          <input id="ordPrice" type="number" min="0" step="0.0001" />
        </div>
        <div class="form-field">
          <label>Due Date</label>
          <input id="ordDue" type="date" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-field" style="flex:1 1 100%">
          <label>${t.memo}</label>
          <textarea id="ordMemo"></textarea>
        </div>
      </div>
      <button class="btn-primary" onclick="saveOrder()">${t.save}</button>
    </div>

    <div class="card">
      <h3>Order List (최근 100건)</h3>
      <div class="table-wrapper">
        <table class="erp-table">
          <thead>
            <tr>
              <th>No</th><th>Buyer</th><th>Code</th><th>Qty</th><th>Price</th><th>Due</th><th>Memo</th>
            </tr>
          </thead>
          <tbody id="ordTableBody"></tbody>
        </table>
      </div>
    </div>
  `;

  db.ref("orders").limitToLast(100).once("value").then(snap => {
    const val = snap.val() || {};
    const list = Object.values(val);
    const tbody = document.getElementById("ordTableBody");
    tbody.innerHTML = "";
    list.forEach(o => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${o.orderNo || ""}</td>
        <td>${o.buyer || ""}</td>
        <td>${o.code || ""}</td>
        <td>${o.qty || 0}</td>
        <td>${o.price || 0}</td>
        <td>${o.dueDate || ""}</td>
        <td>${o.memo || ""}</td>
      `;
      tbody.appendChild(tr);
    });
  });
}

function saveOrder() {
  const o = {
    orderNo: document.getElementById("ordNo").value.trim(),
    buyer: document.getElementById("ordBuyer").value.trim(),
    code: document.getElementById("ordCode").value.trim(),
    qty: Number(document.getElementById("ordQty").value || 0),
    price: Number(document.getElementById("ordPrice").value || 0),
    dueDate: document.getElementById("ordDue").value,
    memo: document.getElementById("ordMemo").value.trim(),
    createdBy: currentUser ? currentUser.id : "",
    createdAt: new Date().toISOString()
  };
  if (!o.orderNo || !o.code) {
    alert("OrderNo / Code required");
    return;
  }
  db.ref("orders").push(o);
  alert("Order Saved");
}

/***************************
 * OUTSOURCING (SKELETON)
 ***************************/
function renderOutsourcingPage(root) {
  const t = T[currentLang];
  root.innerHTML = `
    <div class="page-title">${t.outsourcingTitle}</div>

    <div class="card">
      <h3>Vendor Master</h3>
      <div class="form-row">
        <div class="form-field">
          <label>Vendor Code</label>
          <input id="vCode" />
        </div>
        <div class="form-field">
          <label>Vendor Name</label>
          <input id="vName" />
        </div>
        <div class="form-field">
          <label>Contact</label>
          <input id="vContact" />
        </div>
        <div class="form-field">
          <label>Bank</label>
          <input id="vBank" />
        </div>
        <div class="form-field">
          <label>Account</label>
          <input id="vAccount" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-field" style="flex:1 1 100%">
          <label>${t.memo}</label>
          <textarea id="vMemo"></textarea>
        </div>
      </div>
      <button class="btn-primary" onclick="saveVendor()">${t.save}</button>
    </div>

    <div class="card">
      <h3>Outsource Production (Simple)</h3>
      <div class="form-row">
        <div class="form-field">
          <label>Date</label>
          <input id="outDate" type="date" />
        </div>
        <div class="form-field">
          <label>Vendor Code</label>
          <input id="outVendor" />
        </div>
        <div class="form-field">
          <label>Process</label>
          <input id="outProcess" />
        </div>
        <div class="form-field">
          <label>Product Code</label>
          <input id="outCode" />
        </div>
        <div class="form-field">
          <label>Qty</label>
          <input id="outQty" type="number" min="0" />
        </div>
        <div class="form-field">
          <label>Unit Price</label>
          <input id="outPrice" type="number" min="0" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-field" style="flex:1 1 100%">
          <label>${t.memo}</label>
          <textarea id="outMemo"></textarea>
        </div>
      </div>
      <button class="btn-primary" onclick="saveOutsource()">${t.save}</button>
    </div>
  `;
}

function saveVendor() {
  const v = {
    code: document.getElementById("vCode").value.trim(),
    name: document.getElementById("vName").value.trim(),
    contact: document.getElementById("vContact").value.trim(),
    bank: document.getElementById("vBank").value.trim(),
    account: document.getElementById("vAccount").value.trim(),
    memo: document.getElementById("vMemo").value.trim()
  };
  if (!v.code || !v.name) {
    alert("Vendor Code / Name required");
    return;
  }
  db.ref("vendors").push(v);
  alert("Vendor Saved");
}

function saveOutsource() {
  const o = {
    date: document.getElementById("outDate").value,
    vendor: document.getElementById("outVendor").value.trim(),
    process: document.getElementById("outProcess").value.trim(),
    code: document.getElementById("outCode").value.trim(),
    qty: Number(document.getElementById("outQty").value || 0),
    price: Number(document.getElementById("outPrice").value || 0),
    memo: document.getElementById("outMemo").value.trim(),
    createdBy: currentUser ? currentUser.id : "",
    createdAt: new Date().toISOString()
  };
  if (!o.date || !o.vendor || !o.code) {
    alert("Date / Vendor / Code required");
    return;
  }
  db.ref("outsourcing").push(o);
  alert("Outsource Saved");
}

/***************************
 * MRP / PURCHASE (SKELETON)
 ***************************/
function renderMRPPage(root) {
  const t = T[currentLang];
  root.innerHTML = `
    <div class="page-title">${t.mrpTitle}</div>

    <div class="card">
      <h3>MRP / Purchase (Skeleton)</h3>
      <p>나중에: 주문 + BOM + 재고 + 안전재고 → 부족분 계산 → PO 생성 로직 연결</p>
      <div class="form-row">
        <div class="form-field">
          <label>Item Code</label>
          <input id="mrpItemCode" />
        </div>
        <div class="form-field">
          <label>Safety Stock</label>
          <input id="mrpSafety" type="number" min="0" />
        </div>
        <div class="form-field">
          <label>${t.memo}</label>
          <textarea id="mrpMemo"></textarea>
        </div>
      </div>
      <button class="btn-primary" onclick="saveMRPSetting()">${t.save}</button>
    </div>
  `;
}

function saveMRPSetting() {
  const m = {
    itemCode: document.getElementById("mrpItemCode").value.trim(),
    safetyStock: Number(document.getElementById("mrpSafety").value || 0),
    memo: document.getElementById("mrpMemo").value.trim()
  };
  if (!m.itemCode) {
    alert("Item Code required");
    return;
  }
  db.ref("mrpSettings").push(m);
  alert("MRP Setting Saved");
}

/***************************
 * REPORTS (SKELETON)
 ***************************/
function renderReportsPage(root) {
  const t = T[currentLang];
  root.innerHTML = `
    <div class="page-title">${t.reportsTitle}</div>

    <div class="card">
      <h3>Reports / Profit (Skeleton)</h3>
      <p>나중에: 제품별 원가 / 마진 / 월별 손익 대시보드 연동.</p>
    </div>
  `;
}

/***************************
 * SETTINGS (SIMPLE)
 ***************************/
function renderSettingsPage(root) {
  const t = T[currentLang];
  root.innerHTML = `
    <div class="page-title">${t.settingsTitle}</div>

    <div class="card">
      <h3>Company Info</h3>
      <div class="form-row">
        <div class="form-field">
          <label>Company Name</label>
          <input id="setCompany" />
        </div>
        <div class="form-field">
          <label>Manager</label>
          <input id="setManager" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-field" style="flex:1 1 100%">
          <label>${t.memo}</label>
          <textarea id="setMemo"></textarea>
        </div>
      </div>
      <button class="btn-primary" onclick="saveSettings()">${t.save}</button>
    </div>
  `;

  db.ref("settings/company").once("value").then(snap => {
    const v = snap.val() || {};
    document.getElementById("setCompany").value = v.company || "";
    document.getElementById("setManager").value = v.manager || "";
    document.getElementById("setMemo").value = v.memo || "";
  });
}

function saveSettings() {
  const v = {
    company: document.getElementById("setCompany").value.trim(),
    manager: document.getElementById("setManager").value.trim(),
    memo: document.getElementById("setMemo").value.trim()
  };
  db.ref("settings/company").set(v);
  alert("Settings Saved");
}

/***************************
 * INIT
 ***************************/
document.addEventListener("DOMContentLoaded", () => {
  applyLanguage();
  tryAutoLogin();
});

/***************************
 * WINDOW BINDINGS
 ***************************/
window.login = login;
window.logout = logout;
window.setLanguage = setLanguage;

// employee
window.saveEmployee = saveEmployee;
window.loadEmployeeToForm = loadEmployeeToForm;

// worklog
window.saveWorklog = saveWorklog;

// production
window.saveProduction = saveProduction;

// stock
window.saveReceiving = saveReceiving;

// order
window.saveOrder = saveOrder;

// outsourcing
window.saveVendor = saveVendor;
window.saveOutsource = saveOutsource;

// mrp
window.saveMRPSetting = saveMRPSetting;

// settings
window.saveSettings = saveSettings;
