const Datastore = require('gray-nedb');

class DanceClassBookingDAO {
    constructor(dbFilePath) {
        if (dbFilePath) this.db = new Datastore({ filename: dbFilePath, autoload: true }); //embedded
        else this.db = new Datastore(); //in memory
    }

    //#region Commands

    createDanceClassBooking = (danceClassId, userId, name, email, bookingReference) => {
        var entry = {
            danceClassId: danceClassId,
            userId: userId,
            name: name,
            email: email,
            bookingReference: bookingReference,
            createdDateTime: new Date()
        };

        return new Promise((resolve, reject) => {
            this.db.insert(entry, (err, newItem) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(newItem._id);
                }
            });
        });
    };

    deleteDanceClassById = (classId) => {
        return new Promise((resolve, reject) => {
            this.db.remove({ _id: classId }, {}, (err, numRemoved) => err ? reject(numRemoved) : resolve(classId));
        });
    };

    //#endregion


    //#region Queries

    getAllDanceClasses = () => {
        this.db.find({}, (err, items) => {
            if (!err) {
                return items;
            } else {
                return [];
            }
        });
    };

    getDanceClassById = (classId) => {
        return new Promise((resolve, reject) => {
            this.db.findOne({ _id: classId }, (err, item) => err ? reject(err) : resolve(item));
        });
    };

    //#endregion
}

const dao = new DanceClassBookingDAO("danceClassBookings.db");

module.exports = dao;