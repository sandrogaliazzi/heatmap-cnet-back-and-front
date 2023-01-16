import { $ } from "./handleForm.js";

export const toast = $("#liveToast");

export function triggerToast(message, type) {
  const myToast = new bootstrap.Toast(toast, {
    animation: true,
    autohide: true,
    delay: 4000
  });

  const toastClass = $(".toast").classList;

  if (type) {
    toastClass.remove("text-bg-danger");
    toastClass.add("text-bg-success");
  } else {
    toastClass.remove("text-bg-success");
    toastClass.add("text-bg-danger");
  }

  $(".toast-body").innerHTML = `<span class="fz-4">
    <strong>${message}</strong>
  </span>`;

  myToast.show();
}