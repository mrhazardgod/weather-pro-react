import { useEffect, useState } from "react";
import { HashRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FavoritesPage from "./pages/FavoritesPage";
import HistoryPage from "./pages/HistoryPage";
import HomePage from "./pages/HomePage";
import { useFavorites } from "./hooks/useFavorites";
import { useHistory } from "./hooks/useHistory";
import { useSettings } from "./hooks/useSettings";
import type { GeoCity } from "./types";
import { getT } from "./utils";
import { getStoredApiKey, saveStoredApiKey } from "./api";

function AppRoutes() {
  const { settings, setLanguage, setTheme } = useSettings();
  const favorites = useFavorites();
  const history = useHistory();
  const navigate = useNavigate();
  const [cityRequest, setCityRequest] = useState<{ city: GeoCity; requestId: number } | null>(null);
  const [apiKey, setApiKey] = useState(() => getStoredApiKey());
  const [showApiPanel, setShowApiPanel] = useState(() => !getStoredApiKey());
  const [apiSaved, setApiSaved] = useState(false);
  const t = getT(settings.language);

  useEffect(() => {
    document.body.dataset.theme = settings.theme;
    document.documentElement.lang = settings.language;
  }, [settings]);

  function toggleTheme() {
    setTheme(settings.theme === "day" ? "night" : "day");
  }

  function openCity(city: GeoCity) {
    setCityRequest({ city, requestId: Date.now() });
    navigate("/");
  }

  function handleApiKeySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveStoredApiKey(apiKey);
    setApiSaved(true);
    window.setTimeout(() => {
      setApiSaved(false);
      setShowApiPanel(false);
    }, 900);
  }

  const apiCopy = settings.language === "ru"
    ? {
        title: "OpenWeather API ключ",
        hint: "Вставьте ключ один раз. Он сохранится в браузере, и поиск сразу начнет работать без пересборки.",
        placeholder: "Ваш OpenWeather API key",
        save: "Сохранить ключ",
        saved: "Ключ сохранен",
        hide: "Скрыть",
        toggle: "API ключ",
      }
    : {
        title: "OpenWeather API key",
        hint: "Paste the key once. It is saved in this browser and search works without rebuilding.",
        placeholder: "Your OpenWeather API key",
        save: "Save key",
        saved: "Key saved",
        hide: "Hide",
        toggle: "API key",
      };

  return (
    <div className="app-shell" data-edit-id="app-shell">
      <Header
        t={t}
        language={settings.language}
        theme={settings.theme}
        onSetLanguage={setLanguage}
        onToggleTheme={toggleTheme}
      />
      {!showApiPanel && (
        <button
          className="api-key-toggle"
          type="button"
          onClick={() => setShowApiPanel(true)}
          data-edit-id="api-key-toggle"
        >
          {apiCopy.toggle}
        </button>
      )}
      {showApiPanel && (
        <section className="api-key-panel" data-edit-id="api-key-panel">
          <div className="api-key-copy" data-edit-id="api-key-copy">
            <strong data-edit-id="api-key-title">{apiCopy.title}</strong>
            <span data-edit-id="api-key-hint">{apiCopy.hint}</span>
          </div>
          <form className="api-key-form" onSubmit={handleApiKeySubmit} data-edit-id="api-key-form">
            <input
              className="api-key-input"
              type="password"
              value={apiKey}
              onChange={(event) => {
                setApiKey(event.target.value);
                setApiSaved(false);
              }}
              placeholder={apiCopy.placeholder}
              autoComplete="off"
              data-edit-id="api-key-input"
            />
            <button className="api-key-button" type="submit" data-edit-id="api-key-save-button">
              {apiCopy.save}
            </button>
            {apiKey && (
              <button
                className="api-key-secondary"
                type="button"
                onClick={() => setShowApiPanel(false)}
                data-edit-id="api-key-hide-button"
              >
                {apiCopy.hide}
              </button>
            )}
          </form>
          {apiSaved && <p className="api-key-status" data-edit-id="api-key-status">{apiCopy.saved}</p>}
        </section>
      )}
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              lang={settings.language}
              isFav={favorites.isFavorite}
              addFav={favorites.add}
              removeFav={favorites.remove}
              addHistory={history.addEntry}
              initialCity={cityRequest?.city ?? null}
              initialCityRequestId={cityRequest?.requestId ?? 0}
            />
          }
        />
        <Route
          path="/favorites"
          element={
            <FavoritesPage
              lang={settings.language}
              favorites={favorites.favorites}
              removeFav={favorites.remove}
              clearFav={favorites.clear}
              onViewCity={openCity}
            />
          }
        />
        <Route
          path="/history"
          element={
            <HistoryPage
              lang={settings.language}
              history={history.history}
              removeEntry={history.removeEntry}
              clearHistory={history.clearHistory}
              onSearch={openCity}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer t={t} />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
