# Shudhh APK - MERN Project

Shudhh APK is a MERN-based project for managing and downloading Android APK files. It integrates MongoDB, Express.js, React.js, and Node.js, with cloud storage solutions like Cloudinary and Google Drive for media and file management.

## Table of Contents

- [Introduction](#introduction)
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Setup and Installation](#setup-and-installation)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
  - [Database Setup](#database-setup)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Shudhh APK is a MERN (MongoDB, Express, React, Node) stack application designed to manage Android APK files. It offers features like uploading, downloading, and managing APK files along with media storage via Cloudinary and Google Drive.

## Project Overview

This project is a full-stack web application that allows users to upload, download, and manage Android APK files. The backend is built using Node.js and Express, while the frontend is built using React.js and Redux for state management. The project uses MongoDB for data storage and integrates Cloudinary and Google Drive for file storage.

## Technology Stack

- **Frontend**: React, Redux, React Router, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Cloud Services**: Cloudinary, Google Drive
- **Testing**: Jest, Enzyme, Postman

## Setup and Installation

Follow the steps below to set up the project on your local machine.

### Prerequisites

Make sure the following tools are installed:

- Node.js (v14+)
- MongoDB (v4+)
- npm (v6+)

### Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/shudhh-apk-mern-project.git
cd shudhh-apk-mern-project
```

### Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

### Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the backend server:

```bash
node server.js
```

### Database Setup

Start MongoDB:

```bash
mongod
```

Create a database:

```bash
use shudhh-apk-mern-project
```

Create required collections:

```bash
db.createCollection("users")
db.createCollection("apks")
db.createCollection("comments")
```

## API Documentation

The API documentation is accessible at:

```bash
http://localhost:3000/api/docs
```

Core Endpoints:
- User Routes: Authentication, profile management
- APK Routes: CRUD operations for APK files
- Media Routes: File uploads using Cloudinary and Google Drive

## Testing

Unit Testing Tools: Jest, Enzyme
- Components Tested: AppList, AppDetail, UploadForm

Integration Testing Tools: Postman, Jest
- Focused on API endpoints and error handling.

Cloud Service Testing
- Validated media uploads on Cloudinary.
- Ensured Google Drive integration handles various file types.

## Deployment

Deploy the project to platforms like Heroku, AWS, or Vercel.
- Update .env with production settings.
- Push changes to a remote repository.
- Follow the deployment instructions of your chosen platform.

## Troubleshooting

Common Issues:
- MongoDB connection failure: Ensure MongoDB is running and the URI is correct.
- CORS errors: Update the CORS configuration in the backend.
- Cloud service errors: Verify API keys and credentials in the .env file.

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and submit a pull request. For any issues or suggestions, please open an issue in the GitHub repository.

## License

This project is licensed under the MIT License.
