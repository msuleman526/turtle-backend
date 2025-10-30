# Turtle Path Tracking - Backend API

Backend API for tracking turtle paths with MongoDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (already created):
```
PORT=3001
MONGODB_URI=your_mongodb_connection_string
```

3. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Paths

- `GET /api/paths` - Get all paths
- `GET /api/paths/:id` - Get single path by ID
- `POST /api/paths` - Create new path
  ```json
  {
    "name": "Path 1",
    "locations": [
      { "lat": 26.278, "lng": -81.924, "order": 0 }
    ]
  }
  ```
- `PUT /api/paths/:id` - Update path name
  ```json
  {
    "name": "New Path Name"
  }
  ```
- `DELETE /api/paths/:id` - Delete path

### Locations

- `POST /api/paths/:id/locations` - Add location to path
  ```json
  {
    "lat": 26.278,
    "lng": -81.924
  }
  ```
- `PUT /api/paths/:id/locations/:locationId` - Update location coordinates
  ```json
  {
    "lat": 26.280,
    "lng": -81.920
  }
  ```
- `DELETE /api/paths/:id/locations/:locationId` - Delete location

## Server runs on: http://localhost:3001
