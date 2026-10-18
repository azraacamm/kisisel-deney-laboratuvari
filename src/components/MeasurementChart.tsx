
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import type { Measurement } from "../interfaces/Measurement";

type MeasurementChartProps = {
  measurements: Measurement[];
  variableAName: string;
  variableAUnit: string;
  variableBName: string;
  variableBUnit: string;
  language: "tr" | "en";
};

export default function MeasurementChart({
  measurements,
  variableAName,
  variableAUnit,
  variableBName,
  variableBUnit,
  language,
}: MeasurementChartProps) {
  const en = language === "en";

  // TARİHE GÖRE SIRALAMA
  const chartData = [...measurements].sort(
    (a, b) => a.date.localeCompare(b.date)
  );

  // BOŞ GRAFİK DURUMU
  if (chartData.length === 0) {
    return (
      <section className="mt-6 rounded-xl bg-white p-6 shadow">

        <h2 className="text-xl font-bold">
          {en ? "Measurement Chart" : "Ölçüm Grafiği"}
        </h2>

        <p className="mt-3 text-slate-500">
          {en
            ? "No measurements are available for the chart yet."
            : "Grafik için henüz ölçüm bulunmuyor."}
        </p>
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-xl bg-white p-6 shadow">

      <h2 className="mb-4 text-xl font-bold">
        {en ? "Measurement Chart" : "Ölçüm Grafiği"}
      </h2>

      <p className="mb-5 text-sm text-slate-600">
        {en
          ? "Changes in both variables over time"
          : "İki değişkenin zamana göre değişimi"}
      </p>

      {/* ÇİZGİ GRAFİĞİ */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 15,
              left: 5,
              bottom: 10,
            }}
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis yAxisId="left" />

            <YAxis
              yAxisId="right"
              orientation="right"
            />

            <Tooltip />

            <Legend />

            {/* BİRİNCİ DEĞİŞKEN */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="valueA"
              name={`${variableAName} (${variableAUnit})`}
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
            />

            {/* İKİNCİ DEĞİŞKEN */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="valueB"
              name={`${variableBName} (${variableBUnit})`}
              stroke="#f97316"
              strokeWidth={3}
              dot={{ r: 4 }}
            />

          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        {en
          ? "Note: Variables are displayed on separate vertical axes. The visual appearance of the lines alone does not determine the strength of correlation."
          : "Not: Değişkenler farklı dikey eksenlerde gösterilir. Çizgilerin görünümü tek başına korelasyonun gücünü belirlemez."}
      </p>

    </section>
  );
}
