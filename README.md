# Admin Panel Project

# Assumptions

- User can have only 1 role.
- 3 Roles: Admin, Editor, User (Authorizations of roles are described down below)
- There are 3 data types. Users, Courses and Contents.
- Courses can have multiple contents.

**Admin**

| Table    | Read | Write | Update | Delete |
| -------- | ---- | ----- | ------ | ------ |
| Users    | X    | X     | X      | X      |
| Courses  | X    | X     | X      | X      |
| Contents | X    | X     | X      | X      |

**Editor**

| Table    | Read | Write | Update | Delete |
| -------- | ---- | ----- | ------ | ------ |
| Users    |      |       |        |        |
| Courses  | X    | X     | X      |        |
| Contents | X    | X     | X      |        |

**User**

| Table    | Read | Write | Update | Delete |
| -------- | ---- | ----- | ------ | ------ |
| Users    |      |       |        |        |
| Courses  | X    |       |        |        |
| Contents | X    |       |        |        |

# Tech Stack

1. **Backend**: NestJS
2. **Frontend**: React
3. **Database**: PostgreSQL
4. **Testing**: Jest for unit testing. Postman for e2e testing.

# Features

- Swagger Documentation
- JWT authentication with refresh & access token
- Role based authorization
- Data filtering
- Fully responsive design

# First Login

On the first run, application inserts a new admin to the database.

- **username**: admin
- **password**: admin123

# How to setup

## **Deploy with Docker**

You can run the entire app using docker compose.

On root directory

```bash
docker-compose up -d
```

Application will be deployed on http://localhost:3000

Swagger Docs on http://localhost:3000/api/docs

## **Running locally**

## Backend

First you have to postgresql installed on your computer.

Change the database properties on the backend/.env file.

On backend directory

### Installing the dependencies

```bash
yarn
```

### Running the app

```bash
$ yarn start
```

Backend will be started on http://localhost:5000

Swagger Docs on http://localhost:5000/api/docs

## Frontend

On frontend directory

### Installing the dependencies

```bash
yarn
```

### Running the app

```bash
$ yarn start
```

Frontend will be started on http://localhost:3000

# Testing

**Unit testing**

On backend directory

```bash
yarn test
```

**e2e api testing**

First start the backend locally.

On backend directory

Install the dependencies

```bash
yarn
```

Start the backend locally.

```bash
yarn start
```

Start the test

```bash
yarn test:e2e
```