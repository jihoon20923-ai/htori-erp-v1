/****************************************
 * HTORI ERP v2.0 - app.js
 * Full integrated single-file behavior
 ****************************************/

/* ========== Firebase init (same config you provided) ========== */
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

/* ========== Global state ========== */
window.lang = localStorage.getItem("htori_lang") || "EN";
let currentUser = null;
let editingEmployeeKey = null;

/* ========== DOM short-hands ========== */
const loginModal = document.getElementById("loginModal");
const loginId = document.getElementById("loginId");
const loginPw = document.getElementById("loginPw");
const loginBtn = document.getElementById("loginBtn");
const demoBtn = document.getElementById("demoBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userNameEl = document.getElementById("user-name");
const userRoleEl = document.getElementById("user-role");
const sidebarEl = document.getElementById("sidebar");
const menuList = document.getElementById("menuList");
const content = document.getElementById("content");
const hamburger = document.getElementById("hamburger");

/* ========== Ensure admin exists (once) ========== */
db.ref("employees").once("value").then(snap=>{
  if(!snap.exists()){
    db.ref("employees").push({ id:"admin", pw:"1234", name:"Master", role:"master", createdAt:new Date().toISOString() });
  }
});

/* ========== Login / session ========== */
loginBtn.addEventListener("click", login);
demoBtn.addEventListener("click", demoLogin);
logoutBtn.addEventListener("click", logout);

function login(){
  const id = loginId.value.trim();
  const pw = loginPw.value.trim();
  if(!id || !pw) return alert("Enter ID / PW");

  db.ref("employees").once("value").then(s=>{
    const list = s.val() || {};
    const found = Object.values(list).find(x => x.id===id && x.pw===pw);
    if(!found) return alert("LOGIN FAIL");
    currentUser = found;
    // store session (not secure — for demo)
    localStorage.setItem("htori_user", JSON.stringify({id:found.id, role:found.role, name:found.name}));
    enterSystem();
  });
}

function demoLogin(){
  currentUser = { id:"demo", name:"Demo User", role:"viewer" };
  localStorage.setItem("htori_user", JSON.stringify(currentUser));
  enterSystem();
}

function logout(){
  localStorage.removeItem("htori_user");
  location.reload();
}

function enterSystem(){
  // hide login modal
  loginModal.classList.add("hidden");
  // populate header
  userNameEl.textContent = currentUser.name || currentUser.id || "Guest";
  userRoleEl.textContent = currentUser.role || "viewer";
  logoutBtn.classList.remove("hidden");

  // render menu + default page (order)
  renderMenu();
  const savedMenu = localStorage.getItem("htori_last_page") || "dashboard";
  showPage(savedMenu);
}

/* Restore session if present */
(function restoreSession(){
  const s = localStorage.getItem("htori_user");
  if(s){
    currentUser = JSON.parse(s);
    enterSystem();
  } else {
    // show login modal
    loginModal.classList.remove("hidden");
    document.querySelector(".layout").classList.remove("hidden"); // layout should be visible for sidebar JS
  }
})();

/* ========== Language buttons ========== */
document.querySelectorAll(".lang-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    window.lang = btn.dataset.lang;
    localStorage.setItem("htori_lang", window.lang);
    renderMenu();
    translateAll();
  });
});

/* ========== Hamburger for mobile ========== */
hamburger.addEventListener("click", ()=>{
  document.querySelector(".sidebar").classList.toggle("active");
});

/* ========== Menu configuration (ordering per your flow) ========== */
const DEFAULT_MENU = ["dashboard","order","mrp","receiving","stock","production","outsource","shipment","cost","employees","settings"];

function getMenuOrder(){
  const s = localStorage.getItem("htori_menu_order");
  if(!s) return DEFAULT_MENU;
  try { return s.split(",").map(x=>x.trim()).filter(x=>x); } catch(e) { return DEFAULT_MENU; }
}

