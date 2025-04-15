const express = require('express');
const router = express.Router();
const controller = require('../controllers/danceCourseController.js');
const auth = require('../auth/auth.js')

router.get('/', controller.index);

router.get('/course/:danceCourseId', controller.course_details_page);

router.get('/register', auth.isLoggedIn, controller.show_register_page);
router.post('/register', controller.post_new_user);

router.get('/login', auth.isLoggedIn, controller.show_login_page);
router.post('/login', auth.handleUserLogin, controller.handle_login);
router.post("/logout", controller.handle_logout);

router.get('/admin/dashboard', auth.authenticateToken, controller.admin_dashboard_page);
router.get('/admin/dashboard/managecourses', auth.authenticateToken, controller.admin_manage_courses_page);
router.post('/admin/dashboard/managecourses', auth.authenticateToken, controller.post_admin_create_course);
router.get('/admin/dashboard/managecourses/course/:danceCourseId', auth.authenticateToken, controller.admin_manage_course_page);
router.post('/admin/dashboard/managecourses/course/:danceCourseId', auth.authenticateToken, controller.post_admin_update_course);

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