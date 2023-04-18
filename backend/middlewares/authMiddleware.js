const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    try {
        const token = req.headers["authorization"].split(" ")[1];
        console.log(req.headers['authorization'].split(" ")[1]);
        jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
            if (err) {
                // console.log(err);
                return res.status(200).send({ message: "Auth Failed", status: false });
            }
            else {
                req.body.userId = decode.id;
                // console.log("hello");
                next();
            }
        });
    } catch (e) {
        console.log(e);
        res.status(200).send({ message: "Auth Failed", status: false });
    }
};
