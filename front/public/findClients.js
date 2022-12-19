const clientsFilter = [];

const list = document.getElementById("clientsList");

const canvasBtn = document.getElementById("closeOffCanvasBtn");

function closeCanvas() {
  canvasBtn.click();
}

async function fecthData() {
  const result = await fetch("http://177.73.24.22:5005/tomodat");

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

function setCto(cto) {
  const input = document.getElementById("input-cto")

  input.value = cto

  input.onchange()
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

    const lat = parseFloat(coord.lat);
    const lng = parseFloat(coord.lng);

    let item = `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <p class="mb-0">${name}</p>
    <button 
      class="btn btn-sm btn-success" 
      onclick="setCenter(${lat}, ${lng}); setCto('${cto}'); closeCanvas()">
      cto
    </button>
  </li>
  `

    listItems += item;
  })

  list.innerHTML = listItems;
}

fecthData()

