const formRef = document.querySelector("#login-form");

    formRef.addEventListener("submit", function (e) {
      e.preventDefault();

      const form = new FormData(formRef);

      const user = form.get("user-name").toLowerCase();

      const password = form.get("password");

      checkLogin(user, password);

      formRef.reset();
    });

    function checkLogin(username, password) {
      const user = users.find(
        (user) => user.user == username && user.password == md5(password)
      );

      if (user) {
        window.localStorage.setItem("token", md5(Date.now().toString()));
        window.location.href = `/static/heatmap.html`;
      } else {
        alert("Usuário ou senha Inválidos");
      }
    }

    const users = [
      { user: "sandro", password: "f7ca1179cc89c868efa66923f0bf6bba" },
      { user: "guilherme", password: "5df3f03bf6c0e6476833d7491cb6e5f0" },
      { user: "externo", password: "bcd17ac2560e3f3c814b144c07e818dc" },
      { user: "tecnicos", password: "0e5982ef486699b6ebb93eda19dea932" },
      { user: "vendas", password: "61539cb06c5eae441972da212b7af1be" },
    ];