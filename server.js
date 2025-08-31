require("dotenv").config({ path: __dirname + "/.env" });
const app = require('./app');
const connectDB = require('./utils/db');
const nms = require('./stream')
const port = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Streaming server
nms.run();