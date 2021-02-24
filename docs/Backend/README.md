# Backend

## Running Locally

### Requirements
Make sure to have [NodeJs](https://nodejs.org/en/) installed

### Dependencies
Run the following command in the Backend directory to install the dependencies
```
npm install
```

### Start the backend
Run the following command in the Backend directory to start the backend
```
npm start
```

## Routes
Documentation regarding the routes can be found here:
- [Good routes documentation](Routes/good_routes.md)
- [Manufacturing routes documentation](Routes/manufacturing_routes.md)
- [User routes documentation](Routes/user_routes.md)

## Postman
Click here to download the Postman Collection:
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/join-team?invite_code=86ed225b3ea10b882ff08d2c6d47d410)

## Testing
- [Mocha](https://mochajs.org/) is used as our testing framework
- [ChaiJs](https://www.chaijs.com/) is used as our assertion library
- [SinonJs](https://sinonjs.org/) is used as our Stubs and mock library

### Running tests
To run the tests use the following command:
```
npm test
```

### Running Coverage
- [Nyc](https://www.npmjs.com/package/nyc) is used to calculate the test coverage
- For test to pass we need a coverage of atleast 80% must be reached
To run the coverage test use the following command:
```
npm run coverage
```

## Formatting
- [Prettier](https://prettier.io/) is used to format our code
To format the code use the following command:
```
npm run format
```