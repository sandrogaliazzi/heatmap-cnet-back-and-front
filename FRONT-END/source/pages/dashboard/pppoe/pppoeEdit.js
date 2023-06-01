import { sendApiReq } from "../../../handleApiRequests.js";

export async function editPppoe(id, pppoe) {
  const { status } = await sendApiReq({
    httpMethod: "PATCH",
    endpoint: "pppoealterar/" + id,
    body: {
      pppoe,
      pppoeVerified: true,
    },
  });

  return status;
}

function compareOfflinePppoe(prevList, currentList) {
  const computedData = [];
  for (const ramal in currentList) {
    if (prevList[ramal]) {
      const difference = prevList[ramal] - currentList[ramal];
      const data = {
        ramal,
        oldPppoeCount: prevList[ramal],
        newPppoeCount: currentList[ramal],
        difference,
        countStatus: difference < 0 ? "table-danger" : "table-success",
      };

      computedData.push(data);
    }
  }

  return computedData.sort((a, b) => {
    return b.newPppoeCount - a.newPppoeCount;
  });
}

function setTableContent(content) {
  return content.reduce((htmlText, item, index) => {
    const { ramal, oldPppoeCount, newPppoeCount, difference, countStatus } =
      item;
    const lastDate = localStorage.getItem("oldLastUpdate");
    const newDate = localStorage.getItem("newUpdate");
    htmlText += `
        <tr>
            <th scope="row">${index}</th>
            <td>${ramal}</td>
            <td><strong>${oldPppoeCount}</strong>: ${lastDate}</td>
            <td><strong>${newPppoeCount}</strong> : ${newDate}</td>
            <td class="${countStatus}">${difference}</td>
        </tr>
        `;

    return htmlText;
  }, "");
}

export function generateRamalTable() {
  const oldppoeCount = JSON.parse(localStorage.getItem("oldRamalCount"));
  const newPppoeCont = JSON.parse(localStorage.getItem("ramalCount"));

  const computedData = compareOfflinePppoe(oldppoeCount, newPppoeCont);

  const tableContent = setTableContent(computedData);

  document.querySelector("#ramalTable").innerHTML = tableContent;
}
