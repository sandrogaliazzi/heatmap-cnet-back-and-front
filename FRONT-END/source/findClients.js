import { setCenter, filterCto } from "./script.js";

const clientsFilter = [];

const list = document.getElementById("clientsList");
const canvasBtn = document.getElementById("closeOffCanvasBtn");
const clientSearchInput = document.getElementById("clientSearchInput");


function closeCanvas() {
  canvasBtn.click();
}

async function fecthData() {
  const result = await fetch("https://api.heatmap.conectnet.net/tomodat");

  const data = await result.json();

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
      class="btn btn-sm btn-success" 
      data-cto="${cto}"
      data-lat="${lat}"
      data-lng="${lng}"
      >
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
})

list.addEventListener("click", function (event) {
  if (event.target.dataset.cto) {
    const { cto, lat, lng } = event.target.dataset;
    filterCto(cto);
    setCenter(parseFloat(lat), parseFloat(lng));
    closeCanvas();
  }
})

fecthData()

