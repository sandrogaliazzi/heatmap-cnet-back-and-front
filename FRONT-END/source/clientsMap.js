import { sendApiReq } from "./handleApiRequests.js";
import { createCtoLink } from "./mapUtils.js";
import { $ } from "./handleForm.js";

const clientsList = [];
const markersList = [];

let embedMap;

function insertMapAndPlaceMarkers(markers, elToInject) {
  const { lat, lng } = markers[50];

  embedMap = new google.maps.Map($(elToInject), {
    zoom: 13,
    center: new google.maps.LatLng(lat, lng),
  });

  markers.forEach(marker => {
    const { lat, lng, user, name } = marker;

    markersList.push(
      new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: embedMap,
        title: name,
        icon: "../images/person-icon.png",
      })
    );
  });

  markersList.forEach(marker => {
    marker.addListener("click", function () {
      const { lat, lng } = this.position.toJSON();

      const infoWindow = new google.maps.InfoWindow({
        content: `<a href="${createCtoLink({
          lat,
          lng,
        })}" target="_blank">Abrir Localização no Mapa</a>`,
      });

      infoWindow.open({
        anchor: marker,
        map: embedMap,
      });
    });
  });
}

async function fetchClientes() {
  const clients = await sendApiReq({
    endpoint: "ctoclient",
    httpMethod: "GET",
  });

  clientsList.push(...clients.data);

  return clients.data;
}

async function renderMap() {
  const clients = await fetchClientes();

  $("#totalClietnsWithLocation").innerHTML = clients.length;

  insertMapAndPlaceMarkers(clients, "#clientsMap");
}

async function deleteCtoClient(id) {
  const deleted = sendApiReq({
    endpoint: `deletectoclient/${id}`,
    httpMethod: "DELETE",
  });

  return deleted;
}

$("#clientLocationsModal").addEventListener("show.bs.modal", function () {
  renderMap();
});

$("#foundResults").addEventListener("click", async function (event) {
  if (event.target.dataset.action === "centerMap") {
    const { lat, lng } = event.target.dataset;

    embedMap.setCenter(new google.maps.LatLng(lat, lng));
    embedMap.setZoom(23);

    this.innerHTML = "";
  }

  if (event.target.dataset.action === "delete") {
    if (confirm("deseja deletar este cliente?")) {
      const deleted = await deleteCtoClient(event.target.dataset.deleteId);

      console.log(deleted);

      $(`[data-key="${event.target.dataset.deleteId}"]`).classList.add(
        "d-none"
      );
    }
  }
});

$("#findClientWithLocation").addEventListener("keyup", function (event) {
  const query = this.value;

  $("#foundResults").innerHTML = "";

  if (query) {
    const filterClients = clientsList.filter(
      client => client.name.indexOf(query.toUpperCase()) > -1 && query
    );

    if (filterClients.length > 0) {
      let listItens = "";

      filterClients.forEach(client => {
        const link = createCtoLink({ lat: client.lat, lng: client.lng });
        listItens += `
        <li class="list-group-item" data-key="${client._id}">
        <div class="d-flex justify-content-between align-items-center">
          <span>${client.name}</span>
          <div>
            <div class="d-flex gap-2 align-items-center">
              <a class="btn btn-primary" href="${link}" target="_blank" role="button">
                Maps
                <i class="bi bi-google"></i>
              </a>
              <button
                class="btn btn-success"
                data-lat="${client.lat}"
                data-lng="${client.lng}"
                data-action="centerMap"
              >
                Ver no mapa
                <i class="bi bi-geo-alt-fill"></i>
              </button>
              <button
                class="btn btn-secondary"
                data-delete-id="${client._id}"
                data-action="delete"
              >
              
              <i class="bi bi-trash-fill"></i>
              </button>
            </div>
          </div>
        </div>
      </li>
            `;
      });

      $("#foundResults").innerHTML = listItens;
    } else {
      $("#foundResults").innerHTML = "";
    }
  }
});
