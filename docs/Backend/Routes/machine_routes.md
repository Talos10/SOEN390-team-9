# Machine's routes

### Get all machines 
- Method: **GET**
- Endpoint: `/machine`
- Authorization: Bearer token given from login

### Get machines by status
- Method: **GET**
- Endpoint: `/machine/filter/:status`
- Authorization: Bearer token given from login

### Get a single machine by ID
- Method: **GET**
- Endpoint: `/machine/:machineId`
- Authorization: Bearer token given from login

### Create a machine
- Method: **POST**
- Endpoint: `/machine`
- Authorization: Bearer token given from login

### Schedule a machine for a job
- Method: **POST**
- Endpoint: `/machine/schedule`
- Authorization: Bearer token given from login
- Payload:
    ```JSON
    {
        "machineId": 123,
        "orderId": 123
    }
    ```

### Free up machine (complete a job)
- Method: **POST**
- Endpoint: `/machine/schedule/complete`
- Authorization: Bearer token given from login
- Payload:
    ```JSON
    {
        "machineId": 123,
        "orderId": 123
    }
    ```
