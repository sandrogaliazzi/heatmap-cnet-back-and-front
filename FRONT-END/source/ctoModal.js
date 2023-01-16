import { $ } from "./handleForm.js";

const openModal = $("#openModalBtn");
const clientsList = $("#modalClientsList");
const modalTitle = $("#ctoModalTitle");

function createCtoLink(pos) {
  return `https://www.google.com/maps/search/?api=1&query=${pos.lat},${pos.lng}`;
}

function renderClientsList(clients) {
  let list = "";

  clients.forEach(client => {
    let item = `<li class="list-group-item">${client}</li>`;

    list += item;
  })

  return list;
}

function setClientsList(clients) {
  clientsList.innerHTML = renderClientsList(clients);
}

function setModalTitle(title, pos) {
  modalTitle.innerHTML = `<a href="${createCtoLink(pos)}" target="blank">${title}</a>`;
}

function setModalInfo(clients, title, pos) {
  setClientsList(clients);
  setModalTitle(title, pos);
  $("#clientsNumber").innerHTML = `<strong>${clients.length}</strong> clientes`;
  openModal.click();
}

export default setModalInfo;