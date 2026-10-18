
import { useState } from "react";

import ExperimentForm from "../components/ExperimentForm";
import ExperimentCard from "../components/ExperimentCard";
import { useLocalStorage } from "../hooks/useLocalStorage";

import type { Experiment } from "../interfaces/Experiment";
import type { Measurement } from "../interfaces/Measurement";

type StatusFilter = "all" | "active" | "completed";

type DashboardProps = {
  language: "tr" | "en";
};

const DEMO_ID = "demo-kahve-uyku";

const demoValues = [
  { a: 14, b: 9 },
  { a: 17, b: 7 },
  { a: 19, b: 6 },
  { a: 15, b: 8 },
  { a: 20, b: 5 },
  { a: 16, b: 8 },
  { a: 21, b: 4 },
  { a: 18, b: 7 },
  { a: 13, b: 9 },
  { a: 22, b: 3 },
  { a: 17, b: 6 },
  { a: 20, b: 4 },
];

function createDemoExperiment(): Experiment {
  return {
    id: DEMO_ID,
    title: "Kahve Tüketimi ve Uyku Kalitesi",
    hypothesis:
      "Son kahve saatim geciktikçe uyku kalitem düşer.",
    variableAName: "Son kahve saati",
    variableAUnit: "saat (24 saat)",
    variableBName: "Uyku kalitesi",
    variableBUnit: "1-10",
    expectedRelation: "negative",
    createdAt: new Date().toISOString(),
    status: "active",
  };
}

function createDemoMeasurements(): Measurement[] {
  return demoValues.map((item, index) => {
    const date = new Date();

    date.setHours(12, 0, 0, 0);
    date.setDate(
      date.getDate() - (demoValues.length - 1 - index)
    );

    const formattedDate = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    return {
      id: `${DEMO_ID}-olcum-${index + 1}`,
      experimentId: DEMO_ID,
      date: formattedDate,
      valueA: item.a,
      valueB: item.b,
      note: "Örnek demo verisi",
    };
  });
}

