import { useState } from "react";
import type { FavoriteCity } from "../types";
import { loadFromStorage, saveToStorage } from "../utils";

const KEY = "weather-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteCity[]>(() =>
    loadFromStorage<FavoriteCity[]>(KEY, [])
  );

  function add(city: FavoriteCity) {
    const next = [...favorites.filter((f) => f.name !== city.name || f.country !== city.country), city];
    setFavorites(next);
    saveToStorage(KEY, next);
  }

  function remove(name: string, country: string) {
    const next = favorites.filter((f) => !(f.name === name && f.country === country));
    setFavorites(next);
    saveToStorage(KEY, next);
  }

  function clear() {
    setFavorites([]);
    saveToStorage(KEY, []);
  }

  function isFavorite(name: string, country: string) {
    return favorites.some((f) => f.name === name && f.country === country);
  }

  return { favorites, add, remove, clear, isFavorite };
}