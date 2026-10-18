
import { useEffect, lazy, Suspense } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { useLocalStorage } from "./hooks/useLocalStorage";

// SAYFALARI İHTİYAÇ OLDUĞUNDA YÜKLE
const Dashboard = lazy(() => import("./pages/Dashboard"));

const ExperimentDetail = lazy(
  () => import("./pages/ExperimentDetail")
);

type Language = "tr" | "en";

function App() {
  // TEMA TERCİHİ
  const [theme, setTheme] =
    useLocalStorage<"light" | "dark">(
      "app-theme",
      "light"
    );

  // DİL TERCİHİ
  const [language, setLanguage] =
    useLocalStorage<Language>(
      "app-language",
      "tr"
    );

  // TEMA UYGULAMA
  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );

    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  // SAYFA DİLİ
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // TEMA DEĞİŞTİRME
  function toggleTheme() {
    setTheme((previous) =>
      previous === "light" ? "dark" : "light"
    );
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">

        {/* ÜST MENÜ */}
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-end gap-3">

            <label
              htmlFor="language"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Dil / Language
            </label>

            <select
              id="language"
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value as Language)
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="tr">TR - Türkçe</option>
              <option value="en">EN - English</option>
            </select>

            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              {theme === "light"
                ? language === "tr"
                  ? "🌙 Koyu Moda Geç"
                  : "🌙 Dark Mode"
                : language === "tr"
                  ? "☀️ Açık Moda Geç"
                  : "☀️ Light Mode"}
            </button>
          </div>
        </header>

        {/* SAYFALAR */}
        <div className="flex-1">
          <Suspense
            fallback={
              <div
                role="status"
                className="p-8 text-center text-slate-600 dark:text-slate-300"
              >
                {language === "tr"
                  ? "Sayfa yükleniyor..."
                  : "Loading page..."}
              </div>
            }
          >
            <Routes>
              <Route
                path="/"
                element={<Dashboard language={language} />}
              />

              <Route
                path="/experiments/:id"
                element={
                  <ExperimentDetail language={language} />
                }
              />
            </Routes>
          </Suspense>
        </div>

        {/* ALTBİLGİ */}
        <footer className="border-t border-slate-200 bg-white px-6 py-8 text-center dark:border-slate-700 dark:bg-slate-900">
          <div className="mx-auto max-w-3xl">

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {language === "tr"
                ? "Kişisel Deney Laboratuvarı (N=1)"
                : "Personal Experiment Lab (N=1)"}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {language === "tr"
                ? "Merak ettiğiniz soruları deneylere dönüştürün. Günlük yaşam, eğitim, alışkanlıklar ve daha birçok alanda kendi hipotezlerinizi oluşturun, ölçümlerinizi takip edin ve verilerinizi bilimsel yöntemlerle keşfedin."
                : "Turn your questions into experiments. Create hypotheses, track measurements, and explore your data using scientific methods across everyday life, education, habits, and more."}
            </p>

            <div className="my-5 border-t border-slate-200 dark:border-slate-700" />

            <p className="text-sm text-slate-600 dark:text-slate-300">
              {language === "tr"
                ? "Sonuçlar yalnızca girilen verilere dayalıdır; korelasyon nedensellik kanıtı değildir."
                : "Results are based only on the entered data. Correlation does not prove causation."}
            </p>

            <p className="mt-3 text-xs leading-6 text-slate-500 dark:text-slate-400">
              {language === "tr"
                ? "Bu uygulama bilimsel düşünmeyi öğretmek içindir, tıbbi tavsiye değildir. Gerçek hasta verisi girmeyiniz."
                : "This application is intended to teach scientific thinking and does not provide medical advice. Do not enter real patient data."}
            </p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
