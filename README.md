# Node-Image-Uploader
Image Upload API using Express and S3

## Documentation

# Image
Represents an image file hosted on S3.

### Methods

- GET `/img/{key}`
  
  Get Image identified by `key`.

  **Parameters:**
  | Parameters | Required/Optional | Type    | Description                    |
  |------------|-------------------|---------|--------------------------------|
  | Path Params                                                               |
  | `key`      | Required          | String  | Identifies Image to be fetched.|

  **Response:**
  | Property     | Type      | Description                                        |
  |--------------|-----------|----------------------------------------------------|
  | __200__                                                                       |
  | `fileURL`    | URL       | S3 URL linking to the speified file.               |
  | `key`        | String    | UID for S3 object representing the image.          |
  | `timestamp`  | Unixtime  | Denotes time of creation.                          |
  | `size`       | Number    | Size of image in bytes.                            |
  | __404__                                                                       |
  | `status`     | Number    | Status Code (404)                                  |
  | `message`    | String    | Message (Image Not Found)                          |

- POST `/img`

  Upload Image.

  **Parameters**
  | Parameters | Required/Optional | Type    | Description                    |
  |------------|-------------------|---------|--------------------------------|
  | Body Params                                                               |
  | `image`    | Required          | File    | Image file to be uploaded.     |

  **Response:**
  | Property     | Type      | Description                                        |
  |--------------|-----------|----------------------------------------------------|
  | __200__                                                                       |
  | `fileURL`    | URL       | S3 URL linking to the speified file.               |
  | __400__                                                                       |
  | `status`     | Number    | Status Code (400)                                  |
  | `message`    | String    | Message (File Not Specified)                       |

- DELETE `/img/{key}`

  Delete Image identified by 'key'.
  
  **Parameters**
  | Parameters | Required/Optional | Type    | Description                    |
  |------------|-------------------|---------|--------------------------------|
  | Path Params                                                               |
  | `key`      | Required          | String  | Identifies Image to be deleted.|

  **Response:**
  | Property     | Type      | Description                                        |
  |--------------|-----------|----------------------------------------------------|
  | __200__                                                                       |
  | `fileURL`    | URL       | S3 URL linking to the speified file.               |
  | __404__                                                                       |
  | `status`     | Number    | Status Code (404)                                  |
  | `message`    | String    | Message (Image Not Found)                          |