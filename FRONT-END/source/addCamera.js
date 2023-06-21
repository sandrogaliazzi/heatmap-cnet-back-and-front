import { sendApiReq } from "./handleApiRequests.js";
import { $, get } from "./handleForm.js";
import { triggerToast } from "./toast.js";

const modal = new bootstrap.Modal($("#addCameraModal"));

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

  if (response.status === 200) {
    triggerToast("Dados enviados com sucesso", true);
    this.reset();
    modal.hide();
  } else {
    triggerToast("Ocorreu um erro ao enviar os dadoas", false);
  }
});