/* renderMenu uses t() from lang.js to translate keys */
function renderMenu(){
  menuList.innerHTML = "";
  const order = getMenuOrder();
  order.forEach(key=>{
    const li = document.createElement("li");
    li.className = "menu-item";
    li.dataset.page = key;
    li.dataset.menuKey = key;
    li.textContent = t("menu."+key) || key;
    li.addEventListener("click", ()=> showPage(key));
    menuList.appendChild(li);
  });
}

/* ========== Router: showPage ========== */
function showPage(page){
  localStorage.setItem("htori_last_page", page);
  // ensure layout visible
  document.querySelector(".layout").classList.remove("hidden");

  // reset content, then inject template or build dynamically
  content.innerHTML = "";

  switch(page){
    case "dashboard":
      content.innerHTML = document.getElementById("tpl-dashboard").innerHTML;
      break;

    case "order":
      content.innerHTML = document.getElementById("tpl-order").innerHTML;
      bindOrder();
      break;

    case "mrp":
      content.innerHTML = document.getElementById("tpl-mrp").innerHTML;
      bindMRP();
      break;

    case "receiving":
      content.innerHTML = document.getElementById("tpl-receiving").innerHTML;
      bindReceiving();
      break;

    case "stock":
      content.innerHTML = document.getElementById("tpl-stock").innerHTML;
      bindStock();
      break;

    case "production":
      content.innerHTML = document.getElementById("tpl-production").innerHTML;
      bindProduction();
      break;

    case "outsource":
      content.innerHTML = document.getElementById("tpl-outsource").innerHTML;
      bindOutsource();
      break;

    case "shipment":
      content.innerHTML = document.getElementById("tpl-shipment").innerHTML;
      bindShipment();
      break;

    case "cost":
      content.innerHTML = document.getElementById("tpl-cost").innerHTML;
      bindCost();
      break;

    case "employees":
      content.innerHTML = document.getElementById("tpl-employees").innerHTML;
      renderEmployees(); // employee-specific render
      break;

    case "settings":
      content.innerHTML = document.getElementById("tpl-settings").innerHTML;
      bindSettings();
      break;

    default:
      content.innerHTML = `<h3>Unknown page: ${page}</h3>`;
  }

  // run translations and placeholder applier
  setTimeout(()=>{ translateAll(); applyUniversalPlaceholders(); }, 80);
}

/* ========== Placeholder system (simple/clean) ========== */
function applyUniversalPlaceholders(){
  document.querySelectorAll("input, textarea, select").forEach(el=>{
    if(el.dataset.placeholderApplied) return;
    const id = (el.id || "").toLowerCase();
    const name = (el.name || "").toLowerCase();
    const key = id + " " + name;

    if(key.includes("code")) el.placeholder = "EX: VC100-M001";
    if(key.includes("name") && !key.includes("username")) el.placeholder = "EX: Plastic Case";
    if(key.includes("qty") || key.includes("quantity")) el.placeholder = "EX: 1200";
    if(key.includes("price") || key.includes("cost")) el.placeholder = "EX: 0.021";
    if(key.includes("safety") || key.includes("minqty")) el.placeholder = "EX: 500";
    if(key.includes("hour") || key.includes("perhour")) el.placeholder = "EX: 300";
    if(key.includes("vendor") || key.includes("supplier")) el.placeholder = "EX: VD-001";
    if(el.type === "date") el.placeholder = "EX: 2025-01-31";
    if(key.includes("bank")) el.placeholder = "EX: BCA / BNI";
    if(key.includes("account")) el.placeholder = "EX: 1234567890";
    if(key.includes("tax")) el.placeholder = "EX: 12.345.678.9-012.345";
    if(key.includes("memo")) el.placeholder = "EX: Note...";

    el.dataset.placeholderApplied = "1";
  });
}

/* ========== Translation helper ========== */
function translateAll(){
  // translate menu text
  document.querySelectorAll("#menuList li").forEach(li=>{
    const key = li.dataset.menuKey;
    if(key) li.textContent = t("menu."+key);
  });

  // translate elements with data-i18n
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const k = el.getAttribute("data-i18n");
    el.textContent = t(k);
  });

  // translate select placeholders / buttons in employees if present
  const empTitle = document.getElementById("empFormTitle");
  if(empTitle) empTitle.textContent = t("employees.title") || empTitle.textContent;
}

