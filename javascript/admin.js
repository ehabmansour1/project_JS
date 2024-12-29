//handel login=====================================================================
document.addEventListener("DOMContentLoaded", function () {
  let adminLogged = localStorage.getItem("adminLogged");
  if (!adminLogged) {
    window.location.href = "login.html";
    return;
  }
});
//admin=====================================================================
if (document.getElementById("admin-log-out")) {
  document
    .getElementById("admin-log-out")
    .addEventListener("click", function () {
      localStorage.removeItem("adminLogged");
      window.location.href = "../admin";
    });
}
//delete product=====================================================================
function deleteProduct(id) {
  fetch(`https://676ea4cfdf5d7dac1ccb486d.mockapi.io/products/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.ok) {
        window.location.reload();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function editProduct(id) {
  window.location.href = `../admin/add-product.html?id=${id}`;
}
//add product=====================================================================
function validateAndSubmit(event) {
  event.preventDefault();
  let form = document.getElementById("productForm");
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }
  addProduct(event);
}

async function addProduct(e) {
  e.preventDefault();

  let urlParams = new URLSearchParams(window.location.search);
  let productId = urlParams.get("id");

  if (productId) {
    await deleteProductAfterEdit(productId);
  }

  let productData = {
    name: document.getElementById("productName").value,
    category: document.getElementById("category").value,
    price: parseFloat(document.getElementById("price").value),
    stock: parseInt(document.getElementById("stock").value),
    description: document.getElementById("description").value,
    image: document.getElementById("productImage").value,
    createdAt: new Date().toISOString(),
  };

  let response = await fetch(
    "https://676ea4cfdf5d7dac1ccb486d.mockapi.io/products",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    }
  );

  if (response.ok) {
    Swal.fire({
      title: "Success!",
      text: "Product added successfully!",
      icon: "success",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "products.html";
      }
    });
  } else {
    Swal.fire({
      title: "Error!",
      text: "Failed to add product. Please try again.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}

async function deleteProductAfterEdit(productId) {
  try {
    await fetch(
      `https://676ea4cfdf5d7dac1ccb486d.mockapi.io/products/${productId}`,
      {
        method: "DELETE",
      }
    );
    console.log(`Product with ID ${productId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting product:", error);
    Swal.fire({
      title: "Error!",
      text: "Failed to delete the existing product.",
      icon: "error",
    });
  }
}

async function populateForm(productId) {
  try {
    let products = await fetchProducts();
    let product = products.find((item) => item.id === productId);
    if (product) {
      document.getElementById("productName").value = product.name;
      document.getElementById("category").value = product.category;
      document.getElementById("price").value = product.price;
      document.getElementById("stock").value = product.stock;
      document.getElementById("description").value = product.description;
      document.getElementById("productImage").value = product.image;
    } else {
      console.error("Product not found with the given ID:", productId);
    }
  } catch (error) {
    console.error("Error populating form:", error);
  }
}

let urlParams = new URLSearchParams(window.location.search);
let productId = urlParams.get("id");
if (productId) {
  populateForm(productId);
}

async function fetchCategories() {
  try {
    let response = await fetch(
      "https://6770406e2ffbd37a63cc7e60.mockapi.io/categories"
    );
    let data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}
function populateCategories() {
  let categorySelect = document.getElementById("category");
  fetchCategories().then((categories) => {
    categories.forEach((category) => {
      let option = document.createElement("option");
      option.value = category.name;
      option.id = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  });
}

async function validateAndAddCategory(event) {
  event.preventDefault();

  let form = document.getElementById("addCategoryForm");
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  let categoryData = {
    name: document.getElementById("categoryName").value,
    description: document.getElementById("description").value,
    createdAt: new Date().toISOString(),
  };

  try {
    let response = await fetch(
      "https://6770406e2ffbd37a63cc7e60.mockapi.io/categories",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      }
    );

    if (response.ok) {
      Swal.fire({
        title: "Success!",
        text: "Category added successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload();
        form.classList.remove("was-validated");
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Failed to add category. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  } catch (error) {
    console.error("Error adding category:", error);
    Swal.fire({
      title: "Error!",
      text: "Something went wrong. Please try again.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}
function generatecategoryCard(category) {
  return `
  
      <div class="category-item">
              <div class="category-info">
                <div class="category-icon">
                  <i class="bx bx-shopping-bag"></i>
                </div>
                <span class="category-name">${category.name}</span>
              </div>
              <div class="category-actions">
                <button
                  class="action-btn delete-btn"
                  onclick="deleteCategory(${category.id})"
                >
                  <i class="bx bx-trash"></i>
                </button>
              </div>
            </div>
  `;
}
function generateCategories() {
  fetchCategories().then((res) => {
    let categories = res;
    let categoriesContainer = document.querySelector(".cats");
    categories.forEach((category) => {
      categoriesContainer.innerHTML += generatecategoryCard(category);
    });
  });
}
function deleteCategory(id) {
  fetch(`https://6770406e2ffbd37a63cc7e60.mockapi.io/categories/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.ok) {
        window.location.reload();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
async function populateOrdersTable() {
  try {
    let response = await fetch(
      "https://67713e682ffbd37a63ce91f6.mockapi.io/orders"
    );
    let orders = await response.json();
    let tableBody = document.querySelector(".orders-table tbody");
    if (orders.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center">No orders available</td>
        </tr>
      `;
      return;
    }
    tableBody.innerHTML = orders
      .map((order) => {
        let itemsList = order.items
          .map((item) => `${item.name} (x${item.quantity})`)
          .join(", ");

        return `
        <tr>
          <td>${order.id}</td>
          <td>${order.userId}</td>
          <td>${new Date().toISOString().split("T")[0]}</td>
          <td>$${order.price.toFixed(2)}</td>
          <td>
            <span class="status-badge status-${order.status.toLowerCase()}">${
          order.status
        }</span>
          </td>
          <td>
            <div class="product-actions">
          
              <button class="action-btn confirm-btn" onclick="confirmOrder(${
                order.id
              })">
                <i class="bx bx-check"></i>
              </button>
              <button class="action-btn cancel-btn" onclick="cancelOrder(${
                order.id
              })">
                <i class="bx bx-x"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
      })
      .join("");
  } catch (error) {
    console.error("Error fetching orders:", error);
    Swal.fire({
      title: "Error",
      text: "Failed to load orders. Please try again later.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}
async function confirmOrder(orderId) {
  try {
    await fetch(
      `https://67713e682ffbd37a63ce91f6.mockapi.io/orders/${orderId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "confirmed" }),
      }
    );
    Swal.fire({
      title: "Success",
      text: `Order #${orderId} confirmed.`,
      icon: "success",
      confirmButtonText: "OK",
    });
    populateOrdersTable();
  } catch (error) {
    console.error("Error confirming order:", error);
  }
}

async function cancelOrder(orderId) {
  try {
    await fetch(
      `https://67713e682ffbd37a63ce91f6.mockapi.io/orders/${orderId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      }
    );
    Swal.fire({
      title: "Success",
      text: `Order #${orderId} cancelled.`,
      icon: "success",
      confirmButtonText: "OK",
    });
    populateOrdersTable();
  } catch (error) {
    console.error("Error cancelling order:", error);
  }
}

async function populateCustomersTable() {
  try {
    let [usersResponse] = await Promise.all([
      fetch("https://6770406e2ffbd37a63cc7e60.mockapi.io/users/"),
    ]);
    let users = await usersResponse.json();
    document.querySelector("div.stat-value").innerHTML = users.length;
    let tableBody = document.querySelector(".customers-table tbody");
    if (users.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center">No customers found</td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = users
      .map((user) => {
        return `
        <tr>
          <td>
            <div class="customer-info">
              <img
                src="https://picsum.photos/100/100"
                alt="Customer"
                class="customer-avatar"
              />
              <div>
                <div class="customer-name">User ID : ${user.id}</div>
                <div class="customer-email">${user.email}</div>
              </div>
            </div>
          </td>
          <td><span class="status status-active">Active</span></td>
          <td>${user.cart.length}</td>
          <td>${new Date().toISOString().split("T")[0]}</td>
        </tr>
      `;
      })
      .join("");
  } catch (error) {
    console.error("Error fetching customers:", error);
    Swal.fire({
      title: "Error",
      text: "Failed to load customers. Please try again later.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
}
