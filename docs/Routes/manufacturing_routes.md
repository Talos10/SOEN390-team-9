# Manufacturing's routes

### Get all orders
- Method: **GET**
- Endpoint: `/manufacturing/order`
- Response:
    ```JSON
    {
        "status": "true or false",
        "message": "an array of orders"
    }
    ```

### Get all orders with status
- Method: **GET**
- Enpoint: `/manufacturing/order/status/:status`
- Response:
    ```JSON
    {
        "status": "true or false",
        "message": "an array of orders"
    }
    ```

### Get all orders with id
- Method: **GET**
- Enpoint: `/manufacturing/order/id/:id`
- Response:
    ```JSON
    {
        "status": "true or false",
        "message": "a single order"
    }
    ```

### Create new manufacturing order
- Method: **post**
- Enpoint: `/manufacturing/order/`
- Payload:
    ```JSON
    [
        {
            "compositeId": 16,
            "quantity": 10000
        }
    ]
    ```
- Response:
    ```JSON
    {
        "status": true,
        "message": "New order successfully created",
        "order": [
            {
                "compositeId": 16,
                "quantity": 10000
            }
        ]
    }
    ```

### Update order status
- Method: **put**
- Enpoint: `/manufacturing/order/:newStatus`
- newStatus: confirmed, cancelled, processing, completed
- Payload:
    ```JSON
    [
        1,
        2,
        "the id of the orders..."
    ]
    ```
- Response:
    ```JSON
    [
        {
            "status": false,
            "message": "Order 1 is already completed"
        },
        {
            "status": false,
            "message": "Order 2 is already completed"
        },
    ]
    ```

### Mark orders as complete automatically
- Method: **put**
- Enpoint: `/manufacturing/order/complete/auto`
- Response:
    ```JSON
    [
        {
            "status": false,
            "message": "Order 1 is already completed"
        },
        {
            "status": false,
            "message": "Order 2 is already completed"
        },
    ]
    ```