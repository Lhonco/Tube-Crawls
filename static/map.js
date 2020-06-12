const Map = Object.create(null);

const byId = (id) => document.getElementById(id);
const byClass = (class_html) => document.getElementsByClassName(class_html);
const byTag = (tag) => document.getElementsByTagName(tag)[0];

Map.init = function () {

    // Scale original svg by factor
    // Used parseFloat to get rid of px in width and height

    // console.log(byTag("svg").style.transform);
    let scaleFactor = 2;
    byId("zoom").oninput = function(event) {
        // console.log(event.target.value);
        scaleFactor = parseFloat(event.target.value);
        // console.log(scaleFactor);
        byTag("svg").style.setProperty("--scale", event.target.value);
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
        // console.log(`Click after drag: ${dragStart}`);
    };

    const mouseDrag = function (event) {
        event.preventDefault();
        dragging = true;
        dragStop[0] = event.clientX - dragStart[0];
        dragStop[1] = event.clientY - dragStart[1];
        newPos[0] = dragStop[0] + posSave[0];
        newPos[1] = dragStop[1] + posSave[1];
        // console.log((parseFloat(byTag("svg").getAttribute("width"))) / 2);
        if (newPos[0] >= (parseFloat(byTag("svg").getAttribute("width"))) / 2) {
            newPos[0] = parseFloat(byTag("svg").getAttribute("width")) / 2;
        }
        // byTag("svg").style.transform = "translate(" + newPos[0] + "px, " + newPos[1] + "px)";
        byTag("svg").style.setProperty("--dragX", newPos[0] + "px");
        byTag("svg").style.setProperty("--dragY", newPos[1] + "px");
    };

    const mouseRelease = function () {
        // console.log(dragging ? 'drag' : 'click');
        document.removeEventListener('mousemove', mouseDrag);
        if (dragging) {
            byTag("svg").onmouseup = null;
            byTag("svg").onmousemove = null;
            posSave[0] += dragStop[0];
            posSave[1] += dragStop[1];
            // console.log(`Stop dragging: ${dragStop}`);
        }
    };

    byTag("svg").addEventListener("mousedown", mousePress);

    // Test if fewer items returned when filtering for station-name
    // console.log(byClass("blue-fill").length);
    // console.log(byId("station-names").getElementsByClassName("blue-fill").length);

    // const stations2 = byId("station-names").getElementsByClassName("blue-fill").length;
    // Using querySelector instead of getElements makes forEach useable
    const stations = byId("station-names").querySelectorAll("[class='blue-fill']");

    stations.forEach(function (station) {
        station.onclick = function () {
            // console.log(station.id);
            if (station.id === "") {
                let stationName;
                station.parentNode.childNodes.forEach(function (other) {
                    stationName += other.textContent;
                });
                // First removes undefined, then searches for multiple spaces
                // replacing them with just one and then searching for spaces
                // followed by only one character to get rid of spaces in
                // St James's Park and finally adds space before & back in
                byId("selected").textContent = `Selected station: ${stationName.replace("undefined", "").replace(/\s\s+/g, " ").replace(/\s(?!.[A-Za-z])/g, "").replace("&", " &").trim()}`;
                console.log(stationName.replace("undefined", "").replace(/\s\s+/g, " ").replace(/\s(?!.[A-Za-z])/g, "").replace("&", " &").trim());
            } else {
                // console.log(station.textContent);
                byId("selected").textContent = `Selected station: ${station.textContent}`;
            }
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