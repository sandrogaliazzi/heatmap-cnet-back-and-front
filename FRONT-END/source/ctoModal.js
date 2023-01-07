const openModal = document.querySelector("#openModalBtn");
const clientsList = document.querySelector("#modalClientsList");
const modalTitle = document.querySelector("#ctoModalTitle");

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
  openModal.click();
}

export default setModalInfo;