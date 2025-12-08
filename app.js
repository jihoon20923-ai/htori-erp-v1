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

/* ✅ ADMIN 자동 생성 */
db.ref("employees").once("value").then(s=>{
  if(!s.exists()){
    db.ref("employees").push({id:"admin",pw:"1234",name:"Master",role:"master"});
  }
});

/* ✅ 기본 영어 */
let lang="EN";

/* ✅ 자동 로그인 */
let currentUser=null;
window.onload=()=>{
  const saved=localStorage.getItem("htori_user");
  if(saved){
    currentUser=JSON.parse(saved);
    loginBox.classList.add("hidden");
    erp.classList.remove("hidden");
    renderMenu();
    showPage("dashboard");
  }
};

/* ✅ LOGIN */
function login(){
  db.ref("employees").once("value").then(s=>{
    const found=Object.values(s.val()||{}).find(x=>x.id===loginId.value&&x.pw===loginPw.value);
    if(!found) return alert("LOGIN FAIL");

    currentUser=found;
    localStorage.setItem("htori_user",JSON.stringify(found));
    loginBox.classList.add("hidden");
    erp.classList.remove("hidden");
    renderMenu();
    showPage("dashboard");
  });
}

/* ✅ LANGUAGE */
const T={
  EN:{dashboard:"Dashboard",employee:"Employee",stock:"Stock",order:"Order",shipment:"Shipment"},
  KR:{dashboard:"대시보드",employee:"직원",stock:"재고",order:"주문",shipment:"수출"},
  ID:{dashboard:"Dasbor",employee:"Karyawan",stock:"Stok",order:"Pesanan",shipment:"Pengiriman"}
};

function setLanguage(l){
  lang=l;
  renderMenu();
  showPage("dashboard");
}

/* ✅ MENU */
function renderMenu(){
  sidebar.innerHTML="";
  ["dashboard","employee","stock","order","shipment"].forEach(p=>{
    const b=document.createElement("button");
    b.innerText=T[lang][p];
    b.onclick=()=>showPage(p);
    sidebar.appendChild(b);
  });
}
function toggleSidebar(){ sidebar.classList.toggle("active"); }

/* ✅ PAGES */
function showPage(p){
  if(p==="dashboard"){
    content.innerHTML=`<h2>${T[lang].dashboard}</h2>
    <table><tr><th>Status</th><th>System</th></tr>
    <tr><td>Realtime</td><td>Connected ✅</td></tr></table>`;
  }

  if(p==="employee"){
    content.innerHTML=`
    <h2>${T[lang].employee}</h2>
    <div class="form-row">
      <input id="eId"><input id="ePw"><input id="eName">
      <select id="eRole"><option>master</option><option>sales</option></select>
      <button onclick="addEmployee()">ADD</button>
    </div>
    <table><thead><tr><th>ID</th><th>Name</th><th>Role</th></tr></thead>
    <tbody id="empBody"></tbody></table>`;
    db.ref("employees").on("value",s=>{
      empBody.innerHTML="";
      Object.values(s.val()||{}).forEach(e=>{
        empBody.innerHTML+=`<tr><td>${e.id}</td><td>${e.name}</td><td>${e.role}</td></tr>`;
      });
    });
  }

  if(p==="stock"){
    content.innerHTML=`
    <h2>${T[lang].stock}</h2>
    <div class="form-row">
      <input id="sCode"><input id="sQty" type="number">
      <button onclick="db.ref('stock').push({code:sCode.value,qty:+sQty.value})">ADD</button>
    </div>
    <table><thead><tr><th>Code</th><th>Qty</th></tr></thead>
    <tbody id="stockBody"></tbody></table>`;
    db.ref("stock").on("value",s=>{
      stockBody.innerHTML="";
      Object.values(s.val()||{}).forEach(i=>{
        stockBody.innerHTML+=`<tr><td>${i.code}</td><td>${i.qty}</td></tr>`;
      });
    });
  }

  if(p==="order"){
    content.innerHTML=`
    <h2>${T[lang].order}</h2>
    <div class="form-row">
      <input id="oNo"><input id="oProduct"><input id="oQty" type="number">
      <button onclick="db.ref('orders').push({orderNo:oNo.value,product:oProduct.value,qty:oQty.value})">ADD</button>
    </div>
    <table><thead><tr><th>No</th><th>Product</th><th>Qty</th></tr></thead>
    <tbody id="orderBody"></tbody></table>`;
    db.ref("orders").on("value",s=>{
      orderBody.innerHTML="";
      Object.values(s.val()||{}).forEach(o=>{
        orderBody.innerHTML+=`<tr><td>${o.orderNo}</td><td>${o.product}</td><td>${o.qty}</td></tr>`;
      });
    });
  }

  if(p==="shipment"){
    content.innerHTML=`
    <h2>${T[lang].shipment}</h2>
    <div class="form-row">
      <input id="shipNo"><input id="shipBuyer">
      <button onclick="db.ref('shipments').push({shipNo:shipNo.value,buyer:shipBuyer.value})">SAVE</button>
    </div>
    <table><thead><tr><th>No</th><th>Buyer</th></tr></thead>
    <tbody id="shipBody"></tbody></table>`;
    db.ref("shipments").on("value",s=>{
      shipBody.innerHTML="";
      Object.values(s.val()||{}).forEach(o=>{
        shipBody.innerHTML+=`<tr><td>${o.shipNo}</td><td>${o.buyer}</td></tr>`;
      });
    });
  }
}
