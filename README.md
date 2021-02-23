# ERP Web Application - SOEN390 - Team 9

## Project description:
This project is an ERP (enterprise resource planning) web app which is targeted towards a company that is looking to handle the production and sales of bikes.

## Tech stack:
The frontend has been created in React (TypeScript) with Axios, the backend in Node.js (TypeScript) using the Express.js framework, and the database was implemented using MySQL.

## Team members:
- Sébastien	Blain-Nadeau
- Razvan Ivan
- Jason	Kim
- David	Rossi
- Cosmin	Sustac
- Patrick	Youssef
- Huy Phong	Le
- Tommy	Josépovic

## Cloning the project:
When cloning the project for the first time, make sure to add the `--recursive` argument to your `git clone` command since it will allow the `env` folder to also be cloned. In other words, the resulting command should be: `git clone https://github.com/Talos10/SOEN390-team-9.git --recursive`

## How to run the project in docker:

The project consists of three docker containers: frontend, backend, database.

After installing docker on your machine, follow these steps in order to run the project:
1. **Start docker (on windows, you may simply launch docker desktop).**

2. **In order to test if docker is currently running on your machine, run the following command:** `docker ps`\
This command will show you all the docker containers that are currently running on your machine. Since no docker containers are currently running, you will simply see the following output in the command line:\
**CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES**

3. **In order to run all three docker containers, run the following command:** `docker-compose up`\
If you wish to run a specific container only, you may run the following command: `docker-compose up CONTAINER`\
where CONTAINER is the name of the specific container which can either be frontend, backend, or database.
Note that when you choose to run the backend container only, the database container will also be started since it is required in order for the backend to function properly.

4. **In order to open the website, enter the following link in your browser:** `http://localhost:3000/`

5. **In order to shut down all running docker containers, run the following command:** `docker-compose stop`\
If you wish to stop a specific container, you may run the following command: `docker-compose stop CONTAINER`\
where CONTAINER is the name of the specific container which can either be frontend, backend, or database.

#### Important additional information:

When running a docker container for the first time, the required dependencies are automatically downloaded and cached such that subsequent runs of the containers will be faster. In the case that there are changes in the dependencies (i.e. the case where you would run the command npm install), the docker containers will need to be rebuilt. In order to do that, simply run the following command: `docker-compose up --build`\
This command will rebuild all docker containers (and thereby update their dependencies). If you wish to rebuild a specific container only, you may run the following command: `docker-compose up --build CONTAINER`\
where CONTAINER is the name of the specific container which can either be frontend, backend, or database.

Finally, if nothing is working and you want to start over, run the following command: `docker system prune -a`\
You may then run `docker-compose up` in order to run all the containers (their dependencies will also be rebuilt) and it will be as if you ran that command for the first time with these containers.

## Login information:
The default login information is `admin@email.com` for the email and `admin` for the password.
