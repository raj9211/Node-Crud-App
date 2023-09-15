const jwt = require("jsonwebtoken");

module.exports.createToken = async (payload, expiresIn) => {
    const token = await jwt.sign(payload, process.env.jwtToken, {
        expiresIn: expiresIn,
    });
    return token;
};

module.exports.decodeToken = async (encodeToken) => {
    // Checked Expiry Token Here
    var dToken = await jwt.verify(encodeToken, process.env.jwtToken);
    if (Date.now() >= dToken.exp * 1000) {
        dToken = false;
    }
    return dToken;
};