/* ========== Orders (simple list + add) ========== */
function bindOrder(){
  document.getElementById("oAddBtn").addEventListener("click", ()=>{
    const orderNo = document.getElementById("oNo").value.trim();
    const customer = document.getElementById("oCustomer").value.trim();
    const due = document.getElementById("oDue").value || new Date().toISOString().slice(0,10);
    if(!orderNo) return alert("Order No required");
    db.ref("orders").push({ orderNo, customer, due, createdAt:new Date().toISOString() });
    document.getElementById("oNo").value = "";
    loadOrders();
  });

  loadOrders();
}

function loadOrders(){
  const body = document.getElementById("orderBody");
  if(!body) return;
  db.ref("orders").on("value", snap=>{
    const data = snap.val() || {};
    body.innerHTML = "";
    Object.values(data).forEach(o=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${o.orderNo||""}</td><td>${o.product||"-"}</td><td>${o.qty||""}</td><td>${o.price||""}</td><td>${o.due||""}</td>
        <td><button onclick="showOrder('${o.orderNo || ""}')">View</button></td>`;
      body.appendChild(tr);
    });
  });
}

function showOrder(no){ alert("Order: "+no); }

/* ========== MRP (simple BOM-driven) ========== */
/* Data assumptions:
   - BOMs stored at /boms as objects {productCode: '', items: [{matCode:'', qty:1}, ...]}
   - Materials at /materials with qty on-hand
   - Orders are used to compute required FG and materials
*/
function bindMRP(){
  document.getElementById("mrpRunBtn").addEventListener("click", runMRP);
  loadMRPTable([]);
}

function runMRP(){
  // compute material requirements from orders and boms (simple)
  Promise.all([db.ref("orders").once("value"), db.ref("boms").once("value"), db.ref("materials").once("value")]).then(arr=>{
    const orders = arr[0].val() || {};
    const boms = arr[1].val() || {};
    const mats = arr[2].val() || {};

    // aggregate FG requirements by product (very simple: orders contain product & qty)
    const fgReq = {};
    Object.values(orders).forEach(o=>{
      if(!o.product || !o.qty) return;
      fgReq[o.product] = (fgReq[o.product]||0) + Number(o.qty);
    });

    // expand via BOM
    const matReq = {};
    Object.keys(fgReq).forEach(p=>{
      const bomList = Object.values(boms).filter(b=>b.productCode===p);
      // if multiple BOM entries exist, sum their items
      bomList.forEach(b=>{
        (b.items||[]).forEach(it=>{
          matReq[it.matCode] = (matReq[it.matCode]||0) + (Number(it.qty) * fgReq[p]);
        });
      });
    });

    // build table rows
    const rows = Object.keys(matReq).map(code=>{
      const onhand = Object.values(mats).find(m=>m.code===code);
      return { code, required: matReq[code], onHand: onhand ? onhand.qty : 0, toBuy: Math.max(0, matReq[code] - (onhand?onhand.qty:0))};
    });

    loadMRPTable(rows);
  });
}

function loadMRPTable(rows){
  const body = document.getElementById("mrpBody");
  if(!body) return;
  body.innerHTML = "";
  (rows || []).forEach(r=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${r.code}</td><td>${r.required}</td><td>${r.onHand}</td><td>${r.toBuy}</td>`;
    body.appendChild(tr);
  });
}

/* ========== Receiving -> Stock logic ========== */
function bindReceiving(){
  document.getElementById("recSaveBtn").addEventListener("click", ()=>{
    const date = document.getElementById("recDate").value || new Date().toISOString().slice(0,10);
    const vendor = document.getElementById("recVendor").value.trim();
    const method = document.getElementById("recMethod").value;
    const code = document.getElementById("recCode").value.trim();
    const qty = Number(document.getElementById("recQty").value || 0);
    if(!code || !qty) return alert("Code & Qty required");

    // push receiving log
    db.ref("receiving").push({ date, vendor, method, code, qty, createdAt:new Date().toISOString() });

    // update stock: find material by code or push new
    db.ref("materials").once("value").then(snap=>{
      const mats = snap.val() || {};
      const foundKey = Object.keys(mats).find(k => mats[k].code === code);
      if(foundKey){
        const cur = mats[foundKey];
        db.ref("materials/"+foundKey).update({ qty: Number(cur.qty || 0) + qty, lastUpdate: new Date().toISOString() });
      } else {
        db.ref("materials").push({ code, name: code, qty: qty, createdAt:new Date().toISOString() });
      }
      loadReceivingLog();
      loadStock();
    });
  });

  loadReceivingLog();
}

function loadReceivingLog(){
  const body = document.getElementById("receivingBody");
  if(!body) return;
  db.ref("receiving").on("value", snap=>{
    const list = snap.val() || {};
    body.innerHTML = "";
    Object.values(list).forEach(l=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${l.date}</td><td>${l.vendor}</td><td>${l.method}</td><td>${l.code}</td><td>${l.qty}</td>`;
      body.appendChild(tr);
    });
  });
}

/* ========== Stock management ========== */
function bindStock(){
  loadStock();
  document.getElementById("stockExportBtn").addEventListener("click", downloadStockCSV);
  document.getElementById("stockFilter").addEventListener("input", ()=>{
    loadStock(document.getElementById("stockFilter").value);
  });
}

function loadStock(filter){
  const body = document.getElementById("stockBody");
  if(!body) return;
  db.ref("materials").on("value", snap=>{
    const list = snap.val() || {};
    body.innerHTML = "";
    Object.values(list).forEach(m=>{
      if(filter && !(m.code && m.code.includes(filter)) && !(m.name && m.name.includes(filter))) return;
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${m.code}</td><td>${m.name}</td><td>${m.qty || 0}</td><td>${m.lastUpdate || m.createdAt || ""}</td>`;
      body.appendChild(tr);
    });
  });
}

