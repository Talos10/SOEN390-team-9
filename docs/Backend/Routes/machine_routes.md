# Machine's routes

### Get all machines 
- Method: **GET**
- Endpoint: `/machine`
- Authorization: Bearer token given from login

### Get a single machine by ID
- Method: **GET**
- Endpoint: `/machine/:machineId`
- Authorization: Bearer token given from login

### Create a machine
- Method: **POST**
- Endpoint: `/machine`
- Authorization: Bearer token given from login

### Update a machine
- Method: **PUT**
- Endpoint: `/machine/:machineId`
- Authorization: Bearer token given from login
- Payload:
    ```JSON
    {
        "status": "busy",
        "numberOrderCompleted": 5
    }
    ```

### Delete a machine
- Method: **DELETE**
- Endpoint: `/machine/:machineId`
- Authorization: Bearer token given from login

### Delete **ALL** machines
- Method: **DELETE**
- Endpoint: `/machine`
- Authorization: Bearer token given from login
