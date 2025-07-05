let matieresData = {};

function onSuccess(data) {
  matieresData = data;
  for (let i = 1; i <= 5; i++) {
    initChoix(i);
  }
}

function initChoix(index) {
  const spSelect = document.getElementById(`specialite${index}`);
  const semSelect = document.getElementById(`semestre${index}`);
  const matSelect = document.getElementById(`matiere${index}`);
  const natureDiv = document.getElementById(`nature${index}`);

  spSelect.innerHTML = '<option value="">-- Choisir une spécialité --</option>';
  for (const sp in matieresData) {
    spSelect.innerHTML += `<option value="${sp}">${sp}</option>`;
  }

  spSelect.onchange = () => {
    const selectedSp = spSelect.value;
    semSelect.innerHTML = '<option value="">-- Choisir un semestre --</option>';
    matSelect.innerHTML = '';
    natureDiv.innerHTML = '';
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
    matSelect.innerHTML = '<option value="">-- Choisir une matière --</option>';
    natureDiv.innerHTML = '';
    if (matieresData[selectedSp] && matieresData[selectedSp][selectedSem]) {
      for (const obj of matieresData[selectedSp][selectedSem]) {
        matSelect.innerHTML += `<option value="${obj.matiere}">${obj.matiere}</option>`;
      }
    }
  };

  matSelect.onchange = () => {
    const selectedSp = spSelect.value;
    const selectedSem = semSelect.value;
    const selectedMat = matSelect.value;
    natureDiv.innerHTML = '';
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

window.onload = function () {
  fetch('data.json')
    .then(response => response.json())
    .then(onSuccess)
    .catch(err => {
      document.body.innerHTML = "Erreur de chargement des données : " + err.message;
    });
};
