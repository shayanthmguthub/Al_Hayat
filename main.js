// /assets/js/main.js
(function() {
  // ---------- FETCH COMPONENTS (navbar, hero, footer) ----------
  async function loadComponent(placeholderId, filePath) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error(`Failed to load ${filePath}`);
      const html = await response.text();
      document.getElementById(placeholderId).innerHTML = html;
    } catch (e) {
      console.warn(e);
    }
  }

  // load shared components
  loadComponent('navbar-placeholder', 'navbar.html');
  loadComponent('footer-placeholder', 'footer.html');

  // load hero only on index (if element exists)
  if (document.getElementById('hero-placeholder')) {
    loadComponent('hero-placeholder', 'hero.html');
  }

  // ---------- GLOBAL: determine page type ----------
  const isProductPage = window.location.pathname.includes('product.html');

  // ---------- RENDER PRODUCT GRID (index) ----------
  function renderProducts(products, filterCategory = 'all') {
    const grid = document.getElementById('product-grid');
    if (!grid) return; // not index

    const filtered = filterCategory === 'all' 
      ? products 
      : products.filter(p => p.category === filterCategory);

    grid.innerHTML = '';
    if (filtered.length === 0) {
      grid.innerHTML = '<p class="text-center w-100 py-5">No products in this category.</p>';
      return;
    }

    filtered.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-6 col-md-4 col-lg-3';
      col.innerHTML = `
        <a href="product.html?id=${p.id}" class="product-card card border-0">
          <img src="${p.image}" class="card-img-top" alt="${p.name}" loading="lazy">
          <div class="card-body">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text">${p.price} PKR</p>
          </div>
        </a>
      `;
      grid.appendChild(col);
    });
  }

  // ---------- PRODUCT DETAIL (product.html) ----------
  function renderProductDetail(products) {
    const container = document.getElementById('product-detail-container');
    if (!container) return; // not product page

    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);

    if (!product) {
      container.innerHTML = '<div class="col-12 text-center py-5"><h3>Product not found</h3><a href="index.html" class="btn btn-outline-secondary mt-3">Back to shop</a></div>';
      return;
    }

    container.innerHTML = `
      <div class="col-md-6 mb-4">
        <img src="${product.image}" class="product-detail-image" alt="${product.name}">
      </div>
      <div class="col-md-6">
        <p class="detail-category">${product.category}</p>
        <h1 class="display-5 fw-light mb-3">${product.name}</h1>
        <p class="detail-price">${product.price} PKR</p>
        <p class="text-secondary mt-4">${product.description}</p>
        <a class="btn btn-dark mt-3 px-5 py-3 w-100 w-md-auto" href="https://wa.me/923702841044" style="background: #25d366; border: none; font-size: 22px;"><i class="fa-brands fa-whatsapp"></i> Buy Now</a>
      </div>
    `;
  }

  // ---------- INIT on DOM ready ----------
  document.addEventListener('DOMContentLoaded', () => {
    const products = window.productData; // from products.js

    // handle index products grid + category filters
    if (document.getElementById('product-grid')) {
      renderProducts(products);

      // category buttons
      const categoryBtns = document.querySelectorAll('.category-btn');
      if (categoryBtns.length) {
        categoryBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.getAttribute('data-category');
            renderProducts(products, cat);
          });
        });
      }
    }

    // handle product detail page
    if (isProductPage) {
      renderProductDetail(products);
    }
  });

  // optional: handle product.html?id=... without full page flicker (already done)
})();
