import { useEffect } from "react";
import type { CurrentWeather, FavoriteCity, GeoCity, Language, Translations } from "../types";
import SearchBar from "../components/SearchBar";
import MainCard from "../components/MainCard";
import InfoGrid from "../components/InfoGrid";
import ForecastCard from "../components/ForecastCard";
import WeatherMap from "../components/WeatherMap";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import { useWeatherSearch } from "../hooks/useWeatherSearch";
import { getT } from "../utils";

interface Props {
  lang: Language;
  isFav: (name: string, country: string) => boolean;
  addFav: (city: FavoriteCity) => void;
  removeFav: (name: string, country: string) => void;
  addHistory: (entry: { cityName: string; country: string; lat: number; lon: number }) => void;
  initialCity?: GeoCity | null;
  initialCityRequestId?: number;
}

export default function HomePage({
  lang,
  isFav,
  addFav,
  removeFav,
  addHistory,
  initialCity,
  initialCityRequestId = 0,
}: Props) {
  const t: Translations = getT(lang);
  const { status, current, forecast, errorMsg, search } = useWeatherSearch();

  useEffect(() => {
    if (!initialCity || !initialCityRequestId) return;
    search(initialCity.lat, initialCity.lon, lang);
    addHistory({
      cityName: initialCity.name,
      country: initialCity.country,
      lat: initialCity.lat,
      lon: initialCity.lon,
    });
  }, [initialCityRequestId, lang, search]);

  async function handleSelect(city: GeoCity) {
    await search(city.lat, city.lon, lang);
    addHistory({ cityName: city.name, country: city.country, lat: city.lat, lon: city.lon });
  }

  function handleAddFav(weather: CurrentWeather) {
    addFav({
      name: weather.cityName,
      country: weather.country,
      lat: weather.lat,
      lon: weather.lon,
      currentTemp: weather.temp,
      icon: weather.icon,
    });
  }

  const errorText = errorMsg === "not_found" ? t.errorNotFound : t.errorNetwork;

  return (
    <main className="page-main" data-edit-id="home-page">
      <section id="search-section" className="search-section" data-edit-id="search-section">
        <div className="search-hero" data-edit-id="search-hero">
          <div className="search-hero-icon" data-edit-id="search-hero-icon" aria-hidden="true">🌤️</div>
          <h1 id="search-title" className="search-title" data-edit-id="search-title">{t.searchTitle}</h1>
          <p className="search-subtitle" data-edit-id="search-subtitle">{t.searchSubtitle}</p>
        </div>
        <SearchBar t={t} onSelect={handleSelect} />
      </section>
      {status === "loading" && <Spinner />}
      {status === "error" && <ErrorMessage message={errorText} />}
      {status === "success" && current && (
        <section id="weather-result-section" className="weather-result" data-edit-id="weather-result-section">
          <MainCard
            weather={current}
            t={t}
            lang={lang}
            isFav={isFav(current.cityName, current.country)}
            onAddFav={() => handleAddFav(current)}
            onRemoveFav={() => removeFav(current.cityName, current.country)}
          />
          <InfoGrid weather={current} t={t} lang={lang} />
          {forecast.length > 0 && (
            <section id="forecast-section" className="forecast-section" data-edit-id="forecast-section">
              <h3 className="section-subtitle" data-edit-id="forecast-title">{t.forecastTitle}</h3>
              <div className="forecast-grid" data-edit-id="forecast-grid">
                {forecast.map((d, i) => (
                  <ForecastCard key={d.date} day={d} t={t} lang={lang} index={i} />
                ))}
              </div>
            </section>
          )}
          <WeatherMap lat={current.lat} lon={current.lon} cityName={current.cityName} t={t} />
        </section>
      )}
    </main>
  );
}
