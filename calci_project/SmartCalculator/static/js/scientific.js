const display = document.getElementById("display");


// ==========================================
// ADD VALUE
// ==========================================

function add(value) {

    display.value += value;

}


// ==========================================
// CLEAR
// ==========================================

function clearDisplay() {

    display.value = "";

}


// ==========================================
// BACKSPACE
// ==========================================

function backspace() {

    display.value =
        display.value.slice(0, -1);

}


// ==========================================
// CALCULATE
// ==========================================

async function calculate() {

    if (display.value === "") {
        return;
    }

    let expression = display.value;

    expression =
        expression.replace(/×/g, "*");

    expression =
        expression.replace(/÷/g, "/");

    try {

        const response = await fetch(
            "/calculate",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    expression: expression
                })
            }
        );


        const data =
            await response.json();


        if (data.success) {

            display.value =
                data.result;

            addHistory(
                expression,
                data.result
            );

        }

        else {

            display.value = "Error";

        }

    }

    catch (error) {

        console.error(error);

        display.value = "Error";

    }

}


// ==========================================
// SCIENTIFIC FUNCTIONS
// ==========================================

async function scientific(type) {

    if (display.value === "") {

        return;

    }


    const value =
        display.value;


    let expression = "";


    if (type === "sin") {

        expression =
            `sin(${value})`;

    }


    else if (type === "cos") {

        expression =
            `cos(${value})`;

    }


    else if (type === "tan") {

        expression =
            `tan(${value})`;

    }


    else if (type === "log") {

        expression =
            `log(${value})`;

    }


    else if (type === "ln") {

        expression =
            `ln(${value})`;

    }


    else if (type === "sqrt") {

        expression =
            `sqrt(${value})`;

    }


    else if (type === "square") {

        expression =
            `(${value})**2`;

    }


    else if (type === "factorial") {

        expression =
            `factorial(${value})`;

    }


    else if (type === "inverse") {

        expression =
            `1/(${value})`;

    }


    else {

        return;

    }


    try {

        const response = await fetch(
            "/calculate",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    expression: expression
                })
            }
        );


        const data =
            await response.json();


        if (data.success) {

            display.value =
                data.result;


            addHistory(
                expression,
                data.result
            );

        }

        else {

            display.value =
                "Error";

        }

    }

    catch (error) {

        console.error(error);

        display.value = "Error";

    }

}


// ==========================================
// HISTORY
// ==========================================

function addHistory(expression, result) {

    let history =
        JSON.parse(
            localStorage.getItem(
                "calculatorHistory"
            )
        ) || [];


    history.unshift({

        expression: expression,

        result: result

    });


    history =
        history.slice(0, 20);


    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(history)
    );


    showHistory();

}


// ==========================================
// SHOW HISTORY
// ==========================================

function showHistory() {

    const historyList =
        document.getElementById(
            "historyList"
        );


    if (!historyList) {
        return;
    }


    let history =
        JSON.parse(
            localStorage.getItem(
                "calculatorHistory"
            )
        ) || [];


    historyList.innerHTML = "";


    if (history.length === 0) {

        historyList.innerHTML =
            "<p>No calculations yet.</p>";

        return;

    }


    history.forEach(function(item) {

        const div =
            document.createElement("div");


        div.className =
            "history-item";


        div.innerHTML = `
            <span>${item.expression}</span>
            <strong>= ${item.result}</strong>
        `;


        historyList.appendChild(div);

    });

}


// ==========================================
// CLEAR HISTORY
// ==========================================

function clearHistory() {

    localStorage.removeItem(
        "calculatorHistory"
    );


    showHistory();

}


// ==========================================
// KEYBOARD
// ==========================================

document.addEventListener(
    "keydown",
    function(event) {

        const key = event.key;


        if (
            key >= "0" &&
            key <= "9"
        ) {

            add(key);

        }


        else if (
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/" ||
            key === "%" ||
            key === "." ||
            key === "(" ||
            key === ")"
        ) {

            add(key);

        }


        else if (key === "^") {

            add("**");

        }


        else if (key === "Enter") {

            event.preventDefault();

            calculate();

        }


        else if (key === "Backspace") {

            backspace();

        }


        else if (key === "Escape") {

            clearDisplay();

        }

    }
);


// Load history

showHistory();
