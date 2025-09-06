require("dotenv").config({path: __dirname + "/.env"});
const app = require('./app');
const connectDB = require('./utils/db');
const {nms, nmsConfig} = require('./stream')
const port = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Streaming server
nms.run();
console.log(`✅ NMS running: RTMP on :${nmsConfig.rtmp.port}, HTTP on :${nmsConfig.http.port}`);
console.log(`   HLS:  http://localhost:${nmsConfig.http.port}/live/<STREAM_KEY>/index.m3u8`);
console.log(`   DASH: http://localhost:${nmsConfig.http.port}/live/<STREAM_KEY>/index.mpd`);
console.log(`   Stat: http://localhost:${nmsConfig.http.port}/api/streams`);