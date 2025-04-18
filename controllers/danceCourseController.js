const CommonHelpers = require("../Helpers/CommonHelpers");
const PageHelpers = require("../Helpers/PageHelpers");
const auth = require('../auth/auth.js')
const userModel = require('../models/userModel.js');
const danceCourseModel = require('../models/danceCourseModel.js');
const danceClassModel = require('../models/danceClassModel.js');
const danceClassBookingModel = require('../models/danceClassBookingModel.js');

//#region static pages

exports.index = async (req, res) => {
    PageHelpers.RenderView(res, req, 'index', {
        pageTitle: 'Welcome to the Dance Booking System',
        danceCourses: await danceCourseModel.getAllDanceCourses()
    });
};

exports.about_page = async (req, res) => {
    PageHelpers.RenderView(res, req, 'anon/about', {
        pageTitle: 'About Us'
    });
};

//#endregion


//#region Register

exports.show_register_page = (req, res) => {
    PageHelpers.RenderView(res, req, 'anon/register', {
        pageTitle: 'Register'
    });
};

exports.post_new_user = async (req, res) => {
    const { username, password, name, email } = req.body;

    if (!username || !password || !name || !email) {
        res.status(401).send('Please fill in all the required fields');
        return;
    }

    const user = await auth.isValidUser(username);
    if (!user) {
        auth.registerUser(username, password, name, email);
        res.redirect('/login');

        /* ToDo: log user in straight away? */
    }
    else {
        PageHelpers.RenderView(res, req, 'anon/register', {
            pageTitle: 'Register',
            errorMessage: 'User already exists'
        });
    }
}

//#endregion


//#region Login

exports.show_login_page = (req, res) => {
    PageHelpers.RenderView(res, req, 'anon/login', {
        pageTitle: 'Login',
    });
};

exports.handle_login = (req, res) => {
    res.redirect('/');
};

exports.handle_logout = (req, res) => {
    req.user = null;
    res.clearCookie("jwt").status(200).redirect("/");
};

//#endregion


//#region View Course & Booking

exports.course_details_page = async (req, res) => {
    let danceClasses = await danceClassModel.getAllDanceClassesByCourseId(req.params.danceCourseId);
    if (danceClasses.length > 0) danceClasses.forEach((danceClass) => danceClass.classDateTime = CommonHelpers.FormatDateTime(danceClass.classDateTime));

    PageHelpers.RenderView(res, req, 'anon/course', {
        pageTitle: 'View Course',
        bundleName: 'anon-booking',
        danceCourse: await danceCourseModel.getDanceCourseById(req.params.danceCourseId),
        danceClasses: danceClasses,
    });
};

exports.post_entroll_course = async (req, res) => {
};

