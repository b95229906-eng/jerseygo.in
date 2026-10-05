const products = [
{id:1,name:"Real Madrid Home Jersey",team:"Real Madrid",price:999,emoji:"⚪"},
{id:2,name:"Barcelona Home Jersey",team:"Barcelona",price:899,emoji:"🔵"},
{id:3,name:"Portugal National Jersey",team:"Portugal",price:999,emoji:"🇵🇹"},
{id:4,name:"Brazil Home Jersey",team:"Brazil",price:899,emoji:"🇧🇷"},
{id:5,name:"Italy National Jersey",team:"Italy",price:899,emoji:"🇮🇹"},
{id:6,name:"Manchester United Jersey",team:"Manchester United",price:999,emoji:"🔴"},
{id:7,name:"Real Madrid Away Jersey",team:"Real Madrid",price:999,emoji:"⚽"},
{id:8,name:"Barcelona Away Jersey",team:"Barcelona",price:899,emoji:"🔵"}
];

let cart = JSON.parse(localStorage.getItem("jerseygo_cart") || "[]");

function money(n){return "₹"+n.toLocaleString("en-IN")}
function save(){localStorage.setItem("jerseygo_cart",JSON.stringify(cart));updateCartCount()}
function updateCartCount(){document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0)}
function renderProducts(){
 const q=document.getElementById("search").value.toLowerCase();
 const cat=document.getElementById("category").value;
 const list=products.filter(p=>(cat==="all"||p.team===cat)&&(!q||p.name.toLowerCase().includes(q)||p.team.toLowerCase().includes(q)));
 document.getElementById("products").innerHTML=list.map(p=>`
 <article class="product">
  <div class="product-img">${p.emoji}</div>
  <div class="product-body">
   <p class="product-title">${p.name}</p><p class="product-meta">${p.team} • Multiple sizes</p>
   <div class="price">${money(p.price)}</div>
   <div class="product-actions"><select class="size" id="size-${p.id}"><option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option></select><button class="add" onclick="addToCart(${p.id})">Add</button></div>
  </div>
 </article>`).join("") || `<div class="empty">No jerseys found.</div>`;
}
function addToCart(id){
 const p=products.find(x=>x.id===id), size=document.getElementById("size-"+id).value;
 const existing=cart.find(x=>x.id===id&&x.size===size);
 if(existing) existing.qty++; else cart.push({id:p.id,size,qty:1});
 save();showToast("Added to cart");renderCart();
}
function changeQty(i,d){cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);save();renderCart()}
function renderCart(){
 const box=document.getElementById("cartItems");
 if(!cart.length){box.innerHTML='<div class="empty">Your cart is empty.</div>';document.getElementById("cartTotal").textContent="₹0";return}
 let total=0;
 box.innerHTML=cart.map((x,i)=>{const p=products.find(p=>p.id===x.id);total+=p.price*x.qty;return `
 <div class="cart-row"><div class="cart-thumb">${p.emoji}</div><div><h4>${p.name}</h4><small>${x.size} • ${money(p.price)}</small><div class="qty"><button onclick="changeQty(${i},-1)">−</button><span>${x.qty}</span><button onclick="changeQty(${i},1)">+</button></div></div><b>${money(p.price*x.qty)}</b></div>`}).join("");
 document.getElementById("cartTotal").textContent=money(total);
}
function openCart(){renderCart();document.getElementById("overlay").classList.add("open")}
function closeCart(e){if(!e||e.target===document.getElementById("overlay"))document.getElementById("overlay").classList.remove("open")}
function openCheckout(){
 if(!cart.length){showToast("Add a product first");return}
 document.getElementById("overlay").classList.remove("open");
 let total=0;
 document.getElementById("orderSummary").innerHTML=cart.map(x=>{const p=products.find(p=>p.id===x.id);total+=p.price*x.qty;return `${x.qty} × ${p.name} (${x.size}) — ${money(p.price*x.qty)}`}).join("<br>")+`<hr><b>Total: ${money(total)}</b>`;
 document.getElementById("checkout").classList.add("open");
}
function closeCheckout(){document.getElementById("checkout").classList.remove("open")}
function submitOrder(e){
 e.preventDefault();
 const name=document.getElementById("customerName").value,phone=document.getElementById("customerPhone").value,address=document.getElementById("customerAddress").value;
 const order={orderId:"JG"+Date.now().toString().slice(-6),name,phone,address,notes:document.getElementById("customerNotes").value,items:cart};
 console.log("ORDER FOR BACKEND:",order);
 alert("Order form completed! For a real store, connect this form to a backend/order database before launch.");
}
function showToast(t){const el=document.getElementById("toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),1800)}
updateCartCount();renderProducts();renderCart();
