# Back-end Project northCoders-Knews

## my-nc-knews
A news app created for northCoders bootcamp. It is written in javaScript using a database library called 'knex', as well as 'express' which is a Node.js web application framework. It keeps track of topics, articles, users and comments. The app can be run in a development environment, or on [heroku](https://my-nc-knews.herokuapp.com). 

### Getting Started

1. Make sure you have postgreSQL installed on your machine before the next step.
2. Fork and Clone this repository.
3. Once cloned to your machine, run `npm install` in your terminal to install all dependencies.
4. Create a file called knexfile.js in your route directory. This is where you will put your configuration settings(see 'Installing' below).
5. Run `npm run start` to start the node server on your local environment. 

### Prerequisites

#### Installing PostgreSQL
For Linux install postgreSQL using the following command: `sudo app-get install postgresql`. Make note of the password you create. Once postgreSQL is installed create a new user `create user -U postgres <username>`. Type in the password you created in the previous step. 

For Mac users, please follow the installation instructions on the [official postgreSQL](https://www.postgresql.org/download/) webpage.

To create and seed the database run `npm run seed`. This will create both the production and test databases.

### Installing

Before running the application you will need to set up your database connection in the knexfile.js you previously created. Here is an example configuration: 

```
const { DB_URL } = process.env;

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'nc_knews',
      user: 'yourUserGoesHere',
      password: 'yourPasswordGoesHere',
    },
    migrations: {
      directory: 'db/migrations',
    },
    seeds: {
      directory: 'db/seeds',
    },
  },
  production: {
    client: 'pg',
    connection: `${DB_URL}?ssl=true`,
    migrations: {
      directory: 'db/migrations',
    },
    seeds: {
      directory: 'db/seeds',
    },
  },
  test: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'yourUserGoesHere',
      password: 'yourPasswordGoesHere',
      database: 'test_nc_knews',
    },
    migrations: {
      directory: 'db/migrations',
    },
    seeds: {
      directory: 'db/seeds',
    },
  },
};

```

To set up the schema first run `npx knex migrate:latest`. Then run `npx knex seed:run` to insert the seed data. 

Once your configuration is set up, you should be able to run the server by using the command: `npm run start`.

You can now point your browser to `localhost:9090/api` to get an overview of all the endpoints available for the app. 

### Examples

You can run all of the unit tests by typing in the command `npm run test`.

**NB**: If adding additional tests, be mindful of the fact that the test files run alphabetically and the last test needs to destroy the database connection. If the connection is not destroyed, the tests hang. Currently this is done in topics.spec.js. 

### Deployment

[Deployment instructions](https://devcenter.heroku.com/articles/getting-started-with-nodejs). 

### Built With
- Node.js 
- express web framework
- knexjs
- chai
- mocha

### Versioning
Github has been used for versioning. For the versions available, see the tags on this repository.

### Authors
Britannia Lomax

### Acknowledgements
All of the ncHelpers & tutors who helped BE2 from 12.11.18-26.11.18.
