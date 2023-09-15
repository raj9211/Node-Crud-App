"use strict";

const mongoose = require("mongoose");
// let isConnected;
module.exports = async () => {
    console.log("Using new database connection");
    const db = await mongoose.connect(
        process.env.NODE_ENV === "dev"
            ? process.env.devMongoUri
            : process.env.prodMongoUri,
    );

    // isConnected = db;
    // return isConnected;
};

