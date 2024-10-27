// const { google } = require("googleapis");
// const SCOPE = ["https://www.googleapis.com/auth/drive"];
// const apiKey = require("./credentials.json");

// function configureGoogleDrive() {
//     return new Promise((resolve, reject) => {
//         console.log("Configuring Google Drive...");

//         const jwtClient = new google.auth.JWT(
//             apiKey.client_email, 
//             null, 
//             apiKey.private_key,
//             SCOPE,
//         );

//         jwtClient.authorize((err, tokens) => {
//             if (err) {
//                 console.error("Error configuring Google Drive:", err);
//                 reject(err);
//             } else {
//                 console.log("Configured Google Drive.");
//                 resolve(google.drive({version:'v3', auth: jwtClient}));
//             }
//         });
//     });
// }

// module.exports = { configureGoogleDrive };

const { google } = require("googleapis");
const fs = require("fs");

// Load the credentials from the JSON file
const credentials =require("./credentials.json");

// Create a JWT client
const { client_email, private_key } = credentials;
const jwtClient = new google.auth.JWT(
    client_email,
    null,
    private_key,
    ["https://www.googleapis.com/auth/drive"],
    null
);

async function configureGoogleDrive() {
    try {
        // Authorize the client
        await jwtClient.authorize();
        console.log("Google Drive API configured successfully.");

        // Use the Google Drive API
        const drive = google.drive({ version: 'v3', auth: jwtClient });
        return drive;
    } catch (error) {
        console.error("Error configuring Google Drive API:", error);
        throw error; // Propagate error
    }
}

// Export the function to use it elsewhere
module.exports = { configureGoogleDrive };
