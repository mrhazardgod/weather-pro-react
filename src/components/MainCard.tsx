import type { CurrentWeather, Language, Translations } from "../types";
import { formatTemp, formatDateTime } from "../utils";

interface Props {
  weather: CurrentWeather;
  t: Translations;
  lang: Language;
  isFav: boolean;
  onAddFav: () => void;
  onRemoveFav: () => void;
}

export default function MainCard({ weather, t, lang, isFav, onAddFav, onRemoveFav }: Props) {
  return (
    <div className="main-card" data-edit-id="main-card">
      <div className="main-card-top" data-edit-id="main-card-top">
        <div data-edit-id="main-card-city-info">
          <h2 id="weather-city-name" className="city-name" data-edit-id="weather-city-name">
            {weather.cityName}, {weather.country}
          </h2>
          <p id="weather-datetime" className="weather-datetime" data-edit-id="weather-datetime">
            {formatDateTime(weather.dt, lang)}
          </p>
        </div>
        <img
          id="weather-icon"
          className="weather-icon-large"
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          data-edit-id="weather-icon"
        />
      </div>
      <p id="weather-temp" className="weather-temp" data-edit-id="weather-temp">
        {formatTemp(weather.temp, lang)}
      </p>
      <p id="weather-description" className="weather-description" data-edit-id="weather-description">
        {weather.description}
      </p>
      <div className="fav-buttons" data-edit-id="fav-buttons">
        {isFav ? (
          <button id="btn-remove-favorite" className="btn-fav btn-fav--remove" onClick={onRemoveFav} data-edit-id="btn-remove-favorite">
            ★ {t.removeFavorite}
          </button>
        ) : (
          <button id="btn-add-favorite" className="btn-fav btn-fav--add" onClick={onAddFav} data-edit-id="btn-add-favorite">
            ☆ {t.addFavorite}
          </button>
        )}
      </div>
    </div>
  );
}