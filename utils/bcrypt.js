const bcrypt = require("bcryptjs");

exports.encode = async (payload) => {
    return await bcrypt.hash(payload, Number(process.env.saltRound));
};

exports.decode = async (payload, encodedPayload) => {
    const match = await bcrypt.compare(payload, encodedPayload);
    if (match) {
        return true;
    }
    return false;
};
