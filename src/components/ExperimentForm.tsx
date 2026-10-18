
import type { FormEvent } from "react";
import type { Experiment } from "../interfaces/Experiment";

type ExperimentFormProps = {
  language: "tr" | "en";
  onCreate: (experiment: Experiment) => void;
  onUpdate: (experiment: Experiment) => void;
  editingExperiment: Experiment | null;
  onCancel: () => void;
};

export default function ExperimentForm({
  language,
  onCreate,
  onUpdate,
  editingExperiment,
  onCancel,
}: ExperimentFormProps) {
  const en = language === "en";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const getText = (name: string) =>
      String(data.get(name) ?? "").trim();

    const title = getText("title");
    const hypothesis = getText("hypothesis");
    const variableAName = getText("variableAName");
    const variableAUnit = getText("variableAUnit");
    const variableBName = getText("variableBName");
    const variableBUnit = getText("variableBUnit");
    const expectedRelation = getText("expectedRelation");

    if (
      !title ||
      !hypothesis ||
      !variableAName ||
      !variableAUnit ||
      !variableBName ||
      !variableBUnit
    ) {
      alert(
        en
          ? "Please fill in all required fields."
          : "Lütfen tüm zorunlu alanları doldurun."
      );
      return;
    }

    if (
      expectedRelation !== "positive" &&
      expectedRelation !== "negative"
    ) {
      alert(
        en
          ? "Please select the expected relationship."
          : "Lütfen beklenen ilişki yönünü seçin."
      );
      return;
    }

    if (editingExperiment) {
      const updatedExperiment: Experiment = {
        ...editingExperiment,
        title,
        hypothesis,
        variableAName,
        variableAUnit,
        variableBName,
        variableBUnit,
        expectedRelation,
      };

      onUpdate(updatedExperiment);
    } else {
      const newExperiment: Experiment = {
        id: crypto.randomUUID(),
        title,
        hypothesis,
        variableAName,
        variableAUnit,
        variableBName,
        variableBUnit,
        expectedRelation,
        createdAt: new Date().toISOString(),
        status: "active",
      };

      onCreate(newExperiment);
      form.reset();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-4"
    >
      <h2 className="text-xl font-bold text-slate-900">
        {editingExperiment
          ? en ? "Edit Experiment" : "Deneyi Düzenle"
          : en ? "Create New Experiment" : "Yeni Deney Oluştur"}
      </h2>

      <div>
        <label htmlFor="title" className="block font-medium">
          {en ? "Experiment Title" : "Deney Başlığı"}
        </label>

        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={editingExperiment?.title ?? ""}
          placeholder={
            en
              ? "e.g. Study Time and Exam Performance"
              : "Örn: Ders Çalışma ve Başarı"
          }
          className="mt-2 w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label htmlFor="hypothesis" className="block font-medium">
          {en ? "Hypothesis" : "Hipotez"}
        </label>

        <textarea
          id="hypothesis"
          name="hypothesis"
          required
          rows={3}
          defaultValue={editingExperiment?.hypothesis ?? ""}
          placeholder={
            en
              ? "e.g. Studying longer improves my test scores."
              : "Örn: Çalışma sürem arttıkça test puanım artar."
          }
          className="mt-2 w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label
          htmlFor="variableAName"
          className="block font-medium"
        >
          {en ? "First Variable Name" : "Birinci Değişkenin Adı"}
        </label>

        <input
          id="variableAName"
          name="variableAName"
          type="text"
          required
          defaultValue={editingExperiment?.variableAName ?? ""}
          placeholder={en ? "e.g. Study time" : "Örn: Çalışma süresi"}
          className="mt-2 w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label
          htmlFor="variableAUnit"
          className="block font-medium"
        >
          {en ? "First Variable Unit" : "Birinci Değişkenin Birimi"}
        </label>

        <input
          id="variableAUnit"
          name="variableAUnit"
          type="text"
          required
          defaultValue={editingExperiment?.variableAUnit ?? ""}
          placeholder={en ? "e.g. minutes" : "Örn: dakika"}
          className="mt-2 w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label
          htmlFor="variableBName"
          className="block font-medium"
        >
          {en ? "Second Variable Name" : "İkinci Değişkenin Adı"}
        </label>

        <input
          id="variableBName"
          name="variableBName"
          type="text"
          required
          defaultValue={editingExperiment?.variableBName ?? ""}
          placeholder={en ? "e.g. Test score" : "Örn: Test puanı"}
          className="mt-2 w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label
          htmlFor="variableBUnit"
          className="block font-medium"
        >
          {en ? "Second Variable Unit" : "İkinci Değişkenin Birimi"}
        </label>

        <input
          id="variableBUnit"
          name="variableBUnit"
          type="text"
          required
          defaultValue={editingExperiment?.variableBUnit ?? ""}
          placeholder={en ? "e.g. points" : "Örn: puan"}
          className="mt-2 w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label
          htmlFor="expectedRelation"
          className="block font-medium"
        >
          {en ? "Expected Relationship" : "Beklenen İlişki"}
        </label>

        <select
          id="expectedRelation"
          name="expectedRelation"
          required
          defaultValue={editingExperiment?.expectedRelation ?? ""}
          className="mt-2 w-full rounded-lg border p-3"
        >
          <option value="" disabled>
            {en
              ? "Select a relationship"
              : "İlişki yönünü seçiniz"}
          </option>

          <option value="positive">
            {en ? "Positive (+)" : "Pozitif (+)"}
          </option>

          <option value="negative">
            {en ? "Negative (-)" : "Negatif (-)"}
          </option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700"
      >
        {editingExperiment
          ? en ? "Save Changes" : "Değişiklikleri Kaydet"
          : en ? "Save Experiment" : "Deney Kaydet"}
      </button>

      {editingExperiment && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-lg bg-slate-200 p-3 font-medium text-slate-800"
        >
          {en ? "Cancel" : "İptal"}
        </button>
      )}
    </form>
  );
}
