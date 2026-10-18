export interface Experiment {
  id: string;
  title: string;
  hypothesis: string;
  variableAName: string;
  variableAUnit: string;
  variableBName: string;
  variableBUnit: string;
  expectedRelation: "positive" | "negative";
  createdAt: string;
  status: "active" | "completed";
}