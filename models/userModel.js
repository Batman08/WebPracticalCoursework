const Datastore = require("gray-nedb");

class UserDAO {
    constructor(dbFilePath) {
        if (dbFilePath) this.db = new Datastore({ filename: dbFilePath, autoload: true }); //embedded
        else this.db = new Datastore(); //in memory

        // Auto-compact every 5 minutes
        this.db.persistence.setAutocompactionInterval(5 * 60 * 1000);
    }

    create(username, passwordHash, name, email) {
        var entry = {
            username: username,
            password: passwordHash,
            name: name,
            email: email,
            role: null,
            createdDateTime: new Date()
        };

        this.db.insert(entry, (err) => {
            if (err) {
                console.log("Can't insert user: ", username);
            }
        });
    }

    addUserOrganiserRole = (userId) => {
        return new Promise((resolve, reject) => {
            this.db.update({ _id: userId }, { $set: { role: "Admin Organiser" } }, {}, (err, numUpdated) => err ? reject(err) : resolve(numUpdated));
        });
    }

    deleteUserOrganiserRole = (userId) => {
        return new Promise((resolve, reject) => {
            this.db.update({ _id: userId }, { $set: { role: null } }, {}, (err, numUpdated) => err ? reject(err) : resolve(numUpdated));
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


    getAllUsers = () => {
        return new Promise((resolve, reject) => {
            this.db.find({})
                .sort({ name: 1 }) // Sort by name in ascending order
                .exec((err, items) => err ? resolve([]) : resolve(items));
        });
    }
}
const dao = new UserDAO("users.db");

module.exports = dao;