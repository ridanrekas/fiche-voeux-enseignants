document.addEventListener("DOMContentLoaded", function() {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      window.matieresData = data;
      initDropdown();
    })
    .catch(error => {
      document.body.innerHTML = "<p style='color:red;'>Erreur de chargement des données : " + error.message + "</p>";
    });
});

function initDropdown() {
  const sp = document.getElementById('specialite');
  const sem = document.getElementById('semestre');
  const mat = document.getElementById('matiere');
  const natureDiv = document.getElementById('nature');

  sp.innerHTML += Object.keys(window.matieresData).map(spec => `<option value="${spec}">${spec}</option>`).join('');

  sp.onchange = () => {
    sem.innerHTML = '<option value="">-- Choisir un semestre --</option>';
    mat.innerHTML = '<option value="">-- Choisir une matière --</option>';
    natureDiv.innerHTML = '';
    const selectedSp = sp.value;
    if (window.matieresData[selectedSp]) {
      Object.keys(window.matieresData[selectedSp])
        .filter(s => /^S[1357]$/.test(s))
        .forEach(s => {
          sem.innerHTML += `<option value="${s}">${s}</option>`;
        });
    }
  };

  sem.onchange = () => {
    const selectedSp = sp.value;
    const selectedSem = sem.value;
    mat.innerHTML = '<option value="">-- Choisir une matière --</option>';
    natureDiv.innerHTML = '';
    if (window.matieresData[selectedSp] && window.matieresData[selectedSp][selectedSem]) {
      window.matieresData[selectedSp][selectedSem].forEach(obj => {
        mat.innerHTML += `<option value="${obj.matiere}">${obj.matiere}</option>`;
      });
    }
  };

  mat.onchange = () => {
    const selectedSp = sp.value;
    const selectedSem = sem.value;
    const selectedMat = mat.value;
    natureDiv.innerHTML = '';
    if (window.matieresData[selectedSp] && window.matieresData[selectedSp][selectedSem]) {
      const obj = window.matieresData[selectedSp][selectedSem].find(m => m.matiere === selectedMat);
      if (obj) {
        if (obj.cours) natureDiv.innerHTML += `<label><input type="checkbox" name="nature[]" value="Cours" required> Cours</label><br>`;
        if (obj.td) natureDiv.innerHTML += `<label><input type="checkbox" name="nature[]" value="TD" required> TD</label><br>`;
        if (obj.tp) natureDiv.innerHTML += `<label><input type="checkbox" name="nature[]" value="TP" required> TP</label><br>`;
      }
    }
  };
}

document.getElementById("voeuxForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  // Découper nom et prénom (simple split)
  const nomPrenom = formData.get("nomPrenom") || "";
  const parts = nomPrenom.trim().split(" ");
  const nom = parts.shift() || "";
  const prenom = parts.join(" ") || "";

  const email = formData.get("email") || "";

  const specialite = formData.get("specialite");
  const semestre = formData.get("semestre");
  const matiere = formData.get("matiere");
  const types = formData.getAll("nature[]") || [];

  if (!specialite || !semestre || !matiere || types.length === 0) {
    alert("Merci de bien remplir tous les champs du choix d'enseignement !");
    return;
  }

  const data = {
    nom,
    prenom,
    email,
    voeux: [
      { specialite, semestre, matiere, types }
    ]
  };

  fetch("https://script.google.com/macros/s/AKfycbwJp_ZAYKfPc_DTqzIk2HuPTa8X4kIKd5QfWtGpSJBHxrcY1mtrzU4yTAQ1dvmI12Vn/exec", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => {
    if (response.ok) {
      document.getElementById("confirmationMessage").textContent =
        "✅ Vœu envoyé avec succès !";
      this.reset();
    } else {
      throw new Error("Erreur lors de l'envoi.");
    }
  })
  .catch((error) => {
    document.getElementById("confirmationMessage").textContent =
      "❌ Une erreur est survenue : " + error.message;
    document.getElementById("confirmationMessage").style.color = "red";
  });
});





