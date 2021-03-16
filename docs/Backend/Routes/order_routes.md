# Order's routes

### Get all orders
- Method: **GET**
- Endpoint: `/order`
- Response:
    ```JSON
    {
        "status": "true or false",
        "message": "an array of orders"
    }
    ```

### Get all orders by order id
- Method: **GET**
- Endpoint: `/order/id/:id`
- Response:
    ```JSON
    {
        "status": "true or false",
        "message": {
            "orderId": 2,
            "customerId": 2,
            "status": "cancelled",
            "totalPrice": 0,
            "creationDate": "2015-05-10T17:17:17.000Z",
            "completionDate": null,
            "orderedGoods": []
        }
    }
    ```

### Get all orders by customer id
- Method: **GET**
- Endpoint: `/order/customer/id/:id`
- Response:
    ```JSON
    {
        "status": "true or false",
        "message": "order"
    }
    ```

### Get all orders by status
- Method: **GET**
- Endpoint: `/order/status/:status`
- Response:
    ```JSON
    {
        "status": "true or false",
        "message": "array of orders"
    }
    ```

### Create new customer order
- Method: **post**
- Endpoint: `/order/`
- Payload:
    ```JSON
    {   
        "customerId": 1,
        "orderedGoods": [
            {
                "compositeId": 16,
                "quantity": 10000
            }
        ]
    }
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
- Endpoint: `/order/:newStatus`
- newStatus: confirmed, cancelled, completed
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