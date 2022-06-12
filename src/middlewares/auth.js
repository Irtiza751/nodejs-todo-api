const jwt = require('jsonwebtoken');

async function auth(req, res, next) {
    try {
        if (!req.headers.authorization)
            throw new Error('Unauthorize!');

        const token = req.headers.authorization.split(' ')[1];

        if(!token) {
            return new Error('You must need to authorize.');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded._id;
        next();
    } catch (error) {
        res.status(401).json({msg: error.message});
    }
}

module.exports = auth;