export default function Dashboard({
  language,
}: DashboardProps) {
  const en = language === "en";

  const [experiments, setExperiments] =
    useLocalStorage<Experiment[]>("experiments", []);

  const [measurements, setMeasurements] =
    useLocalStorage<Measurement[]>("measurements", []);

  const [editingExperiment, setEditingExperiment] =
    useState<Experiment | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  // DENEY EKLEME
  function handleCreate(experiment: Experiment) {
    setExperiments((previous) => [
      ...previous,
      experiment,
    ]);
  }

  // DENEY GÜNCELLEME
  function handleUpdate(updatedExperiment: Experiment) {
    setExperiments((previous) =>
      previous.map((experiment) =>
        experiment.id === updatedExperiment.id
          ? updatedExperiment
          : experiment
      )
    );

    setEditingExperiment(null);
  }

  // DENEY SİLME
  function handleDelete(id: string) {
    const experiment = experiments.find(
      (item) => item.id === id
    );

    if (!experiment) return;

    const confirmed = window.confirm(
      en
        ? `Are you sure you want to delete "${experiment.title}"?\n\nAll related measurements will also be deleted.`
        : `"${experiment.title}" deneyini silmek istediğinize emin misiniz?\n\nBu deneye bağlı tüm ölçümler de silinecektir.`
    );

    if (!confirmed) return;

    setExperiments((previous) =>
      previous.filter((item) => item.id !== id)
    );

    setMeasurements((previous) =>
      previous.filter((item) => item.experimentId !== id)
    );

    setEditingExperiment((previous) =>
      previous?.id === id ? null : previous
    );
  }

  // DURUM DEĞİŞTİRME
  function handleToggleStatus(id: string) {
    setExperiments((previous) =>
      previous.map((experiment) =>
        experiment.id === id
          ? {
              ...experiment,
              status:
                experiment.status === "active"
                  ? "completed"
                  : "active",
            }
          : experiment
      )
    );
  }

  // DEMO YÜKLEME
  function handleLoadDemo() {
    const alreadyExists = experiments.some(
      (experiment) => experiment.id === DEMO_ID
    );

    if (alreadyExists) {
      alert(
        en
          ? "The demo experiment already exists."
          : "Demo deney zaten mevcut."
      );
      return;
    }

    setExperiments((previous) => [
      ...previous,
      createDemoExperiment(),
    ]);

    setMeasurements((previous) => [
      ...previous.filter(
        (measurement) =>
          measurement.experimentId !== DEMO_ID
      ),
      ...createDemoMeasurements(),
    ]);

    setSearchTerm("");
    setStatusFilter("all");

    alert(
      en
        ? "Demo experiment and 12 measurements added."
        : "Demo deney ve 12 örnek ölçüm eklendi."
    );
  }

  // DEMO SIFIRLAMA
  function handleResetDemo() {
    const confirmed = window.confirm(
      en
        ? "Reset the demo experiment and its measurements? Your other experiments will be preserved."
        : "Demo deneyini ve ölçümlerini sıfırlamak istiyor musunuz? Diğer deneyleriniz korunacaktır."
    );

    if (!confirmed) return;

    setExperiments((previous) =>
      previous.map((experiment) =>
        experiment.id === DEMO_ID
          ? createDemoExperiment()
          : experiment
      )
    );

    setMeasurements((previous) => [
      ...previous.filter(
        (measurement) =>
          measurement.experimentId !== DEMO_ID
      ),
      ...createDemoMeasurements(),
    ]);

    setEditingExperiment(null);
    setSearchTerm("");
    setStatusFilter("all");

    alert(
      en
        ? "Demo data has been reset."
        : "Demo veriler başlangıç durumuna döndürüldü."
    );
  }

  const demoExists = experiments.some(
    (experiment) => experiment.id === DEMO_ID
  );

  // ARAMA VE FİLTRE
  const normalizedSearch = searchTerm
    .trim()
    .toLocaleLowerCase(language === "tr" ? "tr-TR" : "en-US");

  const filteredExperiments = experiments.filter(
    (experiment) => {
      const searchableText = [
        experiment.title,
        experiment.hypothesis,
        experiment.variableAName,
        experiment.variableBName,
        ...(experiment.id === DEMO_ID
          ? [
              "Coffee Consumption and Sleep Quality",
              "Last coffee time",
              "Sleep quality",
            ]
          : []),
      ]
        .join(" ")
        .toLocaleLowerCase(language === "tr" ? "tr-TR" : "en-US");

      const matchesSearch =
        searchableText.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" ||
        experiment.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">

        {/* BAŞLIK */}
        <h1 className="text-2xl font-bold text-slate-900">
          {en
            ? "Personal Experiment Lab"
            : "Kişisel Deney Laboratuvarı"}
        </h1>

        <p className="mt-2 text-slate-600">
          {en
            ? "Create your own experiments and track your measurements."
            : "Kendi deneylerini oluştur ve ölçümlerini takip et."}
        </p>

        {/* DEMO */}
        <section className="mt-6 rounded-xl bg-blue-50 p-5">
          <h2 className="text-xl font-bold text-slate-900">
            {en ? "Explore a Demo Experiment" : "Örnek Deneyi Keşfet"}
          </h2>

          <p className="mt-2 text-slate-600">
            {en
              ? "Explore 12 example measurements about coffee consumption and sleep quality."
              : "Kahve tüketimi ve uyku kalitesi üzerine hazırlanmış 12 örnek ölçümü inceleyebilirsiniz."}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            {en
              ? "These are sample data for demonstration only, not actual research results."
              : "Bu veriler yalnızca gösterim amaçlıdır. Gerçek bir bilimsel araştırmaya ait değildir."}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {!demoExists ? (
              <button
                type="button"
                onClick={handleLoadDemo}
                className="rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
              >
                {en ? "Load Demo Experiment" : "Demo Deneyi Yükle"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleResetDemo}
                className="rounded-lg bg-slate-700 px-4 py-3 font-semibold text-white hover:bg-slate-800"
              >
                {en ? "Reset Demo Data" : "Demo Veriyi Sıfırla"}
              </button>
            )}
          </div>
        </section>

        {/* DENEY FORMU */}
        <ExperimentForm
          key={`${language}-${editingExperiment?.id ?? "new"}`}
          language={language}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          editingExperiment={editingExperiment}
          onCancel={() => setEditingExperiment(null)}
        />

        {/* DENEY SAYISI */}
        <div className="mt-6 rounded-xl bg-white p-4 shadow">
          <p className="font-semibold text-slate-700">
            {en ? "Total Experiments:" : "Toplam deney:"}{" "}
            {experiments.length}
          </p>
        </div>

        {/* ARAMA VE FİLTRE */}
        <section className="mt-8 rounded-xl bg-white p-5 shadow">

          <h2 className="mb-4 text-xl font-bold">
            {en
              ? "Search and Filter Experiments"
              : "Deney Ara ve Filtrele"}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label
                htmlFor="search"
                className="block font-medium"
              >
                {en ? "Search Experiments" : "Deney Ara"}
              </label>

              <input
                id="search"
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder={
                  en
                    ? "Search by title, hypothesis, or variable..."
                    : "Deney adı, hipotez veya değişken ara..."
                }
                className="mt-2 w-full rounded-lg border border-slate-300 p-3"
              />
            </div>

            <div>
              <label
                htmlFor="statusFilter"
                className="block font-medium"
              >
                {en ? "Filter by Status" : "Duruma Göre Filtrele"}
              </label>

              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as StatusFilter
                  )
                }
                className="mt-2 w-full rounded-lg border border-slate-300 p-3"
              >
                <option value="all">
                  {en ? "All Experiments" : "Tüm Deneyler"}
                </option>

                <option value="active">
                  {en ? "Active Experiments" : "Aktif Deneyler"}
                </option>

                <option value="completed">
                  {en ? "Completed Experiments" : "Tamamlanan Deneyler"}
                </option>
              </select>
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-500">
            {en
              ? `${filteredExperiments.length} experiments shown.`
              : `${filteredExperiments.length} deney gösteriliyor.`}
          </p>
        </section>

        {/* DENEY KARTLARI */}
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            {en ? "Saved Experiments" : "Kayıtlı Deneyler"}
          </h2>

          {experiments.length === 0 ? (
            <p className="rounded-lg bg-white p-5 text-slate-500 shadow">
              {en
                ? "No experiments have been created yet."
                : "Henüz deney oluşturulmadı."}
            </p>
          ) : filteredExperiments.length === 0 ? (
            <p className="rounded-lg bg-white p-5 text-slate-500 shadow">
              {en
                ? "No experiments match your search or filter."
                : "Seçtiğiniz kriterlere uygun deney bulunamadı."}
            </p>
          ) : (
            <div className="space-y-4">
              {filteredExperiments.map((experiment) => (
                <ExperimentCard
                  key={experiment.id}
                  language={language}
                  experiment={experiment}
                  measurements={measurements}
                  onEdit={setEditingExperiment}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
