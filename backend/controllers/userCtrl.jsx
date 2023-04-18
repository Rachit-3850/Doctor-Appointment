const User = require('../models/users.jsx')
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const loginController = () => {}
const registerController = async (req , res) => {
    const { name, email, password } = req.body;
    console.log(req.body);
    try {
        const  UserModels= await User.create({
            name,
            email,
            password,
        });
        res.json(UserModels);
    } catch (e) {
        console.log(e);
        res.status(422).json(e);
    }
}

module.exports = {loginController , registerController}