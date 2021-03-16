# Customer's routes

### Get all customers 
- Method: **GET**
- Endpoint: `/customer`
- Authorization: Bearer token given from login

### Get a single customer by ID
- Method: **GET**
- Enpoint: `/customer/:customerID`
- Authorization: Bearer token given from login

### Create a customer
- Method: **POST**
- Endpoint: `/customer`
- Authorization: Bearer token given from login
- Payload:
    ```JSON
    {
        "name": "New Customer",
        "email": "newEmail@email.com"
    }
    ```

### Update a customer
- Method: **PUT**
- Endpoint: `/customer/:customerID`
- Authorization: Bearer token given from login
- Payload:
    ```JSON
    {
        "id" : 1,
        "name": "New Customer",
        "email": "newEmail@email.com"
    }
    ```

### Archive or un-archive a customer
- Method: **POST**
- Endpoint: `/customer/archive`
- Authorization: Bearer token given from login

### Get **ALL** archived or non-archived customers
- Method: **GET**
- Endpoint: `/customer/archive/:archived`
- Authorization: Bearer token given from login
