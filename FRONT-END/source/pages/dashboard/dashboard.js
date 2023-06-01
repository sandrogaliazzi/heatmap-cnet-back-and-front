import { $ } from "../../handleForm.js";

const location = "/static/pages/dashboard/";

const routes = {
  "/users": location + "users/users",
  "/logs": location + "logs/logs",
  "/pppoe": location + "pppoe/pppoe",
};

async function loadHtml(path) {
  const page = await fetch(`${path}.html`);

  const pageContent = await page.text();

  return pageContent;
}

function loadJS(path) {
  if ($("#injectedScript")) $("#injectedScript").remove();

  const scriptEle = document.createElement("script");

  const FILE_URL = `${path}.js?verion=${Date.now()}`;

  scriptEle.setAttribute("src", FILE_URL);
  scriptEle.setAttribute("type", "module");
  scriptEle.setAttribute("defer", true);
  scriptEle.setAttribute("id", "injectedScript");

  // error event
  scriptEle.addEventListener("error", ev => {
    console.log("Error on loading file", ev);
  });

  return scriptEle;
}

async function loadPage(path) {
  const rootDiv = document.querySelector("#root");

  const page = await loadHtml(path);

  const scriptTag = loadJS(path);

  rootDiv.innerHTML = page;

  document.head.appendChild(scriptTag);
}

function pushRoute(route) {
  return window.history.pushState({}, route, window.location.origin + route);
}

window.addEventListener("popstate", _ => {
  loadPage(routes[window.location.pathname] || routes["/users"]).then(
    console.log("page " + window.location.pathname + " loaded")
  );
});

// window.addEventListener("beforeunload", e => {
//   e.preventDefault();

//   window.location.href = location + "dashboard.html";

//   e.returnValue = "";
// });

$("#sideBarList").addEventListener("click", function (event) {
  event.preventDefault();

  if (event.target.dataset.action === "route") {
    const { route } = event.target.dataset;

    const path = routes[route];

    pushRoute(route);

    loadPage(path);
  }
});

loadPage(routes["/users"]);
