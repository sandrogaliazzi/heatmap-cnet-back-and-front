import { sendApiReq } from "./handleApiRequests.js";
import { $, get, set } from "./handleForm.js";
import { triggerToast } from "./toast.js";
import { tomodatData } from "./script.js";
import setModalInfo, { recalcFreePorts } from "./ctoModal.js";
import { getCurrentPosition, insertMap } from "./mapUtils.js";

const form = $("#addClientForm");
const Modal = new bootstrap.Modal($("#addClientModal"));

function toggleFormVisibility() {
  form.classList.toggle("d-none");
}

$("[data-bs-target='#addClientModal']").toggleAttribute("disabled");

$("#addClientModal").addEventListener("show.bs.modal", function () {
  form.classList.add("d-none");

  getCurrentPosition()
    .then(pos => {
      const { latitude, longitude } = pos;

      set("#lat", latitude);
      set("#lng", longitude);

      $("[data-bs-target='#addClientModal']").toggleAttribute("disabled");

      insertMap(latitude, longitude, "#addClientMap");
    })
    .catch(_ => {
      alert(
        "você precisa habilitar a geolocalização para poder adicionar um cliente!"
      );
    });
});

$("#updateClientLocationBeforeAdd").addEventListener("click", function () {
  getCurrentPosition().then(pos => {
    const { latitude, longitude } = pos;

    set("#lat", latitude);
    set("#lng", longitude);

    insertMap(latitude, longitude, "#addClientMap");
  });
});

$("#confirmClientLocation").addEventListener("click", toggleFormVisibility);

$("#addClientModal").addEventListener("hide.bs.modal", function () {
  form.reset();
});

function getUser() {
  return JSON.parse(sessionStorage.getItem("user")).name;
}

function getDateAndTime() {
  return new Date().toLocaleString("pt-BR");
}

function setFormData(ctoId, ctoName) {
  set("#ctoId", ctoId);
  set("#ctoName", ctoName);
}

async function sendClient(bodyRequest) {
  const response = await sendApiReq({
    endpoint: "client",
    httpMethod: "POST",
    body: bodyRequest,
  });

  return response;
}

function updateClientsModal() {
  const cto = tomodatData.find(cto => cto.id === get("#ctoId"));

  cto.percentage_free = recalcFreePorts(
    cto.clients.length,
    cto.percentage_free
  );

  cto.clients.push({ name: get("#clientName").toUpperCase(), id: null });

  setModalInfo(cto);
  setFormData(cto.id, cto.name);
}

function toggleBtnLoader(isLoading) {
  const saveBtn = $("#saveClientBtn");

  if (isLoading) {
    saveBtn.innerHTML = `
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Salvando
    `;

    saveBtn.setAttribute("disabled", "");
  } else {
    saveBtn.innerHTML = "Salvar";
    saveBtn.removeAttribute("disabled");
  }
}

function isFormCompleted(fields) {
  if (!fields) return false;

  let isComplete = true;

  for (const field in fields) {
    if (!fields[field]) isComplete = false;
  }

  return isComplete;
}

$("#clientName").addEventListener("invalid", function () {
  this.setCustomValidity(
    "Não é permitidos acentos ou caracteres especiais no nome!"
  );
});

$("#clientName").addEventListener("change", function () {
  this.setCustomValidity("");
  const splitName = this.value.split(" ");

  const pppoeSugested =
    splitName[0] + splitName[splitName.length - 1] + "fibra".toLowerCase();
  $("#clientPppoe").value = pppoeSugested;
});

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const bodyRequest = {
    name: get("#clientName").toUpperCase(),
    pppoe: get("#clientPppoe"),
    lat: get("#lat"),
    lng: get("#lng"),
    cto_id: get("#ctoId"),
    user: getUser().toUpperCase(),
    cto_name: get("#ctoName"),
    date_time: getDateAndTime(),
  };

  if (isFormCompleted(bodyRequest)) {
    if (confirm("A localização foi confirmada?")) {
      toggleBtnLoader(true);

      const apiResponse = await sendClient(bodyRequest);

      console.log(bodyRequest);

      toggleBtnLoader(false);

      if (apiResponse.status == 201) {
        triggerToast("Cliente adicionado com sucesso", true);

        updateClientsModal();

        Modal.hide();
      } else {
        alert("erro ao cadastrar cliente, tente novamente");
      }
    }
  } else {
    triggerToast(
      "Formulário incompleto, revise se todos os campos estão preenchidos",
      false
    );
  }
});

export default setFormData;
