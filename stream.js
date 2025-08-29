require('dotenv').config();
const axios = require('axios');
const NodeMediaServer = require('node-media-server');
const path = require('path');
const { streamUploadPath} = require('./config');

let ffmpegPath;
if (process.platform === 'win32') {
    // Windows path
    ffmpegPath = process.env.FFMPEG_WINDOWS_PATH;
} else {
    // Linux path
    ffmpegPath = process.env.FFMPEG_LINUX_PATH || '/usr/bin/ffmpeg';
}

const config = {
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    http: {
        port: 8000,
        mediaroot: streamUploadPath,
        allow_origin: '*'
    },
    trans: {
        ffmpeg: ffmpegPath,
        tasks: [
            {
                app: 'live',
                hls: true,
                hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                hlsKeep: true, // to prevent hls file delete after end the stream
                dash: true,
                dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
                dashKeep: true, // to prevent dash file delete after end the stream
                mp4: true,
                mp4Flags: '[movflags=faststart]',
                record: true
            }
        ]
    }
};


const nms = new NodeMediaServer(config);

nms.on('preConnect', (id, args) => {
    console.log('[NodeEvent on preConnect]:', `id=${id} args=${JSON.stringify(args)}`);
    // Handle preConnect event
});

nms.on('postConnect', (id, args) => {
    console.log('[NodeEvent on postConnect]:', `id=${id} args=${JSON.stringify(args)}`);
    // Handle postConnect event
});

nms.on('doneConnect', (id, args) => {
    console.log('[NodeEvent on doneConnect]:', `id=${id} args=${JSON.stringify(args)}`);
    // Handle doneConnect event
});

nms.on('prePublish', (id, StreamPath, args) => {
    console.log('[NodeEvent on prePublish]:', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    // Handle prePublish event
});

nms.on('postPublish', (id, StreamPath, args) => {
    console.log('[NodeEvent on postPublish]:', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    // Handle postPublish event
});

nms.on('donePublish', async (id, StreamPath, args) => {
    console.log('[NodeEvent on donePublish]:', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    // Handle donePublish event
    // Extract lessonId from stream path: /live/lessonId
    // check below operation is not done on undefined
    const parts = StreamPath.split('/');
    const lessonId = parts[2];
    const videoPath = path.join(streamChunkPath, 'live', `${lessonId}.mp4`);
    // Notify your app to update the lesson record
    try {
        await axios.post('http://localhost:3000/api/webhook/stream-ended', {
            lessonId,
            videoPath
        });
        console.log(`Notified app for lesson ${lessonId} video at ${videoPath}`);
    } catch (err) {
        console.error('Failed to notify app:', err.message);
    }
});

nms.on('prePlay', (id, StreamPath, args) => {
    console.log('[NodeEvent on prePlay]:', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    // Handle prePlay event
});

nms.on('postPlay', (id, StreamPath, args) => {
    console.log('[NodeEvent on postPlay]:', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    // Handle postPlay event
});

nms.on('donePlay', (id, StreamPath, args) => {
    console.log('[NodeEvent on donePlay]:', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    // Handle donePlay event
});

module.exports = nms;
