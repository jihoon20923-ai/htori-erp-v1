/***********************
 * FIREBASE INIT
***********************/
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

/***********************
 * GLOBAL STATE
***********************/
let currentUser = null;
let employees = [];
let currentLang = localStorage.getItem("htori_lang") || "EN";
let editingEmployeeKey = null;
let searchKeyword = "";

/***********************
 * I18N
***********************/
const I18N = {
  EN: {
    appTitle: "HTORI ERP - Employee",
    loginTitle: "HTORI ERP LOGIN",
    loginBtn: "LOGIN",

    search: "Search",
    searchPlaceholder: "ID / Name",
    addEmployee: "Add Employee",
    employeeList: "Employee List",

    thEmpId: "ID",
    thName: "Name",
    thProcess: "Process",
    thJob: "Job",
    thEmployment: "Employment",
    thSalaryType: "Salary Type",
    thStatus: "Status",
    thEdit: "Edit",
    thTerminate: "Terminate",

    basicInfo: "Basic Info",
    lblEmpId: "Employee ID",
    lblName: "Name",
    lblNationality: "Nationality",
    lblProcess: "Process",
    lblJob: "Job",
    lblStatus: "Status",

    employmentTitle: "Employment Type",
    lblEmploymentType: "PKWTT / PKWT",
    lblJoinDate: "Join Date",
    lblContractStart: "Contract Start",
    lblContractEnd: "Contract End",

    salaryTitle: "Salary",
    lblSalaryType: "Salary Type",
    lblCurrency: "Currency",
    lblBaseSalary: "Monthly Salary",
    lblHourlyWage: "Hourly Wage",
    lblPieceRate: "Piece Rate (per unit)",

    bankTitle: "Bank Info",
    lblBankName: "Bank Name",
    lblBankAccount: "Account No.",

    btnSave: "Save",
    btnCancel: "Cancel",
    modalTitleNew: "Add Employee",
    modalTitleEdit: "Edit Employee",

    status_active: "Active",
    status_leave: "Leave",
    status_terminated: "Terminated",

    confirmTerminate: "Set this employee as 'Terminated'?",
    alertNoId: "Employee ID is required.",
    alertNoName: "Name is required."
  },
  KR: {
    appTitle: "HTORI ERP - 직원관리",
    loginTitle: "HTORI ERP 로그인",
    loginBtn: "로그인",

    search: "검색",
    searchPlaceholder: "ID / 이름",
    addEmployee: "직원 등록",
    employeeList: "직원 목록",

    thEmpId: "ID",
    thName: "이름",
    thProcess: "공정",
    thJob: "직무",
    thEmployment: "고용형태",
    thSalaryType: "급여 형태",
    thStatus: "상태",
    thEdit: "수정",
    thTerminate: "퇴사",

    basicInfo: "기본 정보",
    lblEmpId: "직원 ID",
    lblName: "이름",
    lblNationality: "국적",
    lblProcess: "공정",
    lblJob: "직무",
    lblStatus: "상태",

    employmentTitle: "고용 형태",
    lblEmploymentType: "PKWTT / PKWT",
    lblJoinDate: "입사일",
    lblContractStart: "계약 시작",
    lblContractEnd: "계약 종료",

    salaryTitle: "급여",
    lblSalaryType: "급여 형태",
    lblCurrency: "통화",
    lblBaseSalary: "월급",
    lblHourlyWage: "시급",
    lblPieceRate: "개당 단가",

    bankTitle: "은행 정보",
    lblBankName: "은행명",
    lblBankAccount: "계좌번호",

    btnSave: "저장",
    btnCancel: "취소",
    modalTitleNew: "직원 등록",
    modalTitleEdit: "직원 수정",

    status_active: "재직",
    status_leave: "휴직",
    status_terminated: "퇴사",

    confirmTerminate: "해당 직원을 '퇴사' 처리하시겠습니까?",
    alertNoId: "직원 ID를 입력하세요.",
    alertNoName: "이름을 입력하세요."
  },
  ID: {
    appTitle: "HTORI ERP - Karyawan",
    loginTitle: "HTORI ERP LOGIN",
    loginBtn: "MASUK",

    search: "Cari",
    searchPlaceholder: "ID / Nama",
    addEmployee: "Tambah Karyawan",
    employeeList: "Daftar Karyawan",

    thEmpId: "ID",
    thName: "Nama",
    thProcess: "Proses",
    thJob: "Jabatan",
    thEmployment: "Jenis Kerja",
    thSalaryType: "Tipe Gaji",
    thStatus: "Status",
    thEdit: "Edit",
    thTerminate: "Resign",

    basicInfo: "Info Dasar",
    lblEmpId: "ID Karyawan",
    lblName: "Nama",
    lblNationality: "Kebangsaan",
    lblProcess: "Proses",
    lblJob: "Jabatan",
    lblStatus: "Status",

    employmentTitle: "Jenis Kontrak",
    lblEmploymentType: "PKWTT / PKWT",
    lblJoinDate: "Tanggal Masuk",
    lblContractStart: "Mulai Kontrak",
    lblContractEnd: "Akhir Kontrak",

    salaryTitle: "Gaji",
    lblSalaryType: "Tipe Gaji",
    lblCurrency: "Mata Uang",
    lblBaseSalary: "Gaji Bulanan",
    lblHourlyWage: "Gaji per Jam",
    lblPieceRate: "Upah per Unit",

    bankTitle: "Info Bank",
    lblBankName: "Nama Bank",
    lblBankAccount: "No. Rekening",

    btnSave: "Simpan",
    btnCancel: "Batal",
    modalTitleNew: "Tambah Karyawan",
    modalTitleEdit: "Edit Karyawan",

    status_active: "Aktif",
    status_leave: "Cuti",
    status_terminated: "Resign",

    confirmTerminate: "Set karyawan ini menjadi 'Resign'?",
    alertNoId: "ID Karyawan wajib diisi.",
    alertNoName: "Nama wajib diisi."
  }
};

