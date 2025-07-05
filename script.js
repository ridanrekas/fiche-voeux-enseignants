let matieresData = {};

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    matieresData = data;
    generateChoixForm(5);
  })
  .catch(error => {
    document.body.innerHTML = "<p style='color:red;'>Erreur de chargement des données : " + error.message + "</p>";
  });

function generateChoixForm(nbChoix) {
  const container = document.getElementById("choix-container");
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

  for (const spec in matieresData) {
    sp.innerHTML += `<option value="${spec}">${spec}</option>`;
  }

  sp.onchange = () => {
    sem.innerHTML = '<option value="">-- Choisir un semestre --</option>';
    mat.innerHTML = '';
    natureDiv.innerHTML = '';
    const selectedSp = sp.value;
    if (matieresData[selectedSp]) {
      for (const s in matieresData[selectedSp]) {
        if (/^S[1357]$/.test(s)) {
          sem.innerHTML += `<option value="${s}">${s}</option>`;
        }
      }
    }
  };

  sem.onchange = () => {
    const selectedSp = sp.value;
    const selectedSem = sem.value;
    mat.innerHTML = '<option value="">-- Choisir une matière --</option>';
    natureDiv.innerHTML = '';
    if (matieresData[selectedSp] && matieresData[selectedSp][selectedSem]) {
      for (const obj of matieresData[selectedSp][selectedSem]) {
        mat.innerHTML += `<option value="${obj.matiere}">${obj.matiere}</option>`;
      }
    }
  };

  mat.onchange = () => {
    const selectedSp = sp.value;
    const selectedSem = sem.value;
    const selectedMat = mat.value;
    natureDiv.innerHTML = '';
    if (matieresData[selectedSp] && matieresData[selectedSp][selectedSem]) {
      const obj = matieresData[selectedSp][selectedSem].find(m => m.matiere === selectedMat);
      if (obj) {
        if (obj.cours) natureDiv.innerHTML += `<label><input type="checkbox" name="nature${index}[]" value="Cours"> Cours</label><br>`;
        if (obj.td) natureDiv.innerHTML += `<label><input type="checkbox" name="nature${index}[]" value="TD"> TD</label><br>`;
        if (obj.tp) natureDiv.innerHTML += `<label><input type="checkbox" name="nature${index}[]" value="TP"> TP</label><br>`;
      }
    }
  };
}


