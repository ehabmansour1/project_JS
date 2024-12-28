async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    let response = await fetch(
      "https://6770406e2ffbd37a63cc7e60.mockapi.io/users"
    );
    let userData = await response.json();
    let user = userData.find(
      (user) => user.email === email && user.password === password
    );
    if (user) {
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          id: user.id,
          email: user.email,
        })
      );
      await Swal.fire({
        title: `Welcome, ${user.email}!`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      window.location.href = "dashboard.html";
    } else {
      await Swal.fire({
        title: "Error",
        text: "Invalid email or password",
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
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (loggedInUser) {
    window.location.href = "dashboard.html";
  }
});

