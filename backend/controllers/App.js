const AppMedia = require('../models/AppMedia');
const Category = require('../models/Category');
const App = require('../models/App');
const { uploadToCloudinary } = require('../utils/cloudinaryWork');


exports.createApp = async (req, res) => {
    try
    {
        const {appName, appDescription, companyName, category, tag, size, download, releaseDate, systemRequirement, language, appPermission, inAppPurchase, searchKeywords} = req.body;

        const {appFile, appIcon, appMedia} = req.files;

        if(!appName || !category || !tag || !releaseDate || !appPermission || !appFile || !appIcon || !appMedia)
        {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const dataOptions = {};

        // dataOptions.appName = "Fake App " + Math.random().toString(36).substring(2, 10);
        // dataOptions.appDescription = "This is a fake app for testing purpose only";
        // dataOptions.companyName = "Fake Company";
        // dataOptions.category = category;
        // dataOptions.tag = ["Tag 1", "Tag 2", "Tag 3"];
        // dataOptions.size = "10 MB";
        // dataOptions.download = 100;
        // dataOptions.releaseDate = new Date();
        // dataOptions.systemRequirement = "At least 10.0 OS";
        // dataOptions.language = ["English", "Spanish", "Chinese"];
        // dataOptions.appPermission = ["Read Contacts", "Write Contacts", "Read Logs"];
        // dataOptions.inAppPurchase = true;
        // dataOptions.searchKeywords = ["keyword1", "keyword2", "keyword3"];
        if(appName) dataOptions.appName = appName;
        if(appDescription) dataOptions.appDescription = appDescription;
        if(companyName) dataOptions.companyName = companyName;
        if(tag) dataOptions.tag = tag;
        if(size) dataOptions.size = size;
        if(download) dataOptions.download = download;
        if(releaseDate) dataOptions.releaseDate = releaseDate;
        if(systemRequirement) dataOptions.systemRequirement = systemRequirement;
        if(language) dataOptions.language = language;
        if(appPermission) dataOptions.appPermission = appPermission;
        if(inAppPurchase) dataOptions.inAppPurchase = inAppPurchase;
        if(searchKeywords) dataOptions.searchKeywords = searchKeywords;

        const newApp = await App.create(dataOptions);

        const categoryExist = await Category.findById(category);
        
        const appIconResponse = await uploadToCloudinary(appIcon, "media", 90);
        const appIconData = await AppMedia.create({
            secure_url: appIconResponse.secure_url,
            publicId: appIconResponse.public_id,
        });
        
        for (const item of appMedia) {
            const appMediaResponse = await uploadToCloudinary(item, "media", 90);
            const tempAppRes = await AppMedia.create({
                secure_url: appMediaResponse.secure_url,
                publicId: appMediaResponse.public_id,
            });

            newApp.media.push(tempAppRes._id);
        }

        const fileData = await uploadFileToDrive(appFile);
        const newAppFile = await AppMedia.create({
            app: newApp._id,
            googleDriveFileId: fileData.googleDriveFileId,
            fileName: fileData.fileName,
            fileType: fileData.fileType,
            fileSize: file?.size,
            fileUrl: fileData.fileUrl
        });
        
        
        newApp.category = categoryExist._id;
        newApp.appIcon = appIconData._id;
        newApp.appFile = newAppFile._id;
        
    }
    catch(error)
    {
        console.log("Error in creating App: ", error);
        return res.status(500).json({ success: false, message: error.message, additionalInfo: "Error in creating App" });
    }
}

exports.deleteApp = async (req, res) => {
    try
    {

    }
    catch(error)
    {
        console.log("Error in deleting App: ", error);
        return res.status(500).json({ success: false, message: error.message, additionalInfo: "Error in deleting App" });
    }
}

exports.updateApp = async (req, res) => {
    try
    {

    }
    catch(error)
    {
        console.log("Error in updating App: ", error);
        return res.status(500).json({ success: false, message: error.message, additionalInfo: "Error in updating App" });
    }
}

exports.getAllApp = async (req, res) => 
{
    try
    {

    }
    catch(error)
    {
        console.log("Error in getting all App: ", error);
        return res.status(500).json({ success: false, message: error.message, additionalInfo: "Error in getting all App" });
    }
}

exports.getSingleApp = async (req, res) =>
{
    try
    {

    }
    catch(error)
    {
        console.log("Error in getting single App: ", error);
        return res.status(500).json({ success: false, message: error.message, additionalInfo: "Error in getting single App" });
    }
}