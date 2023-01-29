import { $ } from "./handleForm.js";

const openModal = $("#openModalBtn");
const clientsList = $("#modalClientsList");
const modalTitle = $("#ctoModalTitle");
const selectedClients = [];

function createCtoLink(pos) {
  return `https://www.google.com/maps/search/?api=1&query=${pos.lat},${pos.lng}`;
}

$("#ctoModal").addEventListener("hide.bs.modal", () => selectedClients.length = 0);


function showCheckBoxes() {
  const checkBoxes = document.querySelectorAll(".form-check-input");

  checkBoxes.forEach(check => check.classList.toggle("d-none"));
}

$("#admModeBtn").addEventListener("click", showCheckBoxes);

function renderClientsList(clients) {
  let list = "";

  clients.forEach((client) => {
    let item = `<li class="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <input class="form-check-input me-2 d-none" data-action="selectClient" type="checkbox" value="" id="${client.id}">
        <span data-client-id="${client.id}" class="me-3">${client.name}</span>
      </div>
      <div class="btn-group me-1">
        <button class="btn btn-outline-secondary btn-sm">
          <i class="bi bi-clipboard" data-copy-to="unm" data-action="copyName" data-user-name="${client}"></i>
        </button>
        <button class="btn btn-outline-secondary btn-sm"> 
          <i class="bi bi-clipboard-minus" data-copy-to="parks" data-action="copyName" data-user-name="${client}"></i>
        </button>
      </div>
    </li>`;

    list += item;
  })

  return list;
}

function setClientsList(clients, id) {
  clientsList.innerHTML = renderClientsList(clients, id);
}

function setModalTitle(title, pos) {
  modalTitle.innerHTML = `<a href="${createCtoLink(pos)}" target="blank">${title}</a>`;
}

export function setFreePortsNumber(percetageFree, totalClients) {
  let isEmpty, isFull, freePorts, totalPorts

  const occupiedPortsPercentage = 100 - percetageFree;


  if (occupiedPortsPercentage === 100) isFull = true;

  if (percetageFree === 100) isEmpty = true;

  if (!isFull && !isEmpty) {
    totalPorts = Math.ceil((100 * totalClients) / occupiedPortsPercentage);
    freePorts = totalPorts - totalClients;
  }

  return {
    isEmpty,
    isFull,
    freePorts,
    totalPorts
  }
}

function toggleBtn(flag) {
  $("[data-bs-target='#addClientModal']").toggleAttribute("disabled", flag);
}

export function recalcFreePorts(totalClients, oldPercentage) {
  const { totalPorts, isEmpty } = setFreePortsNumber(oldPercentage, totalClients);

  let newPercentageFree

  if (!isEmpty) {
    let newClientCount = totalClients + 1;
    newPercentageFree = ((totalPorts - newClientCount) * 100) / totalPorts;
  } else {
    newPercentageFree = 100;
  }

  return newPercentageFree;
}



function setModalInfo(info) {
  const { clients, name, coord, percentage_free, id } = info;

  setClientsList(clients, id);
  setModalTitle(name, coord);
  $("#clientsNumber").innerHTML = `<strong>${clients.length}</strong> clientes`;

  const { isEmpty, isFull, freePorts } = setFreePortsNumber(parseInt(percentage_free), clients.length);


  if (isEmpty || isFull) {
    $("#percentageFree").innerHTML = `<strong class="${isEmpty ? "text-success" : "text-danger"}">
      ${isEmpty ? "Cto vazia" : "Cto Lotada"}
    </strong>`;

    toggleBtn(isEmpty ? false : true);

  } else {
    $("#percentageFree").innerHTML = `<strong class="text-success">${freePorts} vagas</strong>`
    toggleBtn(false);
  }

  openModal.click();
}

function hifenName(name) {
  const nameString = name.split("");
  nameString.forEach((char, index) => {
    if (char === "(") {
      nameString.splice(index);
    }
  });

  return nameString.join("").trim().split(" ").join("-");
}

function copyClientName(data, event) {
  const { userName, copyTo } = data;
  const el = event.target;


  navigator.clipboard.writeText(
    copyTo === "unm" ? userName : hifenName(userName)
  );

  let icon = el.classList[1];

  [icon, "bi-clipboard-check-fill"].forEach(className => el.classList.toggle(className));

  setTimeout(() => {
    el.classList.remove("bi-clipboard-check-fill");
    el.classList.add(icon);
  }, 1500);
}

function markTextAsSelected(el) {
  el.classList.toggle("text-decoration-line-through");

  const id = el.dataset.clientId;

  if (!selectedClients.find(client => client == id))
    selectedClients.push(id);
  else
    selectedClients.splice(selectedClients.indexOf(id), 1);

  console.log(selectedClients)
}

$("#modalClientsList").addEventListener("click", function (event) {
  const data = event.target.dataset;

  if (Object.keys(data).length > 0) {
    switch (data.action) {
      case "copyName": copyClientName(data, event);
        break;

      case "selectClient": markTextAsSelected($(`[data-client-id="${event.target.id}"]`));
        break;
    }
  }
})

export default setModalInfo;