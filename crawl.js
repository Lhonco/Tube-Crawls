const byTag = (tag) => document.getElementsByTagName(tag)[0];

const Crawl = Object.create(null);



let related = [];
byTag("svg").querySelectorAll(`[id*="${stationId}"]`).forEach(function (nodes) {
    related.push(nodes.id);
});

export default Object.freeze(Crawl);