exports.post_booking = async (req, res) => {
    const user = req.user;
    let userId = null;
    if (user) userId = user.userId;

    const { danceClassId, name, email } = req.body;

    const danceCourse = await danceCourseModel.getDanceCourseById(req.params.danceCourseId);
    let danceClasses = await danceClassModel.getAllDanceClassesByCourseId(req.params.danceCourseId);
    if (danceClasses.length > 0) danceClasses.forEach((danceClass) => danceClass.classDateTime = CommonHelpers.FormatDateTime(danceClass.classDateTime));

    /* Book Class */
    bookClass = async () => {
        if (!user) {
            if (!name || !email) {
                PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses', {
                    pageTitle: 'Manage Courses',
                    bundleName: 'anon-booking',
                    danceCourses: danceCourseModel.getAllDanceCourses(),
                    errorMessage: 'Please fill in all booking details'
                });
                return;
            }
        }

        const bookingReference = generateBookingReference();
        danceClassBookingModel.createDanceClassBooking(danceClassId, userId, name, email, bookingReference).then(async (danceClassBookingId) => {
            let bookedClass = await danceClassModel.getDanceClassById(danceClassId)
            if (bookedClass) bookedClass.classDateTime = CommonHelpers.FormatDateTime(bookedClass.classDateTime);

            PageHelpers.RenderView(res, req, 'anon/course', {
                pageTitle: 'View Course',
                bundleName: 'anon-booking',
                danceCourse: danceCourse,
                danceClasses: danceClasses,
                successMessage: `Class booked successfully`,
                bookedClass: bookedClass,
                bookingReference: bookingReference,
                name: name
            });
        }).catch(async (err) => {
            PageHelpers.RenderView(res, req, 'anon/course', {
                pageTitle: 'View Course',
                bundleName: 'anon-booking',
                danceCourse: danceCourse,
                danceClasses: danceClasses,
                errorMessage: `Failed to book class`
            });
        });
    }

    /* Enroll Course */
    enrollCourse = async () => {
        if (!user) {
            PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses', {
                pageTitle: 'Manage Courses',
                bundleName: 'anon-booking',
                danceCourses: danceCourseModel.getAllDanceCourses()
            });
            return;
        }

        const danceClasses = await danceClassModel.getAllDanceClassesByCourseId(req.params.danceCourseId);
        const courseDanceClassIds = danceClasses.map(c => c._id);
        const bookingReference = generateBookingReference();
        
        // Create an array of booking promises
        const bookingPromises = courseDanceClassIds.map(id => {
            return danceClassBookingModel.createDanceClassBooking(id, userId, name, email, bookingReference);
        });
        
        Promise.all(bookingPromises)
            .then(async () => {
                // After all bookings complete, get the last class (or any one you want to show)
                const lastDanceClassId = courseDanceClassIds[courseDanceClassIds.length - 1];
                let bookedClass = await danceClassModel.getDanceClassById(lastDanceClassId);
                if (bookedClass) {
                    bookedClass.classDateTime = CommonHelpers.FormatDateTime(bookedClass.classDateTime);
                }
        
                PageHelpers.RenderView(res, req, 'anon/course', {
                    pageTitle: 'View Course',
                    bundleName: 'anon-booking',
                    danceCourse: danceCourse,
                    danceClasses: danceClasses,
                    enrolSuccessMessage: `Enrolment Confirmed!`,
                    bookedClass: bookedClass,
                    name: name
                });
            })
            .catch((err) => {
                PageHelpers.RenderView(res, req, 'anon/course', {
                    pageTitle: 'View Course',
                    bundleName: 'anon-booking',
                    danceCourse: danceCourse,
                    danceClasses: danceClasses,
                    errorMessage: `Failed to enrol`
                });
            });
    }

    switch (req.body.action) {
        case 'enroll_course':
            enrollCourse();
            break;
        case 'book_class':
            bookClass();
            break;
        default:
            break;
    }
};

generateBookingReference = () => {
    //create booking reference number
    const currentDateTime = new Date();
    const datePart = currentDateTime.toISOString().slice(0, 10).replace(/-/g, '');
    const timePart = currentDateTime.toTimeString().slice(0, 5).replace(':', '');
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

    return `${datePart}-${timePart}-${random}`;

}


exports.bookings_details_page = async (req, res) => {
    const user = req.user;

    if (user) {
        const bookedDanceClass = await danceClassBookingModel.getClassBookingsByUserId(user.userId);
        let bookedDanceClasses = await Promise.all(
            bookedDanceClass.map(async (entry) => {
                const danceClass = await danceClassModel.getDanceClassById(entry.danceClassId);
                // Attach booking _id to the dance class object
                return {
                    ...danceClass,
                    danceClassBookingId: entry.danceClassBookingId,
                    danceClassId: entry.danceClassId
                };
            })
        );
        if (bookedDanceClasses.length > 0) bookedDanceClasses.forEach((danceClass) => danceClass.classDateTime = CommonHelpers.FormatDateTime(danceClass.classDateTime));

        PageHelpers.RenderView(res, req, 'anon/bookings', {
            pageTitle: 'Bookings',
            bundleName: 'anon-booking',
            bookedDanceClasses: bookedDanceClasses
        });
    }
    else {
        PageHelpers.RenderView(res, req, 'anon/bookings', {
            pageTitle: 'Bookings',
            bundleName: 'anon-booking',
            infoMessage: '<i class="fa-solid fa-circle-info"></i> To find you booking either search with booking reference, or log in'
        });
    }

};

