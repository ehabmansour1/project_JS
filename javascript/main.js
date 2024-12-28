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

function register(event) {
  event.preventDefault();

  let form = document.getElementById("registerForm");
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirmPassword").value;

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }
  if (password !== confirmPassword) {
    let confirmPasswordInput = document.getElementById("confirmPassword");
    confirmPasswordInput.setCustomValidity("Passwords do not match.");
    form.classList.add("was-validated");
    return;
  } else {
    document.getElementById("confirmPassword").setCustomValidity("");
  }

  let data = {
    email: email,
    password: password,
    wishlist: [],
    cart: [],
    orders: [],
  };
  fetch("https://6770406e2ffbd37a63cc7e60.mockapi.io/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (res.ok) {
        Swal.fire({
          title: "Success!",
          text: "User registered successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          form.reset(); 
          form.classList.remove("was-validated"); 
          window.location.href = "login.html"; 
        });
      } else {
        throw new Error("Error registering user.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to register user. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    });
}
function logout() {
  localStorage.removeItem("loggedInUser");
  Swal.fire({
    title: "Logged Out",
    text: "You have been successfully logged out.",
    icon: "success",
    timer: 1500,
    showConfirmButton: false,
  }).then(() => {
    window.location.href = "login.html";
  });
}
async function addToCart(productId) {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    Swal.fire({
      title: "Error",
      text: "You must be logged in to add items to your cart.",
      icon: "error",
      confirmButtonText: "OK",
    });
    return;
  }

  try {
    let response = await fetch(
      `https://6770406e2ffbd37a63cc7e60.mockapi.io/users/${loggedInUser.id}`
    );
    let userData = await response.json();
    let updatedCart = [...userData.cart];
    let existingProduct = updatedCart.find(
      (item) => item.productId === productId
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      updatedCart.push({ productId: productId, quantity: 1 });
    }

    let updateResponse = await fetch(
      `https://6770406e2ffbd37a63cc7e60.mockapi.io/users/${loggedInUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart: updatedCart }),
      }
    );

    if (updateResponse.ok) {
      Swal.fire({
        title: "Success!",
        text: existingProduct
          ? "Product quantity updated in your cart."
          : "Product added to your cart.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      throw new Error("Failed to update cart");
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    Swal.fire({
      title: "Error",
      text: "Something went wrong. Please try again later.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}
async function loadCart() {
  const cartContainer = document.querySelector(".cart-items");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
    Swal.fire({
      title: "Error",
      text: "You must be logged in to view your cart.",
      icon: "error",
      confirmButtonText: "OK",
    }).then(() => {
      window.location.href = "login.html";
    });
    return;
  }

  try {
    const userResponse = await fetch(
      `https://6770406e2ffbd37a63cc7e60.mockapi.io/users/${loggedInUser.id}`
    );
    const userData = await userResponse.json();
    const products = await fetchProducts();
    if (userData.cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }
    userData.cart.forEach((cartItem) => {
      const product = products.find(
        (p) => parseInt(p.id) === cartItem.productId
      );

      if (product) {
        const cartItemHTML = `
          <div class="cart-item">
            <img src="${
              product.image || "https://via.placeholder.com/300"
            }" alt="${product.name}" class="item-image">
            <div class="item-details">
              <div class="item-name">${product.name}</div>
              <div class="item-price">$${product.price.toFixed(2)}</div>
            </div>
            <div class="item-actions">
              <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${
                  cartItem.productId
                }, -1)">-</button>
                <span class="quantity">${cartItem.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${
                  cartItem.productId
                }, 1)">+</button>
              </div>
              <i class="bx bx-trash remove-btn" onclick="removeFromCart(${
                cartItem.productId
              })"></i>
            </div>
          </div>
        `;

        cartContainer.insertAdjacentHTML("beforeend", cartItemHTML);
      }
    });
  } catch (error) {
    console.error("Error fetching cart items or products:", error);
    Swal.fire({
      title: "Error",
      text: "Failed to load cart items. Please try again later.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}
async function updateQuantity(productId, change) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) return;

  try {
    const userResponse = await fetch(
      `https://6770406e2ffbd37a63cc7e60.mockapi.io/users/${loggedInUser.id}`
    );
    const userData = await userResponse.json();

    const updatedCart = userData.cart.map((item) => {
      if (item.productId === productId) {
        item.quantity = Math.max(1, item.quantity + change);
      }
      return item;
    });

    await fetch(
      `https://6770406e2ffbd37a63cc7e60.mockapi.io/users/${loggedInUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart: updatedCart }),
      }
    );

    location.reload();
  } catch (error) {
    console.error("Error updating quantity:", error);
  }
}
async function removeFromCart(productId) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) return;

  try {
    const userResponse = await fetch(
      `https://6770406e2ffbd37a63cc7e60.mockapi.io/users/${loggedInUser.id}`
    );
    const userData = await userResponse.json();

    const updatedCart = userData.cart.filter(
      (item) => item.productId !== productId
    );

    await fetch(
      `https://6770406e2ffbd37a63cc7e60.mockapi.io/users/${loggedInUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart: updatedCart }),
      }
    );

    location.reload();
  } catch (error) {
    console.error("Error removing item from cart:", error);
  }
}
async function updateCartSummary() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
    Swal.fire({
      title: "Error",
      text: "You must be logged in to view your cart summary.",
      icon: "error",
      confirmButtonText: "OK",
    }).then(() => {
      window.location.href = "login.html";
    });
    return;
  }

  try {
    const userResponse = await fetch(
      `https://6770406e2ffbd37a63cc7e60.mockapi.io/users/${loggedInUser.id}`
    );
    const userData = await userResponse.json();
    const products = await fetchProducts();
    let subtotal = 0;
    userData.cart.forEach((cartItem) => {
      const product = products.find(
        (p) => parseInt(p.id) === cartItem.productId
      );
      if (product) {
        subtotal += product.price * cartItem.quantity;
      }
    });
    const shipping = 9.99;
    const taxRate = 0.1;
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;
    const summaryContainer = document.querySelector(".cart-summary");
    summaryContainer.innerHTML = `
      <h2 class="summary-title">Order Summary</h2>
      <div class="summary-item">
        <span class="summary-label">Subtotal</span>
        <span class="summary-value">$${subtotal.toFixed(2)}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Shipping</span>
        <span class="summary-value">$${shipping.toFixed(2)}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Tax</span>
        <span class="summary-value">$${tax.toFixed(2)}</span>
      </div>
      <div class="summary-item summary-total">
        <span class="summary-label">Total</span>
        <span class="summary-value">$${total.toFixed(2)}</span>
      </div>
      <button class="checkout-btn">Proceed to Checkout</button>
    `;
  } catch (error) {
    console.error("Error updating cart summary:", error);
    Swal.fire({
      title: "Error",
      text: "Failed to update order summary. Please try again later.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}
