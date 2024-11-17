const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/User');
const uploadRoutes = require('./routes/Upload');
const categoryRoutes = require('./routes/Category');
const mainFileUploadRoutes = require('./routes/DriveUpload');
const appRoutes = require('./routes/App');
const CookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('./config/database');
const cloudinaryConnection = require('./config/cloudinary');
const { configureGoogleDrive } = require('./config/googleDrive');

configureGoogleDrive().then(drive => {
  // You can use the 'drive' object here to interact with the Google Drive API
}).catch(error => {
  console.error("Failed to configure Google Drive API:", error);
});

dotenv.config();

// Connect to the database
dbConnection();

// Cloudinary connection
cloudinaryConnection();

// Middleware
app.use(express.json());
app.use(CookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  credentials: true, // Enable for cookies
}));  
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp'
}));

// Basic route
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/drive-upload", mainFileUploadRoutes);
app.use("/api/v1/app", appRoutes);
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

