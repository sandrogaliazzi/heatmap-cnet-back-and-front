import { sendApiReq } from "../../../handleApiRequests.js";
import { editPppoe, generateRamalTable } from "./pppoeEdit.js";
import { $ } from "../../../handleForm.js";
import { insertMap } from "../../../mapUtils.js";
import {
  generateCtoCards,
  generateRamalCards,
  generateCtoClientList,
} from "./pppoeModal.js";

const mapPosition = {
  lat: "-29.58576358380055",
  lng: " -50.8956005852099",
};

const pppoeMap = insertMap(mapPosition.lat, mapPosition.lng, "#pppoeMap");

async function getAllPppoeOnline() {
  const response = await sendApiReq({
    endpoint: "getallpppoeonline",
    httpMethod: "GET",
  });

  return response.data;
}

export async function getAllPppoe() {
  const response = await sendApiReq({
    endpoint: "pppoeget",
    httpMethod: "GET",
  });

  return response.data;
}

function setPppoeInfoDate(date) {
  $("#pppoeInfoDate").innerHTML = date;
}

function filterOfflinePppoe(pppoeList, pppoeOnline) {
  const pppoeOnlineList = [];

  for (let prop in pppoeOnline) {
    pppoeOnlineList.push(pppoeOnline[prop]);
  }

  const offlinePpppoeList = pppoeList.filter(client => {
    const isPppoeOnline = pppoeOnlineList.find(
      pppoeOnline => pppoeOnline.pppoe === client.pppoe
    );

    return !isPppoeOnline ? true : false;
  });

  return offlinePpppoeList;
}

function sortPppoeByRamal(pppoeClientsList) {
  const ramalList = [];
  const ramalCount = {};

  pppoeClientsList.forEach(data => {
    const ramal = data.cto_name.split("-")[0];

    if (!ramalList.includes(ramal)) {
      ramalList.push(ramal);
      ramalCount[ramal] = 1;
    } else {
      ramalCount[ramal]++;
    }
  });

  const sortedRamals = ramalList.sort(
    (ramalA, ramaB) => ramalCount[ramaB] - ramalCount[ramalA]
  );

  return { sortedRamals, ramalCount };
}

function setHeatMap(pppoeCoordList) {
  const heatmap = new google.maps.visualization.HeatmapLayer({
    data: pppoeCoordList,
    radius: 50,
  });

  heatmap.setMap(pppoeMap);
}

function checkFirstLoad() {
  if (localStorage.getItem("firstLoad")) return true;
  else if (!localStorage.getItem("pppoeList")) {
    localStorage.setItem("firstLoad", "true");
    return false;
  }
}

async function loadPppoeInfo() {
  const firstLoad = checkFirstLoad();

  $("#pppoeInfoLoader").classList.remove("d-none");

  let pppoeList,
    onlinePppoeList = "";

  if (firstLoad) {
    onlinePppoeList = await getAllPppoeOnline();

    localStorage.setItem("onlinePppoeList", JSON.stringify(onlinePppoeList));

    pppoeList = await getAllPppoe();

    localStorage.setItem("pppoeList", JSON.stringify(pppoeList));

    localStorage.removeItem("firstLoad");

    localStorage.setItem("newUpdate", new Date().toLocaleString("pt-BR"));

    setPppoeInfoDate(localStorage.getItem("newUpdate"));

    alert("dados atualizados");
  } else {
    onlinePppoeList = JSON.parse(localStorage.getItem("onlinePppoeList"));

    pppoeList = JSON.parse(localStorage.getItem("pppoeList"));

    localStorage.setItem("lastUpdate", localStorage.getItem("newUpdate"));

    setPppoeInfoDate(localStorage.getItem("lastUpdate"));
  }

  const offlinePppoeList = filterOfflinePppoe(pppoeList, onlinePppoeList);

  const { sortedRamals, ramalCount } = sortPppoeByRamal(offlinePppoeList);

  localStorage.setItem("offlinePppoeList", JSON.stringify(offlinePppoeList));

  localStorage.setItem("ramalCount", JSON.stringify(ramalCount));

  const offlinePppoeCoordList = offlinePppoeList.map(pppoe => {
    const lat = parseFloat(pppoe.lat);
    const lng = parseFloat(pppoe.lng);

    return new google.maps.LatLng(lat, lng);
  });

  return {
    pppoeList,
    onlinePppoeList,
    offlinePppoeList,
    sortedRamals,
    ramalCount,
    offlinePppoeCoordList,
  };
}

function setRamalCards(html) {
  document.getElementById("ramalCardsList").innerHTML = html;
}

function setCtoCards(html) {
  document.getElementById("ctoCardsList").innerHTML = html;
}

function setClientList(html) {
  document.getElementById("pppoeClientList").innerHTML = html;
}

$("#ramalCardsList").addEventListener("click", e => {
  const { ramal } = e.target.dataset;

  if (!ramal) return;

  setCtoCards(generateCtoCards(ramal));
});

$("#ctoCardsList").addEventListener("click", async e => {
  const { ctoId } = e.target.dataset;

  if (!ctoId) return;

  document.querySelector("#loadClientSpinner").classList.remove("d-none");
  document.getElementById("pppoeClientList").innerHTML = "";

  setClientList(await generateCtoClientList(ctoId));
});

function addCheckIcon(id) {
  $(`#checkIcon_${id}`).classList.remove("d-none");
}

$("#pppoeClientList").addEventListener("click", async e => {
  const { userId } = e.target.dataset;

  console.log("caiu aqui");

  if (!userId) return;

  const pppoe = prompt("Digite o pppoe Novo");

  if (pppoe) {
    const response = await editPppoe(userId, pppoe);

    if (response === 200) {
      document.getElementById(userId).innerHTML = pppoe;

      addCheckIcon(userId);
      alert("pppoe alterado com sucesso");
    } else alert("ocorreu um erro, tente novamente!");
  }
});

function main(refresh) {
  loadPppoeInfo().then(pppoeData => {
    const { sortedRamals, offlinePppoeCoordList } = pppoeData;

    setHeatMap(offlinePppoeCoordList);
    setRamalCards(generateRamalCards(sortedRamals));
    $("#pppoeInfoLoader").classList.add("d-none");

    if (refresh) generateRamalTable();
  });
}

main();

$("#refreshPppoeInfo").addEventListener("click", _ => {
  console.log("caiu no refresh");
  localStorage.setItem("firstLoad", "true");
  localStorage.setItem("oldRamalCount", localStorage.getItem("ramalCount"));
  localStorage.setItem("oldLastUpdate", localStorage.getItem("lastUpdate"));
  main(true);
});

$("#loadRamalTable").addEventListener("click", e => {
  if (localStorage.getItem("oldRamalCount")) generateRamalTable();
});
