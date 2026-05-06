export type Language = "ru" | "en";
export type Theme = "day" | "night";

export interface AppSettings {
  language: Language;
  theme: Theme;
}

export interface GeoCity {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  local_names?: Record<string, string>;
}

export interface CurrentWeather {
  cityName: string;
  country: string;
  lat: number;
  lon: number;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  description: string;
  icon: string;
  dt: number;
}

export interface ForecastDay {
  date: number;
  tempMax: number;
  tempMin: number;
  description: string;
  icon: string;
}

export interface FavoriteCity {
  name: string;
  country: string;
  lat: number;
  lon: number;
  currentTemp?: number;
  icon?: string;
}

export interface HistoryEntry {
  id: string;
  cityName: string;
  country: string;
  lat: number;
  lon: number;
  searchedAt: number;
}

export interface Translations {
  appName: string;
  navHome: string;
  navFavorites: string;
  navHistory: string;
  searchTitle: string;
  searchSubtitle: string;
  searchPlaceholder: string;
  searchButton: string;
  feelsLike: string;
  humidity: string;
  wind: string;
  pressure: string;
  windUnit: string;
  tempUnit: string;
  addFavorite: string;
  removeFavorite: string;
  forecastTitle: string;
  favoritesTitle: string;
  favoritesEmpty: string;
  clearAll: string;
  historyTitle: string;
  historyEmpty: string;
  searchAgain: string;
  remove: string;
  loading: string;
  errorNotFound: string;
  errorNetwork: string;
  footerCopyright: string;
  footerDatasource: string;
  mapTitle: string;
}