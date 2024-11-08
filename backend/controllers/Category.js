const Category = require("../models/Category");

exports.createCategories = async (req, res) => {
    try {
        // Get the category to add from the request body
        const { name, description } = req.body;

        // Check if both name and description are provided
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "Both name and description are required"
            });
        }
        

        // Check if the category already exists
        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: "Category already exists"
            });
        }

        // Create the new category
        const newCategory = new Category({ name, description });

        // Save the new category
        const result = await newCategory.save();

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: result
        });

    } catch (error) {
        console.error("Error while creating categories:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
            additionalInfo: "Error while creating categories"
        });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: categories
        });
    } catch (error) {
        console.error("Error while getting categories:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
            additionalInfo: "Error while getting categories"
        });
    }
};