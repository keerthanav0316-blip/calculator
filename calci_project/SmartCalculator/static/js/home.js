function openNormal() {

    window.location.href = "/normal";

}


function openScientific() {

    window.location.href = "/scientific";

}
function toggleTheme() {

    document.body.classList.toggle("light-mode");


    if (
        document.body.classList.contains(
            "light-mode"
        )
    ) {

        localStorage.setItem(
            "theme",
            "light"
        );

    }

    else {

        localStorage.setItem(
            "theme",
            "dark"
        );

    }

}


if (
    localStorage.getItem("theme") ===
    "light"
) {

    document.body.classList.add(
        "light-mode"
    );

}