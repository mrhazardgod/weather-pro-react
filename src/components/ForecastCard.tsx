import type { ForecastDay, Language, Translations } from "../types";
import { formatTemp, formatDate } from "../utils";

interface Props { day: ForecastDay; t: Translations; lang: Language; index: number }

export default function ForecastCard({ day, t, lang, index }: Props) {
  return (
    <div className="forecast-card" data-edit-id={`forecast-card-${index}`}>
      <p className="forecast-date" data-edit-id={`forecast-date-${index}`}>{formatDate(day.date, lang)}</p>
      <img
        className="forecast-icon"
        src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
        alt={day.description}
        data-edit-id={`forecast-icon-${index}`}
      />
      <p className="forecast-desc" data-edit-id={`forecast-desc-${index}`}>{day.description}</p>
      <div className="forecast-temps" data-edit-id={`forecast-temps-${index}`}>
        <span className="forecast-max" data-edit-id={`forecast-max-${index}`}>{formatTemp(day.tempMax, lang)}</span>
        <span className="forecast-temp-divider">/</span>
        <span className="forecast-min" data-edit-id={`forecast-min-${index}`}>{formatTemp(day.tempMin, lang)}</span>
      </div>
    </div>
  );
}