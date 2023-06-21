import { sendApiReq } from "./handleApiRequests.js";
import { $, get } from "./handleForm.js";
import { triggerToast } from "./toast.js";

async function sendCamera(data) {
  const response = await sendApiReq({
    endpoint: "uploadimg",
    httpMethod: "POST",
    body: data,
    withFile: true,
  });

  return response;
}

$("#addCameraForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = new FormData(this);

  const response = await sendCamera(data);

  console.log(response);
  //   const name = data.get("clientCameraName");

  //   const serial = data.get("serialNumber");

  //   const image = data.get("formFile");

  //   const response = await sendCamera({ name, serial, image });

  //   if (response.status === 200) {
  //     triggerToast("Dados enviados com sucesso", true);
  //   } else {
  //     triggerToast("Ocorreu um erro ao enviar os dadoas", false);
  //   }

  //   console.log(response);
});
