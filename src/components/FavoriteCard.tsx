import type { FavoriteCity, Language, Translations } from "../types";
import { formatTemp } from "../utils";

interface Props {
  city: FavoriteCity;
  t: Translations;
  lang: Language;
  onView: (city: FavoriteCity) => void;
  onRemove: (name: string, country: string) => void;
  index: number;
}

export default function FavoriteCard({ city, t, lang, onView, onRemove, index }: Props) {
  return (
    <div className="fav-city-card" data-edit-id={`fav-card-${index}`}>
      <div className="fav-card-left" data-edit-id={`fav-card-info-${index}`}>
        <div className="fav-card-icon-wrap" data-edit-id={`fav-card-icon-wrap-${index}`}>
          {city.icon ? (
            <img
              className="fav-card-icon"
              src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`}
              alt=""
              data-edit-id={`fav-card-icon-${index}`}
            />
          ) : (
            <span className="fav-card-icon-placeholder" aria-hidden="true">--</span>
          )}
        </div>
        <div className="fav-card-text" data-edit-id={`fav-card-text-${index}`}>
          <strong className="fav-card-name" data-edit-id={`fav-card-name-${index}`}>
            {city.name}, {city.country}
          </strong>
          {city.currentTemp !== undefined && (
            <span className="fav-temp" data-edit-id={`fav-card-temp-${index}`}>
              {formatTemp(city.currentTemp, lang)}
            </span>
          )}
        </div>
      </div>
      <div className="fav-card-actions" data-edit-id={`fav-card-actions-${index}`}>
        <button className="btn-view" onClick={() => onView(city)} data-edit-id={`fav-card-view-${index}`}>
          {t.navHome}
        </button>
        <button
          className="btn-remove-small"
          onClick={() => onRemove(city.name, city.country)}
          data-edit-id={`fav-card-remove-${index}`}
        >
          {t.remove}
        </button>
      </div>
    </div>
  );
}
