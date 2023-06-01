import { sendApiReq } from "./handleApiRequests.js";

export async function getPppoeStatus(pppoe) {
  const pppoeStatus = await sendApiReq({
    endpoint: "pppoeonline",
    httpMethod: "POST",
    body: {
      pppoe: pppoe,
    },
  });

  return pppoeStatus.status === 201 ? true : false;
}

export async function getCtoPppoeStatus(clients) {
  const pppoeList = clients.map(client => {
    return {
      name: client.name,
      pppoe: generatePppoe(client.name),
    };
  });

  const ctoStatus = await Promise.all(
    pppoeList.map(({ name, pppoe }) =>
      getPppoeStatus({ name, pppoeName: pppoe })
    )
  );

  //   const { name, pppoe } = pppoeList[0];

  //   const ctoStatus = await getPppoeStatus({ name, pppoeName: pppoe });

  return ctoStatus;
}

export function generatePppoe(name) {
  let validPppoename = name;

  if (name.includes("(")) {
    validPppoename = name.split("(")[0].trim();
  }

  const firstName = validPppoename.split(" ")[0];
  const lastName = validPppoename.split(" ").pop();

  return `${firstName}${lastName}fibra`.toLowerCase();
}
