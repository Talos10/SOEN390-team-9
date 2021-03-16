# User's routes

### Get all users 
- Method: **GET**
- Endpoint: `/user`
- Authorization: Bearer token given from login

### Get a single user by ID
- Method: **GET**
- Endpoint: `/user/:id`
- Authorization: Bearer token given from login

### Login
- Method: **POST**
- Endpoint: `/user/login`
- Authorisation: Basic email - password

### Create a user
- Method: **POST**
- Endpoint: `/user`
- Authorization: Bearer token given from login
- Payload:
    ```JSON
    {
        "name": "New User",
        "email": "newEmail@email.com",
        "role": "Admin",
        "password": "SuperSecretPassword",
    }
    ```

### Send a recovery email
- Method: **POST**
- Endpoint: `/user/forgot`
- Payload:
    ```JSON
    {
        "email": "newEmail@email.com",
    }
    ```

### Modify the password
- Method: **POST**
- Endpoint: `/user/reset`
- Authorisation: Basic emailToken - newPassword

### Update a user
- Method: **PUT**
- Endpoint: `/user/:id`
- Authorization: Bearer token given from login
- Payload:
    ```JSON
    {
        "id" : 1,
        "name": "New User",
        "email": "newEmail@email.com",
        "role": "Admin",
        "password": "SuperSecretPassword",
    }
    ```

### Delete a user
- Method: **DELETE**
- Endpoint: `/user/:id`
- Authorization: Bearer token given from login

### Delete **ALL** users
- Method: **DELETE**
- Endpoint: `/user`
- Authorization: Bearer token given from login
