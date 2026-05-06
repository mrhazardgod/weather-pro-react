import { useState } from "react";
import type { HistoryEntry } from "../types";
import { loadFromStorage, saveToStorage } from "../utils";

const KEY = "weather-history";

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(() =>
    loadFromStorage<HistoryEntry[]>(KEY, [])
  );

  function addEntry(entry: Omit<HistoryEntry, "id" | "searchedAt">) {
    const id = `${entry.cityName}-${entry.country}-${Date.now()}`;
    const next = [
      { ...entry, id, searchedAt: Date.now() },
      ...history.filter((h) => !(h.cityName === entry.cityName && h.country === entry.country)),
    ].slice(0, 20);
    setHistory(next);
    saveToStorage(KEY, next);
  }

  function removeEntry(id: string) {
    const next = history.filter((h) => h.id !== id);
    setHistory(next);
    saveToStorage(KEY, next);
  }

  function clearHistory() {
    setHistory([]);
    saveToStorage(KEY, []);
  }

  return { history, addEntry, removeEntry, clearHistory };
}