function downloadStockCSV(){
  db.ref("materials").once("value").then(snap=>{
    const list = snap.val() || {};
    let csv = "Code,Name,Qty\n";
    Object.values(list).forEach(m=> csv += `${m.code || ""},${m.name || ""},${m.qty || 0}\n`);
    const blob = new Blob([csv],{type:'text/csv'});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "stock.csv"; a.click();
  });
}

/* ========== Production ========== */
function bindProduction(){
  document.getElementById("prodStartBtn").addEventListener("click", ()=>{
    const product = document.getElementById("prodProduct").value.trim();
    const qty = Number(document.getElementById("prodQty").value || 0);
    const process = document.getElementById("prodProcess").value.trim();
    if(!product || !qty) return alert("Product & Qty required");

    // consume BOM materials
    db.ref("boms").once("value").then(snap=>{
      const boms = snap.val() || {};
      const bomEntries = Object.values(boms).filter(b=>b.productCode===product);
      if(bomEntries.length === 0){
        // produce FG directly (no BOM)
        produceFG(product, qty, process);
        return;
      }

      // For each BOM, attempt to deduct
      db.ref("materials").once("value").then(msnap=>{
        const mats = msnap.val() || {};
        const matsArr = Object.entries(mats).map(([k,v])=> ({key:k, ...v}));

        // check availability for first matching BOM
        const bom = bomEntries[0];
        let shortage = false;
        bom.items.forEach(it=>{
          const mat = matsArr.find(m=>m.code===it.matCode);
          const need = Number(it.qty) * qty;
          if(!mat || Number(mat.qty || 0) < need) shortage = true;
        });
        if(shortage) return alert("Material shortage - cannot produce");

        // Deduct materials
        bom.items.forEach(it=>{
          const matEntry = matsArr.find(m=>m.code===it.matCode);
          const newQty = Number(matEntry.qty) - (Number(it.qty) * qty);
          db.ref("materials/"+matEntry.key).update({ qty: newQty, lastUpdate: new Date().toISOString() });
        });

        // add FG to materials as product code
        produceFG(product, qty, process);
      });
    });
  });

  loadProductionLog();
}

