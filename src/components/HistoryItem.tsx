import type { HistoryEntry, Translations } from "../types";

interface Props {
  entry: HistoryEntry;
  t: Translations;
  onSearch: (entry: HistoryEntry) => void;
  onRemove: (id: string) => void;
  index: number;
}

export default function HistoryItem({ entry, t, onSearch, onRemove, index }: Props) {
  const date = new Date(entry.searchedAt).toLocaleString();

  return (
    <div className="history-item" data-edit-id={`history-item-${index}`}>
      <div className="history-item-left" data-edit-id={`history-item-info-${index}`}>
        <div className="history-item-dot-wrap" aria-hidden="true">
          <span className="history-item-dot" />
        </div>
        <div className="history-item-text" data-edit-id={`history-item-text-${index}`}>
          <strong className="history-item-name" data-edit-id={`history-item-name-${index}`}>
            {entry.cityName}, {entry.country}
          </strong>
          <span className="history-date" data-edit-id={`history-item-date-${index}`}>{date}</span>
        </div>
      </div>
      <div className="history-item-actions" data-edit-id={`history-item-actions-${index}`}>
        <button
          className="btn-view"
          onClick={() => onSearch(entry)}
          data-edit-id={`history-item-search-${index}`}
        >
          {t.searchAgain}
        </button>
        <button
          className="btn-remove-small"
          onClick={() => onRemove(entry.id)}
          data-edit-id={`history-item-remove-${index}`}
        >
          {t.remove}
        </button>
      </div>
    </div>
  );
}