/***********************
 * LOGIN
***********************/

// ✅ 최초 1회 관리자 계정 보장
db.ref("users").once("value").then(snap => {
  if (!snap.exists()) {
    const admin = {
      id: "admin",
      pw: "1234",
      name: "Master",
      role: "master"
    };
    db.ref("users").push(admin);
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
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    applyLanguage();
    subscribeEmployees();
  });
}

/***********************
 * LANGUAGE
***********************/
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("htori_lang", lang);
  applyLanguage();
}

function applyLanguage() {
  const t = I18N[currentLang];

  // Login
  document.getElementById("loginTitle").innerText = t.loginTitle;
  document.getElementById("loginBtnText").innerText = t.loginBtn;

  // Header
  document.getElementById("appTitle").innerText = t.appTitle;

  // Toolbar
  document.getElementById("searchLabel").innerText = t.search;
  document.getElementById("searchInput").placeholder = t.searchPlaceholder;
  document.getElementById("addEmployeeBtnText").innerText = t.addEmployee;

  // Table headings
  document.getElementById("employeeListTitle").innerText = t.employeeList;
  document.getElementById("thEmpId").innerText = t.thEmpId;
  document.getElementById("thName").innerText = t.thName;
  document.getElementById("thProcess").innerText = t.thProcess;
  document.getElementById("thJob").innerText = t.thJob;
  document.getElementById("thEmployment").innerText = t.thEmployment;
  document.getElementById("thSalaryType").innerText = t.thSalaryType;
  document.getElementById("thStatus").innerText = t.thStatus;
  document.getElementById("thEdit").innerText = t.thEdit;
  document.getElementById("thTerminate").innerText = t.thTerminate;

  // Modal labels
  document.getElementById("basicInfoTitle").innerText = t.basicInfo;
  document.getElementById("lblEmpId").innerText = t.lblEmpId;
  document.getElementById("lblName").innerText = t.lblName;
  document.getElementById("lblNationality").innerText = t.lblNationality;
  document.getElementById("lblProcess").innerText = t.lblProcess;
  document.getElementById("lblJob").innerText = t.lblJob;
  document.getElementById("lblStatus").innerText = t.lblStatus;

  document.getElementById("employmentTitle").innerText = t.employmentTitle;
  document.getElementById("lblEmploymentType").innerText = t.lblEmploymentType;
  document.getElementById("lblJoinDate").innerText = t.lblJoinDate;
  document.getElementById("lblContractStart").innerText = t.lblContractStart;
  document.getElementById("lblContractEnd").innerText = t.lblContractEnd;

  document.getElementById("salaryTitle").innerText = t.salaryTitle;
  document.getElementById("lblSalaryType").innerText = t.lblSalaryType;
  document.getElementById("lblCurrency").innerText = t.lblCurrency;
  document.getElementById("lblBaseSalary").innerText = t.lblBaseSalary;
  document.getElementById("lblHourlyWage").innerText = t.lblHourlyWage;
  document.getElementById("lblPieceRate").innerText = t.lblPieceRate;

  document.getElementById("bankTitle").innerText = t.bankTitle;
  document.getElementById("lblBankName").innerText = t.lblBankName;
  document.getElementById("lblBankAccount").innerText = t.lblBankAccount;

  document.getElementById("btnSaveText").innerText = t.btnSave;
  document.getElementById("btnCancelText").innerText = t.btnCancel;

  // 테이블 다시 렌더링해서 상태 텍스트 국제화
  renderEmployeeTable();
}

