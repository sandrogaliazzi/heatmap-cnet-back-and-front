import { setCenter, filterCto, tomodatData } from "./script.js";
import { $ } from "./handleForm.js";

const apListFilter = [];
const clientsList = [];

const list = $("#clientsList");
const clientSearchInput = $("#clientSearchInput");
const ctoSearchInput = $("#ctoSearchInput");

const offCanvas = new bootstrap.Offcanvas("#offcanvasScrolling")

$("#offcanvasScrolling").addEventListener("show.bs.offcanvas", () => {
  if (!apListFilter.length) {
    mapClients(tomodatData);
    apListFilter.push(...tomodatData);
  }
});

function mapClients(aplist) {
  aplist.forEach(data => {
    const clients = data.clients;


    clientsList.push(
      clients.map(client => {
        return {
          name: client,
          cto: data.name,
          coord: data.coord
        }
      })
    )
  });
}

function findResults(query, typeSearch) {
  if (query !== "") {
    const searchResult = typeSearch === "client"
      ? clientsList
        .flat()
        .filter(client => client.name.indexOf(query.toUpperCase()) > -1 && query)
      : apListFilter.filter(ap => ap.name.indexOf(query.toUpperCase()) > -1 && query);

    if (searchResult.length > 0) {
      renderList(searchResult);
    }
  } else {
    clearClientList();
  }
}

function clearClientList() {
  list.innerHTML = "";
}

function renderList(results) {

  clearClientList();

  let listItems = "";

  results.forEach(result => {
    const { name, cto, coord, city } = result;
    const { lat, lng } = coord;

    let item = `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <p class="mb-0">${name}  <b>${city ? city : ""}</b></p>
    <button 
      class="btn btn-sm btn-success d-flex gap-2" 
      data-cto="${(cto || name)}"
      data-lat="${lat}"
      data-lng="${lng}"
      >
      <i class="bi bi-box-fill"></i>
      cto
    </button>
  </li>
  `

    listItems += item;
  })

  list.innerHTML = listItems;
}

clientSearchInput.addEventListener("keyup", function () {
  findResults(this.value, "client");
});

ctoSearchInput.addEventListener("keyup", function () {
  findResults(this.value);
});

list.addEventListener("click", function (event) {
  if (event.target.dataset.cto) {
    const { cto, lat, lng } = event.target.dataset;
    filterCto(cto);
    setCenter(parseFloat(lat), parseFloat(lng));
    offCanvas.hide();
  }
});

