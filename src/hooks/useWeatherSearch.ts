import { useState, useCallback } from "react";
import type { CurrentWeather, ForecastDay, Language } from "../types";
import { fetchCurrentWeather, fetchForecast } from "../api";

type Status = "idle" | "loading" | "success" | "error";

export function useWeatherSearch() {
  const [status, setStatus] = useState<Status>("idle");
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const search = useCallback(async (lat: number, lon: number, lang: Language) => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const [w, f] = await Promise.all([
        fetchCurrentWeather(lat, lon, lang),
        fetchForecast(lat, lon, lang),
      ]);
      setCurrent(w);
      setForecast(f);
      setStatus("success");
    } catch (e: unknown) {
      setStatus("error");
      const msg = e instanceof Error ? e.message : "";
      setErrorMsg(msg === "weather_error" ? "not_found" : "network");
    }
  }, []);

  return { status, current, forecast, errorMsg, search };
}