document.getElementById("loginForm").addEventListener("submit", function (e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Demo Admin Login
    if (
        email === "admin@hospital.com" &&
        password === "123456"
    ) {

        localStorage.setItem("adminLoggedIn", "true");

        window.location.href = "/";

    } else {

        document.getElementById("error").innerText =
            "Invalid Email or Password";

    }

});