const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const userAuthenticate = async (req, res, next) => {
    try{
        const token = req.cookies.jwttoken;
        //for this i face some problem
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: Token missing.' });
        }
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        const rootUser = await User.findOne({_id:verifyToken._id, "tokens.token":token});
        if (!rootUser) {
            // Invalidate the token or handle the case accordingly
            return res.status(401).json({ error: 'User not found or token is invalid.' });
        }        

        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id;
        next();
    } catch(err) {
        res.status(401).json({ error: 'Unauthorized: No token generated.' });
        console.log(err);
    }
}
module.exports = userAuthenticate;