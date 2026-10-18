
import { Link } from "react-router-dom";

import type { Experiment } from "../interfaces/Experiment";
import type { Measurement } from "../interfaces/Measurement";

import { calculatePearson } from "../utils/pearson";

type ExperimentCardProps = {
  language: "tr" | "en";
  experiment: Experiment;
  measurements: Measurement[];
  onEdit: (experiment: Experiment) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
};

export default function ExperimentCard({
  language,
  experiment,
  measurements,
  onEdit,
  onDelete,
  onToggleStatus,
}: ExperimentCardProps) {
  const en = language === "en";

  const isEnglishDemo =
    en && experiment.id === "demo-kahve-uyku";

  const title = isEnglishDemo
    ? "Coffee Consumption and Sleep Quality"
    : experiment.title;

  const hypothesis = isEnglishDemo
    ? "The later I drink coffee, the lower my sleep quality."
    : experiment.hypothesis;

  const variableA = isEnglishDemo
    ? "Last coffee time"
    : experiment.variableAName;

  const variableB = isEnglishDemo
    ? "Sleep quality"
    : experiment.variableBName;

  const unitA = isEnglishDemo
    ? "hour (24-hour clock)"
    : experiment.variableAUnit;

  const unitB = isEnglishDemo
    ? "1–10"
    : experiment.variableBUnit;

  const experimentMeasurements = measurements.filter(
    (measurement) =>
      measurement.experimentId === experiment.id
  );

  const r =
    experiment.status === "completed"
      ? calculatePearson(experimentMeasurements)
      : null;

  let strengthLabel = "";

  if (r !== null) {
    const strength = Math.abs(r);

    if (strength < 0.3) {
      strengthLabel = en ? "Weak" : "Zayıf";
    } else if (strength <= 0.6) {
      strengthLabel = en ? "Moderate" : "Orta";
    } else {
      strengthLabel = en ? "Strong" : "Güçlü";
    }
  }

  let observedRelation = "";

  if (r !== null) {
    if (r > 0) {
      observedRelation = en ? "Positive (+)" : "Pozitif (+)";
    } else if (r < 0) {
      observedRelation = en ? "Negative (-)" : "Negatif (-)";
    } else {
      observedRelation = en
        ? "No linear relationship"
        : "Doğrusal ilişki yok";
    }
  }

  return (
    <article className="rounded-xl bg-white p-5 shadow">

      <h3 className="text-lg font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-slate-600">
        {hypothesis}
      </p>

      <p className="mt-3 text-sm">
        {en ? "Variable A:" : "Değişken A:"}{" "}
        {variableA} ({unitA})
      </p>

      <p className="text-sm">
        {en ? "Variable B:" : "Değişken B:"}{" "}
        {variableB} ({unitB})
      </p>

      <p className="mt-3 text-sm text-blue-600">
        <strong>
          {en ? "Expected Relationship:" : "Beklenen İlişki:"}
        </strong>{" "}
        {experiment.expectedRelation === "positive"
          ? en ? "Positive (+)" : "Pozitif (+)"
          : en ? "Negative (-)" : "Negatif (-)"}
      </p>

      {/* GÖZLENEN İLİŞKİ */}
      <div className="mt-3 rounded-lg bg-slate-100 p-3">

        {experiment.status === "active" ? (
          <p className="text-sm text-slate-600">
            <strong>
              {en ? "Observed Relationship:" : "Gözlenen İlişki:"}
            </strong>{" "}
            {en ? "Not determined yet" : "Henüz belirlenmedi"}
          </p>
        ) : r === null ? (
          <div>
            <p className="text-sm font-medium text-amber-600">
              {en
                ? "Observed Relationship: Cannot be calculated"
                : "Gözlenen İlişki: Hesaplanamadı"}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {en
                ? "At least 5 valid measurements with variation in both variables are required."
                : "En az 5 geçerli ölçüm ve değişkenlerde farklı değerler gereklidir."}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-slate-700">
              <strong>
                {en ? "Observed Relationship:" : "Gözlenen İlişki:"}
              </strong>{" "}
              {observedRelation}
            </p>

            <p className="mt-2 text-sm text-slate-700">
              <strong>
                {en ? "Relationship Strength:" : "İlişki Gücü:"}
              </strong>{" "}
              {strengthLabel}
            </p>

            <p className="mt-2 text-sm text-slate-600">
              Pearson r = {r.toFixed(3)}
            </p>
          </div>
        )}
      </div>

      {/* DURUM */}
      <p className="mt-4 font-medium">
        {en ? "Status:" : "Durum:"}{" "}
        <span
          className={
            experiment.status === "active"
              ? "text-green-600"
              : "text-slate-500"
          }
        >
          {experiment.status === "active"
            ? en ? "Active" : "Aktif"
            : en ? "Completed" : "Tamamlandı"}
        </span>
      </p>

      {/* BUTONLAR */}
      <div className="mt-4 flex flex-wrap gap-3">

        <Link
          to={`/experiments/${experiment.id}`}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          {en ? "View Details" : "Detayları Gör"}
        </Link>

        <button
          type="button"
          onClick={() => onEdit(experiment)}
          className="rounded-lg bg-amber-500 px-4 py-2 font-medium text-white hover:bg-amber-600"
        >
          {en ? "Edit" : "Düzenle"}
        </button>

        <button
          type="button"
          onClick={() => onDelete(experiment.id)}
          className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
        >
          {en ? "Delete" : "Sil"}
        </button>

        <button
          type="button"
          onClick={() => onToggleStatus(experiment.id)}
          className="rounded-lg bg-slate-700 px-4 py-2 font-medium text-white hover:bg-slate-800"
        >
          {experiment.status === "active"
            ? en ? "Mark as Completed" : "Tamamlandı Olarak İşaretle"
            : en ? "Reactivate" : "Yeniden Aktifleştir"}
        </button>
      </div>
    </article>
  );
}
