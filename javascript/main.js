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
  event.preventDefault(); // Prevent form submission

  let form = document.getElementById("registerForm");
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirmPassword").value;

  // Perform Bootstrap validation
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    let confirmPasswordInput = document.getElementById("confirmPassword");
    confirmPasswordInput.setCustomValidity("Passwords do not match.");
    form.classList.add("was-validated");
    return;
  } else {
    document.getElementById("confirmPassword").setCustomValidity("");
  }

  // Prepare user data
  let data = {
    email: email,
    password: password,
    wishlist: [],
    cart: [],
    orders: [],
  };

  // Send data to the server
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
          form.reset(); // Reset form inputs
          form.classList.remove("was-validated"); // Remove validation classes
          window.location.href = "login.html"; // Redirect to login page
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

  // Check if user is logged in
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
    // Fetch the logged-in user's data
    let response = await fetch(
      `https://6770406e2ffbd37a63cc7e60.mockapi.io/users/${loggedInUser.id}`
    );
    let userData = await response.json();

    // Check if the product already exists in the cart
    let updatedCart = [...userData.cart];
    let existingProduct = updatedCart.find((item) => item.productId === productId);

    if (existingProduct) {
      // Increment the quantity if product already exists
      existingProduct.quantity += 1;
    } else {
      // Add the product to the cart if it doesn't exist
      updatedCart.push({ productId: productId, quantity: 1 });
    }

    // Update the user's cart in the API
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
