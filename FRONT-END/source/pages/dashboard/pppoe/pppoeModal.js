import { getAllPppoe } from "./pppoe.js";

function getRandomColor(city) {
  const colors = {
    "NOVA HARTZ": "text-bg-primary",
    ARARICA: "text-bg-success",
    "FAZ. FIALHO": "text-bg-danger",
    "M. PEDRA": "text-bg-warning",
    IGREJINHA: "text-bg-info",
    PAROBE: "text-bg-dark",
    SAPIRANGA: "text-bg-light",
  };

  return colors[city];
}

export function generateRamalCards(ramalList) {
  return ramalList.reduce((htmlText, ramal) => {
    const offlinePppoeList = JSON.parse(
      localStorage.getItem("offlinePppoeList")
    );

    const reducedPppoeCountByCto = offlinePppoeList
      .filter(item => item.cto_name.split("-")[0] === ramal)
      .reduce(
        (total, item, _, array) => {
          if (!total.pppoeCount) total.pppoeCount = array.length;
          if (!total[item.cto_name]) {
            total[item.cto_name] = true;
            total.ctoCount++;
            total.city = item.city;
          }

          return total;
        },
        { ctoCount: 0 }
      );

    const { ctoCount, pppoeCount } = reducedPppoeCountByCto;

    htmlText += `
            <div class="col">
            <div class="card text-bg-warning mb-3">
            <div class="card-header">pppoe offline ${pppoeCount}</div>
            <div class="card-body">
                <h5 class="card-title" data-ramal="${ramal}" type="button" data-bs-toggle="modal" data-bs-target="#pppoeCtoModal">${ramal}</h5>
                <p class="card-text">
                    Número de ctos dentro deste ramal: ${ctoCount}
                </p>
            </div>
            </div>
        </div>
    `;

    return htmlText;
  }, "");
}

export function generateCtoCards(ramal) {
  const offlinePppoeList = JSON.parse(localStorage.getItem("offlinePppoeList"));
  const ctoIdList = [];

  const filterCtoByRamal = offlinePppoeList
    .filter(item => item.cto_name.split("-")[0] === ramal)
    .reduce((total, item) => {
      if (!total.includes(item) && !ctoIdList.includes(item.cto_id)) {
        total.push(item);
        ctoIdList.push(item.cto_id);
      }
      return total;
    }, [])
    .sort((a, b) => {
      const ctoA = offlinePppoeList.filter(
        cto => cto.cto_id === a.cto_id
      ).length;

      const ctoB = offlinePppoeList.filter(
        cto => cto.cto_id === b.cto_id
      ).length;

      return ctoB - ctoA;
    })
    .reduce((htmlText, item) => {
      const { cto_id, cto_name, city } = item;

      const clients = offlinePppoeList.filter(
        cto => cto.cto_id === cto_id
      ).length;

      htmlText += `
        <div class="col">
            <div class="card ${getRandomColor(city)} mb-3">
            <div class="card-header">pppoe offline ${clients}</div>
            <div class="card-body">
                <h5 class="card-title" type="button" data-cto-id="${cto_id}" data-bs-toggle="modal" data-bs-target="#pppoeClientModal">${cto_name}</h5>
                <p class="card-text">
                    ${city}
                </p>
            </div>
            </div>
        </div>`;

      return htmlText;
    }, "");

  return filterCtoByRamal;
}

export async function generateCtoClientList(cto) {
  const offlinePppoeList = JSON.parse(localStorage.getItem("offlinePppoeList"));

  const updatedPppoeList = await getAllPppoe();

  document.querySelector("#loadClientSpinner").classList.add("d-none");

  const pppoeByCto = updatedPppoeList.filter(item => item.cto_id === cto);

  const { cto_name, city } = pppoeByCto[0];

  const pppoeOfflineCtoIdList = offlinePppoeList
    .filter(item => item.cto_id === cto)
    .map(cto => cto._id);

  document.querySelector(
    "#pppoeClientModalLabel"
  ).innerHTML = `#${cto_name} ${city}`;

  return pppoeByCto.reduce((htmlText, item) => {
    const { name, pppoe, _id, pppoeVerified } = item;

    htmlText += `
    <li class="list-group-item d-flex justify-content-between align-items-start ${
      pppoeOfflineCtoIdList.includes(_id) ? "" : "list-group-item-success"
    }" >
        <div class="ms-2 me-auto">
        <div class="fw-bold">${name}</div>
        <i id="checkIcon_${_id}" class="bi bi-check-circle-fill text-success ${
      pppoeVerified ? "" : "d-none"
    }"></i>
        <span id="${_id}">${pppoe}</span>
        </div>
        <button class="btn btn-primary" data-user-id="${_id}">
            <i class="bi bi-pencil-square"></i>
            Editar
        </button>
    </li>
    `;

    return htmlText;
  }, "");
}
