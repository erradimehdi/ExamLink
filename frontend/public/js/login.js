async function loginUser(event) {
    event.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    try {
        // Utiliser l'URL définie dans config.js
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
    
        // Stocker le token et l'utilisateur si présent
        if (data.token) {
            localStorage.setItem("token", data.token);
        }
        localStorage.setItem("user", JSON.stringify(data.user));
    
        // Rediriger vers dashboard
        window.location.href = "dashboard.html";
    
        } catch (error) {
        console.error("❌ Erreur de connexion :", error);
        alert("Erreur réseau.");
    }
}
  