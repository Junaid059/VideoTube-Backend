# Video Tube - YouTube Backend System

Video Tube is a backend system designed to replicate essential YouTube features such as video uploading, streaming, user authentication, and commenting. Videos are uploaded using Multer and stored on Cloudinary for efficient cloud-based media handling. This project is built with Node.js, Express.js, and MongoDB, providing a scalable architecture for video content management.

## Features

- **User Authentication**: Secure login and registration with access and refresh tokens.
- **Video Uploading**: Users can upload videos via Multer, which are then stored on Cloudinary.
- **Video Streaming**: Supports streaming directly from Cloudinary.
- **Commenting System**: Users can post comments on videos.
- **Like/Dislike System**: Allows users to like or dislike videos.
- **Search Functionality**: Search through the video collection based on metadata.
- **Cross-Origin Support**: Enabled for broader API accessibility.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Video Storage**: Cloudinary
- **File Uploads**: Multer

## Installation

### Prerequisites

Make sure you have the following installed:

- Node.js (v14 or later)
- MongoDB
- Cloudinary account for video storage

### Clone the Repository

To get a copy of the project, run the following commands:

```bash
git clone https://github.com/junaidkhalid/video-tube.git
cd video-tube
cd src
```

### Install Dependencies

- Run the following command to install all necessary dependencies:
- npm install

### Environment Variables

Create a .env file in the root directory and add the following variables:

```bash
PORT
CROSS_ORIGIN
MONGO_URI=mongodb
ACCESS_TOKEN_SECRET
ACCESS_TOKEN_EXPIRY
REFRESH_TOKEN_SECRET
REFRESH_TOKEN_EXPIRY
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

## Run the Application

To start the server in development mode, run the following command:

```bash
npm index.js
```

- The application will run on http://localhost:8000.

## Contributing

We welcome contributions! Follow these steps to contribute:

- Fork the Repository
- Clone Your Fork Locally
- Create a New Branch for Your Feature or Bug Fix:

```bash
git checkout -b feature-name

```

- Make Your Changes and Push to Your Fork

```bash
git add .
git commit -m "Added feature-name"
git push origin feature-name
```

- Submit a Pull Request with details of the changes
