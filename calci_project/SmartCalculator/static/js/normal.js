const display = document.getElementById("display");


function add(value) {

    display.value += value;

}


function clearDisplay() {

    display.value = "";

}


function backspace() {

    display.value =
        display.value.slice(0, -1);

}


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

        const response = await fetch("/calculate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                expression: expression
            })

        });


        const data = await response.json();


        if (data.success) {

            display.value = data.result;

        }

        else {

            display.value = "Error";

        }

    }

    catch (error) {

        console.log(error);

        display.value = "Error";

    }

}