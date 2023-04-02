import { $ } from "./handleForm.js";

const notes = $("#mk-notes");
const copyNotes = $("#copyNotes");
const submitBtn = $("#mkNotesSubmitBtn");
const groupedNotesByClients = [];
const lineIndexes = [];
const notesModal = new bootstrap.Modal($("#notesModal"));

let convertedNotes;

window.addEventListener("load", function () {
  notes.focus();
});

function splitInLines(text) {
  return text.split("\n");
}

function filterLines(lines, filter) {
  return lines.filter(line => line.split(" ").find(word => word === filter));
}

function convertNotes() {
  if (!notes.value) return;

  convertedNotes = [];

  try {
    const lines = splitInLines(notes.value);

    const filterdLines = filterLines(lines, "SCI");

    if (!filterdLines.length) throw new Error("formarto inválido");

    filterdLines.forEach(line => {
      const name = line.split(" ")[0];

      groupedNotesByClients.push(
        filterdLines.filter(line => line.split(" ")[0] === name)
      );
    });

    groupedNotesByClients.forEach((group, groupIndex) => {
      const values = group.map(
        value => value.split(" ")[value.split(" ").length - 3]
      );
      const valuesToInteger = values.map(value => parseInt(value));
      const minValue = Math.min(...valuesToInteger);

      group.forEach((notes, index) => {
        let value = 0;
        value = parseInt(notes.split(" ")[notes.split(" ").length - 3]);

        if (value > minValue) {
          let findIndexLine = lines.indexOf(
            groupedNotesByClients[groupIndex][index]
          );

          lineIndexes.push(findIndexLine);

          lines[findIndexLine] = groupedNotesByClients[groupIndex][
            index
          ].replace("SCI", "SCM");
        }
      });
    });

    convertedNotes = [...lines];

    return lines;
  } catch (e) {
    toggleLoader(false);
    alert(e.message);
  }
}

function showConvertedNotes(notes) {
  const linesToBeMarked = lineIndexes.filter(line => line != -1);

  let lines = "";

  notes.forEach((note, index) => {
    if (linesToBeMarked.includes(index)) {
      lines += `<p class="mark">${note}</p>`;
    } else {
      lines += `<p>${note}</p>`;
    }
  });

  $("#notesList").innerHTML = lines;

  notesModal.show();
}

// form.addEventListener("submit", e => {
//   e.preventDefault();

//   //console.log(lineIndexes.filter(index => index != -1));

//   //navigator.clipboard.writeText(lines.join("\n"));
// });

copyNotes.addEventListener("click", function () {
  navigator.clipboard.writeText(convertedNotes.join("\n"));
  alert("texto copiado");
});

function toggleLoader(flag) {
  if (flag) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Convertendo...
  `;
  } else {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="bi bi-currency-exchange"></i> Converter`;
  }
}

submitBtn.addEventListener("click", function () {
  toggleLoader(true);
  setTimeout(() => {
    const convertedLines = convertNotes();
    showConvertedNotes(convertedLines);
    toggleLoader(false);
  }, 500);
});