function produceFG(product, qty, process){
  // add as material if exists; otherwise push as finished product material
  db.ref("materials").once("value").then(snap=>{
    const mats = snap.val() || {};
    const foundKey = Object.keys(mats).find(k=>mats[k].code === product);
    if(foundKey){
      const cur = mats[foundKey];
      db.ref("materials/"+foundKey).update({ qty: Number(cur.qty||0) + qty, lastUpdate: new Date().toISOString() });
    } else {
      db.ref("materials").push({ code: product, name: product, qty: qty, createdAt: new Date().toISOString() });
    }
    // add production log
    db.ref("production").push({ date: new Date().toISOString(), product, qty, process });
    loadProductionLog();
    loadStock();
    alert("Production registered");
  });
}

function loadProductionLog(){
  const body = document.getElementById("prodBody");
  if(!body) return;
  db.ref("production").on("value", snap=>{
    const data = snap.val() || {};
    body.innerHTML = "";
    Object.values(data).forEach(p=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${(p.date||"").slice(0,10)}</td><td>${p.product}</td><td>${p.qty}</td><td>${p.process||""}</td>`;
      body.appendChild(tr);
    });
  });
}

/* ========== Outsource ========== */
function bindOutsource(){
  document.getElementById("outSendBtn").addEventListener("click", ()=>{
    const prod = document.getElementById("outProd").value.trim();
    const qty = Number(document.getElementById("outQty").value || 0);
    const vendor = document.getElementById("outVendor").value.trim();
    const price = Number(document.getElementById("outPrice").value || 0);
    if(!prod || !qty || !vendor) return alert("Prod/Qty/Vendor required");

    db.ref("outsourcing").push({ product:prod, qty, vendor, price, status:"OUT", createdAt:new Date().toISOString() });
    loadOutsource();
  });

  loadOutsource();
}

function loadOutsource(){
  const body = document.getElementById("outBody");
  if(!body) return;
  db.ref("outsourcing").on("value", snap=>{
    const data = snap.val() || {};
    body.innerHTML = "";
    Object.values(data).forEach(o=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${o.product}</td><td>${o.qty}</td><td>${o.vendor}</td><td>${o.status}</td>`;
      body.appendChild(tr);
    });
  });
}

/* ========== Shipment ========== */
function bindShipment(){
  document.getElementById("shipAddBtn").addEventListener("click", ()=>{
    const shipNo = document.getElementById("shipNo").value.trim();
    const buyer = document.getElementById("shipBuyer").value.trim();
    const shipDate = document.getElementById("shipDate").value || new Date().toISOString().slice(0,10);
    if(!shipNo || !buyer) return alert("Ship No & Buyer required");

    db.ref("shipments").push({ shipNo, buyer, shipDate, createdAt:new Date().toISOString() });
    loadShipments();
  });

  loadShipments();
}