exports.post_view_bookings = async (req, res) => {
    guestViewBookings = async () => {
        if (!req.body.bookingReference) {
            PageHelpers.RenderView(res, req, 'anon/bookings', {
                pageTitle: 'Bookings',
                bundleName: 'anon-booking',
                errorMessage: '<div class="text-danger fw-bold"><i class="fa-solid fa-circle-exclamation"></i> Please enter a booking reference</div>'
            });
            return;
        }

        const bookedDanceClass = await danceClassBookingModel.getClassBookingsByBookingReference(req.body.bookingReference);
        let bookedDanceClasses = await Promise.all(
            bookedDanceClass.map(async (entry) => {
                const danceClass = await danceClassModel.getDanceClassById(entry.danceClassId);
                // Attach booking _id to the dance class object
                return {
                    ...danceClass,
                    danceClassBookingId: entry.danceClassBookingId,
                    danceClassId: entry.danceClassId
                };
            })
        );
        if (bookedDanceClasses.length > 0) bookedDanceClasses.forEach((danceClass) => danceClass.classDateTime = CommonHelpers.FormatDateTime(danceClass.classDateTime));

        PageHelpers.RenderView(res, req, 'anon/bookings', {
            pageTitle: 'Bookings',
            bundleName: 'anon-booking',
            bookedDanceClasses: bookedDanceClasses,
            infoMessage: bookedDanceClasses.length == 0 ? '<i class="fa-solid fa-ban"></i> No bookings found' : null,
            errorMessage: bookedDanceClasses.length == 0 ? '<div class="text-danger fw-bold"><i class="fa-solid fa-circle-exclamation"></i> Please enter a valid booking reference</div>' : null
        });
    }

    guestUserCancelBooking = async () => {
        if (!req.body.danceClassBookingId) {
            PageHelpers.RenderView(res, req, 'anon/bookings', {
                pageTitle: 'Bookings',
                bundleName: 'anon-booking'
            });
            return;
        }

        danceClassBookingModel.deleteDanceClassBookingById(req.body.danceClassBookingId).then(() => {
            PageHelpers.RenderView(res, req, 'anon/bookings', {
                pageTitle: 'Bookings',
                bundleName: 'anon-booking',
                successMessageDeleteBooking: `Booking cancelled successfully`
            });
        }).catch(() => {
            PageHelpers.RenderView(res, req, 'anon/bookings', {
                pageTitle: 'Bookings',
                bundleName: 'anon-booking',
                errorMessageDeleteBooking: 'Failed to cancel booking'
            });
        });
    }

    accountUserCancelBooking = async () => {
        const user = req.user;

        const bookedDanceClass = await danceClassBookingModel.getClassBookingsByUserId(user.userId);
        let bookedDanceClasses = await Promise.all(
            bookedDanceClass.map(async (entry) => {
                const danceClass = await danceClassModel.getDanceClassById(entry.danceClassId);
                // Attach booking _id to the dance class object
                return {
                    ...danceClass,
                    danceClassBookingId: entry.danceClassBookingId,
                    danceClassId: entry.danceClassId
                };
            })
        );
        if (bookedDanceClasses.length > 0) bookedDanceClasses.forEach((danceClass) => danceClass.classDateTime = CommonHelpers.FormatDateTime(danceClass.classDateTime));

        if (!req.body.danceClassBookingId) {
            PageHelpers.RenderView(res, req, 'anon/bookings', {
                pageTitle: 'Bookings',
                bundleName: 'anon-booking',
                bookedDanceClasses: bookedDanceClasses
            });
            return;
        }

        danceClassBookingModel.deleteDanceClassBookingById(req.body.danceClassBookingId).then(async () => {
            //get all the bookings again
            const bookedDanceClass = await danceClassBookingModel.getClassBookingsByUserId(user.userId);
            let bookedDanceClasses = await Promise.all(
                bookedDanceClass.map(async (entry) => {
                    const danceClass = await danceClassModel.getDanceClassById(entry.danceClassId);
                    // Attach booking _id to the dance class object
                    return {
                        ...danceClass,
                        danceClassBookingId: entry.danceClassBookingId,
                        danceClassId: entry.danceClassId
                    };
                })
            );
            if (bookedDanceClasses.length > 0) bookedDanceClasses.forEach((danceClass) => danceClass.classDateTime = CommonHelpers.FormatDateTime(danceClass.classDateTime));


            PageHelpers.RenderView(res, req, 'anon/bookings', {
                pageTitle: 'Bookings',
                bundleName: 'anon-booking',
                bookedDanceClasses: bookedDanceClasses,
                successMessageDeleteBooking: `Booking cancelled successfully`
            });
        }).catch(() => {
            PageHelpers.RenderView(res, req, 'anon/bookings', {
                pageTitle: 'Bookings',
                bundleName: 'anon-booking',
                bookedDanceClasses: bookedDanceClasses,
                errorMessageDeleteBooking: 'Failed to cancel booking'
            });
        });
    }

    switch (req.body.action) {
        case 'guest_view_bookings':
            guestViewBookings();
            break;
        case 'guest_user_cancel_booking':
            guestUserCancelBooking();
            break;
        case 'account_user_cancel_booking':
            accountUserCancelBooking();
            break;
        default:
            break;
    }
};

