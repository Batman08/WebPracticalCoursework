const PageHelpers = require("../Helpers/PageHelpers");
const auth = require('../auth/auth.js')
const danceCourseModel = require('../models/danceCourseModel.js');

//#region Index

exports.index = (req, res) => {
    // console.log(dataTime.toLocaleString());

    PageHelpers.RenderView(res, req, 'index', {
        pageTitle: 'Welcome to the Dance Booking System',
        bundleName: 'index'
    });
};

//endregion


//#region Register

exports.show_register_page = (req, res) => {
    PageHelpers.RenderView(res, req, 'anon/register', {
        pageTitle: 'Register'
    });
};

exports.post_new_user = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(401).send('Username and password are required');
        return;
    }

    const user = await auth.isValidUser(username);
    if (!user) {
        auth.registerUser(username, password);
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
    res.redirect('admin/dashboard');
};

exports.handle_logout = (req, res) => {
    req.user = null;
    res.clearCookie("jwt").status(200).redirect("/");
};

//#endregion


//#region Admin

exports.admin_dashboard_page = (req, res) => {
    PageHelpers.RenderView(res, req, 'admin/dashboard', {
        pageTitle: 'Dashboard',
    });
};

exports.admin_manage_courses_page = async (req, res) => {
    PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses', {
        pageTitle: 'Manage Courses',
        danceCourses: await danceCourseModel.getAllDanceCourses()
    });
};

exports.post_admin_create_course = (req, res) => {
    const user = req.user;
    const { title, description } = req.body;

    if (!title || !description) {
        PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses', {
            pageTitle: 'Manage Courses',
            danceCourses: danceCourseModel.getAllDanceCourses(),
            errorMessage: 'Please fill in all course details'
        });
        return;
    }

    danceCourseModel.createDanceCourse(title, description, user.userId).then(async (courseId) => {
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
        danceCourse: await danceCourseModel.getDanceCourseById(req.params.danceCourseId)
    });
};

exports.post_admin_update_course = async (req, res) => {
    updateCourseDetails = () => {
        const user = req.user;
        const { title, description } = req.body;

        if (!title || !description) {
            PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses/course/', {
                pageTitle: 'Manage Courses',
                danceCourses: danceCourseModel.getAllDanceCourses(),
                errorMessage: 'Please fill in all course details'
            });
            return;
        }

        danceCourseModel.updateDanceCourse(req.params.danceCourseId, title, description).then(async () => {
            PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses/course/', {
                pageTitle: 'Manage Course',
                danceCourse: await danceCourseModel.getDanceCourseById(req.params.danceCourseId),
                successMessageUpdateCourse: `Course "${title}" updated successfully`
            });
        }).catch(async () => {
            PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses/course/', {
                pageTitle: 'Manage Course',
                danceCourse: await danceCourseModel.getDanceCourseById(req.params.danceCourseId),
                errorMessageUpdateCourse: `Failed to update course "${title}"`
            });
        });

        // PageHelpers.RenderView(res, req, 'admin/dashboard/managecourses/course/', {
        //     pageTitle: 'Manage Course',
        //     danceCourse: await danceCourseModel.getDanceCourseById(req.params.danceCourseId)
        // });
    }

    deleteCourse = () => { }

    createClass = () => { }

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
        default:
            break;
    }
}



//#endregion