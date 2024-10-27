const AppMedia = require('../models/AppMedia');


exports.createApp = async (req, res) => {
    try
    {

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