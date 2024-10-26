const fs = require("fs");

const { configureGoogleDrive } = require("../config/googleDrive");

configureGoogleDrive();

async function uploadFileToDrive(file, folderId = "1NYtXOCFw15O4ZtxHdesIMR3Nkt6UqzSV") {
    return new Promise((resolve, rejected) => {
        configureGoogleDrive().then(drive => {
            var fileMetaData = {
                name:file.name,
                parents: [folderId] 
            }

            drive.files.create({
                resource: fileMetaData,
                media: {
                    body: fs.createReadStream(file.path),
                    mimeType: file.mimetype
                },
                fields: 'id'
                
            }, function(err, file){
                if(err) return rejected(err);
                console.log("This is the response right there --------------> \n",file);
                console.log("This is the url for the file \n", `https://drive.google.com/file/d/${file.data.id}/view`);
                resolve(file)
            });
        }).catch(error => {
            rejected(error);
        });
    })
}

module.exports = {uploadFileToDrive};

