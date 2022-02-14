import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./database.db");

const handlers = Object.create(null);

const queryPromise = function (query, ...queryParams) {
    return new Promise(function (resolve, reject) {
        db.all(query, queryParams, function (err, rows) {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
};

const actionPromise = function (query, ...queryParams) {
    return new Promise(function (resolve, reject) {
        db.run(query, queryParams, function (err, rows) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this.changes);
            // db.close();
        });
    });
};

const handler = function (obj) {

    return Promise.resolve(handlers[obj.type](obj));

    // return Promise.resolve({
    //     "pub": obj.name + "pub"
    // });
};

handlers.getStation = function (obj) {
    const query = "SELECT * FROM stations WHERE stationName = ?";

    return queryPromise(query, obj.name);
};

handlers.editStation = function (obj) {
    const query = "INSERT INTO stations VALUES (null, ?, ?, ?, ?)";

    return actionPromise(query, obj.name, obj.pub, obj.drink, obj.price);
};

export default Object.freeze(handler);