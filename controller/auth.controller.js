const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

exports.register = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    const result = await User.findOne({ email })

    if (result) {
        return res.status(401).json({ mesage: "email already exist" })
    }

    const hash = await bcrypt.hash(password, 10)

    await User.create({ ...req.body, password: hash })

    res.json({ message: "User Register Successfully" })
})

exports.login = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    const result = await User.findOne({ email })

    if (!result) {
        return res.status(401).json({ message: "invalid email" })
    }

    const verify = await bcrypt.compare(password, result.password)

    if (!verify) {
        res.status(401).json({ message: "invalid password" })
    }

    const token = jwt.sign({ _id: result._id, name: result.name }, process.env.JWT_KEY)

    res.cookie("USER", token, { maxage: 1000 * 60 * 60 * 24, httpOnly: true, secure: false })

    res.json({
        message: "User Login Successfully", result: {
            _id: result._id,
            name: result.name
        }
    })
})

exports.logout = asyncHandler(async (req, res) => {
    res.clearCookie("USER")
    res.json({ message: "User logout Successfully" })
})