function loadShipments(){
  const body = document.getElementById("shipBody");
  if(!body) return;
  db.ref("shipments").on("value", snap=>{
    const data = snap.val() || {};
    body.innerHTML = "";
    Object.values(data).forEach(s=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${s.shipNo}</td><td>${s.buyer}</td><td>${s.shipDate}</td><td>-</td>`;
      body.appendChild(tr);
    });
  });
}

/* ========== Cost calc ========== */
function bindCost(){
  document.getElementById("costCalcBtn").addEventListener("click", ()=>{
    const rent = Number(document.getElementById("costRent").value || 0);
    const cont = Number(document.getElementById("costContainer").value || 0);
    const tax = Number(document.getElementById("costTax").value || 0);
    const total = rent + cont + tax;
    document.getElementById("costResult").textContent = `Total overhead: ${total}`;
  });
}

/* ========== Employees (View + Edit + Delete) ========== */
function renderEmployees(){
  // form bindings
  document.getElementById("empSaveBtn").addEventListener("click", saveEmployee);
  document.getElementById("empCancelBtn").addEventListener("click", resetEmployeeForm);

  loadEmployeeList();
  applyUniversalPlaceholders();
}

function loadEmployeeList(){
  const tbody = document.getElementById("empTableBody");
  if(!tbody) return;
  db.ref("employees").on("value", snap=>{
    const data = snap.val() || {};
    tbody.innerHTML = "";
    Object.entries(data).forEach(([key, emp])=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${emp.id||""}</td>
        <td>${emp.name||""}</td>
        <td>${emp.role||""}</td>
        <td>${emp.bankName||""}</td>
        <td>${emp.bankAccount||""}</td>
        <td>${emp.taxNumber||""}</td>
        <td>
          <button class="btn" onclick="viewEmployee('${key}')">View</button>
          <button class="btn" onclick="editEmployee('${key}')">Edit</button>
          <button class="btn" onclick="deleteEmployee('${key}')" ${currentUser && currentUser.role === "master" ? "" : 'style="display:none"'}>Delete</button>
        </td>`;
      tbody.appendChild(tr);
    });

    if(Object.keys(data).length === 0) tbody.innerHTML = `<tr><td colspan="7" class="muted center">${t("notice.no_employees") || "No employees"}</td></tr>`;
  });
}

function populateEmployeeForm(emp){
  document.getElementById("empId").value = emp.id || "";
  document.getElementById("empName").value = emp.name || "";
  document.getElementById("empRole").value = emp.role || "production";
  document.getElementById("empType").value = emp.type || "PKWT";
  document.getElementById("basicSalary").value = emp.basicSalary || "";
  document.getElementById("hourRate").value = emp.hourRate || "";
  document.getElementById("pieceRate").value = emp.pieceRate || "";
  document.getElementById("empProbation").checked = !!emp.probation;
  document.getElementById("bankName").value = emp.bankName || "";
  document.getElementById("bankAccount").value = emp.bankAccount || "";
  document.getElementById("accountHolder").value = emp.accountHolder || "";
  document.getElementById("taxNumber").value = emp.taxNumber || "";
  document.getElementById("empMemo").value = emp.memo || "";
}

function resetEmployeeForm(){
  if(!document.getElementById("empId")) return;
  document.getElementById("empId").value = "";
  document.getElementById("empName").value = "";
  document.getElementById("empRole").value = "production";
  document.getElementById("empType").value = "PKWT";
  document.getElementById("basicSalary").value = "";
  document.getElementById("hourRate").value = "";
  document.getElementById("pieceRate").value = "";
  document.getElementById("empProbation").checked = false;
  document.getElementById("bankName").value = "";
  document.getElementById("bankAccount").value = "";
  document.getElementById("accountHolder").value = "";
  document.getElementById("taxNumber").value = "";
  document.getElementById("empMemo").value = "";
  editingEmployeeKey = null;
  document.getElementById("empFormTitle").textContent = t("employees.form.title_add") || "Add / Edit Employee";
}

function saveEmployee(){
  const payload = {
    id: (document.getElementById("empId").value||"").trim(),
    name: (document.getElementById("empName").value||"").trim(),
    role: document.getElementById("empRole").value,
    type: document.getElementById("empType").value,
    basicSalary: Number(document.getElementById("basicSalary").value || 0),
    hourRate: Number(document.getElementById("hourRate").value || 0),
    pieceRate: Number(document.getElementById("pieceRate").value || 0),
    probation: document.getElementById("empProbation").checked,
    bankName: (document.getElementById("bankName").value||"").trim(),
    bankAccount: (document.getElementById("bankAccount").value||"").trim(),
    accountHolder: (document.getElementById("accountHolder").value||"").trim(),
    taxNumber: (document.getElementById("taxNumber").value||"").trim(),
    memo: (document.getElementById("empMemo").value||"").trim(),
    updatedAt: new Date().toISOString()
  };

  if(!payload.id || !payload.name) return alert("Employee ID and Name required");

  if(editingEmployeeKey){
    db.ref("employees/"+editingEmployeeKey).update(payload).then(()=>{ alert("Updated"); resetEmployeeForm(); });
  } else {
    payload.createdAt = new Date().toISOString();
    db.ref("employees").push(payload).then(()=>{ alert("Saved"); resetEmployeeForm(); });
  }
}

