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

    getClassBookingsByUserId = (userId) => {
        return new Promise((resolve, reject) => {
            this.db.find({ createdByUserId: userId })
                .sort({ title: 1 }) // Sort by title in ascending order
                .exec((err, items) => err ? resolve([]) : resolve(items));
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

                // Only return danceClassBookingId and booking reference values
                // const result = items.map(item => ({
                //     _id: item._id,
                //     bookingReference: item.bookingReference
                // }));
                // resolve(result);
        });
    }

    //#endregion
}

const dao = new DanceClassBookingDAO("danceClassBookings.db");

module.exports = dao;