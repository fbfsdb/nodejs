var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 10
var svgCaptcha = require('svg-captcha')
var users = require('./../controllers/users')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET login page. */
router.route('/login').get(function(req, res) {
  res.render('login', { title: '用户登陆' });
})

/* GET register page. */
router.route('/register').get(function(req, res) {
  res.render('register', { title: '用户注册' });
})

/* GET home page. */
router.get('/user/home', users.home)

/* GET logout page. */
router.get('/user/logout', users.layout)

/* GET identify img. */

router.get('/captcha', users.captcha)
router.post('/user/login', users.login)
router.post('/user/register', users.register) 


module.exports = router;
