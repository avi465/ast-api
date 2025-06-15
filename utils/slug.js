const categoryModelSlug = require('../models/categoryModel');
const slugify = require('slugify');

const createCategorySlug = async (name) => {
    try {
        // Generate a slug from the name
        const slug = slugify(name, { lower: true, strict: true });

        // Check if the slug already exists in the database
        const existingCategory = await categoryModelSlug.findOne({ slug });
        if (existingCategory) {
            throw new Error('Slug already exists. Please choose a different name.');
        }

        return slug;
    } catch (error) {
        throw error;
    }
}