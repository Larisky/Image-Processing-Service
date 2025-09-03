# 📸 Image Processing Service

An **image upload and processing API** built with **Node.js, TypeScript, Prisma, MongoDB, and AWS S3**, fully containerized using **Docker**.

---

## ✨ Features

* User authentication (JWT-based)
* Secure password hashing with **Argon2**
* Upload images to **AWS S3**
* Store image and user metadata in **MongoDB** via Prisma ORM
* RESTful API endpoints for authentication & image operations
* Fully containerized with Docker Compose

---

## 🛠️ Tech Stack

* **Backend:** Node.js, TypeScript, Express.js
* **Database:** MongoDB (ReplicaSet enabled)
* **ORM:** Prisma
* **Auth:** JWT, Argon2
* **Storage:** AWS S3
* **Deployment:** Docker & Docker Compose

---

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
 git clone https://github.com/your-username/image-processing-service.git
 cd image-processing-service
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=4000
DATABASE_URL="mongodb://image-service-db:27017,image-service-db:27017/image_service?replicaSet=rs0"
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_S3_BUCKET=your_bucket_name
```

### 3. Run with Docker

```bash
docker-compose up --build
```

This will start:

* **API Service** on `http://localhost:4000`
* **MongoDB ReplicaSet**

### 4. Push Prisma Schema

Inside the API container:

```bash
docker exec -it image-service-api sh
npx prisma db push
```

---

## 🔑 API Endpoints

### Authentication

* **POST** `/auth/register` → Register user
* **POST** `/auth/login` → Login user

### Images

* **POST** `/images/upload` → Upload an image (authenticated, multipart/form-data)
* **GET** `/images` → List user images

---

## 📂 Project Structure

```
📦 image-processing-service
 ┣ 📂 src
 ┃ ┣ 📂 controllers   # Route handlers
 ┃ ┣ 📂 services      # Business logic
 ┃ ┣ 📂 prisma        # Prisma schema & client
 ┃ ┣ 📂 middleware    # Auth middlewares
 ┃ ┗ server.ts       # App entrypoint
 ┣ 📜 docker-compose.yml
 ┣ 📜 Dockerfile
 ┣ 📜 prisma/schema.prisma
 ┣ 📜 package.json
 ┣ 📜 README.md
```

---

## 🧪 Testing API

You can test using **Postman** or **cURL**.

```bash
# Register user
POST http://localhost:4000/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "username": "larry"
}

# Login
POST http://localhost:4000/auth/login

# Upload Image (with Bearer Token)
POST http://localhost:4000/images/upload
```

---

## 🚀 Deployment

* Make sure AWS credentials are correctly set in environment.
* Use **Docker Compose** for production as well.
* Optionally, set up **NGINX** or **API Gateway** in front of the API.

---

## 👨‍💻 Author

* Larry 🧑‍💻

---

## 📜 License

This project is licensed under the MIT License.

## PROJECT URL

https://roadmap.sh/projects/image-processing-service