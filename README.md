# Post Office System

This project is a **postal service management system** consisting of two parts: **client** and **server**.

## Running the Application

To run the project on your machine, follow these steps:

### 1. Install Required Tools

Before you begin, you need to have the following tools installed:

- **Docker**: [Download Docker](https://www.docker.com/products/docker-desktop) and install it on your computer.
- **Node.js**: It is recommended to install **Node.js** for backend development.

### 2. Running with Docker

In the root folder of the project (where the `docker-compose.yml` file is located), run the following command to start the database service in Docker:

```bash
docker-compose up
```

### 3. Running the server

- Navigate to server

```bash
cd server
```

- Install dependencies

```bash
npm install
```

- Start the server

```bash
npm start
```

### 4. Running the client

- Navigate to client

```bash
cd client
```

- Install dependencies

```bash
npm install
```

- Start the client application

```bash
npm start
```


