const mongoose = require("mongoose");
require("dotenv").config();

exports.dbConnection = () => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log("DB connected Successfully"))
        .catch((Error) => {
            console.log("DB connection failed");
            console.log(Error);
            process.exit(1);
        });
}