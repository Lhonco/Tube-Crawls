const handler = function (obj) {
    const reversed = obj.message.split("").reverse().join("");
    return {
        "message": reversed
    };
};

export default Object.freeze(handler);