import Ajax from "./ajax.js";

const UI = Object.create(null);
const el = (id) => document.getElementById(id);



UI.init = function () {
    const userInput = el("user-input");
    const requestBox = el("requestBox");
    const responseBox = el("responseBox");
    const display = el("display");

    userInput.onkeydown = function (event) {
        if (event.key !== "Enter" || event.shiftKey) {
            return; // Do nothing special.
        }

        const request = {
            "message": userInput.value
        };
        requestBox.value = JSON.stringify(request);

        const response = Ajax.query(request);

        response.then(function (object) {
            responseBox.textContent = JSON.stringify(object);
        });

        const responseMessage = response.then((res) => res.message);

        responseMessage.then(function (msg) {
            display.textContent = msg;
        });

        event.preventDefault();
    };
};

export default Object.freeze(UI);
