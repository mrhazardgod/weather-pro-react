import { useState, useRef, useEffect, useCallback } from "react";
import type { GeoCity, Translations } from "../types";
import { fetchGeocode } from "../api";

interface Props {
  t: Translations;
  onSelect: (city: GeoCity) => void;
}

export default function SearchBar({ t, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoCity[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [error, setError] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 3) { setSuggestions([]); setError(""); return; }
    try {
      setError("");
      const res = await fetchGeocode(q);
      setSuggestions(res.slice(0, 5));
      if (res.length === 0) setError("Город не найден / City not found");
    } catch (err) {
      setSuggestions([]);
      const code = err instanceof Error ? err.message : "";
      if (code === "api_key_missing") {
        setError("Добавьте OpenWeather API key выше / Add your OpenWeather API key above");
      } else if (code === "api_key_invalid") {
        setError("API key не принят OpenWeather / OpenWeather rejected this API key");
      } else {
        setError("Не удалось загрузить города / Could not load cities");
      }
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchSuggestions(query), 400);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query, fetchSuggestions]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setSuggestions([]);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(city: GeoCity) {
    setQuery(`${city.name}, ${city.country}`);
    setSuggestions([]);
    setActiveIdx(-1);
    onSelect(city);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Enter") {
      if (activeIdx >= 0 && suggestions[activeIdx]) handleSelect(suggestions[activeIdx]);
      else if (suggestions.length > 0) handleSelect(suggestions[0]);
      else if (query.trim()) { fetchSuggestions(query); }
    }
    else if (e.key === "Escape") setSuggestions([]);
  }

  return (
    <div ref={containerRef} className="search-bar" data-edit-id="search-bar">
      <input
        id="search-input"
        type="text"
        className="search-input"
        placeholder={t.searchPlaceholder}
        value={query}
        onChange={(e) => { setQuery(e.target.value); setActiveIdx(-1); }}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        data-edit-id="search-input"
      />
      <button id="search-button" className="search-button" onClick={() => suggestions.length > 0 ? handleSelect(suggestions[0]) : fetchSuggestions(query)} data-edit-id="search-button">
        {t.searchButton}
      </button>
      {suggestions.length > 0 && (
        <ul id="search-suggestions" className="search-suggestions" data-edit-id="search-suggestions">
          {suggestions.map((c, i) => (
            <li
              key={`${c.lat}-${c.lon}`}
              id={`suggestion-${i}`}
              className={"suggestion-item" + (i === activeIdx ? " suggestion-item--active" : "")}
              onMouseDown={() => handleSelect(c)}
              data-edit-id={`suggestion-item-${i}`}
            >
              {c.name}{c.state ? `, ${c.state}` : ""}, {c.country}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="search-error" data-edit-id="search-error">{error}</p>}
    </div>
  );
}
