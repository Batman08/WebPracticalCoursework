const Datastore = require('gray-nedb');

class DanceCourseDAO {
    constructor(dbFilePath) {
        if (dbFilePath) this.db = new Datastore({ filename: dbFilePath, autoload: true }); //embedded
        else this.db = new Datastore(); //in memory

        // Auto-compact every 5 minutes
        this.db.persistence.setAutocompactionInterval(5 * 60 * 1000);
    }

    //#region Commands

    createDanceCourse = (title, description, duration, userId) => {
        var entry = {
            createdByUserId: userId,
            title: title,
            description: description,
            duration: duration,
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

    updateDanceCourse = (courseId, title, description, duration) => {
        return new Promise((resolve, reject) => {
            this.db.update({ _id: courseId }, { $set: { title: title, description: description, duration: duration } }, {}, (err, numUpdated) => err ? reject(err) : resolve(numUpdated));
        });
    }

    deleteDanceCourseById = (courseId) => {
        return new Promise((resolve, reject) => {
            this.db.remove({ _id: courseId }, {}, (err, numRemoved) => err ? reject(err) : resolve(numRemoved));
        });
    };

    //#endregion


    //#region Queries

    getAllDanceCourses = () => {
        return new Promise((resolve, reject) => {
            this.db.find({})
                .sort({ title: 1 }) // Sort by title in ascending order
                .exec((err, items) => err ? resolve([]) : resolve(items));
        });
    };

    getDanceCourseById = (danceCourseId) => {
        return new Promise((resolve, reject) => {
            this.db.findOne({ _id: danceCourseId }, (err, item) => err ? resolve(null) : resolve(item));
        });
    };

    //#endregion
}

const dao = new DanceCourseDAO("danceCourses.db");

module.exports = dao;