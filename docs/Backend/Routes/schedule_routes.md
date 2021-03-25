# Schedule's routes

### Get all schedule 
- Method: **GET**
- Endpoint: `/schedule`
- Authorization: Bearer token given from login
- Response:
    ```JSON
    {
        "status": true,
        "message": [
            {
                "machineId": 1,
                "orderId": 1,
                "finishTime": 2019-02-03
            },
            {
                "machineId": 2,
                "orderId": 2,
                "finishTime": 2019-02-03
            }
        ]
    }
    ```
