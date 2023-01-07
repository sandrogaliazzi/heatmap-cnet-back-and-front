const formRef = document.querySelector("#login-form");

formRef.addEventListener("submit", function (e) {
  e.preventDefault();

  const form = new FormData(formRef);

  const user = form.get("user-name").toLowerCase();

  const password = form.get("password");

  checkLogin(user, password);

  formRef.reset();
});

async function fetchUsers() {
  const response = await fetch("https://api.heatmap.conectnet.net/users");

  const content = await response.json();

  return content;
}

async function checkLogin(username, password) {

  const users = await fetchUsers();


  const user = users.find(
    (user) => user.name == username && user.password == password
  );

  if (user) {
    window.localStorage.setItem("token", md5(Date.now().toString()));
    window.localStorage.setItem("user", user.name);
    window.location.href = `static/pages/heatmap.html`;
  } else {
    alert("Usuário ou senha Inválidos");
  }
}