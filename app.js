// ============================================================
// НАСТРОЙКИ
// ============================================================

const csvFileInput = document.getElementById("csvFile");
const tableContainer = document.getElementById("tableContainer");
const fileName = document.getElementById("fileName");


// ============================================================
// ПО УМОЛЧАНИЮ ЗАГРУЖАЕМ data1.csv
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    loadDefaultCSV();

});


// ============================================================
// ЗАГРУЗКА data1.csv
// ============================================================

async function loadDefaultCSV() {

    try {

        const response = await fetch("data1.csv");

        if (!response.ok) {
            throw new Error("Не удалось загрузить data1.csv");
        }

        const text = await response.text();

        fileName.textContent = "data1.csv";

        generateTable(text);

    }

    catch (error) {

        console.error("Ошибка:", error);

        tableContainer.innerHTML = `
            <p>
                Не удалось загрузить data1.csv.
            </p>
        `;

    }

}


// ============================================================
// EVENT: пользователь выбрал CSV
// ============================================================

csvFileInput.addEventListener("change", async function () {

    const file = this.files[0];

    if (!file) {
        return;
    }

    fileName.textContent = file.name;

    const text = await file.text();

    generateTable(text);

});


// ============================================================
// ОСНОВНАЯ ФУНКЦИЯ
// ============================================================
//
// На вход:
//     текст CSV
//
// На выход:
//     генерирует HTML-таблицу
//
// ============================================================

function generateTable(text) {

    try {

        // ----------------------------------------------------
        // 1. Парсим CSV
        // ----------------------------------------------------

        const data = parseCSV(text);


        if (data.length === 0) {

            tableContainer.innerHTML = `
                <p>CSV файл пустой.</p>
            `;

            return;
        }


        // ----------------------------------------------------
        // 2. Первая строка = заголовки
        // ----------------------------------------------------

        const headers = data[0];

        // Остальные строки = данные
        const rows = data.slice(1);


        // ----------------------------------------------------
        // 3. Создаём HTML таблицу
        // ----------------------------------------------------

        const table = document.createElement("table");

        table.className = "data-table";


        // ----------------------------------------------------
        // 4. Создаём THEAD
        // ----------------------------------------------------

        const thead = document.createElement("thead");

        const headerRow = document.createElement("tr");


        headers.forEach(header => {

            const th = document.createElement("th");

            th.textContent = header;
            // Колонка "Телефон"
            if (header.trim() === "Телефон") {
                th.style.minWidth = "180px";
                th.style.width = "180px";
                th.style.whiteSpace = "nowrap";
            }

            headerRow.appendChild(th);

        });


        thead.appendChild(headerRow);

        table.appendChild(thead);


        // ----------------------------------------------------
        // 5. Создаём TBODY
        // ----------------------------------------------------

        const tbody = document.createElement("tbody");


        rows.forEach(row => {

            const tr = document.createElement("tr");


            row.forEach((value, index) => {

                const td = document.createElement("td");

                td.textContent = value;
                // --------------------------------------------
                // Если это колонка "Телефон"
                // --------------------------------------------
                // Колонка "Телефон"
                if (headers[index].trim() === "Телефон") {
                    td.style.minWidth = "180px";
                    td.style.width = "180px";
                    td.style.whiteSpace = "nowrap";
                }

                // --------------------------------------------
                // Если это колонка "Приоритет"
                // --------------------------------------------

                if (headers[index] === "Приоритет") {

                    if (value === "A") {
                        td.classList.add("priority-A");
                    }

                    if (value === "B") {
                        td.classList.add("priority-B");
                    }

                }


                tr.appendChild(td);

            });


            tbody.appendChild(tr);

        });


        table.appendChild(tbody);


        // ----------------------------------------------------
        // 6. Очищаем контейнер
        // ----------------------------------------------------

        tableContainer.innerHTML = "";


        // ----------------------------------------------------
        // 7. Wrapper для горизонтального скролла
        // ----------------------------------------------------

        const wrapper = document.createElement("div");

        wrapper.className = "table-wrapper";

        wrapper.appendChild(table);


        // ----------------------------------------------------
        // 8. Вставляем таблицу
        // ----------------------------------------------------

        tableContainer.appendChild(wrapper);

    }

    catch (error) {

        console.error("Ошибка:", error);

        tableContainer.innerHTML = `
            <p>
                Ошибка при чтении CSV файла.
            </p>
        `;

    }

}


// ============================================================
// CSV PARSER
// ============================================================

function parseCSV(text) {

    const rows = [];

    let row = [];

    let value = "";

    let insideQuotes = false;


    for (let i = 0; i < text.length; i++) {

        const char = text[i];

        const nextChar = text[i + 1];


        if (char === '"') {

            if (insideQuotes && nextChar === '"') {

                value += '"';

                i++;

            }

            else {

                insideQuotes = !insideQuotes;

            }

            continue;
        }


        if (char === "," && !insideQuotes) {

            row.push(value);

            value = "";

            continue;
        }


        if (
            (char === "\n" || char === "\r") &&
            !insideQuotes
        ) {

            if (char === "\r" && nextChar === "\n") {
                i++;
            }


            row.push(value);

            value = "";


            if (
                row.length > 1 ||
                row[0].trim() !== ""
            ) {

                rows.push(row);

            }


            row = [];

            continue;
        }


        value += char;

    }


    if (value !== "" || row.length > 0) {

        row.push(value);

        rows.push(row);

    }


    if (
        rows.length > 0 &&
        rows[0].length > 0
    ) {

        rows[0][0] = rows[0][0].replace(/^\uFEFF/, "");

    }


    return rows;
}
