import { sendApiReq } from "./handleApiRequests.js";
import { $, get, set } from "./handleForm.js";
import { triggerToast } from "./toast.js";
import { tomodatData } from "./script.js";
import setModalInfo, { recalcFreePorts } from "./ctoModal.js";
import { getCurrentPosition } from "./mapUtils.js";

const form = $("#addClientForm");
const Modal = new bootstrap.Modal($("#addClientModal"));

$("[data-bs-target='#addClientModal']").toggleAttribute("disabled");

$("#addClientModal").addEventListener("show.bs.modal", function () {
  getCurrentPosition().then(pos => {
    set("#lat", pos.latitude);
    set("#lng", pos.longitude);
    $("[data-bs-target='#addClientModal']").toggleAttribute("disabled");
  });
});

$("#addClientModal").addEventListener("hide.bs.modal", function () {
  form.reset();
})

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
    body: bodyRequest
  })

  return response;
}

function updateClientsModal() {
  const cto = tomodatData.find(cto => cto.id === get("#ctoId"));

  cto.percentage_free = recalcFreePorts(
    cto.clients.length,
    cto.percentage_free
  )

  cto.clients.push(get("#clientName").toUpperCase());

  setModalInfo(cto);
  setFormData(cto.id, cto.name);
}

function toggleBtnLoader(isLoading) {
  const saveBtn = $("#saveClientBtn");


  if (isLoading) {
    saveBtn.innerHTML = `
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Salvando
    `

    saveBtn.setAttribute("disabled", "");
  } else {
    saveBtn.innerHTML = "Salvar"
    saveBtn.removeAttribute("disabled");
  }


}

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const bodyRequest = {
    name: get("#clientName").toUpperCase(),
    lat: get("#lat"),
    lng: get("#lng"),
    cto_id: get("#ctoId"),
    user: getUser(),
    cto_name: get("#ctoName"),
    date_time: getDateAndTime()
  }

  console.log(bodyRequest)

  toggleBtnLoader(true);

  const apiResponse = await sendClient(bodyRequest);

  toggleBtnLoader(false);

  if (apiResponse == 201) {
    triggerToast("Cliente adicionado com sucesso", true);
    // sendApiReq({
    //   endpoint: "updatefetch",
    //   httpMethod: "GET"
    // });

    updateClientsModal();

  } else { alert("erro ao cadastrar cliente, tente novamente") };



  Modal.hide();
})


export default setFormData;