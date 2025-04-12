const Datastore = require('gray-nedb');

class DanceCourseDAO {
    constructor(dbFilePath) {
        if (dbFilePath) this.db = new Datastore({ filename: dbFilePath, autoload: true }); //embedded
        else this.db = new Datastore(); //in memory
    }

    //#region Commands

    createDanceCourse = (title, description, userId) => {
        var entry = {
            createdByUserId: userId,
            title: title,
            description: description,
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
                .sort({ createdDateTime: -1 }) // Sort by createdDateTime in descending order (most recent first)
                .exec((err, items) => err ? resolve([]) : resolve(items));
        });
    };

    getDanceCourseById = (id) => {
        return new Promise((resolve, reject) => {
            this.db.findOne({ _id: id }, (err, doc) => err ? reject(err) : resolve(doc));
        });
    };

    //#endregion
}

const dao = new DanceCourseDAO("danceCourses.db");

module.exports = dao;