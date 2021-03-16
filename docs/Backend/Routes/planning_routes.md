# Planning's routes

### Get all events
- Method: **GET**
- Endpoint: `/planning/events`
- Authorization: Bearer token given from login

### Create a new event
- Method: **POST**
- Enpoint: `/planning/events`
- Authorization: Bearer token given from login
- Payload for an event:
    ```JSON
    {
        "date": "2021-04-15",
        "time": "9:00:00",
        "title": "Company wide meeting"
    }
    ```

### Delete an existing event
- Method: **DELETE**
- Enpoint: `/planning/events/:eventId`
- Authorization: Bearer token given from login
- Payload for deleting an event:
    ```JSON
    {
        "id": 5
    }
    ```

### Get all goals
- Method: **GET**
- Endpoint: `/planning/goals`
- Authorization: Bearer token given from login

### Create a new goal
- Method: **POST**
- Enpoint: `/planning/goals`
- Authorization: Bearer token given from login
- Payload for a goal:
    ```JSON
    {
        "completed": false,
        "targetDate": "2021-08-15",
        "title": "Sell 2000 Bikes"
    }
    ```

### Delete an existing goal
- Method: **DELETE**
- Enpoint: `/planning/goals/:goalId`
- Authorization: Bearer token given from login
- Payload for deleting a goal:
    ```JSON
    {
        "id": 3
    }
    ```

### Mark a goal as completed
- Method: **PUT**
- Enpoint: `/planning/goals/:goalId`
- Authorization: Bearer token given from login
- Payload for updating a goal:
    ```JSON
    {
        "id": 3,
        "completed": true,
        "targetDate": "2021-08-15",
        "title": "Sell 2000 Bikes"
    }
    ```