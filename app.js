/***********************
 FIREBASE INIT
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
 ✅ 최초 admin 자동 생성
***********************/
db.ref("employees").once("value").then(snap=>{
  if(!snap.exists()){
    db.ref("employees").push({
      id:"admin", pw:"1234", name:"Master", role:"master"
    });
  }
});

/***********************
 ✅ 기본 언어 = EN
***********************/
let lang = "EN";

/***********************
 ✅ 자동 로그인
***********************/
let currentUser = null;

window.onload = function(){
  const saved = localStorage.getItem("htori_user");
  if(saved){
    currentUser = JSON.parse(saved);
    loginBox.classList.add("hidden");
    erp.classList.remove("hidden");
    renderMenu();
    showPage("dashboard");
  }
};

/***********************
 LOGIN
***********************/
function login(){
  const id = loginId.value.trim();
  const pw = loginPw.value.trim();

  db.ref("employees").once("value").then(s=>{
    const list = s.val() || {};
    const found = Object.values(list).find(x=>x.id===id && x.pw===pw);
    if(!found) return alert("LOGIN FAIL");

    currentUser = found;
    localStorage.setItem("htori_user", JSON.stringify(found));

    loginBox.classList.add("hidden");
    erp.classList.remove("hidden");

    renderMenu();
    showPage("dashboard");
  });
}

/***********************
 MULTI LANGUAGE
***********************/
const T = {
  KR:{ dashboard:"대시보드", employee:"직원", stock:"재고", order:"주문", shipment:"수출" },
  EN:{ dashboard:"Dashboard", employee:"Employee", stock:"Stock", order:"Order", shipment:"Shipment" },
  ID:{ dashboard:"Dasbor", employee:"Karyawan", stock:"Stok", order:"Pesanan", shipment:"Pengiriman" }
};

function setLanguage(l){
  lang = l;
  renderMenu();
  showPage("dashboard");
}

/***********************
 MENU
***********************/
function renderMenu(){
  sidebar.innerHTML="";
  const roleMap={ master:["dashboard","employee","stock","order","shipment"] };

  roleMap[currentUser.role].forEach(p=>{
    const b=document.createElement("button");
    b.innerText = T[lang][p];
    b.onclick=()=>showPage(p);
    sidebar.appendChild(b);
  });
}

function toggleSidebar(){
  sidebar.classList.toggle("active");
}

/***********************
 ✅ PAGES - ALL EXCEL STYLE
***********************/
function showPage(page){

  /* ✅ DASHBOARD */
  if(page==="dashboard"){
    content.innerHTML=`
      <h2>${T[lang].dashboard}</h2>
      <table>
        <tr><th>Status</th><th>System</th></tr>
        <tr><td>Realtime</td><td>Connected ✅</td></tr>
      </table>
    `;
  }

  /* ✅ EMPLOYEE */
  if(page==="employee"){
    content.innerHTML=`
      <h2>${T[lang].employee}</h2>
      <div class="form-row">
        <input id="eId" placeholder="ID">
        <input id="ePw" placeholder="PW">
        <input id="eName" placeholder="Name">
        <select id="eRole">
          <option value="master">MASTER</option>
          <option value="sales">SALES</option>
        </select>
        <button onclick="addEmployee()">ADD</button>
      </div>
      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Role</th></tr></thead>
        <tbody id="empBody"></tbody>
      </table>
    `;
    loadEmployees();
  }

  /* ✅ STOCK (엑셀형) */
  if(page==="stock"){
    content.innerHTML=`
      <h2>${T[lang].stock}</h2>
      <div class="form-row">
        <input id="sCode" placeholder="Code">
        <input id="sQty" type="number" placeholder="Qty">
        <button onclick="addStock()">ADD</button>
      </div>
      <table>
        <thead><tr><th>Code</th><th>Qty</th></tr></thead>
        <tbody id="stockBody"></tbody>
      </table>
    `;
    loadStock();
  }

  /* ✅ ORDER (엑셀형) */
  if(page==="order"){
    content.innerHTML=`
      <h2>${T[lang].order}</h2>
      <div class="form-row">
        <input id="oNo" placeholder="Order No">
        <input id="oProduct" placeholder="Product">
        <input id="oQty" type="number" placeholder="Qty">
        <button onclick="addOrder()">ADD</button>
      </div>
      <table>
        <thead><tr><th>No</th><th>Product</th><th>Qty</th></tr></thead>
        <tbody id="orderBody"></tbody>
      </table>
    `;
    loadOrders();
  }

  /* ✅ SHIPMENT (엑셀형) */
  if(page==="shipment"){
    content.innerHTML=`
      <h2>${T[lang].shipment}</h2>
      <div class="form-row">
        <input id="shipNo" placeholder="Shipment No">
        <input id="shipBuyer" placeholder="Buyer">
        <button onclick="saveShipment()">SAVE</button>
      </div>
      <table>
        <thead><tr><th>No</th><th>Buyer</th></tr></thead>
        <tbody id="shipBody"></tbody>
      </table>
    `;
    loadShipments();
  }
}

/***********************
 EMPLOYEE
***********************/
function addEmployee(){
  db.ref("employees").push({
    id:eId.value, pw:ePw.value,
    name:eName.value, role:eRole.value
  });
}

function loadEmployees(){
  db.ref("employees").on("value",snap=>{
    empBody.innerHTML="";
    Object.values(snap.val()||{}).forEach(e=>{
      empBody.innerHTML+=`<tr><td>${e.id}</td><td>${e.name}</td><td>${e.role}</td></tr>`;
    });
  });
}

/***********************
 STOCK
***********************/
function addStock(){
  db.ref("stock").push({ code:sCode.value, qty:Number(sQty.value) });
}

function loadStock(){
  db.ref("stock").on("value",snap=>{
    stockBody.innerHTML="";
    Object.values(snap.val()||{}).forEach(s=>{
      stockBody.innerHTML+=`<tr><td>${s.code}</td><td>${s.qty}</td></tr>`;
    });
  });
}

/***********************
 ORDER
***********************/
function addOrder(){
  db.ref("orders").push({
    orderNo:oNo.value,
    product:oProduct.value,
    qty:oQty.value
  });
}

function loadOrders(){
  db.ref("orders").on("value",snap=>{
    orderBody.innerHTML="";
    Object.values(snap.val()||{}).forEach(o=>{
      orderBody.innerHTML+=`<tr><td>${o.orderNo}</td><td>${o.product}</td><td>${o.qty}</td></tr>`;
    });
  });
}

/***********************
 SHIPMENT
***********************/
function saveShipment(){
  db.ref("shipments").push({
    shipNo:shipNo.value,
    buyer:shipBuyer.value
  });
}

function loadShipments(){
  db.ref("shipments").on("value",snap=>{
    shipBody.innerHTML="";
    Object.values(snap.val()||{}).forEach(s=>{
      shipBody.innerHTML+=`<tr><td>${s.shipNo}</td><td>${s.buyer}</td></tr>`;
    });
  });
}
