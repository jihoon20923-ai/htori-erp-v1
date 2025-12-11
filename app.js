/****************************************
 * FIREBASE INIT
 ****************************************/
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

/****************************************
 * FIRST ADMIN CREATION
 ****************************************/
db.ref("employees").once("value").then(snap=>{
  if(!snap.exists()){
    db.ref("employees").push({
      id:"admin", pw:"1234", name:"Master", role:"master"
    });
  }
});

/****************************************
 * GLOBAL STATE
 ****************************************/
let currentUser = null;
let lang = localStorage.getItem("lang") || "EN";

/****************************************
 * LANG DATA
 ****************************************/
const T = {
  EN:{ dashboard:"Dashboard", stock:"Stock", order:"Order", excel:"Excel Upload", settings:"Settings" },
  KR:{ dashboard:"대시보드", stock:"재고", order:"주문", excel:"엑셀 업로드", settings:"설정" },
  ID:{ dashboard:"Dasbor", stock:"Stok", order:"Pesanan", excel:"Upload Excel", settings:"Pengaturan" }
};


/****************************************
 * LOGIN
 ****************************************/
document.getElementById("loginBtn").onclick = login;
document.getElementById("demoBtn").onclick = demoLogin;

function login(){
  const id = loginId.value.trim();
  const pw = loginPw.value.trim();

  db.ref("employees").once("value").then(s=>{
    const list = s.val() || {};
    const found = Object.values(list).find(x=>x.id===id && x.pw===pw);

    if(!found){
      alert("Login Failed");
      return;
    }

    currentUser = found;
    enterSystem();
  });
}

function demoLogin(){
  currentUser = { id:"demo", name:"Demo User", role:"viewer" };
  enterSystem();
}

function enterSystem(){
  loginModal.classList.add("hidden");
  document.querySelector(".layout").classList.remove("hidden");

  user-name.textContent = currentUser.name;
  user-role.textContent = currentUser.role;

  logoutBtn.classList.remove("hidden");

  renderMenu();
  showPage("dashboard");
}

logoutBtn.onclick = ()=>{
  location.reload();
};


/****************************************
 * LANGUAGE SWITCH
 ****************************************/
document.querySelectorAll(".lang-btn").forEach(btn=>{
  btn.onclick = ()=>{
    lang = btn.dataset.lang;
    localStorage.setItem("lang", lang);
    renderMenu();
    showPage("dashboard");
  };
});


/****************************************
 * MENU
 ****************************************/
function renderMenu(){
  const menu = [
    {key:"dashboard", page:"dashboard"},
    {key:"stock", page:"stock"},
    {key:"order", page:"order"},
    {key:"excel", page:"excel"},
    {key:"settings", page:"settings"}
  ];

  menuList.innerHTML = "";

  menu.forEach(m=>{
    const li = document.createElement("li");
    li.className = "menu-item";
    li.textContent = T[lang][m.key];
    li.onclick = ()=> showPage(m.page);
    menuList.appendChild(li);
  });
}


/****************************************
 * PAGE ROUTER
 ****************************************/
function showPage(page){
  if(page==="dashboard"){
    content.innerHTML = document.getElementById("tpl-dashboard").innerHTML;
  }

  if(page==="settings"){
    content.innerHTML = document.getElementById("tpl-settings").innerHTML;
  }

  if(page==="excel"){
    content.innerHTML = `
      <h1>${T[lang].excel}</h1>
      <div class="card">
        <input type="file" id="excelFile">
        <button class="btn" onclick="uploadExcel()">Upload</button>
      </div>
    `;
  }

  if(page==="stock"){
    content.innerHTML = `<h1>${T[lang].stock}</h1>`;
  }

  if(page==="order"){
    content.innerHTML = `<h1>${T[lang].order}</h1>`;
  }
}


/****************************************
 * EXCEL UPLOAD
 ****************************************/
function uploadExcel(){
  const file = document.getElementById("excelFile").files[0];
  if(!file) return alert("Select file");

  const reader = new FileReader();
  reader.onload = function(e){
    const wb = XLSX.read(e.target.result, {type:"binary"});
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    db.ref("excelUpload").push({ uploadedAt: new Date().toISOString(), rows });

    alert("Excel Uploaded!");
  };
  reader.readAsBinaryString(file);
}
/**************************************************
  TRANSLATION + PERMISSION PATCH (integrated)
  - uses LANG (lang.js) and currentUser, lang global variables
**************************************************/

