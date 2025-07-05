let matieresData = {};

document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      matieresData = data;
      initForm();
    })
    .catch(err => {
      document.getElementById("resultMessage").innerText = "Erreur de chargement des données.";
    });
});

function initForm() {
  const container = document.getElementById("choixContainer");

  for (let i = 1; i <= 5; i++) {
    const bloc = document.createElement("fieldset");
    bloc.innerHTML = `
      <legend>📌 Choix ${i} ${i <= 3 ? "(obligatoire)" : "(facultatif)"}</legend>
      <label>Spécialité :
        <select id="specialite${i}" name="specialite${i}" ${i <= 3 ? "required" : ""}></select>
      </label><br>
      <label>Semestre :
        <select id="semestre${i}" name="semestre${i}" ${i <= 3 ? "required" : ""}></select>
      </label><br>
      <label>Matière :
        <select id="matiere${i}" name="matiere${i}" ${i <= 3 ? "required" : ""}></select>
      </label><br>
      <div id="nature${i}"></div>
    `;
    container.appendChild(bloc);

    initChoix(i);
  }

  document.getElementById("voeuxForm").addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("resultMessage").innerHTML = "<p style='color:green'>✅ Vos vœux ont été enregistrés (simulés). Merci !</p>";
  });
}

function initChoix(index) {
  const spSelect = document.getElementById(`specialite${index}`);
  const semSelect = document.getElementById(`semestre${index}`);
  const matSelect = document.getElementById(`matiere${index}`);
  const natureDiv = document.getElementById(`nature${index}`);

  spSelect.innerHTML = `<option value="">-- Choisir une spécialité --</option>`;
  for (const sp in matieresData) {
    spSelect.innerHTML += `<option value="${sp}">${sp}</option>`;
  }

  spSelect.onchange = () => {
    const selectedSp = spSelect.value;
    semSelect.innerHTML = `<option value="">-- Choisir un semestre --</option>`;
    matSelect.innerHTML = ``;
    natureDiv.innerHTML = ``;

    if (matieresData[selectedSp]) {
      for (const sem in matieresData[selectedSp]) {
        if (/^S[1357]$/.test(sem)) {
          semSelect.innerHTML += `<option value="${sem}">${sem}</option>`;
        }
      }
    }
  };

  semSelect.onchange = () => {
    const selectedSp = spSelect.value;
    const selectedSem = semSelect.value;
    matSelect.innerHTML = `<option value="">-- Choisir une matière --</option>`;
    natureDiv.innerHTML = ``;

    if (matieresData[selectedSp] && matieresData[selectedSp][selectedSem]) {
      matieresData[selectedSp][selectedSem].forEach(obj => {
        matSelect.innerHTML += `<option value="${obj.matiere}">${obj.matiere}</option>`;
      });
    }
  };

  matSelect.onchange = () => {
    const selectedSp = spSelect.value;
    const selectedSem = semSelect.value;
    const selectedMat = matSelect.value;
    natureDiv.innerHTML = ``;

    if (matieresData[selectedSp] && matieresData[selectedSp][selectedSem]) {
      const obj = matieresData[selectedSp][selectedSem].find(o => o.matiere === selectedMat);
      if (obj) {
        if (obj.cours) natureDiv.innerHTML += `<label><input type="checkbox" name="nature${index}[]" value="Cours"> Cours</label><br>`;
        if (obj.td)    natureDiv.innerHTML += `<label><input type="checkbox" name="nature${index}[]" value="TD"> TD</label><br>`;
        if (obj.tp)    natureDiv.innerHTML += `<label><input type="checkbox" name="nature${index}[]" value="TP"> TP</label><br>`;
      }
    }
  };
}

