<br />
<p align="center">
  <a href="https://github.com/Talos10/SOEN390-team-9">
    <img src="docs/Images/logo.png" alt="Logo" width="200">
  </a>

  <h3 align="center">Supreme Erp</h3>

  <p align="center">
    Fun project designed by Team 9 for Soen390
    <br />
  </p>
</p>
<br />

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#running-using-docker">Running using docker<a></li>
      </ul>
    </li>
    <li><a href="#more-info">More Information</a></li>
    <li><a href="#contributors">Contributors</a></li>
  </ol>
</details>

## About The Project

Supreme ERP is an ERP (enterprise resource planning) web app which is targeted towards a company that is looking to handle the production and sales of bikes.

### Built With
* Frontend Framework [React](https://reactjs.org/)
* Backend Framework [Express](https://expressjs.com/)
* RDMS [MySql](https://expressjs.com/)
* Language [TypeScript](https://www.typescriptlang.org/)
* Continuous integration service [Travis CI](https://nodejs.org/en/)

## Getting Started

### Prerequisites

* Install [Docker](https://www.docker.com/)

### Installation

1. Request access to the [environment repository](https://github.com/SOEN-390-TEAM09/env/tree/c1a1a039ba015fd87d5b70c1c31ca5a1069f37bc)
2. Clone the repo with the submodules included
    ```
    git clone https://github.com/Talos10/SOEN390-team-9.git --recursive
    ```

### Running using docker

* Start Supreme ERP
    ```
    docker-compose up
    ```
* OR start a single service
    ```
    docker-compose up (backend or frontend or database)
    ```
* Default credentials: `admin@email.com` for the email and `admin` for the password.
* Frontend is hosted on http://localhost:3000
* Backend is hosted on http://localhost:5000
* Database is hosted on http://localhost:3306

## More Info

* [Docker](docs/docker_tutorial.md)
* [Backend](docs/Backend/README.md)
* [Frontend](docs/Frontend/README.md)

## Contributors
| Name                   | Github                                                |
|------------------------|-------------------------------------------------------|
| Razvan Ivan            | [Talos10](https://github.com/Talos10)                 |
| Jason Kim              | [Gahyki](https://github.com/Gahyki)                   |
| David Rossi            | [d-rossi](https://github.com/d-rossi)                 |
| Cosmin Sustac          | [N0ot-No0t](https://github.com/N0ot-No0t)             |
| Tommy Josépovic        | [tommy-josepovic](https://github.com/tommy-josepovic) |
| Patrick Youssef        | [PatrickYoussef](https://github.com/PatrickYoussef)   |
| Phong Le               | [phong1233](https://github.com/phong1233)             |
| Sébastien Blain-Nadeau | [sebastien-blain](https://github.com/sebastien-blain) |
