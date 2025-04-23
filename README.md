
# Pantraqa – Backend API

Pantraqa is a smart inventory management system designed for hospitality teams who need real-time control over beverage stock across suite pantries and storage locations.

This repository contains the backend API built with **Node.js**, **Express**, **PostgreSQL**, and **Sequelize ORM**.

## 🧠 Key Features

- RESTful API endpoints for drinks, stock management, users, and activity logs
- Role-based authentication and authorization (Admin, Manager, Staff)
- Sequelize ORM for database interactions
- JSON Web Token (JWT) based auth
- Error handling and request validation
- Environment-based configuration

## ⚙️ Tech Stack

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **Sequelize ORM**
- **JWT (Authentication)**
- **Dotenv**
- **Jest & Supertest** for testing

## 🛠 Environment Variables

Create a `.env` file in the root of the project with the following:

```
PORT=5000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=your_db_name
JWT_SECRET=your_jwt_secret
DB_URL=your_database_url
```

> Make sure PostgreSQL is running and the database `pantry_db` exists.

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/Harrytimbog/Pantraqa.git
cd Pantraqa
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

## 🧪 Running Tests

```bash
npm test
```

## 📁 API Endpoints

- `POST /auth/register` – Register a new user
- `POST /auth/login` – Login and receive JWT
- `GET /drinks` – Retrieve list of drinks
- `POST /stocks/in` – Stock in drinks
- `POST /stocks/out` – Stock out drinks
- `GET /stocks` – Current stock list
- `GET /stocklogs` – Stock in/out logs

## 📄 License

This project is licensed under the MIT License.

## 🙌 Acknowledgements

Built and maintained by [Timilehin Arigbede](https://github.com/harrytimbog).
