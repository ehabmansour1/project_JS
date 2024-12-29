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
      <button class='wish-button' onclick='addToWish(${product.id})'><i class="bx bx-heart"></i></button>
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
  let cartContainer = document.querySelector(".cart-items");
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

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
    let userResponse = await fetch(
      `https://6770406e2ffbd37a63cc7e60.mockapi.io/users/${loggedInUser.id}`
    );
    let userData = await userResponse.json();
    let products = await fetchProducts();
    if (userData.cart.length === 0) {
      cartContainer.innerHTML = `<div class="empty-cart bg-white rounded-4">
            <lord-icon src="https://cdn.lordicon.com/slkvcfos.json" trigger="loop" colors="primary:#1e1b4b,secondary:#4f46e5">
            </lord-icon>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything to your cart yet</p>
            <a href="/" style='display: block;
    width: fit-content;
    margin: 20px auto 0;' class="checkout-btn">Start Shopping</a>
          </div>`;
      return;
    }
    userData.cart.forEach((cartItem) => {
      let product = products.find((p) => parseInt(p.id) === cartItem.productId);

      if (product) {
        let cartItemHTML = `
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
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) return;

  try {
    let userResponse = await fetch(
      `https://6770406e2ffbd37a63cc7e60.mockapi.io/users/${loggedInUser.id}`
    );
    let userData = await userResponse.json();

    let updatedCart = userData.cart.map((item) => {
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
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) return;

  try {
    let userResponse = await fetch(
      `https://6770406e2ffbd37a63cc7e60.mockapi.io/users/${loggedInUser.id}`
    );
    let userData = await userResponse.json();

    let updatedCart = userData.cart.filter(
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
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

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
    let userResponse = await fetch(
      `https://6770406e2ffbd37a63cc7e60.mockapi.io/users/${loggedInUser.id}`
    );
    let userData = await userResponse.json();
    let products = await fetchProducts();
    let subtotal = 0;
    userData.cart.forEach((cartItem) => {
      let product = products.find((p) => parseInt(p.id) === cartItem.productId);
      if (product) {
        subtotal += product.price * cartItem.quantity;
      }
    });
    let taxRate = 0.1;
    let tax = subtotal * taxRate;
    let total = subtotal + tax;
    let summaryContainer = document.querySelector(".cart-summary");
    summaryContainer.innerHTML = `
      <h2 class="summary-title">Order Summary</h2>
      <div class="summary-item">
        <span class="summary-label">Subtotal</span>
        <span class="summary-value">$${subtotal.toFixed(2)}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Tax</span>
        <span class="summary-value">$${tax.toFixed(2)}</span>
      </div>
      <div class="summary-item summary-total">
        <span class="summary-label">Total</span>
        <span class="summary-value">$${total.toFixed(2)}</span>
      </div>
      <button class="checkout-btn" onclick="makeOrder()">Proceed to Checkout</button>
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
async function makeOrder() {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    Swal.fire({
      title: "Error",
      text: "You must be logged in to place an order.",
      icon: "error",
      confirmButtonText: "OK",
    }).then(() => {
      window.location.href = "login.html";
    });
    return;
  }
  try {
    let userResponse = await fetch(
      `https://6770406e2ffbd37a63cc7e60.mockapi.io/users/${loggedInUser.id}`
    );
    let userData = await userResponse.json();
    if (!userData.cart || userData.cart.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Your cart is empty. Add items to your cart before placing an order.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    let products = await fetchProducts();
    let totalPrice = 0;
    let taxRate = 0.1;
    let orderItems = userData.cart
      .map((cartItem) => {
        let product = products.find(
          (p) => parseInt(p.id) === cartItem.productId
        );
        if (product) {
          let itemTotal = product.price * cartItem.quantity;
          totalPrice += itemTotal;
          return {
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            name: product.name,
            price: product.price,
            image: product.image,
          };
        }
        return null;
      })
      .filter(Boolean);
    totalPrice += totalPrice * taxRate;
    let orderData = {
      userId: loggedInUser.id,
      items: orderItems,
      price: totalPrice,
      status: "pending",
    };

    let orderResponse = await fetch(
      "https://67713e682ffbd37a63ce91f6.mockapi.io/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      }
    );

    if (orderResponse.ok) {
      await fetch(
        `https://6770406e2ffbd37a63cc7e60.mockapi.io/users/${loggedInUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart: [] }),
        }
      );
      Swal.fire({
        title: "Order Placed!",
        text: "Your order has been placed successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "my-orders.html";
      });
    } else {
      throw new Error("Failed to place order");
    }
  } catch (error) {
    console.error("Error placing order:", error);
    Swal.fire({
      title: "Error",
      text: "Something went wrong. Please try again later.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}
function fetchOrders() {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
    Swal.fire({
      title: "Error",
      text: "You must be logged in to view your orders.",
      icon: "error",
      confirmButtonText: "OK",
    }).then(() => {
      window.location.href = "login.html";
    });
    return;
  }

  fetch("https://67713e682ffbd37a63ce91f6.mockapi.io/orders")
    .then((res) => res.json())
    .then((orders) => {
      let userOrders = orders.filter(
        (order) => order.userId === loggedInUser.id
      );
      let ordersContainer = document.querySelector(".orders-list");

      if (userOrders.length === 0) {
        ordersContainer.innerHTML = `
<div class="empty-state">
  <h1 class="empty-title">No Orders Yet</h1>
  <p class="empty-description">Looks like you haven't made any orders yet. Start shopping to see your orders here!</p>
  <a href="products.html" class="shop-button">
    Start Shopping
  </a>
</div>
        `;
        return;
      }

      ordersContainer.innerHTML = userOrders
        .map((order) => {
          console.log(order);
          let itemsHTML = order.items
            .map(
              (item) => `
              <div class="order-item">
                <img
                  src="${item.image}"
                  alt="${item.name}"
                  class="item-image"
                />
                <div class="item-details">
                  <div class="item-name">${item.name}</div>
                  <div class="item-price">$${(
                    item.price * item.quantity
                  ).toFixed(2)}</div>
                  <div class="item-quantity">Quantity: ${item.quantity}</div>
                </div>
              </div>
            `
            )
            .join("");

          return `
          <div class="order-card">
            <div class="order-header">
              <div>
                <span class="order-id">Order #${order.id}</span>
                <div class="order-date">Placed on Oct 15, 2023</div>
              </div>
              <span class="order-status status-${order.status.toLowerCase()}">${
            order.status
          }</span>
            </div>

            <div class="order-items">
              ${itemsHTML}
            </div>

            <div class="order-footer">
              <div class="order-total">Total: $${order.price.toFixed(2)}</div>
            </div>
          </div>
        `;
        })
        .join("");
    })
    .catch((error) => {
      console.error("Error fetching orders:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to load your orders. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    });
}

async function addToWish(productId) {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
    Swal.fire({
      title: "Error",
      text: "You must be logged in to add items to your wishlist.",
      icon: "error",
      confirmButtonText: "OK",
    }).then(() => {
      window.location.href = "login.html";
    });
    return;
  }
  try {
    let response = await fetch(
      `https://6770406e2ffbd37a63cc7e60.mockapi.io/users/${loggedInUser.id}`
    );
    let userData = await response.json();
    if (userData.wishlist.includes(productId)) {
      Swal.fire({
        title: "Info",
        text: "This product is already in your wishlist.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }
    let updatedWishlist = [...userData.wishlist, productId];

    await fetch(
      `https://6770406e2ffbd37a63cc7e60.mockapi.io/users/${loggedInUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wishlist: updatedWishlist }),
      }
    );

    Swal.fire({
      title: "Success!",
      text: "Product added to your wishlist.",
      icon: "success",
      confirmButtonText: "OK",
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    Swal.fire({
      title: "Error",
      text: "Failed to add product to wishlist. Please try again later.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}

async function populateWishlist() {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
    Swal.fire({
      title: "Error",
      text: "You must be logged in to view your wishlist.",
      icon: "error",
      confirmButtonText: "OK",
    }).then(() => {
      window.location.href = "login.html";
    });
    return;
  }

  try {
    let userResponse = await fetch(
      `https://6770406e2ffbd37a63cc7e60.mockapi.io/users/${loggedInUser.id}`
    );
    let userData = await userResponse.json();
    let products = await fetchProducts();

    let wishlistGrid = document.querySelector(".wishlist-grid");
    if (!userData.wishlist || userData.wishlist.length === 0) {
      wishlistGrid.innerHTML = `
<div class="empty-state" style='grid-column: 1 / -1; '>
  <h1 class="empty-title">No Orders Yet</h1>
  <p class="empty-description">Looks like you haven't made any orders yet. Start shopping to see your orders here!</p>
  <a href="products.html" class="shop-button">
    Start Shopping
  </a>
</div>
      `;
      return;
    }
    wishlistGrid.innerHTML = userData.wishlist
      .map((productId) => {
        let product = products.find((p) => parseInt(p.id) === productId);
        if (product) {
          return `
            <div class="wishlist-item">
              <div class="item-image-container">
                <img src="${
                  product.image || "https://via.placeholder.com/300"
                }" alt="${product.name}" class="item-image">
                <div class="item-remove" onclick="removeFromWishlist(${
                  product.id
                })">
                  <i class="bx bx-x"></i>
                </div>
              </div>
              <div class="item-details">
                <div class="item-name">${product.name}</div>
                <div class="item-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="addToCart(${
                  product.id
                })">Add to Cart</button>
              </div>
            </div>
          `;
        }
        return "";
      })
      .join("");
  } catch (error) {
    console.error("Error populating wishlist:", error);
    Swal.fire({
      title: "Error",
      text: "Failed to load your wishlist. Please try again later.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}
async function removeFromWishlist(productId) {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) return;
  try {
    let userResponse = await fetch(
      `https://6770406e2ffbd37a63cc7e60.mockapi.io/users/${loggedInUser.id}`
    );
    let userData = await userResponse.json();
    let updatedWishlist = userData.wishlist.filter((id) => id !== productId);
    await fetch(
      `https://6770406e2ffbd37a63cc7e60.mockapi.io/users/${loggedInUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wishlist: updatedWishlist }),
      }
    );
    populateWishlist();
  } catch (error) {
    console.error("Error removing item from wishlist:", error);
  }
}
