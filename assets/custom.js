

document.addEventListener('DOMContentLoaded', () => {


 const popup = document.getElementById('popup');
 const titleEl = document.getElementById('popup-title');
 const priceEl = document.getElementById('popup-price');
 const descEl = document.getElementById('popup-desc');
 const imageEl = document.getElementById('popup-image');


 const sizeWrap = document.getElementById('size-options');
 const colorSelect = document.getElementById('color-select');


 const addToCartBtn = document.getElementById('add-to-cart');
 const closeBtn = document.getElementById('close-popup');


 let currentProduct = null;
 let selectedVariantId = null;


 /* ---------------- OPEN POPUP ---------------- */
 document.querySelectorAll('.open-popup').forEach(btn => {
   btn.addEventListener('click', async (e) => {
     e.preventDefault();
     e.stopPropagation();


     const handle = btn.closest('.wild-item').dataset.handle;
     const res = await fetch(`/products/${handle}.js`);
     const product = await res.json();
     currentProduct = product;


     /* Fill content */
     titleEl.textContent = product.title;
     descEl.innerHTML = product.description;
     priceEl.textContent = (product.price / 100).toFixed(2) + '€';
     imageEl.src = product.featured_image;


     /* Reset UI */
     sizeWrap.innerHTML = '';
     colorSelect.innerHTML = '<option value="">Choose size</option>';
     selectedVariantId = null;


     /* Populate COLOR dropdown */
     const colors = [...new Set(product.variants.map(v => v.option1))];
     colors.forEach(color => {
       const opt = document.createElement('option');
       opt.value = color;
       opt.textContent = color;
       colorSelect.appendChild(opt);
     });


     /* When COLOR changes → show SIZE buttons */
     colorSelect.onchange = () => {
       sizeWrap.innerHTML = '';
       selectedVariantId = null;


       product.variants
         .filter(v => v.option1 === colorSelect.value)
         .forEach(v => {
           const btn = document.createElement('button');
           btn.textContent = v.option2;


           btn.addEventListener('click', () => {
             document
               .querySelectorAll('#size-options button')
               .forEach(b => b.classList.remove('active'));


             btn.classList.add('active');
             selectedVariantId = v.id;
           });


           sizeWrap.appendChild(btn);
         });
     };


     popup.classList.remove('hidden');
   });
 });


 /* ---------------- CLOSE POPUP ---------------- */
 closeBtn.addEventListener('click', (e) => {
   e.preventDefault();
   e.stopPropagation();
   popup.classList.add('hidden');
 });


 /* ---------------- ADD TO CART ---------------- */
 addToCartBtn.addEventListener('click', async () => {
   if (!selectedVariantId) {
     alert('Please select size');
     return;
   }


   await fetch('/cart/add.js', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       id: selectedVariantId,
       quantity: 1
     })
   });


   showToast('Added to cart');
   popup.classList.add('hidden');
 });


});


/* ---------------- TOAST ---------------- */
function showToast(text) {
 const toast = document.getElementById('toast');
 toast.textContent = text;
 toast.classList.remove('hidden');
 toast.style.opacity = '1';


 setTimeout(() => {
   toast.style.opacity = '0';
   toast.classList.add('hidden');
 }, 2000);
}








