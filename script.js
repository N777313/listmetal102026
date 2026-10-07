// ============================================================
// НАСТРОЙКИ ПОЛЬЗОВАТЕЛЯ
// ============================================================

const CORRECT_LOGIN = "admin";
const CORRECT_PASSWORD = "admin";


// ============================================================
// ELEMENTS
// ============================================================

const loginForm = document.getElementById("loginForm");

const loginInput = document.getElementById("login");

const passwordInput = document.getElementById("password");

const errorMessage = document.getElementById("errorMessage");


// ============================================================
// LOGIN
// ============================================================

loginForm.addEventListener("submit", function (event) {

    // Не перезагружаем страницу
    event.preventDefault();


    const login = loginInput.value.trim();

    const password = passwordInput.value;


    // --------------------------------------------------------
    // Проверяем логин и пароль
    // --------------------------------------------------------

    if (
        login === CORRECT_LOGIN &&
        password === CORRECT_PASSWORD
    ) {

        // Запоминаем, что пользователь вошёл
        sessionStorage.setItem("isLoggedIn", "true");


        // Переходим на основную страницу
        window.location.href = "main.html";

    }

    else {

        errorMessage.textContent =
            "Неверный логин или пароль.";

        passwordInput.value = "";

        passwordInput.focus();

    }

});
