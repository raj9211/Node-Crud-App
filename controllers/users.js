const User = require("../models/users");
const bcrypt = require("../utils/bcrypt");
const { createToken, decodeToken } = require("../utils/jwtToken");

async function create(req, res) {
    try {
        const body = req.body;

        if (typeof body.email == "undefined" || body.email == "") {
            return res.status(400).send({
                success: false,
                message: "Email is required.",
            });
        }
        if (typeof body.phone == "undefined" || body.phone == "") {
            return res.status(400).send({
                success: false,
                message: "Phone is required.",
            });
        }

        const userExists = await User.count({
            $or: [
                {
                    email: body.email,
                },
                {
                    phone: body.phone,
                },
            ],
        });

        if (userExists > 0) {
            return res.status(400).send({
                success: false,
                message: "User already exists, please use different Email-ID Or Phone",
            });
        }

        // Encrypt Password
        const encryptPassword = await bcrypt.encode(body.password);

        // User Payload
        let userPayload = {
            name: body.name,
            email: body.email,
            password: encryptPassword,
            phone: body.phone,
            role: "user",
            state: body.state,
            country: body.country,
        };

        const newUser = await User.create(userPayload);

        newUser.password = undefined;
        delete newUser.password;

        // res.redirect('/getAllUsers');

        return res.status(200).send({
            message: "User created successfully",
            data: newUser,
            success: true,
        });
    } catch (error) {
        const errObj = new Error(error);
        return res.status(500).send({
            message: errObj.message,
            success: false,
        });
    }
}


async function userLogin(req, res) {
    try {
        const body = req.body;

        // User Exists Check
        let userExists = await User.findOne({
            email: body.email,
        });

        if (!userExists) {
            return res.status(400).send({
                success: false,
                message:
                    "It appears that the user does not exist or has been deactivated, please contact admin",
            });
        }

        // Decode Password
        const decodedPassword = await bcrypt.decode(
            body.password,
            userExists.password
        );
        if (!decodedPassword) {
            return res.status(400).send({
                success: false,
                message: "Please check your valid password",
            });
        }

        // Generate Token
        const authToken = await createToken({ userId: userExists._id }, "30d");

        userExists.password = undefined;
        delete userExists.password;

        //Adding token key to user payload
        Object.values(userExists).forEach((e) => {
            e.token = authToken
        })

        return res.status(200).send({
            success: true,
            message: "User logged in successfully",
            user: userExists
        });
    } catch (error) {
        const errObj = new Error(error);
        return res.status(500).send({
            message: errObj.message,
            success: false,
        });
    }
}

async function getAllUsers(req, res) {
    try {
        const userData = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
        // console.log("data", userData);
        // res.render('users', {
        //     users: userData
        // });
        return res.status(200).send({
            success: true,
            message: "Users found Successfully",
            data: userData,
        });
    } catch (error) {
        const errObj = new Error(error);
        return res.status(500).send({
            message: errObj.message,
            success: false,
        });
    }
}

async function getParticularUser(req, res) {
    try {
        const userId = req.params.userId;

        const user = await User.findOne({ _id: userId }, { password: 0 });

        return res.status(200).send({
            success: true,
            message: "User found successfully",
            data: user,
        });
    } catch (error) {
        const errObj = new Error(error);
        return res.status(500).send({
            message: errObj.message,
            success: false,
        });
    }
}

async function updateUser(req, res) {
    try {
        const userId = req.params.userId;

        await User.findOneAndUpdate({ _id: userId },
            req.body,
            {
                upsert: true,
                new: true,
            }
        );

        return res.status(200).send({
            success: true,
            message: "User updated successfully",
        });
    } catch (error) {
        const errObj = new Error(error);
        return res.status(500).send({
            message: errObj.message,
            success: false,
        });
    }
}

async function deleteUser(req, res) {
    try {
        const userId = req.params.userId;

        await User.findOneAndUpdate({ _id: userId },
            { deleted: true }
        );


        return res.status(200).send({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        const errObj = new Error(error);
        return res.status(500).send({
            message: errObj.message,
            success: false,
        });
    }
}

module.exports = {
    create,
    userLogin,
    getAllUsers,
    getParticularUser,
    updateUser,
    deleteUser
};
