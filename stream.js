const NodeMediaServer = require('node-media-server');

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
        mediaroot: './media',
        allow_origin: '*'
    },
    trans: {
        ffmpeg: '/usr/bin/ffmpeg',
        tasks: [
            {
                app: 'live',
                hls: true,
                hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                dash: true,
                dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
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

nms.on('donePublish', (id, StreamPath, args) => {
    console.log('[NodeEvent on donePublish]:', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    // Handle donePublish event
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
