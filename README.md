# Weight Tracker App

A full-stack web application for tracking weight measurements over time. Built with React for the frontend and Flask for the backend.

## Features

- Add and manage clients
- Record weight measurements for each client
- Visualize weight trends with charts
- Responsive design that works on desktop and mobile

## Tech Stack

### Frontend
- React
- React Router for navigation
- Chart.js for data visualization
- Axios for API requests
- Tailwind CSS for styling

### Backend
- Flask (Python)
- SQLite database
- Flask-SQLAlchemy for ORM
- Flask-CORS for cross-origin requests

## Getting Started

### Prerequisites
- Node.js and npm
- Python 3.x

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/weight-tracker-app.git
cd weight-tracker-app
```

2. Set up the backend
```
cd backend
pip install -r requirements.txt
python app.py
```

3. Set up the frontend
```
cd frontend
npm install
npm start
```

4. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api

## Mobile Access

To access the app on your mobile device:

1. Make sure your phone is connected to the same WiFi network as your computer
2. Find your computer's IP address on the local network
3. Update the API_URL in `frontend/src/services/api.js` to use your IP address
4. Access the app on your phone at http://YOUR_IP_ADDRESS:3000

## API Endpoints

- `GET /api/clients` - Get all clients
- `POST /api/clients` - Add a new client
- `GET /api/clients/:id` - Get a specific client
- `GET /api/weight/client/:id` - Get weight entries for a client
- `POST /api/weight` - Add a weight entry
- `PUT /api/weight/:id` - Update a weight entry
- `DELETE /api/weight/:id` - Delete a weight entry

## License

This project is licensed under the MIT License - see the LICENSE file for details.
