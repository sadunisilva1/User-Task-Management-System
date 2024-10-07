# User-Task-Management-System

## Create MongoDB account and free cluster if not available
Refer https://www.mongodb.com/cloud/atlas/register

## If MongoDB account and a cluster available
Get the connection string as explained in https://www.mongodb.com/docs/guides/atlas/connection-string/

## Available Scripts

In the directory /User-Task-Management-System/backend, you can run:

### `npm install`

Install the dependencies

### Create .env file

Create .env file at /User-Task-Management-System/backend directory

Add the following environment variables to the .env file

PORT=3005
JWT_SECRET=mysecretkey

#### Add the mongoDB Connection String of MONGO_URI and MONGO_TEST_URI in .env file
Get the copied connection String and add the respective environment variables in .env file as below

MONGO_URI=mongodb+srv://<db_username>:<db_password>@<cluster>/user_task_management_system
MONGO_TEST_URI=mongodb+srv://<db_username>:<db_password>@<cluster>/user_task_management_system_TEST

Finally save the .env file

### `nodemon`

Runs the app in the development mode.\
Runs on port 3005