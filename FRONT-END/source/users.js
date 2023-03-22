import { get, set, $ } from "./handleForm.js";
import { sendApiReq } from "./handleApiRequests.js";
import { logout } from "./logout.js";
import { triggerToast } from "./toast.js";

const userTable = $("#usersTableBody");
const logTable = $("#logsTableBody");
const form = $("#addUserForm");
const userModal = new bootstrap.Modal($("#addUsersModal"));
const popovers = [];

$("#addUsersModal").addEventListener("hidden.bs.modal", function () {
  form.reset();
  set("#userId", "");
});

function showPopover(id, popoverInfo) {
  if (popovers.length > 0) popovers.forEach(popover => popover.hide());

  const popover = new bootstrap.Popover(document.getElementById(id), {
    title: `Numero de Loigns: ${popoverInfo.userLogin}`,
    content: `Data do último Login: ${popoverInfo.userLastLogin}`,
    trigger: "focus",
  });

  popovers.push(popover);

  popover.show();

  setTimeout(() => {
    popover.hide();
  }, 5000);
}

async function saveNewUser(reqBody) {
  const apiResponse = await sendApiReq({
    endpoint: "users",
    httpMethod: "POST",
    body: reqBody,
  });

  apiResponse.status === 201 &&
    triggerToast("usuário adicionado com sucess", true);
  renderUserTable();
}

async function editUserAndSave(reqBody, id) {
  const apiResponse = await sendApiReq({
    endpoint: `users/${id}`,
    httpMethod: "PUT",
    body: reqBody,
  });

  apiResponse.status === 200 &&
    triggerToast("usuário editado com sucesso", true);
  renderUserTable();
}

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const reqBody = {
    name: get("#userName"),
    password: get("#userPassword"),
    category: get("#userCategory"),
  };

  const userId = get("#userId");

  userId ? editUserAndSave(reqBody, userId) : saveNewUser(reqBody);

  userModal.hide();
  renderUserTable();
});

export async function fetchUsers() {
  const users = await sendApiReq({
    endpoint: "users",
    httpMethod: "GET",
  });

  const logins = await fetchLogins();

  return users.data.map(user => {
    const { loginCounter, lastDate } = logins[user?.name] || "indefinido";

    return {
      _id: user._id,
      name: user.name,
      category: user.category,
      loginCounter,
      lastDate,
    };
  });
}

export async function fetchLogs() {
  const logs = await sendApiReq({
    endpoint: "logctoclient",
    httpMethod: "GET",
  });

  return logs.data;
}

async function fetchLogins() {
  const logins = await sendApiReq({
    endpoint: "logindataget",
    httpMethod: "GET",
  });

  const loginsByUser = {};

  return logins.data.reduce((_, current) => {
    if (loginsByUser[current.name]) {
      loginsByUser[current.name].loginCounter++;
    } else {
      loginsByUser[current.name] = { loginCounter: 1, lastDate: current.date };
    }

    return loginsByUser;
  });
}

function getTableRows(type, dataRows) {
  let rows = "";

  dataRows.forEach((data, index) => {
    let row = `<tr>${getTableColumn(type, data, index)}</tr>`;

    rows += row;
  });

  return rows;
}

function getTableColumn(type, data, index) {
  if (type === "user") {
    const { name, category, _id: id, loginCounter, lastDate } = data;

    return `<th scope="row">${index + 1}</th>
            <td id="${id}" 
              data-user-id="${id}"
              data-user-login="${loginCounter || ""}" 
              data-user-last-login="${
                lastDate?.split(" ")[0] || "sem registro"
              }"
              data-user-action="showPopover"
            >${name}</td>
            <td>${category}</td>
            <td>
              <div class="btn-group" role="group">
                <button 
                  type="button" 
                  class="btn btn-sm btn-secondary" 
                  data-user-id="${id}" 
                  data-user-action="delete"
                >
                  Excluir
                </button>
                <button 
                  type="button" 
                  class="btn btn-sm btn-secondary" 
                  data-user-id="${id}" 
                  data-user-action="edit"
                >
                  Editar
                </button>
              </div>
            </td>
    `;
  } else if (type === "logs") {
    const { name, date_time, cto_name, user, _id } = data;

    return `<th scope="row">${index + 1}</th>
    <td>${name}</td>
    <td>${cto_name}</td>
    <td>${user}</td>
    <td>${date_time}</td>
    <td>
      <button 
        data-log-id="${_id}" 
        class="btn btn-outline-danger btn-sm"
      >
        Del
      </button>
    </td>
`;
  }
}

