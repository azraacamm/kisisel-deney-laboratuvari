
import type { FormEvent } from "react";
import type { Measurement } from "../interfaces/Measurement";

type MeasurementFormProps = {
  experimentId: string;
  variableAName: string;
  variableBName: string;
  language: "tr" | "en";
  onCreate: (measurement: Measurement) => void;
  onUpdate: (measurement: Measurement) => void;
  editingMeasurement: Measurement | null;
  onCancel: () => void;
};

export default function MeasurementForm({
  experimentId,
  variableAName,
  variableBName,
  language,
  onCreate,
  onUpdate,
  editingMeasurement,
  onCancel,
}: MeasurementFormProps) {
  const en = language === "en";

  const t = (tr: string, english: string) =>
    en ? english : tr;

  // BUGÜNÜN YEREL TARİHİ
  const now = new Date();

  const today = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  ).toISOString().slice(0, 10);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const date = String(data.get("date") ?? "").trim();
    const rawA = String(data.get("valueA") ?? "").trim();
    const rawB = String(data.get("valueB") ?? "").trim();
    const note = String(data.get("note") ?? "").trim();

    // BOŞ ALAN KONTROLÜ
    if (!date || !rawA || !rawB) {
      alert(
        t(
          "Lütfen zorunlu alanları doldurun.",
          "Please fill in all required fields."
        )
      );
      return;
    }

    // TARİH DOĞRULAMA
    const parsedDate = new Date(date + "T00:00:00");

    const validDate =
      /^\d{4}-\d{2}-\d{2}$/.test(date) &&
      !Number.isNaN(parsedDate.getTime()) &&
      parsedDate.getFullYear() === Number(date.slice(0, 4)) &&
      parsedDate.getMonth() + 1 === Number(date.slice(5, 7)) &&
      parsedDate.getDate() === Number(date.slice(8, 10));

    if (!validDate || date > today) {
      alert(
        t(
          "Lütfen geçerli ve gelecekte olmayan bir tarih girin.",
          "Please enter a valid date that is not in the future."
        )
      );
      return;
    }

    // SAYI KONTROLÜ
    const valueA = Number(rawA);
    const valueB = Number(rawB);

    if (
      !Number.isFinite(valueA) ||
      !Number.isFinite(valueB)
    ) {
      alert(
        t(
          "Lütfen geçerli sayısal değerler girin.",
          "Please enter valid numeric values."
        )
      );
      return;
    }

    // ÖLÇÜM GÜNCELLEME
    if (editingMeasurement) {
      onUpdate({
        ...editingMeasurement,
        date,
        valueA,
        valueB,
        note,
      });
    } else {
      // YENİ ÖLÇÜM OLUŞTURMA
      onCreate({
        id: crypto.randomUUID(),
        experimentId,
        date,
        valueA,
        valueB,
        note,
      });

      form.reset();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mt-6 space-y-4 rounded-xl bg-white p-6 shadow"
    >

      <h2 className="text-xl font-bold">
        {editingMeasurement
          ? t("Ölçümü Düzenle", "Edit Measurement")
          : t("Yeni Ölçüm Ekle", "Add New Measurement")}
      </h2>

      {/* TARİH */}
      <div>
        <label htmlFor="date" className="block font-medium">
          {t("Ölçüm Tarihi", "Measurement Date")}
        </label>

        <input
          id="date"
          name="date"
          type="date"
          max={today}
          required
          defaultValue={editingMeasurement?.date ?? today}
          className="mt-2 w-full rounded-lg border p-3"
        />
      </div>

      {/* DEĞİŞKEN A */}
      <div>
        <label htmlFor="valueA" className="block font-medium">
          {variableAName}
        </label>

        <input
          id="valueA"
          name="valueA"
          type="number"
          step="any"
          required
          defaultValue={editingMeasurement?.valueA ?? ""}
          className="mt-2 w-full rounded-lg border p-3"
        />
      </div>

      {/* DEĞİŞKEN B */}
      <div>
        <label htmlFor="valueB" className="block font-medium">
          {variableBName}
        </label>

        <input
          id="valueB"
          name="valueB"
          type="number"
          step="any"
          required
          defaultValue={editingMeasurement?.valueB ?? ""}
          className="mt-2 w-full rounded-lg border p-3"
        />
      </div>

      {/* NOT */}
      <div>
        <label htmlFor="note" className="block font-medium">
          {t("Not (İsteğe Bağlı)", "Note (Optional)")}
        </label>

        <textarea
          id="note"
          name="note"
          rows={3}
          defaultValue={editingMeasurement?.note ?? ""}
          placeholder={t(
            "Bugünkü ölçümün hakkında not yazabilirsin.",
            "You can add a note about your measurement."
          )}
          className="mt-2 w-full rounded-lg border p-3"
        />
      </div>

      {/* KAYDETME */}
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700"
      >
        {editingMeasurement
          ? t("Değişiklikleri Kaydet", "Save Changes")
          : t("Ölçümü Kaydet", "Save Measurement")}
      </button>

      {/* İPTAL */}
      {editingMeasurement && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-lg bg-slate-200 p-3 font-medium text-slate-800"
        >
          {t("İptal", "Cancel")}
        </button>
      )}

    </form>
  );
}
