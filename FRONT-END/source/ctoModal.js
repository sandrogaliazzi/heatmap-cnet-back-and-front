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
    let item = `<li class="list-group-item d-flex justify-content-between align-items-center">
      <span class="me-3">${client}</span>
      <div class="btn-group">
        <button class="btn btn-outline-secondary btn-sm">
          <i class="bi bi-clipboard" data-copy-to="unm"  data-user-name="${client}"></i>
        </button>
        <button class="btn btn-outline-secondary btn-sm"> 
          <i class="bi bi-clipboard-minus" data-copy-to="parks"  data-user-name="${client}"></i>
        </button>
      </div>
    </li>`;

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

export function setFreePortsNumber(percetageFree, totalClients) {
  const occupiedPortsPercentage = 100 - percetageFree;


  if (occupiedPortsPercentage === 100) return false;

  let totalPorts = "";

  if (percetageFree === 100) totalPorts = false;

  totalPorts = Math.ceil((100 * totalClients) / occupiedPortsPercentage);


  return totalPorts ? totalPorts - totalClients : "cto vazia";
}



function setModalInfo(info, newPercentageFree) {
  const { clients, name, coord, percentage_free } = info;


  setClientsList(clients);
  setModalTitle(name, coord);
  $("#clientsNumber").innerHTML = `<strong>${clients.length}</strong> clientes`;

  let freePortsNumber =  setFreePortsNumber(parseInt(percentage_free), clients.length);


  if(newPercentageFree) {
    let newTotalFree = setFreePortsNumber(parseInt(percentage_free), clients.length - 1);
    freePortsNumber = Number.isInteger(newTotalFree) ? newTotalFree - 1 : newTotalFree;
  }


  if (freePortsNumber) {
    $("#percentageFree").innerHTML = `<strong class="text-success">Vagas: ${freePortsNumber}</strong>`
    $("[data-bs-target='#addClientModal']").removeAttribute("disabled");
  } else {
    $("#percentageFree").innerHTML = `<strong class="text-danger">Cto lotada</strong>`
    $("[data-bs-target='#addClientModal']").setAttribute("disabled", "");
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

$("#modalClientsList").addEventListener("click", function (event) {
  const data = event.target.dataset;

  if (Object.keys(data).length > 0) {
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
})

export default setModalInfo;