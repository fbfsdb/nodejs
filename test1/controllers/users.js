var express = require('express');
var bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 10
var svgCaptcha = require('svg-captcha')

exports.login = function (req, res) {
    var User = global.dbHandle.getModel('user')
    var uname = req.body.uname
    var upwd = req.body.upwd
    var uidentify = req.body.uidentify.toLowerCase()

    User.findOne({ name: uname }, function (err, doc) {
        if (err) {
            res.send(500)
            console.log(err)
        } else if (!doc) {
            req.session.error = '用户不存在！'
            res.send(404)
        } else {
            bcrypt.compare(upwd, doc.password, function (err, isMatch) {
                if (!isMatch) {
                    req.session.error = '密码错误！'
                    res.send(404)
                } else {
                    var captcha = req.session.captcha.toLowerCase()
                    if (uidentify !== captcha) {
                        req.session.error = '验证码错误！'
                        res.send(404)
                    } else {
                        req.session.user = doc
                        res.send(200)
                    }
                }
            })
        }
    })
}

exports.register = function (req, res) {
    var User = global.dbHandle.getModel('user')
    var uname = req.body.uname
    var upwd = req.body.upwd
    var uidentify = req.body.uidentify.toLowerCase()

    User.findOne({ name: uname }, function (err, doc) {
        if (err) {
            res.send(500)
            req.session.error = '网络异常错误'
            console.log(err)
        } else if (doc) {
            req.session.error = '用户已存在！'
            res.send(404)
        } else {
            var captcha = req.session.captcha.toLowerCase()
            if (uidentify !== captcha) {
                req.session.error = '验证码错误！'
                res.send(404)
            } else {
                1
                bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
                    if (err) { return next(err) }
                    bcrypt.hash(upwd, salt, function (err, hash) {
                        if (err) { return next(err) }
                        upwd = hash
                        User.create({
                            name: uname,
                            password: upwd
                        }, function (err, doc) {
                            if (err) {
                                console.log(err)
                                req.send(500)
                            } else {
                                req.session.error = '用户创建成功'
                                res.send(200)
                            }
                        })
                    })
                })
            }
        }
    })
}

exports.home = function (req, res) {
    if (!req.session.user) {
        req.session.error = '请先登录'
        res.redirect('/login')
    } else {
        res.render('home', { title: 'Home' })
    }
}

exports.layout = function (req, res) {
    req.session.user = null
    req.session.error = null
    res.redirect('/')
}

exports.captcha = function (req, res) {
    var codeConfig = {
        size: 1,// 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        noise: 2, // 干扰线条的数量
        height: 44
    }
    var captcha = svgCaptcha.create(codeConfig);
    req.session.captcha = captcha.text
    console.log(typeof (req.session.captcha))
    res.send(captcha.data);
}