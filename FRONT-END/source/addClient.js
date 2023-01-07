function $(query) {
  return document.querySelector(query);
}

const latInput = $("#lat");
const LngInput = $("#lng");
const clientNameInput = $("#clientName");
const ctoIdInput = $("#ctoId");
const ctoNameInput = $("#ctoName");
const form = $("#addClientForm");
const toast = $("#liveToast");
const closeToastBtn = $("#closeToastBtn");
const closeAddClientModalBtn = $("#closeAddClientModalBtn");


function getClientName() {
  return clientNameInput.value.toUpperCase();
}

function getLat() {
  return latInput.value;
}

function setLat(lat) {
  latInput.value = lat;
}

function getLng() {
  return LngInput.value;
}

function setLng(lng) {
  LngInput.value = lng;
}

function getCtoId() {
  return ctoIdInput.value;
}

function setCtoId(id) {
  ctoIdInput.value = id;
}

function getCtoName() {
  return ctoNameInput.value;
}

function setCtoName(cto) {
  ctoNameInput.value = cto;
}

function getUser() {
  return window.localStorage.getItem("user");
}

function getDateAndTime() {
  return new Date().toLocaleString("pt-BR");
}

function setFormData(lat, lng, ctoId, ctoName) {
  setLat(lat);
  setLng(lng);
  setCtoId(ctoId);
  setCtoName(ctoName);
}

function closeToast() {
  setTimeout(() => { closeToastBtn.click(); }, 3000);
}

function triggerToast() {
  const myToast = new bootstrap.Toast(toast);
  myToast.show();
  closeToast();
}

function closeModal() {
  closeAddClientModalBtn.click();
}

async function sendpostRequest(url, bodyRequest) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyRequest)
  });

  const status = response.status;

  const content = await response.json();

  return { content, status };
}

async function sendClient(bodyRequest) {
  const response = await sendpostRequest("https://api.heatmap.conectnet.net/client", bodyRequest);
  return response;
}

async function sendClientLog(bodyRequest) {
  const response = await sendpostRequest("https://api.heatmap.conectnet.net/logctoclient", bodyRequest);
  return response;
}

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const bodyRequest = {
    name: getClientName(),
    lat: getLat(),
    lng: getLng(),
    cto_id: getCtoId(),
    user: getUser(),
    cto_name: getCtoName(),
    date_time: getDateAndTime()
  }

  //const apiResponse = await sendClientLog(bodyRequest);

  triggerToast();
  closeModal();
  this.reset();
})


export default setFormData;