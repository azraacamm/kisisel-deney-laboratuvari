
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);

      return saved !== null
        ? (JSON.parse(saved) as T)
        : initialValue;
    } catch (error) {
      console.error("Veri okunamadı:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Veri kaydedilemedi:", error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}
