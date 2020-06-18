import Ajax from "./ajax.js";

const Map = Object.create(null);

const byId = (id) => document.getElementById(id);
const byClass = (class_html) => document.getElementsByClassName(class_html);
const byTag = (tag) => document.getElementsByTagName(tag)[0];
const cl = (text) => console.log(text);

Map.init = function () {

    // Scale original svg by factor
    // Used parseFloat to get rid of px in width and height

    // console.log(byTag("svg").style.transform);
    let scaleFactor = byId("zoom").value;
    scaleFactor = 2;
    byId("status-map").style.setProperty("--scale", scaleFactor);
    byId("zoom").oninput = function(event) {
        // console.log(event.target.value);
        scaleFactor = parseFloat(event.target.value);
        // console.log(scaleFactor);
        byId("status-map").style.setProperty("--scale", scaleFactor);
        // byTag("svg").setAttribute("width", byId("zoom").value * parseFloat(byTag("svg").getAttribute("width")) + "px");
        // byTag("svg").setAttribute("height", byId("zoom").value * parseFloat(byTag("svg").getAttribute("height")) + "px");
    };

    // let posSave = [0, 0];
    // byTag("svg").addEventListener("mousedown", function (event) {
    //     let newPos = [];
    //     let dragStop = [];
    //     let dragStart = [];

    //     event.preventDefault();
    //     dragStart[0] = event.clientX;
    //     dragStart[1] = event.clientY;
    //     document.onmouseup = closeDragElement;
    //     document.onmousemove = elementDrag;

    // function elementDrag(e) {
    //     e.preventDefault();
    //     dragStop[0] = e.clientX - dragStart[0];
    //     dragStop[1] = e.clientY - dragStart[1];
    //     newPos[0] = dragStop[0] + posSave[0];
    //     newPos[1] = dragStop[1] + posSave[1];
    //     // console.log((parseFloat(byTag("svg").getAttribute("width"))) / 2);
    //     if (newPos[0] >= (parseFloat(byTag("svg").getAttribute("width"))) / 2) {
    //         newPos[0] = parseFloat(byTag("svg").getAttribute("width")) / 2;
    //     }
    //     // byTag("svg").style.transform = "translate(" + newPos[0] + "px, " + newPos[1] + "px)";
    //     byTag("svg").style.setProperty("--dragX", newPos[0] + "px");
    //     byTag("svg").style.setProperty("--dragY", newPos[1] + "px");
    // }

    // function closeDragElement() {
    //     document.onmouseup = null;
    //     document.onmousemove = null;
    //     posSave[0] += dragStop[0];
    //     posSave[1] += dragStop[1];
    //     // console.log(`Stop dragging: ${dragStop}`);
    // }
    // });


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
        document.addEventListener('mouseup', mouseRelease);
        document.addEventListener('mousemove', mouseDrag);
        // Disable station names to make panning smoother
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

        if (newPos[0] > 0 && newPos[0] >= (mapWidth - windowWidth) / 2 + (mapWidth / 2) * (scaleFactor - 1) + (0.4 * windowWidth)) {
            newPos[0] = (mapWidth - windowWidth) / 2 + (mapWidth / 2) * (scaleFactor - 1) + (0.4 * windowWidth);
        } else if (newPos[0] < 0 && newPos[0] <= - (mapWidth - windowWidth) / 2 - (mapWidth / 2) * (scaleFactor - 1)) {
            newPos[0] = - (mapWidth - windowWidth) / 2 - (mapWidth / 2) * (scaleFactor - 1);
        }
        if (newPos[1] > 0 && newPos[1] >= (mapHeight - windowHeight) / 2 + (mapHeight / 2) * (scaleFactor - 1)) {
            newPos[1] = (mapHeight - windowHeight) / 2 + (mapHeight / 2) * (scaleFactor - 1);
        } else if (newPos[1] < 0 && newPos[1] <= - (mapHeight - windowHeight) / 2 - (mapHeight / 2) * (scaleFactor - 1)) {
            newPos[1] = - (mapHeight - windowHeight) / 2 - (mapHeight / 2) * (scaleFactor - 1);
        }
        // byTag("svg").style.transform = "translate(" + newPos[0] + "px, " + newPos[1] + "px)";
        byId("status-map").style.setProperty("--dragX", newPos[0] + "px");
        byId("status-map").style.setProperty("--dragY", newPos[1] + "px");
    };

    const mouseRelease = function () {
        // console.log(dragging ? 'drag' : 'click');
        document.removeEventListener("mousemove", mouseDrag);
        if (dragging) {
            byId("status-map").onmouseup = null;
            byId("status-map").onmousemove = null;
            posSave[0] += dragStop[0];
            posSave[1] += dragStop[1];
            const mapWidth = parseFloat(byId("status-map").getAttribute("width"));
            const windowWidth = window.innerWidth;
            const mapHeight = parseFloat(byId("status-map").getAttribute("height"));
            const windowHeight = window.innerHeight;
            if (posSave[0] > 0 && posSave[0] >= (mapWidth - windowWidth) / 2 + (mapWidth / 2) * (scaleFactor - 1) + (0.4 * windowWidth)) {
                posSave[0] = (mapWidth - windowWidth) / 2 + (mapWidth / 2) * (scaleFactor - 1) + (0.4 * windowWidth);
            } else if (posSave[0] < 0 && posSave[0] <= - (mapWidth - windowWidth) / 2 - (mapWidth / 2) * (scaleFactor - 1)) {
                posSave[0] = - (mapWidth - windowWidth) / 2 - (mapWidth / 2) * (scaleFactor - 1);
            }
            if (posSave[1] > 0 && posSave[1] >= (mapHeight - windowHeight) / 2 + (mapHeight / 2) * (scaleFactor - 1)) {
                posSave[1] = (mapHeight - windowHeight) / 2 + (mapHeight / 2) * (scaleFactor - 1);
            } else if (posSave[1] < 0 && posSave[1] <= - (mapHeight - windowHeight) / 2 - (mapHeight / 2) * (scaleFactor - 1)) {
                posSave[1] = - (mapHeight - windowHeight) / 2 - (mapHeight / 2) * (scaleFactor - 1);
            }
            // console.log(`Stop dragging: ${dragStop}`);
        }
        // Enable station names again when stop panning
        // document.getElementById("station-names").style.display = "";
    };

    byId("status-map").addEventListener("mousedown", mousePress);

    // Test if fewer items returned when filtering for station-name
    // console.log(byClass("blue-fill").length);
    // console.log(byId("station-names").getElementsByClassName("blue-fill").length);

    // const stations2 = byId("station-names").getElementsByClassName("blue-fill").length;
    // Using querySelector instead of getElements makes forEach useable
    const stations = Array.from(byId("station-names").querySelectorAll(".blue-fill"));
    // const stations = byId("station-names").querySelectorAll(".blue-fill");

    cl(stations);
    // cl(stations.filter(x => (x.childNodes.nodeName === "#text")));

    stations.forEach(function (selectedStation) {
        selectedStation.setAttribute("fill", "black");

        selectedStation.onmouseover = function () {
            if (selectedStation.id === "") {
                Array.from(selectedStation.parentNode.childNodes)
                    // Filters out weird whitespace
                    .filter(x => (x.nodeName !== "#text"))
                    .map(x => {
                        x.style.fontWeight = "bold";
                        x.style.cursor = "pointer";
                });
            } else {
                selectedStation.style.fontWeight = "bold";
                selectedStation.style.cursor = "pointer";
            }
        }

        selectedStation.onmouseout = function () {
            if (selectedStation.id === "") {
                Array.from(selectedStation.parentNode.childNodes)
                    // Filters out weird whitespace
                    .filter(x => (x.nodeName !== "#text"))
                    .map(x => {
                        x.style.fontWeight = "";
                        x.style.cursor = "";
                });
            } else {
                selectedStation.style.fontWeight = "";
                selectedStation.style.cursor = "";
            }
        }

        selectedStation.onclick = function () {
            // console.log(station.id);
            let stationName;
            let stationId;
            if (selectedStation.id === "") {
                // cl(selectedStation.parentNode.childNodes);
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
                stationName = stationName
                    .replace("undefined", "")
                    .replace(/\s\s+/g, " ")
                    .replace(/\s(?!.[A-Za-z])/g, "")
                    .replace("&", " &")
                    .trim();
            } else {
                // console.log(station.textContent);
                stationName = selectedStation.textContent;
                stationId = selectedStation.id;
            }
            stationId = stationId.replace(/s-/g, "").replace(/_.+/g, "");
            // byId("selected").textContent = `Selected station: ${stationName}`;
            byId("search").value = stationName;
            byTag("h2").textContent = stationName;
            cl(`Station: ${stationName}\nID: ${stationId}`);

            const request = {
                "name": stationName,
                "id": stationId
            }

            const response = Ajax.query(request);

            // Returns JSON object
            response.then(function (object) {
                cl(JSON.stringify(object));
                cl(object.pub);
            });
    
            const responseMessage = response.then((res) => res.pub);
    
            responseMessage.then(function (msg) {
                byId("pub").textContent = `Pub: ${msg}`;
            });

            // let related = [];
            // byTag("svg").querySelectorAll(`[id*="${stationId}"]`).forEach(function (nodes) {
            //     related.push(nodes.id);
            // });
            // cl(related);
        };
    });

    // Change tube line between stations on mouseover

    // const polls = document.querySelectorAll("[id^='lul-']");

    // Array.prototype.forEach.call(polls, callback);

    // function callback(element, iterator) {
    //     element.addEventListener("mousedown", function (event) {
    //         // console.log(iterator, element.id);
    //         event.target.style.stroke = "black";
    //         event.target.style.cursor = "pointer";

    //         event.target.addEventListener("mouseout", function (event) {
    //             event.target.style.stroke = "";
    //         });
    //     });
    // }
};

export default Object.freeze(Map);