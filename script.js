document.addEventListener("DOMContentLoaded", function() {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      window.matieresData = data; // variable globale accessible partout
      generateChoixForm(5);
    })
    .catch(error => {
      document.body.innerHTML = "<p style='color:red;'>Erreur de chargement des données : " + error.message + "</p>";
    });
});

function generateChoixForm(nbChoix) {
  const container = document.getElementById("choix-container");
  container.innerHTML = ''; // vide au cas où

  for (let i = 1; i <= nbChoix; i++) {
    const obligatoire = i <= 3 ? ' (obligatoire)' : ' (facultatif)';
    const fieldset = document.createElement("fieldset");
    fieldset.innerHTML = `
      <legend>📌 Choix ${i}${obligatoire}</legend>
      <label>Spécialité :
        <select id="specialite${i}" name="specialite${i}" ${i <= 3 ? "required" : ""}>
          <option value="">-- Choisir une spécialité --</option>
        </select>
      </label><br><br>
      <label>Semestre :
        <select id="semestre${i}" name="semestre${i}" ${i <= 3 ? "required" : ""}>
          <option value="">-- Choisir un semestre --</option>
        </select>
      </label><br><br>
      <label>Matière :
        <select id="matiere${i}" name="matiere${i}" ${i <= 3 ? "required" : ""}>
          <option value="">-- Choisir une matière --</option>
        </select>
      </label><br><br>
      <div id="nature${i}"></div>
    `;
    container.appendChild(fieldset);
    initDropdown(i);
  }
}

function initDropdown(index) {
  const sp = document.getElementById(`specialite${index}`);
  const sem = document.getElementById(`semestre${index}`);
  const mat = document.getElementById(`matiere${index}`);
  const natureDiv = document.getElementById(`nature${index}`);

  // Remplir spécialités
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
        if (obj.cours) natureDiv.innerHTML += `<label><input type="checkbox" name="nature${index}[]" value="Cours"> Cours</label><br>`;
        if (obj.td) natureDiv.innerHTML += `<label><input type="checkbox" name="nature${index}[]" value="TD"> TD</label><br>`;
        if (obj.tp) natureDiv.innerHTML += `<label><input type="checkbox" name="nature${index}[]" value="TP"> TP</label><br>`;
      }
    }
  };
}
document.getElementById("voeuxForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = {};
  formData.forEach((value, key) => {
    if (!data[key]) {
      data[key] = value;
    } else {
      // gérer les cases à cocher
      if (!Array.isArray(data[key])) {
        data[key] = [data[key]];
      }
      data[key].push(value);
    }
  });

  fetch("https://script.google.com/a/macros/univ-annaba.dz/s/AKfycbwcLiJIqUGwhY5MSKWq6J7GZMaQk5VPtCO9gUJxeroZBbkRzZWP0BqqcxBzOT_ooHPr/exec", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        document.getElementById("confirmationMessage").textContent =
          "✅ Vœux envoyés avec succès !";
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




