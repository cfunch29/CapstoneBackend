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

    // GET: /api/auth - GET User info - Private access 

    .get(auth, async (req, res) => {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    })

    // PUT: /api/auth - Updated user info - Private access 
    .put( 
        auth, [
            // using .optional() to allow user to choose if they need to update either input
            check("email", "Please include a valid email").optional().isEmail(),
            check("password", "Password must be 6 or more characters").optional().isLength({ min: 6 }),
        ],
        async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() });

            const { email, password, name } = req.body;

            try {
                // Create updated fields obj - dynamically build obj - only updates whats send to the body
                const updatedFields = {};
                if (name) updatedFields.name = name;
                if (email) updatedFields.email = email;
                if (password) {
                    // Must hash a new password prior to saving
                    const salt = await bcrypt.genSalt(10);
                    updatedFields.password = await bcrypt.hash(password, salt);
                }

                // Find user by id from JWT and update
                const user = await User.findByIdAndUpdate(
                    req.user.id,
                    { $set: updatedFields },
                    { new: true } //returns updated instead of old
                ).select("-password");

                if (!user)
                    return res.status(400).json({ errors: [{ msg: "User not found!"}] });

                res.json(user);
        
            } catch (err) {
                console.error(err.message);
                res.status(500).json({ errors: [{ msg: err.message }] });
            }
        }
    )

    // DELETE: /api/auth - Delete user - Private access 
    .delete(auth, async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.user.id);

            if (!user)
                return res.status(404).json({ errors: [{ msg: "User not found!" }] });

            res.json({ msg: "User deleted successfully!" });
        } catch (err) {
            console.error(err.message);
            res.status(500).jsom({ errors: [{ msg: err.message }] });
        }
    });
    
export default router;