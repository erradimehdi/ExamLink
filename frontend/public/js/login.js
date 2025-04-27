async function loginUser(event) {
    event.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        // Détecter si tu es sur backend ou JSON Server
        if (API_BASE_URL.includes(":3001")) {
            // Cas Backend Express (Node.js)
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                alert(error.error || "Email ou mot de passe incorrect.");
                return;
            }

            const data = await response.json();
            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = "dashboard.html";

        } else {
            // Cas JSON Server
            const response = await fetch(`${API_BASE_URL}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
            const users = await response.json();

            if (users.length > 0) {
                localStorage.setItem("user", JSON.stringify(users[0]));
                window.location.href = "dashboard.html";
            } else {
                alert("Email ou mot de passe incorrect.");
            }
        }
    } catch (error) {
        console.error("❌ Erreur de connexion :", error);
        alert("Erreur réseau !");
    }
}
