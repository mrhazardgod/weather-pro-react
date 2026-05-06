import type { CurrentWeather, ForecastDay, GeoCity } from "./types";

const BASE = "https://api.openweathermap.org";
export const API_KEY_STORAGE_KEY = "weather-openweather-api-key";

export function getStoredApiKey(): string {
  const runtimeKey = localStorage.getItem(API_KEY_STORAGE_KEY)?.trim();
  const envKey = (import.meta.env.VITE_OWM_API_KEY as string | undefined)?.trim();
  return runtimeKey || envKey || "";
}

export function saveStoredApiKey(key: string): void {
  const value = key.trim();
  if (value) {
    localStorage.setItem(API_KEY_STORAGE_KEY, value);
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
}

function getApiKey(): string {
  const key = getStoredApiKey();
  if (!key) throw new Error("api_key_missing");
  return key;
}

async function readOpenWeatherResponse<T>(res: Response, fallbackError: string): Promise<T> {
  if (res.ok) return res.json();

  if (res.status === 401 || res.status === 403) {
    throw new Error("api_key_invalid");
  }

  throw new Error(fallbackError);
}

export async function fetchGeocode(query: string): Promise<GeoCity[]> {
  const KEY = getApiKey();
  const url = `${BASE}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${KEY}`;
  const res = await fetch(url);
  return readOpenWeatherResponse<GeoCity[]>(res, "geocode_error");
}

export async function fetchCurrentWeather(
  lat: number,
  lon: number,
  lang: string
): Promise<CurrentWeather> {
  const KEY = getApiKey();
  const url = `${BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=${lang}&appid=${KEY}`;
  const res = await fetch(url);
  const d = await readOpenWeatherResponse<any>(res, "weather_error");
  return {
    cityName: d.name,
    country: d.sys.country,
    lat: d.coord.lat,
    lon: d.coord.lon,
    temp: d.main.temp,
    feelsLike: d.main.feels_like,
    humidity: d.main.humidity,
    windSpeed: d.wind.speed,
    pressure: d.main.pressure,
    description: d.weather[0].description,
    icon: d.weather[0].icon,
    dt: d.dt,
  };
}

export async function fetchForecast(
  lat: number,
  lon: number,
  lang: string
): Promise<ForecastDay[]> {
  const KEY = getApiKey();
  const url = `${BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=${lang}&appid=${KEY}`;
  const res = await fetch(url);
  const d = await readOpenWeatherResponse<any>(res, "forecast_error");
  const daily: Record<string, { temps: number[]; icon: string; desc: string }> = {};
  for (const item of d.list) {
    const day = new Date(item.dt * 1000).toDateString();
    if (!daily[day]) daily[day] = { temps: [], icon: item.weather[0].icon, desc: item.weather[0].description };
    daily[day].temps.push(item.main.temp);
  }
  const today = new Date().toDateString();
  return Object.entries(daily)
    .filter(([k]) => k !== today)
    .slice(0, 5)
    .map(([key, v]) => ({
      date: new Date(key).getTime() / 1000,
      tempMax: Math.max(...v.temps),
      tempMin: Math.min(...v.temps),
      description: v.desc,
      icon: v.icon,
    }));
}
