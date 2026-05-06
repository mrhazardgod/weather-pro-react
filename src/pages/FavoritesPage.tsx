import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FavoriteCity, Language, Translations } from "../types";
import type { GeoCity } from "../types";
import FavoriteCard from "../components/FavoriteCard";
import Spinner from "../components/Spinner";
import { fetchCurrentWeather } from "../api";
import { getT } from "../utils";

interface Props {
  lang: Language;
  favorites: FavoriteCity[];
  removeFav: (name: string, country: string) => void;
  clearFav: () => void;
  onViewCity: (city: GeoCity) => void;
}

export default function FavoritesPage({ lang, favorites, removeFav, clearFav, onViewCity }: Props) {
  const t: Translations = getT(lang);
  const [loading, setLoading] = useState(false);
  const [enriched, setEnriched] = useState<FavoriteCity[]>(favorites);

  useEffect(() => {
    if (favorites.length === 0) { setEnriched([]); return; }
    setLoading(true);
    Promise.all(
      favorites.map(async (c) => {
        try {
          const w = await fetchCurrentWeather(c.lat, c.lon, lang);
          return { ...c, currentTemp: w.temp, icon: w.icon };
        } catch { return c; }
      })
    ).then((res) => { setEnriched(res); setLoading(false); });
  }, [favorites, lang]);

  function handleView(city: FavoriteCity) {
    onViewCity({ name: city.name, country: city.country, lat: city.lat, lon: city.lon });
  }

  return (
    <main className="page-main" data-edit-id="favorites-page">
      <div className="page-header-row" data-edit-id="favorites-header-row">
        <h2 className="page-title" data-edit-id="favorites-title">{t.favoritesTitle}</h2>
        {favorites.length > 0 && (
          <button className="btn-clear-all" onClick={clearFav} data-edit-id="favorites-clear-all">{t.clearAll}</button>
        )}
      </div>
      {loading && <Spinner />}
      {!loading && enriched.length === 0 && (
        <p className="empty-state" data-edit-id="favorites-empty">{t.favoritesEmpty}</p>
      )}
      {!loading && enriched.length > 0 && (
        <div className="city-list" data-edit-id="favorites-list">
          {enriched.map((c, i) => (
            <FavoriteCard key={`${c.name}-${c.country}`} city={c} t={t} lang={lang} onView={handleView} onRemove={removeFav} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}