const Datastore = require("gray-nedb");
const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserDAO {
    constructor(dbFilePath) {
        if (dbFilePath) this.db = new Datastore({ filename: dbFilePath, autoload: true }); //embedded
        else this.db = new Datastore(); //in memory
    }

    create(username, passwordHash) {
        var entry = {
            username: username,
            password: passwordHash,
        };

        this.db.insert(entry, (err) => {
            if (err) {
                console.log("Can't insert user: ", username);
            }
        });
    }

    lookup(username) {
        return new Promise((resolve, reject) => {
            this.db.find({ 'username': username }, (err, entries) => {
                if (err || entries.length === 0) {
                    reject('User not found');
                } else {
                    resolve(entries[0]);
                }
            });
        });
    }
}
const dao = new UserDAO("users.db");

module.exports = dao;