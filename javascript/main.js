//slider=====================================================================
let slides = document.querySelectorAll(".slide");
let currentSlide = 0;
function showSlide(index) {
  slides.forEach((slide) => {
    slide.classList.remove("active");
  });
  slides[index].classList.add("active");
}
let nextSlide = () => {
  slides[currentSlide].style.opacity = 0;
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].style.opacity = 1;
  showSlide(currentSlide);
};

async function fetchProducts() {
  try {
    let response = await fetch(
      "https://676ea4cfdf5d7dac1ccb486d.mockapi.io/products"
    );
    let products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}
function generateProductCard(product) {
  return `
      <div class="product-card" id='${product.id}'>
        <div class="product-img">
          <img src='${product.image}' alt='${product.name}'>
        </div>
        <div class="product-info">
          <div class="product-title">${product.name}</div>
          <div class="product-price">&#x24;${product.price}</div>
                  <button onclick='addToCart(${product.id})' class="btn-add-to-cart">
              <i class="fas fa-shopping-cart"></i>
              Add to Cart
            </button>
        </div>

      </div>
  `;
}
function generateProductsToHome() {
  fetchProducts().then((res) => {
    let products = res;
    let productsContainer = document.querySelector(".product-grid");
    products.forEach((product) => {
      productsContainer.innerHTML += generateProductCard(product);
    });
  });
}
function generateProductCardAdmin(product) {
  return `
      <div class="product-card" id='${product.id}'>
        <div class="product-img">
          <img src='${product.image}' alt='${product.name}'>
        </div>
        <div class="product-info">
        <div class="product-category">${product.category}</div>
          <div class="product-title">${product.name}</div>
          <div class="product-price">&#x24;${product.price}</div>
          <div class="product-stock">In Stock: ${product.stockQuantity}</div>
                  <div class="product-actions">
                <button class="action-btn edit-btn" onclick="editProduct(${product.id})">
                  <i class="bx bx-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">
                  <i class="bx bx-trash"></i>
                </button>
              </div>
        </div>

      </div>
  `;
}
function generateProductsToAdmin() {
  fetchProducts().then((res) => {
    let products = res;
    let productsContainer = document.querySelector(".product-grid");
    products.forEach((product) => {
      productsContainer.innerHTML += generateProductCardAdmin(product);
    });
  });
}
(function () {
  var forms = document.querySelectorAll(".needs-validation");

  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
