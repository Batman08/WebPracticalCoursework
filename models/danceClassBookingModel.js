const Datastore = require('gray-nedb');

class DanceClassBookingDAO {
    constructor(dbFilePath) {
        if (dbFilePath) this.db = new Datastore({ filename: dbFilePath, autoload: true }); //embedded
        else this.db = new Datastore(); //in memory

        // Auto-compact every 5 minutes
        this.db.persistence.setAutocompactionInterval(5 * 60 * 1000);
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

    deleteDanceClassBookingById = (bookingId) => {
        return new Promise((resolve, reject) => {
            this.db.remove({ _id: bookingId }, {}, (err, numRemoved) => err ? reject() : resolve(numRemoved));
        });
    };

    //#endregion


    //#region Queries

    getClassBookingsByUserId = (userId) => {
        return new Promise((resolve, reject) => {
            this.db.find({ userId: userId })
                .sort({ title: 1 }) // Sort by title in ascending order
                .exec((err, items) => {
                    if (err) return resolve([]);

                    //only return danceClassBookingId and danceClassId values
                    const result = items.map(item => ({
                        danceClassBookingId: item._id,
                        danceClassId: item.danceClassId,
                    }));
                    resolve(result);
                });
        });
    }

    getClassBookingsByBookingReference = (bookingReference) => {
        return new Promise((resolve, reject) => {
            this.db.find({ bookingReference: bookingReference })
                .sort({ title: 1 }) // Sort by title in ascending order
                .exec((err, items) => {
                    if (err) return resolve([]);

                    //only return danceClassBookingId and danceClassId values
                    const result = items.map(item => ({
                        danceClassBookingId: item._id,
                        danceClassId: item.danceClassId,
                    }));
                    resolve(result);
                });
        });
    }

    getClassBookingsByClassId = (danceClassId) => {
        return new Promise((resolve, reject) => {
            this.db.find({ danceClassId: danceClassId })
                .sort({ name: 1 }) // Sort by name in ascending order
                .exec((err, items) => err ? resolve([]) : resolve(items));
        });
    }

    //#endregion
}

const dao = new DanceClassBookingDAO("danceClassBookings.db");

module.exports = dao;