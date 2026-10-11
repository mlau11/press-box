export const outcomeVariant = (outcome: string) => {
  if (outcome === "exact") return "success";
  if (outcome === "correct_result") return "neutral";
  return "destructive";
};

export const outcomeLabel: Record<string, string> = {
  exact: "Exact",
  correct_result: "Correct",
  wrong: "Wrong",
};

export const formatPoints = (points: number) =>
  points > 0 ? `+${points}` : "0";
