Video Tube - YouTube Backend System
Video Tube is a backend system designed to replicate essential YouTube features such as video uploading, streaming, user authentication, and commenting. Videos are uploaded using Multer and stored on Cloudinary for efficient cloud-based media handling. This project is built with Node.js, Express.js, and MongoDB, providing a scalable architecture for video content management.

Features
User Authentication: Secure login and registration with access and refresh tokens.
Video Uploading: Users can upload videos via Multer, which are then stored on Cloudinary.
Video Streaming: Supports streaming directly from Cloudinary.
Commenting System: Users can post comments on videos.
Like/Dislike System: Allows users to like or dislike videos.
Search Functionality: Search through the video collection based on metadata.
Cross-Origin Support: Enabled for broader API accessibility.
Tech Stack
Backend: Node.js, Express.js
Database: MongoDB
Authentication: JWT (JSON Web Tokens)
Video Storage: Cloudinary
File Uploads: Multer
Installation
Prerequisites
Make sure you have the following installed:

Node.js (v14 or later)
MongoDB
Cloudinary account for video storage
Clone the repository
bash
Copy code
git clone https://github.com/yourusername/video-tube.git
cd video-tube
Install dependencies
bash
Copy code
npm install
Environment Variables
Create a .env file in the root directory and add the following variables:

bash
Copy code
PORT=8000
CROSS_ORIGIN=\*
MONGO_URI=mongodb://127.0.0.1:27017/videoTube
ACCESS_TOKEN_SECRET=dhiuwhdiuwhwncwxhoiwxalknxslkahxwi
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=iudwhgdiwhdwodoiwdhoiu3429y9xkabxxjqkaxnkjanx,abxkwxgiwbxkabxkqgdiqxkq
REFRESH_TOKEN_EXPIRY=20d
CLOUDINARY_CLOUD_NAME=dffi0m2rb
CLOUDINARY_API_KEY=417131923331576
CLOUDINARY_API_SECRET=Lde10DanuuhFHhZlQuEdwumK8AQ
Run the Application
To start the server in development mode:

bash
Copy code
npm run dev
The application will run on http://localhost:8000.

Contributing
We welcome contributions! Follow these steps to contribute:

Fork the repository.

Clone your fork locally:

bash
Copy code
git clone https://github.com/your-username/video-tube.git
cd video-tube
Create a new branch for your feature or bug fix:

bash
Copy code
git checkout -b feature-name
Make your changes and push to your fork:

bash
Copy code
git add .
git commit -m "Added feature-name"
git push origin feature-name
Submit a Pull Request with details of the changes.
