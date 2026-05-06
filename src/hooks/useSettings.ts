import { useState } from "react";
import type { AppSettings, Language, Theme } from "../types";
import { loadFromStorage, saveToStorage } from "../utils";

const DEFAULTS: AppSettings = { language: "ru", theme: "day" };

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() =>
    loadFromStorage<AppSettings>("weather-settings", DEFAULTS)
  );

  function setLanguage(language: Language) {
    const next = { ...settings, language };
    setSettings(next);
    saveToStorage("weather-settings", next);
  }

  function setTheme(theme: Theme) {
    const next = { ...settings, theme };
    setSettings(next);
    saveToStorage("weather-settings", next);
  }

  return { settings, setLanguage, setTheme };
}