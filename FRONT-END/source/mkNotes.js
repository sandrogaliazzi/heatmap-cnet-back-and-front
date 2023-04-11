import { $ } from "./handleForm.js";

const notes = $("#mk-notes");
const copyNotes = $("#copyNotes");
const submitBtn = $("#mkNotesSubmitBtn");
const lineIndexes = [];
const notesModal = new bootstrap.Modal($("#notesModal"));

window.addEventListener("load", function () {
  notes.focus();
});

function splitInLines(text) {
  return text.split("\n");
}

function fixSCInotes(notes, SCI_NOTES) {
  notes.forEach((note, index) => {
    if (SCI_NOTES.find(sci => sci === note)) {
      lineIndexes.push({
        index,
        type: "SCI",
      });
    }
  });
}

function fixSCMnotes(notes, SCM_NOTES) {
  notes.forEach((note, index) => {
    if (SCM_NOTES.find(sci => sci === note)) {
      lineIndexes.push({
        index,
        type: "SCM",
      });
    }
  });
}

function groupNotesByType(notes, type) {
  const filterByType = notes.filter(note =>
    note.split(" ").find(word => word === type)
  );

  const clientNotesGroup = filterByType.map(line => {
    const client = line.split(" ")[0];

    return filterByType.filter(line => line.split(" ")[0] === client);
  });

  return clientNotesGroup;
}

function mapIncorrectNotes(group, type) {
  const incorretLines = [];

  group.forEach(client => {
    const values = client.map(
      value => value.split(" ")[value.split(" ").length - 3]
    );
    const valuesToInteger = values.map(value => parseInt(value));

    const minValue = Math.min(...valuesToInteger);
    const maxValue = Math.max(...valuesToInteger);

    client.forEach(line => {
      let value = 0;
      value = parseInt(line.split(" ")[line.split(" ").length - 3]);

      if (type === "SCI") {
        if (value > minValue) {
          incorretLines.push(line);
        }
      } else {
        if (value < maxValue) {
          incorretLines.push(line);
        }
      }
    });
  });

  return incorretLines;
}

function convertNotes() {
  if (!notes.value) return;

  try {
    const lines = splitInLines(notes.value);

    const SCI_Notes = mapIncorrectNotes(groupNotesByType(lines, "SCI"), "SCI");

    const SCM_Notes = mapIncorrectNotes(groupNotesByType(lines, "SCM"), "SCM");

    fixSCInotes(lines, SCI_Notes);

    fixSCMnotes(lines, SCM_Notes);

    return lines;
  } catch (e) {
    toggleLoader(false);
    alert(e.message);
  }
}

function showConvertedNotes(notes) {
  let lines = "";

  notes.forEach((note, index) => {
    if (lineIndexes.find(line => line.index === index && line.type === "SCI")) {
      lines += `<p class="text-bg-primary">${note.replace("SCI", "SCM")}</p>`;
    } else if (
      lineIndexes.find(line => line.index === index && line.type === "SCM")
    ) {
      lines += `<p class="text-bg-success">${note.replace("SCM", "SCI")}</p>`;
    } else {
      lines += `<p>${note}</p>`;
    }
  });

  $("#notesList").innerHTML = lines;

  notesModal.show();
}

copyNotes.addEventListener("click", function () {
  navigator.clipboard.writeText($("#notesList").innerText);
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
