
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import MeasurementForm from "../components/MeasurementForm";
import AnalysisResult from "../components/AnalysisResult";
import MeasurementChart from "../components/MeasurementChart";

import { useLocalStorage } from "../hooks/useLocalStorage";

import type { Experiment } from "../interfaces/Experiment";
import type { Measurement } from "../interfaces/Measurement";

type ExperimentDetailProps = {
  language: "tr" | "en";
};

export default function ExperimentDetail({
  language,
}: ExperimentDetailProps) {
  const { id } = useParams<{ id: string }>();

  const en = language === "en";

  const t = (tr: string, english: string) =>
    en ? english : tr;

  // DENEYLER
  const [experiments] = useLocalStorage<Experiment[]>(
    "experiments",
    []
  );

  // ÖLÇÜMLER
  const [measurements, setMeasurements] =
    useLocalStorage<Measurement[]>("measurements", []);

  // DÜZENLENEN ÖLÇÜM
  const [editingMeasurement, setEditingMeasurement] =
    useState<Measurement | null>(null);

  // SEÇİLİ DENEY
  const experiment = experiments.find(
    (item) => item.id === id
  );

  // ÖLÇÜM EKLEME
  function handleCreate(measurement: Measurement) {
    setMeasurements((previous) => [
      ...previous,
      measurement,
    ]);
  }

  // ÖLÇÜM GÜNCELLEME
  function handleUpdate(updatedMeasurement: Measurement) {
    setMeasurements((previous) =>
      previous.map((measurement) =>
        measurement.id === updatedMeasurement.id
          ? updatedMeasurement
          : measurement
      )
    );

    setEditingMeasurement(null);
  }

  // ÖLÇÜM SİLME
  function handleDelete(measurementId: string) {
    const confirmed = window.confirm(
      t(
        "Bu ölçümü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
        "Are you sure you want to delete this measurement? This action cannot be undone."
      )
    );

    if (!confirmed) return;

    setMeasurements((previous) =>
      previous.filter(
        (measurement) =>
          measurement.id !== measurementId
      )
    );

    setEditingMeasurement((previous) =>
      previous?.id === measurementId ? null : previous
    );
  }

  // DENEY BULUNAMAZSA
  if (!experiment) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">

        <h1 className="text-2xl font-bold">
          {t("Deney Bulunamadı", "Experiment Not Found")}
        </h1>

        <p className="mt-2 text-slate-600">
          {t(
            "Aradığınız deney mevcut değil.",
            "The requested experiment does not exist."
          )}
        </p>

        <Link
          to="/"
          className="mt-4 inline-block text-blue-600"
        >
          {t("Ana Sayfaya Dön", "Back to Dashboard")}
        </Link>

      </main>
    );
  }

  // DENEYE AİT ÖLÇÜMLER
  const experimentMeasurements = measurements.filter(
    (item) => item.experimentId === experiment.id
  );

  // DEMO DENEYİN İNGİLİZCE İSİMLERİ
  const isEnglishDemo =
    en && experiment.id === "demo-kahve-uyku";

  const displayTitle = isEnglishDemo
    ? "Coffee Consumption and Sleep Quality"
    : experiment.title;

  const displayHypothesis = isEnglishDemo
    ? "The later I drink coffee, the lower my sleep quality."
    : experiment.hypothesis;

  const displayVariableAName = isEnglishDemo
    ? "Last coffee time"
    : experiment.variableAName;

  const displayVariableAUnit = isEnglishDemo
    ? "hour (24-hour clock)"
    : experiment.variableAUnit;

  const displayVariableBName = isEnglishDemo
    ? "Sleep quality"
    : experiment.variableBName;

  const displayVariableBUnit = isEnglishDemo
    ? "1–10"
    : experiment.variableBUnit;

  return (
    <main className="min-h-screen bg-slate-50 p-6">

      {/* ANA SAYFAYA DÖN */}
      <Link
        to="/"
        className="text-blue-600 hover:underline"
      >
        {t("← Ana Sayfaya Dön", "← Back to Dashboard")}
      </Link>

      {/* DENEY BİLGİLERİ */}
      <div className="mt-6 rounded-xl bg-white p-6 shadow">

        <h1 className="text-2xl font-bold text-slate-900">
          {displayTitle}
        </h1>

        <p className="mt-3 text-slate-600">
          {displayHypothesis}
        </p>

        <div className="mt-6 space-y-3">

          <p>
            <strong>
              {t("Birinci Değişken:", "First Variable:")}
            </strong>{" "}
            {displayVariableAName} ({displayVariableAUnit})
          </p>

          <p>
            <strong>
              {t("İkinci Değişken:", "Second Variable:")}
            </strong>{" "}
            {displayVariableBName} ({displayVariableBUnit})
          </p>

          <p>
            <strong>
              {t("Beklenen İlişki:", "Expected Relationship:")}
            </strong>{" "}
            {experiment.expectedRelation === "positive"
              ? t("Pozitif (+)", "Positive (+)")
              : t("Negatif (-)", "Negative (-)")}
          </p>

          <p>
            <strong>
              {t("Durum:", "Status:")}
            </strong>{" "}
            {experiment.status === "active"
              ? t("Aktif", "Active")
              : t("Tamamlandı", "Completed")}
          </p>

        </div>
      </div>

      {/* ÖLÇÜM FORMU */}
      <MeasurementForm
        key={`${language}-${editingMeasurement?.id ?? "new"}`}
        experimentId={experiment.id}
        variableAName={displayVariableAName}
        variableBName={displayVariableBName}
        language={language}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        editingMeasurement={editingMeasurement}
        onCancel={() => setEditingMeasurement(null)}
      />

      {/* ÖLÇÜM SAYISI */}
      <div className="mt-6 rounded-xl bg-white p-4 shadow">
        <p className="font-semibold">
          {t("Toplam ölçüm:", "Total Measurements:")}{" "}
          {experimentMeasurements.length}
        </p>
      </div>

      {/* BİLİMSEL ANALİZ */}
      <AnalysisResult
        experiment={experiment}
        measurements={experimentMeasurements}
        language={language}
      />

      {/* ÖLÇÜM GRAFİĞİ */}
      <MeasurementChart
        measurements={experimentMeasurements}
        variableAName={displayVariableAName}
        variableAUnit={displayVariableAUnit}
        variableBName={displayVariableBName}
        variableBUnit={displayVariableBUnit}
        language={language}
      />

      {/* ÖLÇÜM GEÇMİŞİ */}
      <section className="mt-6 rounded-xl bg-white p-6 shadow">

        <h2 className="mb-4 text-xl font-bold">
          {t("Ölçüm Geçmişi", "Measurement History")}
        </h2>

        {experimentMeasurements.length === 0 ? (
          <p className="text-slate-500">
            {t(
              "Henüz ölçüm eklenmedi.",
              "No measurements have been added yet."
            )}
          </p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full border-collapse text-left">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border p-3">
                    {t("Tarih", "Date")}
                  </th>

                  <th className="border p-3">
                    {displayVariableAName}
                  </th>

                  <th className="border p-3">
                    {displayVariableBName}
                  </th>

                  <th className="border p-3">
                    {t("Not", "Note")}
                  </th>

                  <th className="border p-3">
                    {t("İşlem", "Actions")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {[...experimentMeasurements]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((measurement) => (

                    <tr key={measurement.id}>

                      <td className="border p-3">
                        {measurement.date}
                      </td>

                      <td className="border p-3">
                        {measurement.valueA}
                      </td>

                      <td className="border p-3">
                        {measurement.valueB}
                      </td>

                      <td className="border p-3">
                        {isEnglishDemo &&
                        measurement.note === "Örnek demo verisi"
                          ? "Sample demo data"
                          : measurement.note || "-"}
                      </td>

                      <td className="border p-3">
                        <div className="flex flex-wrap gap-2">

                          {/* DÜZENLE */}
                          <button
                            type="button"
                            onClick={() =>
                              setEditingMeasurement(measurement)
                            }
                            className="rounded-lg bg-amber-500 px-3 py-2 text-white hover:bg-amber-600"
                          >
                            {t("Düzenle", "Edit")}
                          </button>

                          {/* SİL */}
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(measurement.id)
                            }
                            className="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                          >
                            {t("Sil", "Delete")}
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </main>
  );
}
