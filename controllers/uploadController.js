const Image = require('../models/Image');

exports.uploadImages = async (req, res) => {
    try {
        const files = req.files || [];

        if (!files.length) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const images = await Promise.all(
            files.map(async (file) => {
                const image = new Image({
                    url: file.path, // or cloudinary URL
                    altText: file.originalname,
                    metadata: {
                        fieldname: file.fieldname,
                        originalname: file.originalname,
                        encoding: file.encoding,
                        mimetype: file.mimetype,
                        destination: file.destination,
                        filename: file.filename,
                        path: file.path,
                        size: file.size,
                    },
                });
                return await image.save();
            })
        );

        res.status(201).json({
            message: 'Images uploaded successfully',
            images: images.map(({ _id, url, altText }) => ({ _id, url, altText })),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Image upload failed' });
    }
};
