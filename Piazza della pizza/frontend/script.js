const order = {
  size: '',
  type: '',
  toppings: [],
  name: '',
  phone: '',
  address: ''
};

const prices = { M: 500, L: 1000, XL: 1500, XXL: 2000 };
const toppingPriceEach = 50;

const toppingList = [
  'Tomato sauce', 'Mozzarella', 'Edam', 'Camembert', 'Cheddar',
  'Chicken', 'Tuna', 'Beef', 'Pepperoni','Olive', 'Onion', 
  'Corn', 'Mushrooms', 'Bell pepper', 'Chilli pepper','Basil' ];

// Topping
function buildToppings() {
  const grid = document.getElementById('toppingGrid');
  grid.innerHTML = '';

  toppingList.forEach(t => {
    const btn = document.createElement('div');
    btn.className = 'topping-btn' + (order.toppings.includes(t) ? ' selected' : '');
    btn.innerHTML = `<span class="topping-check">${order.toppings.includes(t) ? '✓' : ''}</span>${t}`;
    btn.addEventListener('click', () => toggleTopping(t, btn));
    grid.appendChild(btn);
  });
}

function toggleTopping(t, el) {
  const idx = order.toppings.indexOf(t);
  if (idx === -1) {
    order.toppings.push(t);
    el.classList.add('selected');
    el.querySelector('.topping-check').textContent = '';
  } else {
    order.toppings.splice(idx, 1);
    el.classList.remove('selected');
    el.querySelector('.topping-check').textContent = '';
  }
}

// Size & Type selection
function selectSize(s, el) {
  order.size = s;
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  checkNext1();
}

function selectType(t, el) {
  order.type = t;
  document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  checkNext1();
}

function checkNext1() {
  document.getElementById('next1').disabled = !(order.size && order.type);
}

//Navigation
function goTo(n) {
  if (n === 3) {
    order.name    = document.getElementById('fname').value.trim();
    order.phone   = document.getElementById('fphone').value.trim();
    order.address = document.getElementById('faddr').value.trim();
  }

  if (n === 4) {
    order.name    = document.getElementById('fname').value.trim();
    order.phone   = document.getElementById('fphone').value.trim();
    order.address = document.getElementById('faddr').value.trim();

    let ok = true;
    const showErr = (id, show) => document.getElementById(id).classList.toggle('show', show);

    showErr('errName', !order.name);
    if (!order.name) ok = false;

    const phoneDigits = order.phone.replace(/\D/g, '');
    showErr('errPhone', phoneDigits.length < 9);
    if (phoneDigits.length < 9) ok = false;

    showErr('errAddr', !order.address);
    if (!order.address) ok = false;

    if (!ok) return;
    buildSummary();
  }

  if (n === 2) buildToppings();

  for (let i = 1; i <= 5; i++) {
    document.getElementById('page' + i).style.display = (i === n) ? '' : 'none';
  }

  updateStepBar(n);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepBar(n) {
  for (let i = 1; i <= 4; i++) {
    document.getElementById('s' + i).classList.toggle('active', i < n || (n === 5 && i <= 4));
  }
}

// Order summary
function buildSummary() {
  const basePrice   = prices[order.size] || 0;
  const topPrice    = order.toppings.length * toppingPriceEach;
  const total       = basePrice + topPrice;

  const pills = order.toppings
    .map(t => `<span class="pill">${t}</span>`)
    .join('');

  document.getElementById('summaryBlock').innerHTML = `
    <div class="summary-row">
      <span class="label">Pizza</span>
      <span class="val">${order.type}</span>
    </div>
    <div class="summary-row">
      <span class="label">Size</span>
      <span class="val">${order.size} &mdash; ${basePrice} DA</span>
    </div>
    <div class="summary-row" style="align-items:flex-start">
      <span class="label">Toppings (+${toppingPriceEach} DA each)</span>
    </div>
    <div class="toppings-pills" style="margin-bottom:10px">
      ${pills || '<span style="font-size:12px;color:#993C1D">No extra toppings</span>'}
    </div>
    <div class="summary-row" style="border-top:1px dashed #F5C4B3;padding-top:8px;margin-top:4px">
      <span class="label" style="font-weight:500">Total</span>
      <span class="val" style="font-size:1.05rem;color:#C0392B">${total} DA</span>
    </div>
    <div class="summary-row" style="margin-top:8px;border-top:1px dashed #F5C4B3;padding-top:8px">
      <span class="label">Name</span>
      <span class="val">${order.name}</span>
    </div>
    <div class="summary-row">
      <span class="label">Phone</span>
      <span class="val">${order.phone}</span>
    </div>
    <div class="summary-row">
      <span class="label">Address</span>
      <span class="val" style="max-width:60%;text-align:right">${order.address}</span>
    </div>
  `;
}

//Submit order
function submitOrder() {
  const ticketNum = '#' + Math.floor(1000 + Math.random() * 9000);
  const basePrice = prices[order.size] || 0;
  const total     = basePrice + order.toppings.length * toppingPriceEach;

  document.getElementById('ticketNum').textContent      = ticketNum;
  document.getElementById('confirmPhone').textContent   = order.phone;

  document.getElementById('ticketDetails').innerHTML = `
    <div class="summary-row">
      <span class="label" style="color:var(--color-text-secondary)">Pizza</span>
      <span class="val">${order.type} (${order.size})</span>
    </div>
    <div class="summary-row">
      <span class="label" style="color:var(--color-text-secondary)">Toppings</span>
      <span class="val">${order.toppings.length} extra${order.toppings.length !== 1 ? 's' : ''}</span>
    </div>
    <div class="summary-row">
      <span class="label" style="color:var(--color-text-secondary)">Total</span>
      <span class="val">${total} DA</span>
    </div>
    <div class="summary-row">
      <span class="label" style="color:var(--color-text-secondary)">Deliver to</span>
      <span class="val" style="max-width:55%;text-align:right">${order.address}</span>
    </div>
  `;

  for (let i = 1; i <= 4; i++) {
    document.getElementById('page' + i).style.display = 'none';
  }
  document.getElementById('page5').style.display = '';
  updateStepBar(5);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

//New Order
function resetOrder() {
  order.size     = '';
  order.type     = '';
  order.toppings = [];
  order.name     = '';
  order.phone    = '';
  order.address  = '';

  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('fname').value  = '';
  document.getElementById('fphone').value = '';
  document.getElementById('faddr').value  = '';
  document.getElementById('next1').disabled = true;

  goTo(1);
}

goTo(1);