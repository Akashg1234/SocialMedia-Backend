# Social Media Backend with Node.js, MongoDB, and Cloudinary

[![Node.js](https://img.shields.io/badge/Node.js-v14.17.5-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v4.4-green.svg)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-v2.0.0-blue.svg)](https://cloudinary.com/)

🚀 Welcome to the Social Media Backend project! This backend application is built using Node.js, MongoDB, and Cloudinary to handle social media-related functionalities. It provides endpoints to manage users, posts, comments, and media files, allowing you to create a fully functional social media platform.

## Table of Contents

1. [Description](#description)
2. [Installation and Setup](#installation-and-setup)
3. [Usage](#usage)
4. [License](#license)

## Description

This project aims to provide the backend infrastructure for a social media platform. It leverages the power of Node.js as the server-side runtime environment, MongoDB as the database for storing user information, posts, and comments, and Cloudinary for managing media files such as images and videos.

🎯 Key features of the Social Media Backend include:

- User Authentication: Allows users to sign up, log in, and manage their profiles securely.
- Post Creation and Management: Enables users to create, edit, delete, and view posts.
- Comment System: Allows users to comment on posts and interact with each other.
- Media Upload: Provides the capability to upload and store media files for posts and user profiles.
- User Following: Implements a following system where users can follow each other to see their posts in their feed.

The project is built with scalability and maintainability in mind, providing a solid foundation for further enhancements and customization.


## Installation and Setup

To get started with the Social Media Backend, follow these steps:

1. Clone the repository to your local machine.

```
git clone <repository_url>
cd social-media-backend
```

2. Install the required dependencies.

```
npm install
```


3. Set up your Cloudinary account and obtain the API credentials.

- Create a Cloudinary account at https://cloudinary.com/.
- Retrieve your Cloudinary Cloud Name, API Key, and API Secret.

4. Configure the environment variables.

Create a `.env` file in the root directory of the project and add the following:

```
PORT=5000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET_KEY=<jwt secret>
SMTP_HOST="smtp.mailtrap.io"
SMTP_PORT='2525'
SMTP_USER='nikita71@ethereal.email'
SMTP_PASS='u6PQnMtfanTEucNZQP'
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
```


Replace `<your_mongodb_connection_string>`, `<your_cloudinary_cloud_name>`, `<your_cloudinary_api_key>`, and `<your_cloudinary_api_secret>` with your actual credentials.

5. Start the application.

```
npm start
```


The backend server will be running on `http://localhost:3000`.

## Usage

Once the backend is up and running, you can use the provided API endpoints to interact with the social media platform. Below are some of the available endpoints:

- `POST /user/register`: Register a new user.
- `POST /user/login`: Log in an existing user.
- `PUT  /update/password`: Update user password
- `GET  /logout`: Logout user
- `GET /post`: Get a list of all posts.
- `POST /post/create`: Create a new post.
- `POST /post/like/:postId`: Like a specific post
- `POST /post/dislike/:postId`: Disike a specific post
- `GET /post/posts/:postId`: Get a specific post by its ID.
- `PUT /api/posts/:postId`: Update a post.
- `DELETE /posts/delete-post/:postId`: Delete a post.
- `PUT /post/comment-post/:postId`: Add a comment to a post.
- `POST /api/follow/:userId`: Follow a user.

Please refer to the API documentation or explore the codebase to discover more endpoints and functionalities.

## License

The Social Media Backend project is licensed under the [MIT License](LICENSE), which allows you to use, modify, and distribute the code for both commercial and non-commercial purposes. See the [LICENSE](LICENSE) file for more details.
