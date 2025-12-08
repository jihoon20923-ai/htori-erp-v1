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
 ✅ 최초 1회만 admin 생성
***********************/
db.ref("employees").once("value").then(snap=>{
  const list = snap.val();
  if(!list){
    db.ref("employees").push({
      id:"admin",
      pw:"1234",
      name:"Master",
      role:"master"
    });
  }
});




/***********************
 LOGIN
***********************/
let currentUser = null;

function login(){
  const id = loginId.value.trim();
  const pw = loginPw.value.trim();

  db.ref("employees").once("value").then(s=>{
    const list = s.val() || [];
    const found = list.find(x=>x.id===id && x.pw===pw);
    if(!found) return alert("LOGIN FAIL");

    currentUser = found;
    loginBox.classList.add("hidden");
    erp.classList.remove("hidden");

    renderMenu();
    showPage("dashboard");
  });
}

/***********************
 MULTI LANGUAGE
***********************/
let lang = "KR";

const T = {
  KR:{ dashboard:"대시보드", employee:"직원", stock:"재고", order:"주문", shipment:"수출" },
  EN:{ dashboard:"Dashboard", employee:"Employee", stock:"Stock", order:"Order", shipment:"Shipment" },
  ID:{ dashboard:"Dasbor", employee:"Karyawan", stock:"Stok", order:"Pesanan", shipment:"Pengiriman" }
};

function setLanguage(l){
  lang=l;
  renderMenu();
  showPage("dashboard");
}

/***********************
 MENU
***********************/
function renderMenu(){
  sidebar.innerHTML="";
  const roleMap = {
    master:["dashboard","employee","stock","order","shipment"],
    sales:["dashboard","order","shipment"],
    production:["dashboard","stock"]
  };

  roleMap[currentUser.role].forEach(p=>{
    const b = document.createElement("button");
    b.innerText = T[lang][p];
    b.onclick = ()=>showPage(p);
    sidebar.appendChild(b);
  });
}

function toggleSidebar(){
  sidebar.classList.toggle("active");
}

/***********************
 PAGES
***********************/
function showPage(page){
  if(page==="dashboard"){
    content.innerHTML = `<h2>${T[lang].dashboard}</h2><p>Realtime Connected ✅</p>`;
  }

  if(page==="employee"){
    content.innerHTML = `
      <h2>${T[lang].employee}</h2>
      <div class="form-row">
        <input id="eId" placeholder="ID">
        <input id="ePw" placeholder="PW">
        <input id="eName" placeholder="NAME">
        <select id="eRole">
          <option value="master">MASTER</option>
          <option value="sales">SALES</option>
          <option value="production">PRODUCTION</option>
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

  if(page==="stock"){
    content.innerHTML = `
      <h2>${T[lang].stock}</h2>
      <div class="form-row">
        <input type="date" id="inDate">
        <input id="inVendor" placeholder="Vendor">
        <select id="inMethod"><option>SEA</option><option>AIR</option></select>
        <input id="sCode" placeholder="Code">
        <input id="sQty" type="number" placeholder="Qty">
        <button onclick="addStock()">입고</button>
      </div>
      <table>
        <thead><tr><th>Code</th><th>Qty</th></tr></thead>
        <tbody id="stockBody"></tbody>
      </table>
    `;
    loadStock();
  }

  if(page==="order"){
    content.innerHTML = `
      <h2>${T[lang].order}</h2>
      <div class="form-row">
        <input id="oNo" placeholder="Order No">
        <input id="oProduct" placeholder="Product">
        <input id="oQty" type="number" placeholder="Qty">
        <input id="oPrice" type="number" placeholder="Price">
        <input id="oDue" type="date">
        <button onclick="addOrder()">ADD</button>
      </div>
      <table>
        <thead><tr><th>No</th><th>Product</th><th>Qty</th></tr></thead>
        <tbody id="orderBody"></tbody>
      </table>
    `;
    loadOrders();
  }

  if(page==="shipment"){
    content.innerHTML = `
      <h2>${T[lang].shipment}</h2>
      <div class="form-row">
        <input id="shipNo" placeholder="Shipment No">
        <input id="shipBuyer" placeholder="Buyer">
        <input id="shipDate" type="date">
        <button onclick="saveShipment()">SAVE</button>
      </div>
    `;
  }
}

/***********************
 EMPLOYEE
***********************/
function addEmployee(){
  const emp = {
    id:eId.value, pw:ePw.value,
    name:eName.value, role:eRole.value
  };
  db.ref("employees").push(emp);
}

function loadEmployees(){
  db.ref("employees").on("value", snap=>{
    empBody.innerHTML="";
    const list = snap.val() || {};
    Object.values(list).forEach(e=>{
      empBody.innerHTML+=`<tr><td>${e.id}</td><td>${e.name}</td><td>${e.role}</td></tr>`;
    });
  });
}

/***********************
 STOCK
***********************/
function addStock(){
  const data = {
    date:inDate.value, vendor:inVendor.value,
    method:inMethod.value, code:sCode.value,
    qty:Number(sQty.value)
  };

  db.ref("stock").push({ code:data.code, qty:data.qty });
  db.ref("stock_log").push(data);
}

function loadStock(){
  db.ref("stock").on("value", snap=>{
    stockBody.innerHTML="";
    const list = snap.val() || {};
    Object.values(list).forEach(s=>{
      stockBody.innerHTML+=`<tr><td>${s.code}</td><td>${s.qty}</td></tr>`;
    });
  });
}

/***********************
 ORDER
***********************/
function addOrder(){
  const o = {
    orderNo:oNo.value, product:oProduct.value,
    qty:oQty.value, price:oPrice.value, due:oDue.value
  };
  db.ref("orders").push(o);
}

function loadOrders(){
  db.ref("orders").on("value", snap=>{
    orderBody.innerHTML="";
    const list = snap.val() || {};
    Object.values(list).forEach(o=>{
      orderBody.innerHTML+=`<tr><td>${o.orderNo}</td><td>${o.product}</td><td>${o.qty}</td></tr>`;
    });
  });
}

/***********************
 SHIPMENT
***********************/
function saveShipment(){
  alert("Shipment saved (step 1 complete)");
}
