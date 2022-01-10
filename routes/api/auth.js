const express = require("express");
// const Joi = require("joi");

const { BadRequest, Conflict } = require("http-errors");
const bcrypt = require("bcryptjs");

const { User } = require("../../models");
const { joiSchema } = require("../../models/user");

const router = express.Router();

router.post("/register", async (req, res, next) => {
    try {
        const { error } = joiSchema.validate(req.body)
        if (error) {
            throw new BadRequest(error.message);
        }
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw new Conflict("User already exist");
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt)
        const newUser = await User.create({ name, email, password: hashPassword });
        res.status(201).json({
            user: {
                name: newUser.name,
                email: newUser.email
            }
        })

    } catch (error) {
        next(error)

    }

})

module.exports = router;