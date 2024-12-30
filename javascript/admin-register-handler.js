async function handleRegister(event) {
  event.preventDefault();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  try {
    let response = await fetch(
      "https://676ea4cfdf5d7dac1ccb486d.mockapi.io/admin"
    );
    let adminData = await response.json();

    let userExists = adminData.some((admin) => admin.user === username);

    if (userExists) {
      await Swal.fire({
        title: "Error",
        text: "Username already exists. Please choose a different username.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    let newUser = {
      user: username,
      password: password,
    };
    let createResponse = await fetch(
      "https://676ea4cfdf5d7dac1ccb486d.mockapi.io/admin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      }
    );
    if (createResponse.ok) {
      await Swal.fire({
        title: "Success!",
        text: "Admin registered successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
      window.location.href = "login.html";
    } else {
      throw new Error("Failed to register admin");
    }
  } catch (error) {
    await Swal.fire({
      title: "Error",
      text: "Something went wrong. Please try again.",
      icon: "error",
    });
    console.error("Registration error:", error);
  }
}
