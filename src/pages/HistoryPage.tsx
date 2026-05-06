import type { HistoryEntry, Language, Translations } from "../types";
import type { GeoCity } from "../types";
import HistoryItem from "../components/HistoryItem";
import { getT } from "../utils";

interface Props {
  lang: Language;
  history: HistoryEntry[];
  removeEntry: (id: string) => void;
  clearHistory: () => void;
  onSearch: (city: GeoCity) => void;
}

export default function HistoryPage({ lang, history, removeEntry, clearHistory, onSearch }: Props) {
  const t: Translations = getT(lang);

  function handleSearch(entry: HistoryEntry) {
    onSearch({ name: entry.cityName, country: entry.country, lat: entry.lat, lon: entry.lon });
  }

  return (
    <main className="page-main" data-edit-id="history-page">
      <div className="page-header-row" data-edit-id="history-header-row">
        <h2 className="page-title" data-edit-id="history-title">{t.historyTitle}</h2>
        {history.length > 0 && (
          <button className="btn-clear-all" onClick={clearHistory} data-edit-id="history-clear-all">{t.clearAll}</button>
        )}
      </div>
      {history.length === 0 && (
        <p className="empty-state" data-edit-id="history-empty">{t.historyEmpty}</p>
      )}
      {history.length > 0 && (
        <div className="city-list" data-edit-id="history-list">
          {history.map((e, i) => (
            <HistoryItem key={e.id} entry={e} t={t} onSearch={handleSearch} onRemove={removeEntry} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}