async function setTableContent(type, filterResults) {
  const data = type === "user" ? await fetchUsers() : await fetchLogs();

  const tableContent = getTableRows(type, filterResults ? filterResults : data);

  return tableContent;
}

function mountFilter(query) {
  let filter = "";

  query.forEach((q, i) => {
    let [key, value] = q;

    if (key === "date") {
      value = new Date(value)
        .toLocaleString("pt-bt", { timeZone: "UTC" })
        .split(" ")[0];
    }

    if (query.length > 1) {
      if (!i) {
        filter = `${key} === "${value.toUpperCase()}"`;
      } else {
        filter += ` && ${key} === "${value.toUpperCase()}"`;
      }
    } else {
      filter = `${key} === "${value.toUpperCase()}"`;
    }
  });

  return filter;
}

$("#filterLogForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const logFormData = new FormData(this);

  const query = [];

  for (const item of logFormData.entries()) {
    if (item[1]) query.push(item);
  }

  if (!query.length) return;

  const filter = mountFilter(query);

  const logs = await fetchLogs();

  const filterLogs = logs.filter(log => {
    const { name, cto_name, date_time, user } = log;
    const date = date_time.split(" ")[0];

    return eval(filter);
  });

  renderLogsTable(filterLogs);
});

$("#updateLogBtn").addEventListener("click", function () {
  $("#filterLogForm").reset();

  renderLogsTable();
});

let isSortDesc = false;
$("#sortLogsByDateBtn").addEventListener("click", async function () {
  const logs = await fetchLogs();

  const sortedLogs = logs.sort(function (a, b) {
    let firstDate = a.date_time.split(" ")[0].split("/");
    let secondDate = b.date_time.split(" ")[0].split("/");

    if (isSortDesc) {
      return (
        new Date(firstDate[2], firstDate[1] - 1, firstDate[0]) <
        new Date(secondDate[2], secondDate[1] - 1, secondDate[0])
      );
    } else {
      return (
        new Date(firstDate[2], firstDate[1] - 1, firstDate[0]) >
        new Date(secondDate[2], secondDate[1] - 1, secondDate[0])
      );
    }
  });

  renderLogsTable(sortedLogs);
  isSortDesc = !isSortDesc;
});

function renderUserTable() {
  setTableContent("user").then(data => (userTable.innerHTML = data));
}

function renderLogsTable(withFilter = "") {
  setTableContent("logs", withFilter).then(data => (logTable.innerHTML = data));
}

function updateLogs() {
  setInterval(() => {
    renderLogsTable();
    console.log("atualizado " + new Date().toLocaleString());
  }, 5 * 100000);
}

function renderTablesAll() {
  renderLogsTable();
  renderUserTable();
}

function setForm(user) {
  const { name, category, _id: id } = user.data;

  set("#userName", name);
  set("#userCategory", category);
  set("#userId", id);
}

async function deleteUser(id) {
  if (confirm("deseja excluir este usuário permanentemente?")) {
    const apiResponse = await sendApiReq({
      endpoint: `users/${id}`,
      httpMethod: "DELETE",
    });

    if (apiResponse.status == 200)
      triggerToast("usuário deletado com sucesso", true);

    renderUserTable();
  }
}

async function editUser(id) {
  const user = await sendApiReq({
    endpoint: `users/${id}`,
    httpMethod: "GET",
  });

  setForm(user);

  userModal.show();
}

userTable.addEventListener("click", function (event) {
  const { userId, userAction } = event.target.dataset;

  switch (userAction) {
    case "delete":
      deleteUser(userId);
      break;

    case "edit":
      editUser(userId);

    case "showPopover":
      const { userLogin, userLastLogin } = event.target.dataset;
      showPopover(userId, { userLogin, userLastLogin });
    default:
      break;
  }
});

logTable.addEventListener("click", async function (event) {
  const { logId } = event.target.dataset;

  console.log(event.target.dataset);

  if (!logId) return;

  if (confirm("deseja excluir este log?")) {
    const deleted = await sendApiReq({
      endpoint: `deletectolog/${logId}`,
      httpMethod: "DELETE",
    });

    if (deleted.status === 201) {
      console.log(deleted);
      renderLogsTable();
    }
  }
});

$("#btnLogout").addEventListener("click", logout);

renderTablesAll();
updateLogs();