//#endregion


//#region Admin

exports.admin_dashboard_page = (req, res) => {
    PageHelpers.RenderView(res, req, 'admin/dashboard', {
        pageTitle: 'Dashboard',
    });
};

exports.admin_manage_organisers_page = async (req, res) => {
    PageHelpers.RenderView(res, req, 'admin/dashboard/manageorganisers', {
        pageTitle: 'Manage Courses',
        users: await userModel.getAllUsers()
    });
};

exports.post_admin_manage_organisers = async (req, res) => {
    addOrganiser = () => {
        userModel.addUserOrganiserRole(req.body.userId).then(async () => {
            PageHelpers.RenderView(res, req, 'admin/dashboard/manageorganisers', {
                pageTitle: 'Manage Courses',
                users: await userModel.getAllUsers(),
                successMessage: `Added organiser role successfully`
            });
        }).catch(async (err) => {
            PageHelpers.RenderView(res, req, 'admin/dashboard/manageorganisers', {
                pageTitle: 'Manage Courses',
                users: await userModel.getAllUsers(),
                errorMessage: `Failed to add organiser role`

            });
        });
    }

    removeOrganiser = () => {
        userModel.deleteUserOrganiserRole(req.body.userId).then(async () => {
            PageHelpers.RenderView(res, req, 'admin/dashboard/manageorganisers', {
                pageTitle: 'Manage Courses',
                users: await userModel.getAllUsers(),
                successMessage: `Removed organiser role successfully`
            });
        }).catch(async (err) => {
            PageHelpers.RenderView(res, req, 'admin/dashboard/manageorganisers', {
                pageTitle: 'Manage Courses',
                users: await userModel.getAllUsers(),
                errorMessage: `Failed to remove organiser role`

            });
        });
    }

    switch (req.body.action) {
        case 'add_organiser':
            addOrganiser();
            break;
        case 'remove_organiser':
            removeOrganiser();
            break;
        default:
            break;
    }
};


exports.admin_manage_courses_page = async (req, res) => {
    PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses', {
        pageTitle: 'Manage Courses',
        danceCourses: await danceCourseModel.getAllDanceCourses()
    });
};

exports.post_admin_create_course = (req, res) => {
    const user = req.user;
    const { title, description, duration } = req.body;

    if (!title || !description || !duration) {
        PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses', {
            pageTitle: 'Manage Courses',
            danceCourses: danceCourseModel.getAllDanceCourses(),
            errorMessage: 'Please fill in all course details'
        });
        return;
    }

    danceCourseModel.createDanceCourse(title, description, duration, user.userId).then(async (courseId) => {
        PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses', {
            pageTitle: 'Manage Courses',
            danceCourses: await danceCourseModel.getAllDanceCourses(),
            successMessage: `Course "${title}" created successfully`
        });
    }).catch(async (err) => {
        PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses', {
            pageTitle: 'Manage Courses',
            danceCourses: await danceCourseModel.getAllDanceCourses(),
            errorMessage: `Failed to create course "${title}"`
        });
    });
};

exports.admin_manage_course_page = async (req, res) => {
    PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses/course/', {
        pageTitle: 'Manage Course',
        bundleName: 'admin-manage-course',
        danceCourse: await danceCourseModel.getDanceCourseById(req.params.danceCourseId),
        danceClasses: await danceClassModel.getAllDanceClassesByCourseId(req.params.danceCourseId)
    });
};