function viewEmployee(key){
  db.ref("employees/"+key).once("value").then(snap=>{
    const emp = snap.val();
    if(!emp) return alert("Not found");
    populateEmployeeForm(emp);
    // disable form
    Array.from(document.querySelectorAll("#empId,#empName,#empRole,#empType,#basicSalary,#hourRate,#pieceRate,#empProbation,#bankName,#bankAccount,#accountHolder,#taxNumber,#empMemo")).forEach(i=>i.disabled=true);
    document.getElementById("empSaveBtn").style.display = "none";
    document.getElementById("empCancelBtn").textContent = "Close";
    editingEmployeeKey = null;
  });
}

function editEmployee(key){
  db.ref("employees/"+key).once("value").then(snap=>{
    const emp = snap.val();
    if(!emp) return alert("Not found");
    populateEmployeeForm(emp);
    Array.from(document.querySelectorAll("#empId,#empName,#empRole,#empType,#basicSalary,#hourRate,#pieceRate,#empProbation,#bankName,#bankAccount,#accountHolder,#taxNumber,#empMemo")).forEach(i=>i.disabled=false);
    document.getElementById("empSaveBtn").style.display = "inline-block";
    document.getElementById("empCancelBtn").textContent = "Cancel";
    editingEmployeeKey = key;
    document.getElementById("empFormTitle").textContent = t("employees.form.title_edit") || "Edit Employee";
  });
}

function deleteEmployee(key){
  if(!(currentUser && currentUser.role === "master")) return alert("No permission");
  if(!confirm("Delete employee?")) return;
  db.ref("employees/"+key).remove().then(()=> alert("Deleted"));
}

/* ========== Excel upload (generic + materials preview) ========== */
function handleExcelUploadFile(file, callback){
  const reader = new FileReader();
  reader.onload = function(e){
    const data = new Uint8Array(e.target.result);
    const wb = XLSX.read(data, {type:"array"});
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, {defval:""});
    if(callback) callback(rows);
  };
  reader.readAsArrayBuffer(file);
}

/* Option: handle excel upload via the excel page in settings (simple) */
function uploadExcelSheet(file){
  handleExcelUploadFile(file, (rows)=>{
    // push to firebase generic node
    db.ref("excelUpload").push({ uploadedAt:new Date().toISOString(), rows });
    alert("Excel uploaded to excelUpload node");
  });
}

/* ========== Settings bindings ========== */
function bindSettings(){
  // populate defaults
  document.getElementById("settingDefaultLang").value = localStorage.getItem("htori_lang") || window.lang;
  document.getElementById("settingMenuOrder").value = getMenuOrder().join(",");

  document.getElementById("saveSettingsBtn").addEventListener("click", ()=>{
    const langSel = document.getElementById("settingDefaultLang").value;
    const menuOrder = document.getElementById("settingMenuOrder").value;
    localStorage.setItem("htori_lang", langSel);
    window.lang = langSel;
    localStorage.setItem("htori_menu_order", menuOrder);
    renderMenu();
    translateAll();
    alert("Settings saved");
  });

  document.getElementById("resetDataBtn").addEventListener("click", ()=>{
    if(!confirm("Reset demo data? This only clears Firebase nodes in this example.")) return;
    db.ref().set({ employees: { demo: {id:'admin', pw:'1234', name:'Master', role:'master'} } });
    alert("Reset done (demo)");
    location.reload();
  });
}

/* ========== Utility: simple CSV download ========== */
function downloadCSV(content, filename){
  const blob = new Blob([content], {type:'text/csv'});
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
}

/* ========== Initial render of menu if session exists ========== */
if(currentUser){
  renderMenu();
  translateAll();
}

/* ========== Ensure translate + placeholders run periodically for dynamic content ========== */
setInterval(()=>{ applyUniversalPlaceholders(); translateAll(); }, 600);
