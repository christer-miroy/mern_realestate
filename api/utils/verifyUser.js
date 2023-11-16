import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // get token from cookie
    const token = req.cookies.access_token;
    
    if(!token) {
        return next(errorHandler(401, "Unauthorized"));
    }

    // check if the token is correct
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) {
            return next(errorHandler(403, "Forbidden"));
        }
        req.user = user; // send the data to userController
        next();
    })
}    
