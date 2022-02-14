import Ajax from "./ajax.js";
import Map from "./map.js";

const UI = Object.create(null);

const byId = (id) => document.getElementById(id);
const byTag = (tag) => document.getElementsByTagName(tag)[0];
// const cloneTemplate = (id) => document.importNode(byId(id).content, true);
const cl = (text) => console.log(text);

UI.init = function () {

    // Experimental zoom (fully working except jumping to new position af
    // after zoom)
    // Scale original svg by factor
    // Used parseFloat to get rid of px in width and height

    // console.log(byTag("svg").style.transform);
    let scaleFactor = byId("zoom").value;
    scaleFactor = 2;
    byId("status-map").style.setProperty("--scale", scaleFactor);
    byId("zoom").oninput = function (event) {
        scaleFactor = parseFloat(event.target.value);
        byId("status-map").style.setProperty("--scale", scaleFactor);
    };


    let dragging = false;
    let posSave = [0, 0];
    let newPos = [];
    let dragStop = [];
    let dragStart = [];

    const mousePress = function (event) {
        event.preventDefault();
        dragging = false;
        dragStart[0] = event.clientX;
        dragStart[1] = event.clientY;
        document.addEventListener("mouseup", mouseRelease);
        document.addEventListener("mousemove", mouseDrag);
        // Test disabling station names to make panning smoother
        // document.getElementById("station-names").style.display = "none";
        // console.log(`Click after drag: ${dragStart}`);
    };

    const mouseDrag = function (event) {
        event.preventDefault();
        dragging = true;
        dragStop[0] = event.clientX - dragStart[0];
        dragStop[1] = event.clientY - dragStart[1];
        newPos[0] = dragStop[0] + posSave[0];
        newPos[1] = dragStop[1] + posSave[1];
        const mapWidth = parseFloat(byId("status-map").getAttribute("width"));
        const windowWidth = window.innerWidth;
        const mapHeight = parseFloat(byId("status-map").getAttribute("height"));
        const windowHeight = window.innerHeight;

        if (newPos[0] > 0 && newPos[0] >= (
            (mapWidth - windowWidth) / 2 + (mapWidth / 2) *
            (scaleFactor - 1) + (0.4 * windowWidth)
        )) {
            newPos[0] = (mapWidth - windowWidth) / 2
                + (mapWidth / 2) * (scaleFactor - 1) + (0.4 * windowWidth);
        } else if (newPos[0] < 0 && newPos[0] <= - (mapWidth - windowWidth) / 2
            - (mapWidth / 2) * (scaleFactor - 1)) {
            newPos[0] = - (mapWidth - windowWidth) / 2
                - (mapWidth / 2) * (scaleFactor - 1);
        }
        if (newPos[1] > 0 && newPos[1] >= (mapHeight - windowHeight) / 2
            + (mapHeight / 2) * (scaleFactor - 1)) {
            newPos[1] = (mapHeight - windowHeight) / 2
                + (mapHeight / 2) * (scaleFactor - 1);
        } else if (newPos[1] < 0 && newPos[1] <= - (mapHeight - windowHeight)
            / 2 - (mapHeight / 2) * (scaleFactor - 1)) {
            newPos[1] = - (mapHeight - windowHeight)
                / 2 - (mapHeight / 2) * (scaleFactor - 1);
        }
        byId("status-map").style.setProperty("--dragX", newPos[0] + "px");
        byId("status-map").style.setProperty("--dragY", newPos[1] + "px");
    };

    const mouseRelease = function () {
        document.removeEventListener("mousemove", mouseDrag);
        if (dragging) {
            byId("status-map").onmouseup = null;
            byId("status-map").onmousemove = null;
            posSave[0] += dragStop[0];
            posSave[1] += dragStop[1];
            const mapWidth = parseFloat(byId("status-map")
                .getAttribute("width"));
            const windowWidth = window.innerWidth;
            const mapHeight = parseFloat(byId("status-map")
                .getAttribute("height"));
            const windowHeight = window.innerHeight;
            if (posSave[0] > 0 && posSave[0] >= (mapWidth - windowWidth) / 2
                + (mapWidth / 2) * (scaleFactor - 1) + (0.4 * windowWidth)) {
                posSave[0] = (mapWidth - windowWidth) / 2 + (mapWidth / 2)
                    * (scaleFactor - 1) + (0.4 * windowWidth);
            } else if (posSave[0] < 0 && posSave[0] <= - (mapWidth
                    - windowWidth) / 2 - (mapWidth / 2) * (scaleFactor - 1)) {
                posSave[0] = - (mapWidth - windowWidth)
                    / 2 - (mapWidth / 2) * (scaleFactor - 1);
            }
            if (posSave[1] > 0 && posSave[1] >= (mapHeight - windowHeight) / 2
                + (mapHeight / 2) * (scaleFactor - 1)) {
                posSave[1] = (mapHeight - windowHeight) / 2 + (mapHeight / 2)
                    * (scaleFactor - 1);
            } else if (posSave[1] < 0 && posSave[1] <= - (mapHeight
                    - windowHeight) / 2 - (mapHeight / 2) * (scaleFactor - 1)) {
                posSave[1] = - (mapHeight - windowHeight) / 2
                    - (mapHeight / 2) * (scaleFactor - 1);
            }
        }
    };

    byId("status-map").addEventListener("mousedown", mousePress);

    let stationName;
    let stationId;

    // Test if fewer items returned when filtering for station-name
    // console.log(byClass("blue-fill").length);
    // console.log(byId("station-names")
        // .getElementsByClassName("blue-fill").length);

    // const stations2 = byId("station-names")
        // .getElementsByClassName("blue-fill").length;
    // Using querySelector instead of getElements makes forEach useable
    const stations = Array.from(byId("station-names")
        .querySelectorAll(".blue-fill"));

    const getStationId = function (searchedStation) {
        let stationN;
        let stationI;
        let stationA;
        stations.forEach(function (selectedStation) {
            if (selectedStation.id === "") {
                // cl(selectedStation.parentNode.childNodes);
                selectedStation.parentNode.childNodes.forEach(function (other) {
                    stationN += other.textContent;
                });
                if (selectedStation.parentNode.id === "") {
                    stationI = selectedStation.parentNode.parentNode.id;
                } else {
                    stationI = selectedStation.parentNode.id;
                }
                // First removes undefined, then searches for multiple spaces
                // replacing them with just one and then searching for spaces
                // followed by only one character to get rid of spaces in
                // St James's Park and finally adds space before & back in
                stationN = Map.formatStationName(stationN);
            } else {
                stationN = selectedStation.textContent;
                stationI = selectedStation.id;
            }
            stationI = stationI.replace(/s-/g, "").replace(/_.+/g, "");
            if (stationN === searchedStation) {
                stationA = stationI;
            }
        });
        return stationA;
    };


    stations.forEach(function (selectedStation) {
        selectedStation.setAttribute("fill", "black");

        selectedStation.onmouseover = function () {
            if (selectedStation.id === "") {
                Array.from(selectedStation.parentNode.childNodes)
                    // Filters out weird whitespace
                    .filter((x) => (x.nodeName !== "#text"))
                    .map(function (x) {
                        x.style.fontWeight = "bold";
                        x.style.cursor = "pointer";
                    });
            } else {
                selectedStation.style.fontWeight = "bold";
                selectedStation.style.cursor = "pointer";
            }
        };

        selectedStation.onmouseout = function () {
            if (selectedStation.id === "") {
                Array.from(selectedStation.parentNode.childNodes)
                    // Filters out weird whitespace
                    .filter((x) => (x.nodeName !== "#text"))
                    .map(function (x) {
                        x.style.fontWeight = "";
                        x.style.cursor = "";
                    });
            } else {
                selectedStation.style.fontWeight = "";
                selectedStation.style.cursor = "";
            }
        };

        selectedStation.onclick = function () {
            stationName = "";
            if (selectedStation.id === "") {
                selectedStation.parentNode.childNodes.forEach(function (other) {
                    stationName += other.textContent;
                });
                if (selectedStation.parentNode.id === "") {
                    stationId = selectedStation.parentNode.parentNode.id;
                } else {
                    stationId = selectedStation.parentNode.id;
                }
                // First removes undefined, then searches for multiple spaces
                // replacing them with just one and then searching for spaces
                // followed by only one character to get rid of spaces in
                // St James's Park and finally adds space before & back in
                stationName = Map.formatStationName(stationName);
            } else {
                stationName = selectedStation.textContent;
                stationId = selectedStation.id;
            }
            stationId = stationId.replace(/s-/g, "").replace(/_.+/g, "");
            byId("search").value = stationName;

            byId("submit").click();
        };
    });

    byId("submit").onclick = function () {
        stationName = byId("search").value;

        stationId = getStationId(stationName);


        const request = {
            "type": "getStation",
            "name": stationName,
            "id": stationId
        };

        const response = Ajax.query(request);

        // Returns JSON object
        response.then(function (object) {
            if (object[0]) {
                byId("edit-station").style.display = "none";
                byId("selected-station").style.display = "block";
                byTag("h2").textContent = object[0].stationName;
                byId("pub").textContent = object[0].pubName;
                byId("drink").textContent = object[0].drinkName;
                byId("price").textContent = `£${object[0].drinkPrice}`;
            } else {
                byId("selected-station").style.display = "none";
                byId("edit-station").style.display = "block";
            }
        });

        let related = [];
        byId("status-map").querySelectorAll(`[id*="${stationId}"]`)
            .forEach(function (nodes) {
            related.push(nodes.id);
        });
        cl(related);
    };

    byId("submit-edit").onclick = function () {
        const request = {
            "type": "editStation",
            "name": byId("search").value,
            "pub": byId("add-pub").value,
            "drink": byId("add-drink").value,
            "price": byId("add-price").value
        };

        Ajax.query(request);
    };
};

export default Object.freeze(UI);