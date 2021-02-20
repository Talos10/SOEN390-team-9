# Good's routes

### Get all goods (from any types)
- Method: **GET**
- Endpoint: `/good/`

### Get a single good by id
- Method: **GET**
- Enpoint: `/good/id/:id`

### Get all goods of a specific type (raw, semi-finished, finished)
- Method: **GET**
- Endpoint: `/good/type/:type`

### Get all archived goods of a specific type (raw, semi-finished, finished)
- Method: **GET**
- Endpoint: `/good/archive/type/:type`

### Archive multiple goods
- Method: **POST**
- Endpoint: `/good/archive/`
- Payload:
    ```JSON
    [
        {
            "id": 1234,
            "archive": true
        },
        {
            "id": 1235,
            "archive": false
        }
    ]
    ```

### Add a single new good
- Method: **POST**
- Endpoint: `/good/single`
- Payload for raw goods:
    ```JSON
    {
        "name": "aluminum",
        "type": "raw",
        "processTime": 10,
        "cost": 55.69,
        "vendor": "bunquisha",
        "properties": [
            {
                "value": "red",
                "name": "color"
            }
        ],
        "components": [
            {
                "id": 1,
                "quantity": 5
            }
        ]
    }
    ```
- Payload for semi-finished goods:
    ```JSON
    {
        "name": "frame",
        "type": "semi-finished",
        "processTime": 10,
        "cost": 55.69,
        "properties": [
            {
                "value": "red",
                "name": "color"
            }
        ],
        "components": [
            {
                "id": 1,
                "quantity": 5
            }
        ]
    }
    ```
- Payload for finished goods:
    ```JSON
    {
        "name": "bike",
        "type": "finished",
        "processTime": 10,
        "cost": 55.69,
        "price": 420,
        "properties": [
            {
                "value": "red",
                "name": "color"
            }
        ],
        "components": [
            {
                "id": 1,
                "quantity": 5
            }
        ]
    }
    ```

### Add new goods in bulk
- Method: **POST**
- Endpoint: `/good/`
- Payload:
    ```JSON
    [
        {
            "name": "bike",
            "type": "finished",
            "processTime": 10,
            "cost": 55.69,
            "price": 420,
            "properties": [
                {
                    "value": "red",
                    "name": "color"
                }
            ],
            "components": [
                {
                    "id": 1,
                    "quantity": 5
                }
            ]
        }
    ]
    ```