exports.post_admin_update_course = async (req, res) => {
    updateCourseDetails = async () => {
        const { title, description, duration } = req.body;

        if (!title || !description || !duration) {
            PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses/course/', {
                pageTitle: 'Manage Course',
                bundleName: 'admin-manage-course',
                danceCourses: await danceCourseModel.getAllDanceCourses(),
                danceClasses: await danceClassModel.getAllDanceClassesByCourseId(req.params.danceCourseId),
                errorMessageDanceCourse: 'Please fill in all course details'
            });
            return;
        }

        danceCourseModel.updateDanceCourse(req.params.danceCourseId, title, description, duration).then(async () => {
            PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses/course/', {
                pageTitle: 'Manage Course',
                bundleName: 'admin-manage-course',
                danceCourse: await danceCourseModel.getDanceCourseById(req.params.danceCourseId),
                danceClasses: await danceClassModel.getAllDanceClassesByCourseId(req.params.danceCourseId),
                successMessageDanceCourse: `Course "${title}" updated successfully`
            });
        }).catch(async () => {
            PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses/course/', {
                pageTitle: 'Manage Course',
                bundleName: 'admin-manage-course',
                danceCourse: await danceCourseModel.getDanceCourseById(req.params.danceCourseId),
                danceClasses: await danceClassModel.getAllDanceClassesByCourseId(req.params.danceCourseId),
                errorMessageDanceCourse: `Failed to update course "${title}"`
            });
        });
    }

    deleteCourse = async () => {
        if (!req.params.danceCourseId) {
            PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses/course/', {
                pageTitle: 'Manage Courses',
                bundleName: 'admin-manage-course',
                danceCourse: await danceCourseModel.getDanceCourseById(req.params.danceCourseId),
                danceClasses: await danceClassModel.getAllDanceClassesByCourseId(req.params.danceCourseId),
                errorMessageDanceClass: 'Something went wrong, please try again'
            });
            return;
        }

        danceCourseModel.deleteDanceCourseById(req.params.danceCourseId).then(async () => {
            //redirect to the manage courses page
            res.redirect('/admin/dashboard/managecourses');
        }).catch(async () => {
            PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses/course/', {
                pageTitle: 'Manage Course',
                bundleName: 'admin-manage-course',
                danceCourse: await danceCourseModel.getDanceCourseById(req.params.danceCourseId),
                danceClasses: await danceClassModel.getAllDanceClassesByCourseId(req.params.danceCourseId),
                errorMessageDanceClass: `Failed to remove course`
            });
        });
    }


    createClass = async () => {
        const user = req.user;
        const { title, description, classDateTime, duration, location, price } = req.body;

        if (!title || !description || !classDateTime || !location || !price || !duration) {
            PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses/course/', {
                pageTitle: 'Manage Courses',
                bundleName: 'admin-manage-course',
                danceCourse: await danceCourseModel.getDanceCourseById(req.params.danceCourseId),
                danceClasses: await danceClassModel.getAllDanceClassesByCourseId(req.params.danceCourseId),
                errorMessageDanceClass: 'Please fill in all course details'
            });
            return;
        }

        danceClassModel.createDanceClass(req.params.danceCourseId, user.userId, title, description, classDateTime, duration, location, price).then(async () => {
            PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses/course/', {
                pageTitle: 'Manage Course',
                bundleName: 'admin-manage-course',
                danceCourse: await danceCourseModel.getDanceCourseById(req.params.danceCourseId),
                danceClasses: await danceClassModel.getAllDanceClassesByCourseId(req.params.danceCourseId),
                successMessageDanceClass: `Class "${title}" created successfully`
            });
        }).catch(async () => {
            PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses/course/', {
                pageTitle: 'Manage Course',
                bundleName: 'admin-manage-course',
                danceCourse: await danceCourseModel.getDanceCourseById(req.params.danceCourseId),
                danceClasses: await danceClassModel.getAllDanceClassesByCourseId(req.params.danceCourseId),
                errorMessageDanceClass: `Failed to create class "${title}"`
            });
        });
    }

    updateClassDetails = async () => {
        const { danceClassId, title, description, classDateTime, duration, location, price } = req.body;

        if (!title || !description || !classDateTime || !location || !price || !duration) {
            PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses/course/', {
                pageTitle: 'Manage Course',
                bundleName: 'admin-manage-course',
                danceCourse: await danceCourseModel.getDanceCourseById(req.params.danceCourseId),
                danceClasses: await danceClassModel.getAllDanceClassesByCourseId(req.params.danceCourseId),
                errorMessageDanceClass: 'Please fill in all class details'
            });
            return;
        }

        danceClassModel.updateDanceClass(danceClassId, title, description, classDateTime, duration, location, price).then(async () => {
            PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses/course/', {
                pageTitle: 'Manage Course',
                bundleName: 'admin-manage-course',
                danceCourse: await danceCourseModel.getDanceCourseById(req.params.danceCourseId),
                danceClasses: await danceClassModel.getAllDanceClassesByCourseId(req.params.danceCourseId),
                successMessageDanceClass: `Class "${title}" updated successfully`
            });
        }).catch(async () => {
            PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses/course/', {
                pageTitle: 'Manage Course',
                bundleName: 'admin-manage-course',
                danceCourse: await danceCourseModel.getDanceCourseById(req.params.danceCourseId),
                danceClasses: await danceClassModel.getAllDanceClassesByCourseId(req.params.danceCourseId),
                errorMessageDanceClass: `Failed to update class "${title}"`
            });
        });
    }

    deleteClass = async () => {
        if (!req.body.danceClassId) {
            PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses/course/', {
                pageTitle: 'Manage Courses',
                bundleName: 'admin-manage-course',
                danceCourse: await danceCourseModel.getDanceCourseById(req.params.danceCourseId),
                danceClasses: await danceClassModel.getAllDanceClassesByCourseId(req.params.danceCourseId),
                errorMessageDanceClass: 'Something went wrong, please try again'
            });
            return;
        }

        danceClassModel.deleteDanceClassById(req.body.danceClassId).then(async () => {
            PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses/course/', {
                pageTitle: 'Manage Course',
                bundleName: 'admin-manage-course',
                danceCourse: await danceCourseModel.getDanceCourseById(req.params.danceCourseId),
                danceClasses: await danceClassModel.getAllDanceClassesByCourseId(req.params.danceCourseId),
                successMessageDanceClass: `Class removed successfully`
            });
        }).catch(async () => {
            PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses/course/', {
                pageTitle: 'Manage Course',
                bundleName: 'admin-manage-course',
                danceCourse: await danceCourseModel.getDanceCourseById(req.params.danceCourseId),
                danceClasses: await danceClassModel.getAllDanceClassesByCourseId(req.params.danceCourseId),
                errorMessageDanceClass: `Failed to remove class`
            });
        });
    }

    switch (req.body.action) {
        case 'update_course_details':
            updateCourseDetails();
            break;
        case 'delete_course':
            deleteCourse();
            break;
        case 'create_class':
            createClass();
            break;
        case 'update_class_details':
            updateClassDetails();
            break;
        case 'delete_class':
            deleteClass();
            break;
        default:
            break;
    }
}


exports.admin_manage_bookings_page = async (req, res) => {
    PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses/course/bookings', {
        pageTitle: 'Manage Bookings',
        participants: await danceClassBookingModel.getClassBookingsByClassId(req.params.danceClassId),
    });
};

exports.admin_post_remove_class_booking = async (req, res) => {
    danceClassBookingModel.deleteDanceClassBookingById(req.params.danceClassId).then(async () => {
        PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses/course/bookings', {
            pageTitle: 'Manage Bookings',
            participants: await danceClassBookingModel.getClassBookingsByClassId(req.params.danceClassId),
            successMessage: `Booking removed successfully`
        });
    }).catch(async (err) => {
        PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses/course/bookings', {
            pageTitle: 'Manage Bookings',
            participants: await danceClassBookingModel.getClassBookingsByClassId(req.params.danceClassId),
            errorMessage: `Failed to remove bookign`
        });
    });
};

//#endregion