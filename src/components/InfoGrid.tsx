import type { CurrentWeather, Language, Translations } from "../types";
import { formatTemp, formatWind } from "../utils";

interface Props { weather: CurrentWeather; t: Translations; lang: Language }

export default function InfoGrid({ weather, t, lang }: Props) {
  return (
    <div className="info-grid" data-edit-id="info-grid">
      <div className="info-item" data-edit-id="info-feels-like">
        <span className="info-label" data-edit-id="info-feels-like-label">{t.feelsLike}</span>
        <span id="weather-feels-like" className="info-value" data-edit-id="weather-feels-like">
          {formatTemp(weather.feelsLike, lang)}
        </span>
      </div>
      <div className="info-item" data-edit-id="info-humidity">
        <span className="info-label" data-edit-id="info-humidity-label">{t.humidity}</span>
        <span id="weather-humidity" className="info-value" data-edit-id="weather-humidity">
          {weather.humidity}%
        </span>
      </div>
      <div className="info-item" data-edit-id="info-wind">
        <span className="info-label" data-edit-id="info-wind-label">{t.wind}</span>
        <span id="weather-wind" className="info-value" data-edit-id="weather-wind">
          {formatWind(weather.windSpeed, lang)}
        </span>
      </div>
      <div className="info-item" data-edit-id="info-pressure">
        <span className="info-label" data-edit-id="info-pressure-label">{t.pressure}</span>
        <span id="weather-pressure" className="info-value" data-edit-id="weather-pressure">
          {weather.pressure} hPa
        </span>
      </div>
    </div>
  );
}