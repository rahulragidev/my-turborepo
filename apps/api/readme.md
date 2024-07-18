# Lokus API

Property of Lokus, LLC

## Project Setup and Running Instructions

1. Run `yarn install` to install dependencies
2. Get your .env file from the project owner
3. Run `yarn build:watch` to start the tsc compiler in watch mode
4. Run `yarn dev` to start the server in watch mode
5. The server will emit a JWT token signed with the secret key in the .env file. You can use that as Authorization header to make requests via the graphql API.

## Project Structure

The `src` folder contains the following subfolders:
- auth
- database
- dbscripts
- entities 
- libs
- routes
- types
- utils

app.ts is the entry point of the application.
index.ts is the entry point of the graphql server.
config.ts has the env vars and the configurations of the server.
logger.ts is the logger configuration.
