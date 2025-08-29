const Lesson = require('../models/Lesson');

exports.streamEndedWebhook = async (req, res) => {
    const { lessonId, videoPath } = req.body;
    if (!lessonId || !videoPath) {
        return res.status(400).send('Missing data');
    }

    try {
        await Lesson.updateOne({ _id: lessonId }, { videoUrl: `/${videoPath}` });
        res.status(200).send('Video saved');
    } catch (err) {
        console.error('DB update failed:', err.message);
        res.status(500).send('DB update failed');
    }
}