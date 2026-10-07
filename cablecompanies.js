// ============================================================
// НАСТРОЙКИ
// ============================================================

const CSV_FILE =
    "kazakhstan_cable_suppliers.csv";


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

const loadingMessage =
    document.getElementById("loadingMessage");

const errorMessage =
    document.getElementById("errorMessage");

const backButton =
    document.getElementById("backButton");


// ============================================================
// DATA
// ============================================================

let headers = [];

let allRows = [];


// ============================================================
// START
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadCSV();

    }
);


// ============================================================
// LOAD CSV
// ============================================================

async function loadCSV() {

    try {

        const response =
            await fetch(CSV_FILE);


        if (!response.ok) {

            throw new Error(
                "Не удалось загрузить файл: " +
                CSV_FILE
            );

        }


        const text =
            await response.text();


        // ----------------------------------------------------
        // Парсим CSV
        // ----------------------------------------------------

        const data =
            parseCSV(text);


        if (data.length === 0) {

            throw new Error(
                "CSV файл пустой."
            );

        }


        // ----------------------------------------------------
        // Первая строка = заголовки
        // ----------------------------------------------------

        headers =
            data[0];


        // ----------------------------------------------------
        // Остальные строки = компании
        // ----------------------------------------------------

        allRows =
            data.slice(1);


        // ----------------------------------------------------
        // Убираем loading
        // ----------------------------------------------------

        loadingMessage.style.display =
            "none";


        // ----------------------------------------------------
        // Создаём таблицу
        // ----------------------------------------------------

        renderHeader();

        renderTable(allRows);


        updateCompanyCount(
            allRows.length
        );

    }

    catch (error) {

        console.error(
            "Ошибка:",
            error
        );


        loadingMessage.style.display =
            "none";


        errorMessage.textContent =
            "Ошибка загрузки базы: " +
            error.message;


        errorMessage.style.display =
            "block";

    }

}


// ============================================================
// TABLE HEADER
// ============================================================

function renderHeader() {

    tableHead.innerHTML = "";


    const tr =
        document.createElement("tr");


    headers.forEach(
        function (header) {

            const th =
                document.createElement("th");


            th.textContent =
                header.trim();


            tr.appendChild(th);

        }
    );


    tableHead.appendChild(tr);

}


// ============================================================
// TABLE BODY
// ============================================================

function renderTable(rows) {

    tableBody.innerHTML = "";


    rows.forEach(
        function (row) {

            const tr =
                document.createElement("tr");


            headers.forEach(
                function (header, index) {

                    const td =
                        document.createElement("td");


                    const value =
                        row[index] ?? "";


                    td.textContent =
                        value.trim();


                    // ----------------------------------------
                    // Телефон
                    // ----------------------------------------

                    if (
                        header.trim() === "Телефон"
                    ) {

                        td.classList.add(
                            "phone-column"
                        );

                    }


                    // ----------------------------------------
                    // Email
                    // ----------------------------------------

                    if (
                        header.trim() === "Email"
                    ) {

                        td.classList.add(
                            "email-column"
                        );

                    }


                    tr.appendChild(td);

                }
            );


            tableBody.appendChild(tr);

        }
    );


    updateCompanyCount(
        rows.length
    );

}


// ============================================================
// SEARCH
// ============================================================

searchInput.addEventListener(
    "input",
    function () {

        const search =
            this.value
                .trim()
                .toLowerCase();


        // Если поиск пустой
        if (search === "") {

            renderTable(allRows);

            return;

        }


        // ----------------------------------------------------
        // Ищем по всем колонкам
        // ----------------------------------------------------

        const filteredRows =
            allRows.filter(
                function (row) {

                    return row.some(
                        function (value) {

                            return String(value)
                                .toLowerCase()
                                .includes(search);

                        }
                    );

                }
            );


        renderTable(
            filteredRows
        );

    }
);


// ============================================================
// COMPANY COUNT
// ============================================================

function updateCompanyCount(count) {

    companyCount.textContent =
        "Компаний: " + count;

}


// ============================================================
// BACK BUTTON
// ============================================================

backButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "main.html";

    }
);


// ============================================================
// CSV PARSER
// ============================================================
//
// Разделитель:
//     ,
//
// Поддерживает:
//     "Компания, ООО"
//
// То есть запятые внутри кавычек
// НЕ считаются разделителями.
//
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
        // Кавычка
        // ----------------------------------------------------

        if (char === '"') {

            // Двойная кавычка внутри значения
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
        // ЗАПЯТАЯ
        // ----------------------------------------------------

        if (
            char === "," &&
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


            // Не добавляем полностью пустую строку
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
    // ПОСЛЕДНЕЕ ЗНАЧЕНИЕ
    // --------------------------------------------------------

    if (
        value !== "" ||
        row.length > 0
    ) {

        row.push(value);

        rows.push(row);

    }


    // --------------------------------------------------------
    // Убираем BOM UTF-8
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
