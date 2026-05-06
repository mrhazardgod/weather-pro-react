import type { Language, Translations } from "./types";

export const RU: Translations = {
  appName: "ПогодаPRO",
  navHome: "Главная",
  navFavorites: "Избранное",
  navHistory: "История",
  searchTitle: "Найдите погоду в вашем городе",
  searchSubtitle: "Введите название города и узнайте актуальный прогноз погоды",
  searchPlaceholder: "Введите название города",
  searchButton: "Поиск",
  feelsLike: "Ощущается как",
  humidity: "Влажность",
  wind: "Ветер",
  pressure: "Давление",
  windUnit: "м/с",
  tempUnit: "°C",
  addFavorite: "Добавить в избранное",
  removeFavorite: "Удалить из избранного",
  forecastTitle: "Прогноз на 5 дней",
  favoritesTitle: "Избранное",
  favoritesEmpty: "Нет избранных городов",
  clearAll: "Очистить всё",
  historyTitle: "История поиска",
  historyEmpty: "История пуста",
  searchAgain: "Повторить поиск",
  remove: "Удалить",
  loading: "Загрузка...",
  errorNotFound: "Город не найден",
  errorNetwork: "Ошибка сети. Попробуйте позже.",
  footerCopyright: "© 2024 ПогодаPRO",
  footerDatasource: "Данные: OpenWeatherMap",
  mapTitle: "Карта",
};

export const EN: Translations = {
  appName: "WeatherPRO",
  navHome: "Home",
  navFavorites: "Favorites",
  navHistory: "History",
  searchTitle: "Find weather in your city",
  searchSubtitle: "Enter a city name to get the latest weather forecast",
  searchPlaceholder: "Enter city name",
  searchButton: "Search",
  feelsLike: "Feels like",
  humidity: "Humidity",
  wind: "Wind",
  pressure: "Pressure",
  windUnit: "mph",
  tempUnit: "°F",
  addFavorite: "Add to favorites",
  removeFavorite: "Remove from favorites",
  forecastTitle: "5-Day Forecast",
  favoritesTitle: "Favorites",
  favoritesEmpty: "No favorite cities",
  clearAll: "Clear all",
  historyTitle: "Search History",
  historyEmpty: "History is empty",
  searchAgain: "Search again",
  remove: "Remove",
  loading: "Loading...",
  errorNotFound: "City not found",
  errorNetwork: "Network error. Please try again.",
  footerCopyright: "© 2024 WeatherPRO",
  footerDatasource: "Data: OpenWeatherMap",
  mapTitle: "Map",
};

export function getT(lang: Language): Translations {
  return lang === "ru" ? RU : EN;
}

export function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32);
}

export function msToMph(ms: number): number {
  return Math.round(ms * 2.237);
}

export function formatTemp(c: number, lang: Language): string {
  if (lang === "en") return `${celsiusToFahrenheit(c)}°F`;
  return `${Math.round(c)}°C`;
}

export function formatWind(ms: number, lang: Language): string {
  if (lang === "en") return `${msToMph(ms)} mph`;
  return `${Math.round(ms)} м/с`;
}

export function formatDate(dt: number, lang: Language): string {
  const locale = lang === "ru" ? "ru-RU" : "en-US";
  return new Date(dt * 1000).toLocaleDateString(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dt: number, lang: Language): string {
  const locale = lang === "ru" ? "ru-RU" : "en-US";
  return new Date(dt * 1000).toLocaleString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}