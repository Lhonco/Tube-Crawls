import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./database.db");

const handler = function (obj) {
    const query = "select * from stations";

    return new Promise(function (resolve, reject) {
        db.all(query, [], function (err, rows) {
            if(err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });

    // return Promise.resolve({
    //     "pub": obj.name + "pub"
    // });
};

export default Object.freeze(handler);