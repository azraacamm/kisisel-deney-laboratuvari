
import type { Experiment } from "../interfaces/Experiment";
import type { Measurement } from "../interfaces/Measurement";
import { calculatePearson } from "../utils/pearson";

type AnalysisResultProps = {
  experiment: Experiment;
  measurements: Measurement[];
  language: "tr" | "en";
};

export default function AnalysisResult({
  experiment,
  measurements,
  language,
}: AnalysisResultProps) {
  const en = language === "en";

  const t = (tr: string, english: string) =>
    en ? english : tr;

  const r = calculatePearson(measurements);

  // DEMO DENEYİN İNGİLİZCE DEĞİŞKEN İSİMLERİ
  const isEnglishDemo =
    en && experiment.id === "demo-kahve-uyku";

  const variableAName = isEnglishDemo
    ? "Last coffee time"
    : experiment.variableAName;

  const variableBName = isEnglishDemo
    ? "Sleep quality"
    : experiment.variableBName;

  // YETERSİZ VERİ
  if (r === null) {
    return (
      <section className="mt-6 rounded-xl bg-white p-6 shadow">
        <h2 className="text-xl font-bold text-slate-900">
          {t("Bilimsel Analiz", "Scientific Analysis")}
        </h2>

        <p className="mt-4 font-semibold text-amber-600">
          {t("Yetersiz Veri", "Insufficient Data")}
        </p>

        <p className="mt-2 text-slate-600">
          {t(
            "Henüz deneyin hakkında bir sonuç çıkaramıyoruz. Analiz için en az 5 geçerli ölçüm ve her iki değişkende farklı değerler gereklidir.",
            "There is not enough information to draw a conclusion. At least 5 valid measurements and variation in both variables are required."
          )}
        </p>

        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          {t(
            "Korelasyon nedensellik değildir.",
            "Correlation does not imply causation."
          )}
        </p>
      </section>
    );
  }

  // İLİŞKİNİN GÜCÜ
  const strength = Math.abs(r);

  // İLİŞKİNİN YÖNÜ
  const relation =
    r > 0 ? "positive" : r < 0 ? "negative" : "none";

  // BEKLENEN İLİŞKİYLE KARŞILAŞTIRMA
  const matches =
    relation === experiment.expectedRelation;

  let result: string;
  let strengthLabel: string;

  if (strength < 0.3) {
    strengthLabel = t("Zayıf", "Weak");
    result = t("Desteklenmiyor", "Not Supported");
  } else if (strength <= 0.6) {
    strengthLabel = t("Orta", "Moderate");

    result = matches
      ? t("Kısmen Destekleniyor", "Partially Supported")
      : t("Desteklenmiyor", "Not Supported");
  } else {
    strengthLabel = t("Güçlü", "Strong");

    result = matches
      ? t("Destekleniyor", "Supported")
      : t("Desteklenmiyor", "Not Supported");
  }

  // KULLANICI DOSTU AÇIKLAMA
  let explanation: string;

  if (strength < 0.3) {
    explanation = en
      ? `The measurements do not show a clear linear relationship between "${variableAName}" and "${variableBName}".`
      : `Bu ölçümlerde "${variableAName}" ile "${variableBName}" arasında belirgin bir doğrusal ilişki görülmüyor.`;
  } else if (r > 0) {
    explanation = en
      ? `In your measurements, as "${variableAName}" increases, "${variableBName}" generally increases as well.`
      : `Bu ölçümlerde "${variableAName}" değeri arttıkça "${variableBName}" de genellikle artıyor.`;
  } else {
    explanation = en
      ? `In your measurements, as "${variableAName}" increases, "${variableBName}" generally decreases.`
      : `Bu ölçümlerde "${variableAName}" değeri arttıkça "${variableBName}" genellikle azalıyor.`;
  }

  // HİPOTEZ DEĞERLENDİRMESİ
  let hypothesisExplanation: string;

  if (strength > 0.6 && matches) {
    hypothesisExplanation = t(
      "Ölçümlerinde güçlü bir ilişki var ve bu ilişki başlangıçta beklediğin yönde. Yani verilerin hipotezinle uyumlu.",
      "Your measurements show a strong relationship in the direction you expected. Your data are consistent with your hypothesis."
    );
  } else if (strength >= 0.3 && matches) {
    hypothesisExplanation = t(
      "Ölçümlerin beklediğin yönde bir ilişki gösteriyor. Ancak ilişkinin gücü orta düzeyde.",
      "Your measurements show a relationship in the expected direction, but its strength is moderate."
    );
  } else {
    hypothesisExplanation = t(
      "Mevcut ölçümler hipotezini belirgin biçimde desteklemiyor. Bu, hipotezinin kesinlikle yanlış olduğunu göstermez.",
      "The current measurements do not clearly support your hypothesis. This does not prove that your hypothesis is false."
    );
  }

  return (
    <section className="mt-6 rounded-xl bg-white p-6 shadow">

      {/* BAŞLIK */}
      <h2 className="text-xl font-bold text-slate-900">
        {t("Bilimsel Analiz", "Scientific Analysis")}
      </h2>

      {/* ANLAŞILIR AÇIKLAMA */}
      <div className="mt-5 rounded-xl bg-slate-100 p-5">

        <h3 className="text-lg font-bold text-slate-900">
          {t(
            "🔍 Verilerin Ne Anlatıyor?",
            "🔍 What Does Your Data Tell You?"
          )}
        </h3>

        <p className="mt-3 leading-relaxed text-slate-700">
          {explanation}
        </p>

        <p className="mt-3 leading-relaxed text-slate-700">
          {hypothesisExplanation}
        </p>
      </div>

      {/* HİPOTEZ SONUCU */}
      <div className="mt-5">
        <h3 className="font-semibold text-slate-900">
          {t(
            "Hipotez Değerlendirmesi",
            "Hypothesis Evaluation"
          )}
        </h3>

        <p className="mt-2 text-lg font-bold text-blue-600">
          {result}
        </p>
      </div>

      {/* BİLİMSEL DETAYLAR */}
      <div className="mt-6 border-t border-slate-200 pt-5">

        <h3 className="font-semibold text-slate-900">
          {t(
            "📊 Bilimsel Hesaplama Detayları",
            "📊 Scientific Calculation Details"
          )}
        </h3>

        <p className="mt-3 text-slate-700">
          {t("Pearson Korelasyonu:", "Pearson Correlation:")}{" "}
          <strong>{r.toFixed(3)}</strong>
        </p>

        <p className="mt-2 text-slate-700">
          {t("İlişki Gücü:", "Relationship Strength:")}{" "}
          <strong>{strengthLabel}</strong>
        </p>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {t(
            "Pearson korelasyonu -1 ile +1 arasında bir değerdir. Pozitif değerler iki değişkenin aynı yönde, negatif değerler ters yönde değişme eğilimini gösterir. Sıfıra yakın değerler ise zayıf doğrusal ilişkiyi belirtir.",
            "Pearson correlation ranges from -1 to +1. Positive values indicate that two variables tend to move in the same direction, while negative values indicate opposite directions. Values near zero suggest a weak linear relationship."
          )}
        </p>
      </div>

      {/* BİLİMSEL UYARI */}
      <div className="mt-5 rounded-lg bg-amber-50 p-4">
        <p className="text-sm leading-relaxed text-amber-800">
          {t(
            "⚠️ Korelasyon nedensellik değildir. İki değişken arasında ilişki bulunması, birinin diğerine neden olduğunu kanıtlamaz. Bu sonuç yalnızca girilen ölçümlere dayalı bir değerlendirmedir.",
            "⚠️ Correlation does not imply causation. A relationship between two variables does not prove that one causes the other. This evaluation is based only on the measurements entered."
          )}
        </p>
      </div>

    </section>
  );
}
