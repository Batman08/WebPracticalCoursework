const express = require('express');
const router = express.Router();
const controller = require('../controllers/danceCourseController.js');
const auth = require('../auth/auth.js')

router.get('/', auth.isLoggedIn, controller.index);
router.get('/register', auth.isLoggedIn, controller.show_register_page);
router.post('/register', controller.post_new_user);
router.get('/login', auth.isLoggedIn, controller.show_login_page);
router.post('/login', auth.handleUserLogin, controller.handle_login);
router.get('/dashboard', auth.authenticateToken, controller.dashboard_page);
router.post("/logout", controller.handle_logout);

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