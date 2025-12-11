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
