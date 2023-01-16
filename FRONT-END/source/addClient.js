import { sendApiReq } from "./handleApiRequests.js";
import { $, get, set } from "./handleForm.js";
import { triggerToast } from "./toast.js";

const form = $("#addClientForm");
const Modal = new bootstrap.Modal($("#addClientModal"));
const coords = {};

$("#addClientModal").addEventListener("show.bs.modal", function () {
  getClinetPos();
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

function getClinetPos() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  return navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;

    set("#lat", latitude);
    set("#lng", longitude);

    coords.lat = latitude;
    coords.lng = longitude;

  }, error => {
    alert("Naõ foi possivel obter localização " + error.message);
  }, options);
}

function setFormData(ctoId, ctoName) {
  set("#ctoId", ctoId);
  set("#ctoName", ctoName);
  set("#lat", "");
  set("#lng", "");
}

async function sendClient(bodyRequest) {
  const response = await sendApiReq({
    endpoint: "client",
    httpMethod: "POST",
    body: bodyRequest
  })

  return response;
}

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const { lat, lng } = coords;

  const bodyRequest = {
    name: get("#clientName").toUpperCase(),
    lat,
    lng,
    cto_id: get("#ctoId"),
    user: getUser(),
    cto_name: get("#ctoName"),
    date_time: getDateAndTime()
  }

  const apiResponse = await sendClient(bodyRequest);

  if (apiResponse.status === 201) {
    triggerToast("Cliente adicionado com sucesso", true);
  }

  Modal.hide();
})


export default setFormData;