var express = require('express');
var router = express.Router();
let userController = require('../controllers/users');
let jwt = require('jsonwebtoken')
let { checkLogin } = require('../utils/authHandler.js')

/* GET home page. */
//localhost:3000
router.post('/register', async function (req, res, next) {
    let roleId = req.body.role || "69a5462f086d74c9e772b804"; // Mặc định là USER
    let newUser = await userController.CreateAnUser(
        req.body.username,
        req.body.password,
        req.body.email,
        roleId
    )
    res.send({
        message: "dang ki thanh cong",
        user: newUser
    })
});
router.post('/login', async function (req, res, next) {
    let result = await userController.QueryByUserNameAndPassword(
        req.body.username, req.body.password
    )
    if (result) {
        let token = jwt.sign({
            id: result.id
        }, 'secret', {
            expiresIn: '1h'
        })
        res.cookie("token", token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        });
        res.send(token)
    } else {
        res.status(404).send({ message: "sai THONG TIN DANG NHAP" })
    }

});
router.get('/me', checkLogin, async function (req, res, next) {
    console.log(req.userId);
    let getUser = await userController.FindUserById(req.userId);
    res.send(getUser);
})
router.post('/logout', checkLogin, function (req, res, next) {
    res.cookie('token', null, {
        maxAge: 0,
        httpOnly: true
    })
    res.send("da logout ")
})
router.post('/change-password', checkLogin, async function (req, res, next) {
    try {
        let { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).send({ message: "Vui long nhap oldPassword va newPassword" });
        }
        await userController.changePassword(req.userId, oldPassword, newPassword);
        res.send({ message: "Doi mat khau thanh cong" });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;
