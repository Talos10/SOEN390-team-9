# SOEN390 - Team 9

## How to run the project in docker:

The project consists of three docker containers: frontend, backend, database.

After installing docker on your machine, follow these steps in order to run the project:
1. **Start docker (on windows, you may simply launch docker desktop).**

2. **In order to test if docker is currently running on your machine, run the following command:** `docker ps`\
This command will show you all the docker containers that are currently running on your machine. Since no docker containers are currently running, you will simply see the following output in the command line:\
**CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES**

3. **In order to run all three docker containers, run the following command:** `docker-compose up`\
If you wish to run a specific container only, you may run the following command: `docker-compose up nameOfTheContainer`\
The name of the container can either be frontend, backend, or database.
Note that when you choose to run the backend container only, the database container will also be started since it is required in order for the backend to function properly.

4. **In order to shut down all running docker containers, run the following command:** `docker-compose stop`\
If you wish to stop a specific container, you may run the following command: `docker-compose stop nameOfTheContainer`\
The name of the container can either be frontend, backend, or database.

### Important additional information:

When running a docker container for the first time, the required dependencies are automatically downloaded and cached such that subsequent runs of the containers will be faster. In the case that there are changes in the dependencies (i.e. the case where you would run the command npm install), the docker containers will need to be rebuilt. In order to do that, simply run the following command: `docker-compose up --build`\
This command will rebuild all docker containers (and thereby update their dependencies). If you wish to rebuild a specific container only, you may run the following command: `docker-compose up --build nameOfTheContainer`\
The name of the container can either be frontend, backend, or database.

Finally, if nothing is working and you want to start over, run the following command: `docker system prune -a`\
You may then run `docker-compose up` in order to run all the containers (their dependencies will also be rebuilt) and it will be as if you ran that command for the first time with these containers.
