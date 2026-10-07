// ============================================================
// НАСТРОЙКИ
// ============================================================

const CSV_FILE = "jbeton-data.csv";


// ============================================================
// ELEMENTS
// ============================================================

const tableHead =
    document.getElementById("tableHead");

const tableBody =
    document.getElementById("tableBody");

const searchInput =
    document.getElementById("searchInput");

const companyCount =
    document.getElementById("companyCount");

const logoutButton =
    document.getElementById("logoutButton");


// ============================================================
// ДАННЫЕ
// ============================================================

let headers = [];

let allRows = [];


// ============================================================
// ЗАПУСК
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadCSV();

    }
);


// ============================================================
// ЗАГРУЗКА CSV
// ============================================================

async function loadCSV() {

    try {

        const response =
            await fetch(CSV_FILE);


        if (!response.ok) {

            throw new Error(
                "Не удалось загрузить " + CSV_FILE
            );

        }


        const text =
            await response.text();


        // Парсим CSV
        const data =
            parseCSV(text);


        if (data.length === 0) {

            showError(
                "CSV файл пустой."
            );

            return;
        }


        // Первая строка = заголовки
        headers = data[0];


        // Остальные строки = компании
        allRows = data.slice(1);


        // Создаём таблицу
        renderHeader();

        renderTable(allRows);


        // Показываем количество
        updateCompanyCount(
            allRows.length
        );

    }

    catch (error) {

        console.error(
            "Ошибка:",
            error
        );


        showError(
            "Не удалось загрузить базу компаний."
        );

    }

}


// ============================================================
// СОЗДАНИЕ ЗАГОЛОВКА ТАБЛИЦЫ
// ============================================================

function renderHeader() {

    tableHead.innerHTML = "";


    const row =
        document.createElement("tr");


    headers.forEach(function (header) {

        const th =
            document.createElement("th");


        th.textContent =
            header;


        row.appendChild(th);

    });


    tableHead.appendChild(row);

}


// ============================================================
// СОЗДАНИЕ ТАБЛИЦЫ
// ============================================================

function renderTable(rows) {

    tableBody.innerHTML = "";


    rows.forEach(function (row) {

        const tr =
            document.createElement("tr");


        headers.forEach(function (header, index) {

            const td =
                document.createElement("td");


            const value =
                row[index] ?? "";


            td.textContent =
                value;


            // --------------------------------------------
            // Телефон
            // --------------------------------------------

            if (
                header.trim() === "Телефон"
            ) {

                td.classList.add(
                    "phone-column"
                );

            }


            // --------------------------------------------
            // Email
            // --------------------------------------------

            if (
                header.trim() === "Email"
            ) {

                td.classList.add(
                    "email-column"
                );

            }


            tr.appendChild(td);

        });


        tableBody.appendChild(tr);

    });


    updateCompanyCount(
        rows.length
    );

}


// ============================================================
// ПОИСК
// ============================================================

searchInput.addEventListener(
    "input",
    function () {

        const search =
            this.value
                .trim()
                .toLowerCase();


        if (search === "") {

            renderTable(allRows);

            return;
        }


        const filteredRows =
            allRows.filter(function (row) {

                return row.some(function (value) {

                    return String(value)
                        .toLowerCase()
                        .includes(search);

                });

            });


        renderTable(filteredRows);

    }
);


// ============================================================
// КОЛИЧЕСТВО КОМПАНИЙ
// ============================================================

function updateCompanyCount(count) {

    companyCount.textContent =
        "Компаний: " + count;

}


// ============================================================
// ОШИБКА
// ============================================================

function showError(message) {

    tableBody.innerHTML = `
        <tr>
            <td colspan="${headers.length || 1}">
                ${message}
            </td>
        </tr>
    `;

}


// ============================================================
// ВЫХОД
// ============================================================

logoutButton.addEventListener(
    "click",
    function () {

        sessionStorage.removeItem(
            "isLoggedIn"
        );


        window.location.href =
            "index.html";

    }
);


// ============================================================
// ПРОВЕРКА АВТОРИЗАЦИИ
// ============================================================

if (
    sessionStorage.getItem("isLoggedIn")
    !== "true"
) {

    window.location.href =
        "index.html";

}


// ============================================================
// CSV PARSER
// ============================================================
//
// Разделитель: ;
// Поддерживает:
// "Компания, ООО"
// "Трубы; лист; арматура"
// ============================================================

function parseCSV(text) {

    const rows = [];

    let row = [];

    let value = "";

    let insideQuotes = false;


    for (
        let i = 0;
        i < text.length;
        i++
    ) {

        const char =
            text[i];

        const nextChar =
            text[i + 1];


        // ----------------------------------------------------
        // Кавычки
        // ----------------------------------------------------

        if (char === '"') {

            if (
                insideQuotes &&
                nextChar === '"'
            ) {

                value += '"';

                i++;

            }

            else {

                insideQuotes =
                    !insideQuotes;

            }

            continue;
        }


        // ----------------------------------------------------
        // ТОЧКА С ЗАПЯТОЙ
        // ----------------------------------------------------

        if (
            char === ";" &&
            !insideQuotes
        ) {

            row.push(value);

            value = "";

            continue;
        }


        // ----------------------------------------------------
        // НОВАЯ СТРОКА
        // ----------------------------------------------------

        if (
            (
                char === "\n" ||
                char === "\r"
            ) &&
            !insideQuotes
        ) {

            // Windows CRLF
            if (
                char === "\r" &&
                nextChar === "\n"
            ) {

                i++;

            }


            row.push(value);

            value = "";


            // Не добавляем пустые строки
            if (
                row.length > 1 ||
                row[0].trim() !== ""
            ) {

                rows.push(row);

            }


            row = [];

            continue;
        }


        // ----------------------------------------------------
        // ОБЫЧНЫЙ СИМВОЛ
        // ----------------------------------------------------

        value += char;

    }


    // --------------------------------------------------------
    // ПОСЛЕДНЯЯ СТРОКА
    // --------------------------------------------------------

    if (
        value !== "" ||
        row.length > 0
    ) {

        row.push(value);

        rows.push(row);

    }


    // --------------------------------------------------------
    // Убираем BOM
    // --------------------------------------------------------

    if (
        rows.length > 0 &&
        rows[0].length > 0
    ) {

        rows[0][0] =
            rows[0][0]
                .replace(/^\uFEFF/, "");

    }


    return rows;

}
