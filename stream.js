require('dotenv').config();
const axios = require('axios');
const NodeMediaServer = require('node-media-server');
const path = require('path');
const {streamUploadPath} = require('./config');

let ffmpegPath;
if (process.platform === 'win32') {
    // Windows path
    ffmpegPath = process.env.FFMPEG_WINDOWS_PATH;
} else {
    // Linux path
    ffmpegPath = process.env.FFMPEG_LINUX_PATH || '/usr/bin/ffmpeg';
}

const nmsConfig = {
    // RTMP ingest (from OBS/FFmpeg/etc.)
    rtmp: {
        port: Number(process.env.NMS_RTMP_PORT || 1935),
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    // HTTP server that serves HLS/DASH files and a simple stat page
    http: {
        port: Number(process.env.NMS_HTTP_PORT || 8000),
        mediaroot: streamUploadPath,
        allow_origin: '*'
    },
    // Transcoding: create HLS and DASH variants from RTMP
    trans: {
        ffmpeg: ffmpegPath,
        tasks: [
            {
                app: 'live', // publish to rtmp://host/live/STREAM_KEY
                hls: true,
                hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                hlsKeep: false,
                mp4: true,
                record: true,
                ffmpegParams: ["-loglevel", "debug"],
            }
        ],
        MediaRoot: streamUploadPath,
    },

    // Lightweight auth/signed URL features
    // auth: {
    //     api: true,           // enable /api endpoints with secret
    //     play: false,         // protect play with signed token (false by default)
    //     publish: false,      // protect publish with signed token (false by default)
    //     secret: process.env.NMS_SECRET || 'supersecret',
    // },
};


const nms = new NodeMediaServer(nmsConfig);

nms.on("preConnect", (id, args) => {
    console.log(
        "[NodeEvent on preConnect]",
        `id=${id} args=${JSON.stringify(args)}`,
    );
    // let session = nms.getSession(id);
    // session.reject();
});

nms.on("postConnect", (id, args) => {
    console.log(
        "[NodeEvent on postConnect]",
        `id=${id} args=${JSON.stringify(args)}`,
    );
});

nms.on("doneConnect", (id, args) => {
    console.log(
        "[NodeEvent on doneConnect]",
        `id=${id} args=${JSON.stringify(args)}`,
    );
});

nms.on("prePublish", (id, StreamPath, args) => {
    console.log(
        "[NodeEvent on prePublish]",
        `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`,
    );
    // Implement authentication for your streamers...
    // let session = nms.getSession(id);
    // session.reject();
});

nms.on("postPublish", (id, StreamPath, args) => {
    console.log(
        "[NodeEvent on postPublish]",
        `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`,
    );
});

nms.on("donePublish", (id, StreamPath, args) => {
    console.log(
        "[NodeEvent on donePublish]",
        `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`,
    );
});

nms.on("prePlay", (id, StreamPath, args) => {
    console.log(
        "[NodeEvent on prePlay]",
        `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`,
    );
    // let session = nms.getSession(id);
    // session.reject();
});

nms.on("postPlay", (id, StreamPath, args) => {
    console.log(
        "[NodeEvent on postPlay]",
        `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`,
    );
});

nms.on("donePlay", (id, StreamPath, args) => {
    console.log(
        "[NodeEvent on donePlay]",
        `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`,
    );
});


module.exports = {nms, nmsConfig};
