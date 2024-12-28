async function handleLogin(event) {
  event.preventDefault();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  try {
    let response = await fetch(
      "https://676ea4cfdf5d7dac1ccb486d.mockapi.io/admin"
    );
    let adminData = await response.json();
    let user = adminData.find(
      (admin) => admin.user === username && admin.password === password
    );
    if (user) {
      localStorage.setItem(
        "adminLogged",
        JSON.stringify({
          id: user.id,
          username: user.user,
        })
      );
      await Swal.fire({
        title: "Welcome admin!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      window.location.href = "index.html";
    } else {
      await Swal.fire({
        title: "Error",
        text: "Invalid username or password",
        icon: "error",
      });
    }
  } catch (error) {
    await Swal.fire({
      title: "Error",
      text: "Something went wrong. Please try again.",
      icon: "error",
    });
    console.error("Login error:", error);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  let adminLogged = localStorage.getItem("adminLogged");
  if (adminLogged) {
    window.location.href = "index.html";
  }
});
