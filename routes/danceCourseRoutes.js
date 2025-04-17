const express = require('express');
const router = express.Router();
const controller = require('../controllers/danceCourseController.js');
const auth = require('../auth/auth.js')

router.get('/', controller.index);

router.get('/course/:danceCourseId', controller.course_details_page);
router.post('/course/:danceCourseId', auth.checkForUser, controller.post_booking);

router.get('/bookings', auth.checkForUser, controller.bookings_details_page);
router.post('/bookings', auth.checkForUser, controller.post_view_bookings);

router.get('/register', auth.isLoggedIn, controller.show_register_page);
router.post('/register', controller.post_new_user);

router.get('/login', auth.isLoggedIn, controller.show_login_page);
router.post('/login', auth.handleUserLogin, controller.handle_login);
router.post("/logout", controller.handle_logout);

router.get('/admin/dashboard', auth.checkForAdmin, controller.admin_dashboard_page);
router.get('/admin/dashboard/manageorganisers', auth.checkForAdmin, controller.admin_manage_organisers_page);
router.post('/admin/dashboard/manageorganisers', auth.checkForAdmin, controller.post_admin_manage_organisers);//
router.get('/admin/dashboard/managecourses', auth.checkForAdmin, controller.admin_manage_courses_page);
router.post('/admin/dashboard/managecourses', auth.checkForAdmin, controller.post_admin_create_course);
router.get('/admin/dashboard/managecourses/course/:danceCourseId', auth.checkForAdmin, controller.admin_manage_course_page);
router.post('/admin/dashboard/managecourses/course/:danceCourseId', auth.checkForAdmin, controller.post_admin_update_course);
router.get('/admin/dashboard/managecourses/course/bookings/:danceClassId', auth.checkForAdmin, controller.admin_manage_bookings_page);
router.post('/admin/dashboard/managecourses/course/bookings/:danceClassId', auth.checkForAdmin, controller.admin_post_remove_class_booking);

router.use(function (req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
});
// router.use(function (err, req, res, next) {
//     res.status(500);
//     res.type('text/plain');
//     res.send('Internal Server Error.');
// });

module.exports = router;