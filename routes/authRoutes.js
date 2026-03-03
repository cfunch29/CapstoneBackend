import express from "express";
import User from "../models/userSchema.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { check, validationResult } from "express-validator";
import auth from "../middleware/authMiddleware.js";
dotenv.config();

const router = express.Router();

// POST: /api/auth - login user - Public access 
router.route("/")
    .post(
        // create rules
        [
            check("email", "Please include a valid email").isEmail(),
            check("password", "Password required").not().isEmpty(),
        ],
        async (req, res) => {
            // check req body for errors
            const errors = validationResult(req);

            // if errors, res to FE
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });

            const { email, password } = req.body;

            try {
                // find user by email 
                let user = await User.findOne({ email });

                // if no user, res w/ error
                if (!user)
                    return res.status(400)
                                .json({ errors: [{ msg: "Invalid Credentials" }] });


                    // compare password
                    const isMatch = await bcrypt.compare(password, user.password);

                    // if not a match return w/ error 
                    if (!isMatch)
                        return res.status(400)
                                    .json({ errors: [{ msg: "Invalid Credentials" }] });

                        // Create payload for jwt 
                        const payload = {
                            user: {
                                id: user._id,
                            },
                        };

                        // sign in and send JWT in res
                        jwt.sign(
                            payload,
                            process.env.jwtSecret,
                            { expiresIn: "3h" },
                            (err, token) => {
                                if (err) throw err;
                                res.json({ token });
                            },
                        );
            } catch (err) {
                console.error(err.message);
                res.status(500).json({ errors: [{ msg: err.message }] });
            }
        },
    )

    // GET - /api/auth - GET User info - Private access 

    .get(auth, async (req, res) => {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    });

    export default router;