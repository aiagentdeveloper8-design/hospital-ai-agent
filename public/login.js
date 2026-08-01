document.getElementById("loginForm").addEventListener("submit", async function (e) {

    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/admin-login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            username,
            password
        })

    });

    const data = await res.json();

    if (data.success) {

        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("token", data.token);

        window.location.href = "/index.html";

    } else {

        document.getElementById("error").innerText =
            data.message || "Login Failed";

    }

});