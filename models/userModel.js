const Datastore = require("gray-nedb");
const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserDAO {
    constructor(dbFilePath) {
        if (dbFilePath) this.db = new Datastore({ filename: dbFilePath, autoload: true }); //embedded
        else this.db = new Datastore(); //in memory
    }

    create(username, passwordHash) {
        const that = this;

        bcrypt.hash(passwordHash, saltRounds).then((hash) => {
            var entry = {
                user: username,
                password: hash,
            };

            that.db.insert(entry, (err) => {
                if (err) {
                    console.log("Can't insert user: ", username);
                }
            });
        });
    }

    lookup(username) {
        var result = this.db.find({ 'user': username });
        if (result == null) {
            return null;
        }
        else {
            return result[0];
        }

    }
}
const dao = new UserDAO("users.db");

module.exports = dao;