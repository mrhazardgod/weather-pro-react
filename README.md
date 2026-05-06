# WeatherPRO

A multilingual weather application built with React, TypeScript and Vite.  
The app allows users to search for weather by city, view forecast data, switch language, save favorite locations, and display weather information on a map.

## Features

- Search weather by city
- City autocomplete
- Current weather information
- 5-day weather forecast
- Favorite cities
- Search history
- Save favorites and history in localStorage
- Language switcher
- Day and night mode
- Weather map with Leaflet
- Responsive user interface

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- OpenWeather API
- Leaflet
- CSS
- localStorage

## Demo

[Live Demo](https://projectc9eb2d99-4b68-4e3f-b1cf-7c00.vercel.app)

## Screenshots

Screenshots will be added soon.

## Installation

```bash
git clone https://github.com/mrhazardgod/weather-pro-react.git
cd weather-pro-react
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the root folder and add your API key:

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

## Project Structure

```txt
src/
  components/
  pages/
  services/
  hooks/
  utils/
  App.tsx
  main.tsx
```

## Project Goal

This project was created to practice React, TypeScript, API integration, weather data handling, localStorage, language switching, and working with maps in frontend applications.

## What I Learned

- Working with weather API data
- Handling API requests and errors
- Using TypeScript in React components
- Saving user data in localStorage
- Building responsive frontend interfaces
- Using Leaflet maps in React
- Managing UI settings such as language and theme

## Possible Improvements

- Add geolocation-based weather search
- Add more detailed hourly forecast
- Improve map markers and weather layers
- Add skeleton loading states
- Add better accessibility support
- Add unit tests

## Author

Alexander
