async function signupUser(event) {
    event.preventDefault();
  
    const userType = document.getElementById("userType").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const nom = document.getElementById("nom").value;
    const prenom = document.getElementById("prenom").value;
    const dob = document.getElementById("dob").value;
    const sexe = document.getElementById("sexe").value;
    const etablissement = document.getElementById("etablissement").value;
    const filiere = document.getElementById("filiere").value;
  
    if (password.length < 4) {
        alert("Mot de passe trop court !");
        return;
    }
    
    if (!isValidEmail(email)) {
        alert("Adresse e-mail invalide !");
        return;
    }
      

    try {
        const check = await fetch(`${API_BASE_URL}/users?email=${encodeURIComponent(email)}`);
        const existingUsers = await check.json();
    
        if (existingUsers.length > 0) {
            alert("Cet email est déjà utilisé !");
            return;
        }
    
        const newUser = {
            type: userType,
            email,
            password,
            nom,
            prenom,
            dob,
            sexe,
            etablissement,
            filiere
        };
    
        const res = await fetch(`${API_BASE_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        });
    
        if (res.ok) {
            console.log("✅ Inscription réussie !");
            window.location.replace("login.html");
        } else {
            alert("Erreur lors de l'inscription.");
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
        alert("Erreur de connexion au serveur.");
    }
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return regex.test(email);
}
  