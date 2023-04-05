# Edutask: a Training System for PA1417

This is the codebase for **edutask**, a simple web-based application where users can sign up, add YouTube videos to a watchlist, and associate these videos with todo lists in order to keep track of educational material. The application consists of a database using MongoDB, a server using Flask, and a graphical user interface using React. You can find more information in the [specification](./documentation/edutask-specification.pdf).

Please keep the following in mind:

* The system contains intended flaws, which are to be identified applying test techniques.
* The system is a work-in-progress, meaning that some functionalities are not yet implemented. Focus on the functionalities that already exist, everything else can be disregarded for now.

## Setup

There are two ways to get the system running: either you start all components (database, backend, frontend) locally, or you use the dockerized version.

### Dockerized

#### Prerequisites

Your system must have [Docker](https://www.docker.com/get-started/) enabled.

#### Installing and Running

The following steps need to be performed in order to start the system:

1. Make sure that docker is currently running. For example, on Windows, DockerDesktop must be running.
2. Navigate a console (with admin rights) to the root folder of the repository and run `docker-compose up`.

This will setup a network with three separate containers, one for each component. You can then access the system via a browser at `localhost:3000`.

### Local

#### Prerequisites

Make sure to have the following software available on your system to run this application:

* Database: [MongoDB](https://www.mongodb.com/try/download/community)
* Server: [Python](https://www.python.org/downloads/) and [pip](https://pypi.org/project/pip/)
* Frontend: [nodejs](https://nodejs.org/en/download/)

#### Installing libraries

The following steps need to be performed before running the system for the first time:

1. In the root folder of this repository, create the folder `data\db`
2. In the folder [backend](./backend/) run the following command to install all relevant python packages: `pip install -r requirements.pip`
3. in the folder [frontend](./frontend/) run the following command to install all relevant node packages `npm install --dev`

#### Starting the application

The following steps need to be performed in order to start the edutask application:

1. Navigate a shell to the root folder of this repository and run the following command (you might need admin rights for this) to start the database: `mongod --port 27017 --dbpath data\db`
2. Navigate a different shell to the folder [backend](./backend/) and run the following command to start the server: `python ./main.py`
3. Navigate a third shell into the folder [frontend](./frontend/) and run the following commend to start the user interface: `npm start`

Now a browser window should open and display the frontend of the system on `localhost:3000`.

## Interaction

You can interact with the system in different ways. Here are a few to explore the different components of the system:

1. To interact with the database directly, you can use the [MongoDB Compass](https://www.mongodb.com/try/download/compass): while the database is running, connect to it via the compass interface using the connection string `mongodb://localhost:27017`. You can now see and manipulate all data in the database manually. Alternatively, you can use the [MongoDB Shell](https://www.mongodb.com/try/download/shell).
2. To interact with the server directly, you can use a service like [Postman](https://www.postman.com/downloads/): while the database and server are running, create a new *collection* in the Postman GUI and "add requests". Select a HTTP method and an URL, for example GET http://localhost:5000/users/all. You can find all available API endpoints in the [backend/src/blueprints](./backend/src/blueprints/) folder or by inspecting the console of your server, where all API endpoints are printed when starting the server. Try for example PST http://localhost:5000/populate to populate the database with an initial user and some tasks. Alternatively to Postman, you can use any browser to interact with the API of the server directly on `localhost:5000`. Interaction between the browser and the server is, however, limited to GET requests.
3. To interact with the frontend directly, simply use the browser which is opened when running `npm start`. You can access the frontend at http://localhost:3000

## Troubleshooting

The following issues are known and may require attention:

1. The system was built using nodejs 17, which has a [known compatability issue due to its upgrade to OpenSSL3](https://github.com/webpack/webpack/issues/14532#issuecomment-947807590). Check the version of node that you are using and adapt accordingly:
    * v17.0.0 and beyond: in frontend/package.json, the "start" script needs to contain the flag --openssl-legacy-provider 
    * before v17.0.0: remove the --openssl-legacy-provider flag from the "start" script
2. When starting the MongoDB with `mongod`, make sure to use the path separators appropriate on your operating system.
3. When using Fedora as your Linux distribution and encountering issues installing mongoDB (student solution): 
    1. From https://www.mongodb.com/try/download/community, select RedHat / CentOS 8.0 as platform and download the .rpm file
    2. Go to downloads and execute `sudo dnf install <rpm file>`
    3. Execute `sudo systemctl enable mongod`, then `sudo systemctl start mongod`
    4. Delete the file in /tmp which causes errors when tryng to start a new mongodb instance in a dir with `sudo rm /tmp/mongodb-27017.sock` in the terminal
    5. Then you can finally start up the database in the data/db directory
