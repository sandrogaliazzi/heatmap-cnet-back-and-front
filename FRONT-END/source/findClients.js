import { setCenter, filterCto } from "./script.js";
import { sendApiReq } from "./handleApiRequests.js";
import { $ } from "./handleForm.js";

const clientsFilter = [];

const list = $("#clientsList");
const clientSearchInput = $("#clientSearchInput");

const offCanvas = new bootstrap.Offcanvas("#offcanvasScrolling")

$("#offcanvasScrolling").addEventListener("show.bs.offcanvas", () => {
  if (!clientsFilter.length) fecthData();
});

$("#offcanvasScrolling").addEventListener("hide.bs.offcanvas", () => {
  clearClientList();
});


async function fecthData() {
  const result = await sendApiReq({
    endpoint: "tomodat",
    httpMethod: "GET"
  });

  const data = result.data;

  data.forEach(data => {
    const clients = data.clients;


    clientsFilter.push(
      clients.map(client => {
        return {
          name: client,
          cto: data.name,
          coord: data.coord
        }
      })
    )
  })
}

function findClient(query) {
  if (query !== "") {
    const searchResult = clientsFilter
      .flat()
      .filter(client => client.name.indexOf(query.toUpperCase()) > -1 && query)

    if (searchResult.length > 0) {
      renderClientList(searchResult);
    }
  } else {
    clearClientList();
  }
}

function clearClientList() {
  list.innerHTML = "";
}

function renderClientList(clients) {

  clearClientList();

  let listItems = "";

  clients.forEach(client => {
    const { name, cto, coord } = client;
    const { lat, lng } = coord;

    let item = `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <p class="mb-0">${name}</p>
    <button 
      class="btn btn-sm btn-success d-flex gap-2" 
      data-cto="${cto}"
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
  findClient(this.value);
});

list.addEventListener("click", function (event) {
  if (event.target.dataset.cto) {
    const { cto, lat, lng } = event.target.dataset;
    filterCto(cto);
    setCenter(parseFloat(lat), parseFloat(lng));
    offCanvas.hide();
  }
});

