import { setCenter, filterCto, tomodatData } from "./script.js";
import { $ } from "./handleForm.js";
import { sendApiReq } from "./handleApiRequests.js";
import { spinner } from "./components/spinner.js";
import { getCurrentPosition, insertMap, createCtoLink } from "./mapUtils.js";

const apListFilter = [];
const clientsList = [];

const list = $("#clientsList");
const clientSearchInput = $("#clientSearchInput");
const ctoSearchInput = $("#ctoSearchInput");

const offCanvas = new bootstrap.Offcanvas("#offcanvasScrolling");
const locationModal = new bootstrap.Modal($("#clientLocationModal"));

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
          name: client.name,
          cto: data.name,
          coord: data.coord,
          ctoId: data.id,
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

function renderGeoBtn(flag) {
  return flag ? `<button class="btn btn-sm btn-outline-primary d-flex gap-2" data-find="client">
    <i class="bi bi-geo-alt-fill"></i>
    cli
  </button>` : "";
}

function renderList(results) {

  clearClientList();

  let listItems = "";

  results.forEach(result => {
    const { name, cto, coord, city, ctoId } = result;
    const { lat, lng } = coord;

    let item = `
    <li class="list-group-item d-flex justify-content-between align-items-center gap-2">
      <p class="mb-0 small">${name}  <b>${city ? city : ""}</b></p>
    <div class="btn-group d-flex align-items-center" role="group" style="height:25px"
      data-cto="${(cto || name)}"
      data-lat="${lat}"
      data-lng="${lng}"
      data-cto-id="${ctoId}"
      data-cto-client="${name}"
    >
      <button 
        class="btn btn-sm btn-outline-success d-flex gap-2" data-find="cto">
        <i class="bi bi-box-fill"></i>
        cto
      </button>
      ${renderGeoBtn(!city)}    
    </div> 
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

function openNewTab(url) {
  const win = window.open(url, '_blank')
  win.focus()
}

function toggleElementsAttr(selector, attr, add) {
  document.querySelectorAll(selector).forEach(el => el.toggleAttribute(attr, add));
}

function toggleElementClass(selectors, className, add) {
  [...selectors].forEach(selector => $(selector).classList[add ? "add" : "remove"](className));
}

async function setClientLocation(client, id, cto, endpoint = "ctoclient") {

  const position = await getCurrentPosition();

  if (!position) {
    alert("erro ao pegar localização, tente novamente");
    return
  }

  const bodyRequest = {
    name: client,
    lat: position.latitude,
    lng: position.longitude,
    cto_id: id,
    user: JSON.parse(sessionStorage.getItem("user")).name,
    cto_name: cto,
    date_time: new Date().toLocaleString("pt-BR", { timeZone: "UTC" })
  }

  const apiResponse = await sendApiReq({
    endpoint,
    httpMethod: "POST",
    body: bodyRequest
  });

  return { apiResponse, position };

}

async function handleClientLocationSubmit(client, id, cto) {
  try {
    $("#embedMap").innerHTML = spinner({ width: "5rem", height: "5rem" });

    toggleElementsAttr("#addClientLocation", "disabled", true);

    const { apiResponse } = await setClientLocation(client, id, cto);

    toggleElementsAttr("#addClientLocation", "disabled");

    if (apiResponse.status == 201) {
      toggleElementClass(["#sendToGoogleMaps", "#updateClientLocation"], "d-none", false);

      handleClientLocation(client, id);
    }
  } catch (err) {
    alert(`erro ${err.message}`);

    toggleElementsAttr("#addClientLocation", "disabled");
  }
}


async function handleClientLocation(client, id, cto) {

  const response = await sendApiReq({
    endpoint: "ctoclientid",
    httpMethod: "POST",
    body: {
      cto_id: id,
      name: client
    }
  });

  if (response.status === 200) {
    let { lat, lng, link } = response.data;

    $("#sendToGoogleMaps").addEventListener("click", () => openNewTab(link));

    $("#updateClientLocation").addEventListener("click", async () => {
      if (confirm(`Atualizar localização de ${client} ?`)) {
        const { position } = await setClientLocation(client, id, cto, "updatectoclient");

        if (position) {
          let { latitude, longitude } = position;

          const newLink = createCtoLink({
            lat: latitude,
            lng: longitude
          });

          link = newLink;

          insertMap(latitude, longitude);

          alert("Localização atualizada com sucesso");
        }
      }

    }, { once: true });

    toggleElementClass(["#addClientLocation"], "d-none", true);

    toggleElementClass(["#sendToGoogleMaps", "#updateClientLocation"], "d-none", false);

    insertMap(lat, lng);

  } else {

    toggleElementClass(["#addClientLocation"], "d-none", false);

    toggleElementClass(["#sendToGoogleMaps", "#updateClientLocation"], "d-none", true);

    $("#embedMap").innerHTML = `<i class="bi bi-globe-americas" style="font-size: 8rem"></i>`;

    $("#addClientLocation").addEventListener("click", () => handleClientLocationSubmit(client, id, cto), { once: true });

  }

  locationModal.show();
}


list.addEventListener("click", function (event) {
  if (event.target.dataset.find) {
    const isFindindCto = event.target.dataset.find === "cto";

    const data = event.target.closest(".btn-group").dataset;

    const { cto, lat, lng, ctoId, ctoClient } = data;

    if (isFindindCto) {
      filterCto(cto);
      setCenter(parseFloat(lat), parseFloat(lng));
      offCanvas.hide();
    } else {
      handleClientLocation(ctoClient, ctoId);
    }

  }
});

