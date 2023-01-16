import sendApiRequest from "./handleApiRequests.js"


async function login(username, password) {
  const reqBody = {
    name: username,
    password: password
  }

  const user = await sendApiRequest(
    "https://api.heatmap.conectnet.net/login",
    "POST",
    reqBody
  )

  return user
}

const formRef = document.querySelector("#login-form");

formRef.addEventListener("submit", async function (event) {
  event.preventDefault();

  const form = new FormData(formRef);

  const username = form.get("user-name").toLowerCase();

  const password = form.get("password");

  const { status, content: user } = await login(username, password);

  if (status === 201) {
    redirectIfAuthCheck(user);
  } else {
    alert("usuário ou senha inválidos");
  }

});

function redirectIfAuthCheck(user) {
  sessionStorage.setItem("token", user.token);
  sessionStorage.setItem("user", JSON.stringify(user));
  window.location.href = `static/pages/heatmap.html`;
}