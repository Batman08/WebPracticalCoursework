const Datastore = require('gray-nedb');

class DanceClassDAO {
    constructor(dbFilePath) {
        if (dbFilePath) this.db = new Datastore({ filename: dbFilePath, autoload: true }); //embedded
        else this.db = new Datastore(); //in memory
    }

    //#region Commands

    createDanceClass = (danceCourseId, userId, title, description, classDateTime, duration, location, price) => {
        var entry = {
            danceCourseId: danceCourseId,
            createdByUserId: userId,
            title: title,
            description: description,
            classDateTime: classDateTime,
            duration: duration,
            location: location,
            price: price,
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

    updateDanceClass = (classId, title, description, classDateTime, duration, location, price) => {
        return new Promise((resolve, reject) => {
            this.db.update({ _id: classId }, { $set: { title: title, description: description, classDateTime: classDateTime, duration: duration, location: location, price: price } }, {}, (err, numUpdated) => err ? reject(err) : resolve(numUpdated));
        });
    }

    deleteDanceClassById = (classId) => {
        return new Promise((resolve, reject) => {
            this.db.remove({ _id: classId }, {}, (err, numRemoved) => err ? reject(numRemoved) : resolve(classId));
        });
    };

    //#endregion


    //#region Queries

    getAllDanceClassesByCourseId = (courseId) => {
        return new Promise((resolve, reject) => {
            this.db.find({ danceCourseId: courseId })
                .sort({ title: 1 }) // Sort by title in ascending order
                .exec((err, items) => err ? resolve([]) : resolve(items));
        });

        // this.db.find({}, (err, items) => {
        //     if (!err) {
        //         return items;
        //     } else {
        //         return [];
        //     }
        // });
    }

    getDanceClassById = (danceClassId) => {
        return new Promise((resolve, reject) => {
            this.db.findOne({ _id: danceClassId }, (err, item) => err ? resolve(null) : resolve(item));
        });
    }

    //#endregion
}

const dao = new DanceClassDAO("danceClasses.db");

module.exports = dao;