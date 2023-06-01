import { triggerToast, toast } from "./toast.js";

export const headersConfig = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "x-access-token": sessionStorage.getItem("token"),
};

const baseURL = "https://api.heatmap.conectnet.net";

export default async function sendApiRequest(
  url,
  httpMethod = "GET",
  bodyRequest
) {
  const response = await fetch(url, {
    method: httpMethod,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: bodyRequest ? JSON.stringify(bodyRequest) : null,
  });

  const status = response.status;

  const content = await response.json();

  return { content, status };
}

export async function sendApiReq({ endpoint, httpMethod, body }) {
  const response = await fetch(`${baseURL}/${endpoint}`, {
    method: httpMethod,
    headers: headersConfig,
    body: JSON.stringify(body) || null,
  });

  const status = response.status;

  if (!response.ok) {
    if (status >= 500) {
      triggerToast("ocorreu um erro no servidor, tente novamente", false);
      console.log(response);
    } else if (status === 403 || status === 401) {
      triggerToast("Sua sessão expirou, faça login novamente", false);

      toast.addEventListener("hidden.bs.toast", function () {
        location.href = "/";
      });
    }
  }

  const data = await response.json();

  return { data, status };
}
