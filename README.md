# Atmos — Weather Forecast App

A responsive weather dashboard built with React, Vite, normal CSS, and the OpenWeather API.

## Features

- Search for a city
- Current temperature, feels-like temperature, humidity, wind, visibility, and pressure
- Five-day forecast (summarized from OpenWeather's 5-day / 3-hour forecast)
- Celsius/Fahrenheit toggle
- Optional browser location lookup
- Loading and error states
- Responsive layout for desktop, tablet, and mobile

## Requirements

- Node.js LTS (includes npm)
- An OpenWeather API key: https://openweathermap.org/appid

## Setup

1. Extract the project folder.
2. Open the folder in VS Code.
3. Open a terminal in the project folder.
4. Install packages:

   ```bash
   npm install
   ```

5. Copy `.env.example` and rename the copy to `.env`.
6. In `.env`, replace `your_api_key_here` with your OpenWeather API key:

   ```env
   VITE_OPENWEATHER_API_KEY=your_real_api_key
   ```

7. Start the development server:

   ```bash
   npm run dev
   ```

8. Open the local URL printed by Vite, usually `http://localhost:5173`.

If you add or change `.env` while the server is running, stop the server and run `npm run dev` again.

## Build for production

```bash
npm run build
npm run preview
```

The production files are generated in the `dist` folder.

## Folder structure

```text
weather-forecast-react/
├── index.html
├── package.json
├── .env.example
├── README.md
└── src/
    ├── App.jsx
    ├── App.css
    ├── index.css
    └── main.jsx
```

## Notes

- This frontend calls OpenWeather directly from the browser. The API key is therefore visible to users in browser requests. For a public production app, use a backend proxy to protect credentials and configure API-key restrictions if available.
- OpenWeather API keys may take some time to activate after creation.
- The forecast API provides data in three-hour intervals; this app chooses a representative entry for each day, so it is not a true daily high/low forecast.
- The location button requires browser permission and typically works on localhost or HTTPS.
