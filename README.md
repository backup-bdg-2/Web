# Apple Certificate Store

A web application for purchasing Apple certificates with different delivery options and customization features.

## Features

- Two certificate options:
  - Standard Certificate ($6) with a 72-hour waiting period
  - Instant Certificate ($14) with immediate delivery
- Customization options for certificates
- Secure payment processing
- Integration with Dropbox for storing payment information

## Project Structure

The project is divided into two main parts:

### Client

The client-side application is built with React and Material-UI, providing a modern and responsive user interface.

- **Technologies**: React, React Router, Material-UI, Axios
- **Features**: Responsive design, animated UI elements, form validation

### Server

The server-side application handles payment processing and Dropbox integration.

- **Technologies**: Node.js, Express, Dropbox API
- **Features**: Automatic token refresh for Dropbox, secure payment data handling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies for both client and server:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Environment Variables

Create a `.env` file in the server directory with the following variables:

```
DROPBOX_APP_KEY=your_dropbox_app_key
DROPBOX_APP_SECRET=your_dropbox_app_secret
DROPBOX_REFRESH_TOKEN=your_dropbox_refresh_token
PORT=12001
```

### Running the Application

1. Start the server:

```bash
cd server
npm start
```

2. Start the client:

```bash
cd client
npm run dev
```

## Deployment

The application is configured for deployment on Render.com.

## License

This project is proprietary and not licensed for public use.