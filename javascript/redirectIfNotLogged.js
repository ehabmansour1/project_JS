document.addEventListener("DOMContentLoaded", function () {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    window.location.href = "login.html";
  }
});
