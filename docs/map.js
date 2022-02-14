const Map = Object.create(null);

Map.formatStationName = function (stationString) {
    return (
        stationString
        .replace("undefined", "")
        .replace(/\s\s+/g, " ")
        .replace(/\s(?!.[A-Za-z])/g, "")
        .replace("&", " &")
        .trim()
    );
};

export default Object.freeze(Map);