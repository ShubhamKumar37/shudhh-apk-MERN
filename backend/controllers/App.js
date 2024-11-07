const AppMedia = require('../models/AppMedia');
const Category = require('../models/Category');
const App = require('../models/App');
const Media = require('../models/Media');
const { uploadToCloudinary, deleteFileCloudinary } = require('../utils/cloudinaryWork');
const {uploadFileToDrive, deleteFileFromDrive} = require("../utils/driveWork");


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
        console.log(1);

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
        if(releaseDate) dataOptions.releaseDate =  new Date(releaseDate);
        if(systemRequirement) dataOptions.systemRequirement = systemRequirement;
        if(language) dataOptions.language = language;
        if(appPermission) dataOptions.appPermission = appPermission;
        if(inAppPurchase) dataOptions.inAppPurchase = inAppPurchase;
        if(searchKeywords) dataOptions.searchKeywords = searchKeywords;


        const newApp = await App.create(dataOptions);

        const categoryExist = await Category.findById(category);
        if(!categoryExist)
        {
            return res.status(400).json({ success: false, message: "Category not found" });
        }

        const appIconResponse = await uploadToCloudinary(appIcon, "media", 90);
        const appIconData = await Media.create({
            url: appIconResponse.secure_url,
            publicId: appIconResponse.public_id,
            type: appIcon.mimetype.split("/")[0],
        });

        for (const item of appMedia) {
            console.log("This is item = ", item);
            const appMediaResponse = await uploadToCloudinary(item, "media", 90);
            const tempAppRes = await Media.create({
                url: appMediaResponse.secure_url,
                publicId: appMediaResponse.public_id,
                type: item.mimetype.split("/")[0],
            });

            newApp.media.push(tempAppRes._id);
        }

        const fileData = await uploadFileToDrive(appFile);
        const newAppFile = await AppMedia.create({
            app: newApp._id,
            googleDriveFileId: fileData.googleDriveFileId,
            fileName: fileData.fileName,
            fileType: fileData.fileType,
            fileSize: appFile?.size,
            fileUrl: fileData.fileUrl
        });
        
        
        newApp.category = categoryExist._id;
        newApp.appIcon = appIconData._id;
        newApp.appFile = newAppFile._id;


        const savedApp = await newApp.save({ new: true });
        const populatedApp = await App.findById(savedApp._id)
            .populate('category')  
            .populate('appIcon')    
            .populate('media')      
            .exec();
        return res.status(200).json({ success: true, message: "App created successfully", data: populatedApp });
        
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
        const {appId} = req.body;

        if(!appId)
        {
            return res.status(400).json({ success: false, message: "App id is required" });
        }

        const appExist = await App.findById(appId);
        if(!appExist)
        {
            return res.status(404).json({ success: false, message: "App not found" });
        }

        const appFileDelete = await AppMedia.findByIdAndDelete(appExist.appFile);
        if(!appFileDelete) return res.status(404).json({ success: false, message: "App file not found" });
        const deleteFileResponse = await deleteFileFromDrive(appFileDelete.googleDriveFileId);
        console.log("Delete file response:", deleteFileResponse);

        const appIconDelete = await Media.findByIdAndDelete(appExist.appIcon);
        if(!appIconDelete) return res.status(404).json({ success: false, message: "App icon not found" });
        const deleteIconResponse = await deleteFileCloudinary(appIconDelete.publicId, appIconDelete.type);
        console.log("Delete icon response:", deleteIconResponse);

        for(let item of appExist.media)
        {
            const mediaDelete = await Media.findByIdAndDelete(item);
            if(!mediaDelete) return res.status(404).json({ success: false, message: "App media not found" });
            const deleteMediaResponse = await deleteFileCloudinary(mediaDelete.publicId, mediaDelete.type);
            console.log("Delete media response:", deleteMediaResponse);
        }

        const appDelete = await App.findByIdAndDelete(appId);

        return res.status(200).json({ success: true, message: "App deleted successfully", data: appDelete });
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
        const allApps = await App.find({}).populate('category').populate('appIcon').populate('media');

        return res.status(200).json({ success: true, message: "App fetched successfully", data: allApps });
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
        const {appId} = req.body || req.params;

        if(!appId)
        {
            return res.status(400).json({ success: false, message: "App id is required" });
        }

        const appExist = await App.findById(appId)?.populate('category')?.populate('appIcon')?.populate('media');
        if(!appExist)
        {
            return res.status(404).json({ success: false, message: "App not found" });
        }

        return res.status(200).json({ success: true, message: "App fetched successfully", data: appExist });
    }
    catch(error)
    {
        console.log("Error in getting single App: ", error);
        return res.status(500).json({ success: false, message: error.message, additionalInfo: "Error in getting single App" });
    }
}