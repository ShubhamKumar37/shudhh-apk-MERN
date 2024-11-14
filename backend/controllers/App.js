const AppMedia = require('../models/AppMedia');
const Category = require('../models/Category');
const User = require('../models/User');
const App = require('../models/App');
const Media = require('../models/Media');
const { uploadToCloudinary, deleteFileCloudinary, updateFileCloudinary } = require('../utils/cloudinaryWork');
const { uploadFileToDrive, deleteFileFromDrive, updateFileOnDrive } = require("../utils/driveWork");


exports.createApp = async (req, res) => {
    try {
        const { appName, appDescription, companyName, category, tag, size, download, releaseDate, systemRequirement, language, appPermission, inAppPurchase, searchKeywords } = req.body;
        const userId = req.user.id;

        const { appFile, appIcon, appMedia } = req.files;

        console.log("This is req.files = ", req.files);
        console.log("This is req.body = ", req.body);
        console.log("This is appFile = ", appFile);

        if (!appName || !category || !tag || !releaseDate || !appPermission || !appFile || !appIcon || !appMedia) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }


        const dataOptions = {};

        if (appName) dataOptions.appName = appName;
        if (appDescription) dataOptions.appDescription = appDescription;
        if (companyName) dataOptions.companyName = companyName;
        if (tag) dataOptions.tag = tag;
        if (size) dataOptions.size = size;
        if (download) dataOptions.download = download;
        if (releaseDate) dataOptions.releaseDate = new Date(releaseDate);
        if (systemRequirement) dataOptions.systemRequirement = systemRequirement;
        if (language) dataOptions.language = language;
        if (appPermission) dataOptions.appPermission = appPermission;
        if (inAppPurchase) dataOptions.inAppPurchase = inAppPurchase;
        if (searchKeywords) dataOptions.searchKeywords = searchKeywords;
        dataOptions.providedBy = userId;


        const newApp = await App.create(dataOptions);
        const userData = await User.findByIdAndUpdate(userId, { $push: { apps: newApp._id } }, { new: true });

        const categoryExist = await Category.findById({ _id: category });
        if (!categoryExist) {
            return res.status(400).json({ success: false, message: "Category not found" });
        }

        const appIconResponse = await uploadToCloudinary(appIcon, "media", 90);
        const appIconData = await Media.create({
            url: appIconResponse.secure_url,
            publicId: appIconResponse.public_id,
            type: appIcon.mimetype.split("/")[0],
        });

        if (Array.isArray(appMedia)) {
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
        } else {
            const appMediaResponse = await uploadToCloudinary(appMedia, "media", 90);
            const tempAppRes = await Media.create({
                url: appMediaResponse.secure_url,
                publicId: appMediaResponse.public_id,
                type: appMedia.mimetype.split("/")[0],
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
        populatedApp.providedBy = userData;
        return res.status(200).json({ success: true, message: "App created successfully", data: populatedApp });

    }
    catch (error) {
        console.log("Error in creating App: ", error);
        return res.status(500).json({ success: false, message: error.message, additionalInfo: "Error in creating App" });
    }
}

exports.deleteApp = async (req, res) => {
    try {
        const { appId } = req.body;
        const userId = req.user.id;

        if (!appId) {
            return res.status(400).json({ success: false, message: "App id is required" });
        }

        // Ensure the app exists and is owned by the user
        const appExist = await App.findById(appId);
        if (!appExist) {
            return res.status(404).json({ success: false, message: "App not found" });
        }

        // Delete app file from drive
        const appFileDelete = await AppMedia.findByIdAndDelete(appExist.appFile);
        if (appFileDelete)
        {
            const deleteFileResponse = await deleteFileFromDrive(appFileDelete.googleDriveFileId);
            if (!deleteFileResponse.success) {
                return res.status(500).json({ success: false, message: "Failed to delete app file from Google Drive" });
            }
        }

        // Delete app icon from Cloudinary
        const appIconDelete = await Media.findByIdAndDelete({_id: appExist.appIcon._id});
        if(appIconDelete )
        {
            const deleteIconResponse = await deleteFileCloudinary(appIconDelete.publicId, appIconDelete.type);
            console.log("This is deleteIconResponse: ", deleteIconResponse);
        }

        // Delete associated media files from Cloudinary
        for (let item of appExist.media) {
            const mediaDelete = await Media.findByIdAndDelete(item);
            if (mediaDelete)
            {
                const deleteMediaResponse = await deleteFileCloudinary(mediaDelete.publicId, mediaDelete.type);
                console.log("This is deleteMediaResponse: ", deleteMediaResponse);
                if (!deleteMediaResponse.result === 'ok') {
                    return res.status(500).json({ success: false, message: "Failed to delete app media from Cloudinary" });
                }
            }
        }

        // Delete the app from the database
        const appDelete = await App.findByIdAndDelete(appId);

        // Pull the appId from the user's apps array
        const deleteFromUser = await User.findByIdAndUpdate(userId, { $pull: { apps: appId } }, { new: true });

        // Update the app's `providedBy` field (if necessary)
        appDelete.providedBy = deleteFromUser._id;

        return res.status(200).json({ success: true, message: "App deleted successfully", data: appDelete });
    }
    catch (error) {
        console.log("Error in deleting App: ", error);
        return res.status(500).json({ success: false, message: error.message, additionalInfo: "Error in deleting App" });
    }
};


exports.updateApp = async (req, res) => {
    try {
        try {
            const appId = req.params.appId || req.body;
            const {
                appName,
                appDescription,
                companyName,
                category,
                tag,
                size,
                download,
                releaseDate,
                systemRequirement,
                language,
                appPermission,
                inAppPurchase,
                searchKeywords,
            } = req.body;

            const app = await App.findById(appId);
            if (!app) {
                return res.status(404).json({ success: false, message: "App not found" });
            }

            if (appName) app.appName = appName;
            if (appDescription) app.appDescription = appDescription;
            if (companyName) app.companyName = companyName;
            if (tag) app.tag = tag;
            if (size) app.size = size;
            if (download) app.download = download;
            if (releaseDate) app.releaseDate = new Date(releaseDate);
            if (systemRequirement) app.systemRequirement = systemRequirement;
            if (language) app.language = language;
            if (appPermission) app.appPermission = appPermission;
            if (typeof inAppPurchase === 'boolean') app.inAppPurchase = inAppPurchase;
            if (searchKeywords) app.searchKeywords = searchKeywords;

            if (category) {
                const categoryExist = await Category.findById(category);
                if (!categoryExist) {
                    return res.status(400).json({ success: false, message: "Category not found" });
                }
                app.category = category;
            }

            const updatedApp = await app.save();

            const populatedApp = await App.findById(updatedApp._id)
                .populate('category')
                .populate('appIcon')
                .populate('media');

            return res.status(200).json({
                success: true,
                message: "App updated successfully",
                data: populatedApp,
            });
        } catch (error) {
            console.log("Error in updating App: ", error);
            return res.status(500).json({
                success: false,
                message: error.message,
                additionalInfo: "Error in updating App",
            });
        }
    }
    catch (error) {
        console.log("Error in updating App: ", error);
        return res.status(500).json({ success: false, message: error.message, additionalInfo: "Error in updating App" });
    }
}

exports.getAllApp = async (req, res) => {
    try {
        const allApps = await App.find({}).populate('category').populate('appIcon').populate('media');
        console.log("This is allApps: ", allApps);

        return res.status(200).json({ success: true, message: "App fetched successfully", data: allApps });
    }
    catch (error) {
        console.log("Error in getting all App: ", error);
        return res.status(500).json({ success: false, message: error.message, additionalInfo: "Error in getting all App" });
    }
}

exports.getSingleApp = async (req, res) => {
    try {
        const { appId } = req.params;
        console.log("This is appId: ", appId);

        if (!appId) {
            return res.status(400).json({ success: false, message: "App id is required" });
        }

        const appExist = await App.findById(appId)
            .populate('category')
            .populate('appIcon')
            .populate('appFile')
            .populate('media');

        if (!appExist) {
            return res.status(404).json({ success: false, message: "App not found" });
        }

        return res.status(200).json({ success: true, message: "App fetched successfully", data: appExist });
    } catch (error) {
        console.log("Error in getting single App: ", error);
        return res.status(500).json({ success: false, message: error.message, additionalInfo: "Error in getting single App" });
    }
};
