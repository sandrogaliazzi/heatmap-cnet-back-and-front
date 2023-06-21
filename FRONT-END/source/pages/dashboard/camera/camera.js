import { $ } from "../../../handleForm.js";
import { sendApiReq } from "../../../handleApiRequests.js";

const cameraTable = $("#cameraTableBody");
const modal = new bootstrap.Modal($("#showCameraImgModal"));

async function fetchCamera() {
  const cameras = await sendApiReq({
    endpoint: "getallcameras",
    httpMethod: "GET",
  });

  return cameras.data;
}

function getTableColumn(data, index) {
  const { clientCameraName, serialNumber, _id } = data;

  return `<th scope="row">${index + 1}</th>
              <td>${clientCameraName}</td>
              <td>${serialNumber}</td>
              <td>
                <button 
                type="button" 
                class="btn btn-sm btn-success" 
                data-camera-id="${_id}" 
                >
                <i class="bi bi-qr-code"></i>
                Abrir
                </button>
              </td>`;
}

function getTableRows(dataRows) {
  let rows = "";

  dataRows.forEach((data, index) => {
    let row = `<tr>${getTableColumn(data, index)}</tr>`;

    rows += row;
  });

  return rows;
}

async function setTableContent(hasFilter) {
  const data = await fetchCamera();
  console.log(data);
  let filterResults = false;
  if (hasFilter) {
    filterResults = data.filter(d => d?.clientCameraName.includes(hasFilter));
  }

  const tableContent = getTableRows(hasFilter ? filterResults : data);

  return tableContent;
}

function renderCameraTable(withFilter = false) {
  setTableContent(withFilter).then(data => (cameraTable.innerHTML = data));
}

$("#searchCameraClientInput").addEventListener("keyup", function () {
  renderCameraTable(this.value);
});

cameraTable.addEventListener("click", async function (e) {
  const id = e.target.dataset?.cameraId;

  if (!e.target.dataset.cameraId) return;

  const img = await getCodeImage(id);

  const imgContainer = $("#cameraImgContainer");

  imgContainer.style.backgroundImage = `url('${img.url}')`;

  $("#openImgBtn").dataset.imgId = img.url;

  modal.show();
});

async function getCodeImage(id) {
  const response = await fetch(
    `https://api.heatmap.conectnet.net/getcameraimg/${id}`
  );

  return response;
}

function openNewTab(url) {
  const win = window.open(url, "_blank");
  win.focus();
}

$("#openImgBtn").addEventListener("click", function () {
  openNewTab(this.dataset.imgId);
});

renderCameraTable();
