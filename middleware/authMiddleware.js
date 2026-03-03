// install jsonwebtoken to node
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function auth(req, res, next) {
    // get token from header
    const token = req.header("x-auth-token");

    // if no token response with error
    if (!token)
        return res.status(401).json({ errors: [{ msg: "No token, Auth Denied" }] });

    try {
        // decode token: checks if the token is ours - created with signature AND if its not expired
        const decoded = jwt.verify(token, process.env.jwtSecret);

        //set req.user to the decoded user info from payload
        req.user = decoded.user;

        next()

    } catch (err) {
        console.error(err.message);
        res.status(401).json({ errors: [{ msg: "Token is not valid" }] });
    }
}