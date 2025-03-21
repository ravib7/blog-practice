const { register, login, logout } = require("../controller/auth.controller")

const router = require("express").Router()

router
    .post("/user-register", register)
    .post("/user-login", login)
    .post("/user-logout", logout)

module.exports = router