// translate all elements with data-i18n or known IDs in employees template
function translateAll(){
  // translate menu if exists
  try {
    // menuList buttons (re-render with translations)
    if(typeof renderMenu === "function"){
      renderMenu(); // renderMenu should use t('menu.xxx') if available
    }
  } catch(e){ /* ignore */ }

  // translate employees template elements if on that page
  const empTitle = document.querySelector("#content h1") || document.getElementById("empFormTitle");
  if(empTitle) {
    // if current page is employees, set specific labels
    if(document.getElementById("empFormTitle")){
      document.getElementById("empFormTitle").textContent = t("employees.form.title_add");
      // set button text if present
      if(document.getElementById("empSaveBtn")) document.getElementById("empSaveBtn").textContent = t("employees.form.save");
      if(document.getElementById("empCancelBtn")) document.getElementById("empCancelBtn").textContent = t("employees.form.cancel");

      // set table headers if exist
      const head = document.querySelector("#empTable thead tr");
      if(head){
        // find th elements and set by order
        const ths = head.querySelectorAll("th");
        if(ths.length >= 7){
          ths[0].textContent = t("employees.table.empId");
          ths[1].textContent = t("employees.table.name");
          ths[2].textContent = t("employees.table.role");
          ths[3].textContent = t("employees.table.bank");
          ths[4].textContent = t("employees.table.account");
          ths[5].textContent = t("employees.table.tax");
          ths[6].textContent = t("employees.table.actions");
        }
      }
    }

    // try translate other static labels with data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });
  }
}

// patch renderMenu to use t(...) — if you already have renderMenu, replace internal texts accordingly.
// Example safe fallback: if your renderMenu uses direct text, override it:
if(typeof renderMenu === "function"){
  const _oldRenderMenu = renderMenu;
  renderMenu = function(){
    // call old to build structure if it exists, then localize
    try { _oldRenderMenu(); } catch(e){ /* ignore */ }

    // now translate menu buttons (if they were created with keys in data-menu)
    document.querySelectorAll("#menuList .menu-item").forEach(btn=>{
      const key = btn.dataset && btn.dataset.menuKey;
      if(key) btn.textContent = t("menu."+key);
      else {
        // try to map by innerText if matches English keys - best-effort
        const txt = btn.textContent.trim().toLowerCase();
        // quick map fallback (common)
        const map = {
          "dashboard":"dashboard","order":"order","mrp":"mrp","receiving":"receiving","stock":"stock",
          "production":"production","outsourcing":"outsource","shipment":"shipment","cost":"cost",
          "employees":"employees","settings":"settings"
        };
        Object.keys(map).forEach(k=>{
          if(txt === k) btn.textContent = t("menu."+map[k]);
        });
      }
    });
  };
}

// helper: hide delete buttons for non-master
function applyEmployeePermissions(){
  // called after employee list render
  const canDelete = currentUser && currentUser.role === "master";
  document.querySelectorAll("#empTableBody button").forEach(btn=>{
    if(btn.textContent && btn.textContent.toLowerCase().includes("delete")){
      btn.style.display = canDelete ? "inline-block" : "none";
    }
  });
}

// integrate permissions directly into loadEmployeeList (if present in your app.js)
// If you use the loadEmployeeList() provided earlier, it already renders delete button via code.
// To be safe, monkey-patch db ref listener handler if exists:
if(typeof loadEmployeeList === "function"){
  const _oldLoadEmployeeList = loadEmployeeList;
  loadEmployeeList = function(){
    _oldLoadEmployeeList(); // call original which repopulates table
    // after a tiny delay allow DOM update then apply perms & translation
    setTimeout(()=>{
      applyEmployeePermissions();
      translateAll();
    }, 200);
  };
}

// ensure language changes call translateAll
// if you already have setLanguage or language button handlers, patch them
if(typeof setLanguage === "function"){
  const _oldSetLanguage = setLanguage;
  setLanguage = function(l){
    _oldSetLanguage(l);
    // ensure global var updated
    window.lang = l;
    localStorage.setItem("lang", l);
    setTimeout(()=>translateAll(), 50);
  };
} else {
  // fallback: if language buttons exist, bind them to call translateAll
  document.querySelectorAll(".lang-btn").forEach(btn=>{
    btn.addEventListener("click", (ev)=>{
      const L = btn.dataset.lang;
      window.lang = L;
      localStorage.setItem("lang", L);
      translateAll();
    });
  });
}

// initial translate on load
document.addEventListener("DOMContentLoaded", ()=>{
  window.lang = window.lang || localStorage.getItem("lang") || "EN";
  translateAll();
});

