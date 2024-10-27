const { google } = require("googleapis");
const SCOPE = ["https://www.googleapis.com/auth/drive"];
const apiKey = require("./credentials.json");

function configureGoogleDrive() {
    return new Promise((resolve, reject) => {
        const jwtClient = new google.auth.JWT(
            apiKey.client_email, 
            null, 
            apiKey.private_key,
            SCOPE,
        );

        jwtClient.authorize((err, tokens) => {
            if (err) {
                reject(err);
            } else {
                resolve(google.drive({version:'v3', auth: jwtClient}));
            }
        });
    });
}

module.exports = { configureGoogleDrive };