/***********************
 * EMPLOYEE SUBSCRIBE
***********************/
function subscribeEmployees() {
  db.ref("employees").on("value", snap => {
    const val = snap.val() || {};
    employees = Object.keys(val).map(key => ({ key, ...val[key] }));
    renderEmployeeTable();
  });
}

/***********************
 * RENDER EMPLOYEE TABLE
***********************/
function renderEmployeeTable() {
  const tbody = document.getElementById("employeeTableBody");
  tbody.innerHTML = "";
  const t = I18N[currentLang];

  let list = employees;

  if (searchKeyword.trim()) {
    const kw = searchKeyword.toLowerCase();
    list = list.filter(e =>
      (e.empId || "").toLowerCase().includes(kw) ||
      (e.name || "").toLowerCase().includes(kw)
    );
  }

  list.forEach(emp => {
    const tr = document.createElement("tr");

    // 상태 텍스트
    const statusCode = emp.status || "active";
    let statusLabel = t["status_" + statusCode] || statusCode;
    let statusClass = "status-active";
    if (statusCode === "leave") statusClass = "status-leave";
    if (statusCode === "terminated") statusClass = "status-terminated";

    // 급여 타입 표시
    let salaryLabel = "";
    if (emp.salaryType === "monthly") salaryLabel = "Monthly";
    if (emp.salaryType === "hourly") salaryLabel = "Hourly";
    if (emp.salaryType === "piece") salaryLabel = "Piece";

    const empType = emp.employmentType || "";

    tr.innerHTML = `
      <td>${emp.empId || ""}</td>
      <td>${emp.name || ""}</td>
      <td>${emp.process || ""}</td>
      <td>${emp.job || ""}</td>
      <td>${empType}</td>
      <td>${salaryLabel}</td>
      <td>
        <span class="status-badge ${statusClass}">${statusLabel}</span>
      </td>
      <td>
        <button class="btn-secondary" onclick="editEmployee('${emp.key}')">
          ${t.thEdit}
        </button>
      </td>
      <td>
        <button class="btn-primary" onclick="terminateEmployee('${emp.key}')">
          ${t.thTerminate}
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

/***********************
 * SEARCH
***********************/
function onSearchChange() {
  searchKeyword = document.getElementById("searchInput").value || "";
  renderEmployeeTable();
}

/***********************
 * MODAL OPEN/CLOSE
***********************/
function openEmployeeModal(key = null) {
  editingEmployeeKey = key;
  const t = I18N[currentLang];

  // 초기화
  document.getElementById("empIdInput").value = "";
  document.getElementById("empNameInput").value = "";
  document.getElementById("empNationalityInput").value = "ID";
  document.getElementById("empProcessInput").value = "";
  document.getElementById("empJobInput").value = "operator";
  document.getElementById("empStatusInput").value = "active";

  document.getElementById("empEmploymentTypeInput").value = "PKWTT";
  document.getElementById("empJoinDateInput").value = "";
  document.getElementById("empContractStartInput").value = "";
  document.getElementById("empContractEndInput").value = "";

  document.getElementById("empSalaryTypeInput").value = "monthly";
  document.getElementById("empCurrencyInput").value = "IDR";
  document.getElementById("empBaseSalaryInput").value = "";
  document.getElementById("empHourlyWageInput").value = "";
  document.getElementById("empPieceRateInput").value = "";

  document.getElementById("empBankNameInput").value = "";
  document.getElementById("empBankAccountInput").value = "";

  if (key) {
    const emp = employees.find(e => e.key === key);
    if (emp) {
      document.getElementById("empIdInput").value = emp.empId || "";
      document.getElementById("empNameInput").value = emp.name || "";
      document.getElementById("empNationalityInput").value = emp.nationality || "ID";
      document.getElementById("empProcessInput").value = emp.process || "";
      document.getElementById("empJobInput").value = emp.job || "operator";
      document.getElementById("empStatusInput").value = emp.status || "active";

      document.getElementById("empEmploymentTypeInput").value = emp.employmentType || "PKWTT";
      document.getElementById("empJoinDateInput").value = emp.joinDate || "";
      document.getElementById("empContractStartInput").value = emp.contractStart || "";
      document.getElementById("empContractEndInput").value = emp.contractEnd || "";

      document.getElementById("empSalaryTypeInput").value = emp.salaryType || "monthly";
      document.getElementById("empCurrencyInput").value = emp.currency || "IDR";
      document.getElementById("empBaseSalaryInput").value = emp.baseSalary || "";
      document.getElementById("empHourlyWageInput").value = emp.hourlyWage || "";
      document.getElementById("empPieceRateInput").value = emp.pieceRate || "";

      document.getElementById("empBankNameInput").value = emp.bankName || "";
      document.getElementById("empBankAccountInput").value = emp.bankAccount || "";
    }
    document.getElementById("employeeModalTitle").innerText = t.modalTitleEdit;
  } else {
    document.getElementById("employeeModalTitle").innerText = t.modalTitleNew;
  }

  onEmploymentTypeChange();
  onSalaryTypeChange();

  document.getElementById("employeeModal").classList.remove("hidden");
}

function closeEmployeeModal() {
  document.getElementById("employeeModal").classList.add("hidden");
}

/***********************
 * EMPLOYMENT / SALARY UI
***********************/
function onEmploymentTypeChange() {
  const type = document.getElementById("empEmploymentTypeInput").value;
  const pkwtOnly = document.querySelectorAll(".pkwt-only");
  if (type === "PKWT") {
    pkwtOnly.forEach(el => el.style.display = "flex");
  } else {
    pkwtOnly.forEach(el => el.style.display = "none");
  }
}

function onSalaryTypeChange() {
  const type = document.getElementById("empSalaryTypeInput").value;
  const m = document.querySelector(".salary-monthly");
  const h = document.querySelector(".salary-hourly");
  const p = document.querySelector(".salary-piece");

  m.style.display = "none";
  h.style.display = "none";
  p.style.display = "none";

  if (type === "monthly") m.style.display = "flex";
  if (type === "hourly") h.style.display = "flex";
  if (type === "piece") p.style.display = "flex";
}

/***********************
 * SAVE EMPLOYEE
***********************/
function saveEmployee() {
  const t = I18N[currentLang];

  const emp = {
    empId: document.getElementById("empIdInput").value.trim(),
    name: document.getElementById("empNameInput").value.trim(),
    nationality: document.getElementById("empNationalityInput").value,
    process: document.getElementById("empProcessInput").value,
    job: document.getElementById("empJobInput").value,
    status: document.getElementById("empStatusInput").value,

    employmentType: document.getElementById("empEmploymentTypeInput").value,
    joinDate: document.getElementById("empJoinDateInput").value,
    contractStart: document.getElementById("empContractStartInput").value,
    contractEnd: document.getElementById("empContractEndInput").value,

    salaryType: document.getElementById("empSalaryTypeInput").value,
    currency: document.getElementById("empCurrencyInput").value,
    baseSalary: document.getElementById("empBaseSalaryInput").value,
    hourlyWage: document.getElementById("empHourlyWageInput").value,
    pieceRate: document.getElementById("empPieceRateInput").value,

    bankName: document.getElementById("empBankNameInput").value.trim(),
    bankAccount: document.getElementById("empBankAccountInput").value.trim()
  };

  if (!emp.empId) {
    alert(t.alertNoId);
    return;
  }
  if (!emp.name) {
    alert(t.alertNoName);
    return;
  }

  if (editingEmployeeKey) {
    db.ref("employees/" + editingEmployeeKey).set(emp);
  } else {
    db.ref("employees").push(emp);
  }

  closeEmployeeModal();
}

/***********************
 * EDIT & TERMINATE
***********************/
function editEmployee(key) {
  openEmployeeModal(key);
}

function terminateEmployee(key) {
  const t = I18N[currentLang];
  if (!confirm(t.confirmTerminate)) return;

  const emp = employees.find(e => e.key === key);
  if (!emp) return;

  emp.status = "terminated";
  db.ref("employees/" + key).set(emp);
}

/***********************
 * INIT
***********************/
document.addEventListener("DOMContentLoaded", () => {
  // 앱 첫 진입 시 언어만 먼저 적용
  applyLanguage();
});

// 전역에서 사용하는 함수 노출
window.setLanguage = setLanguage;
window.login = login;
window.openEmployeeModal = openEmployeeModal;
window.closeEmployeeModal = closeEmployeeModal;
window.onEmploymentTypeChange = onEmploymentTypeChange;
window.onSalaryTypeChange = onSalaryTypeChange;
window.saveEmployee = saveEmployee;
window.editEmployee = editEmployee;
window.terminateEmployee = terminateEmployee;
window.onSearchChange = onSearchChange;
