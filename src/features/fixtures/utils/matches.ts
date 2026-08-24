import type { Match } from "@/types";

const statusOrder = (status: string): number => {
  switch (status) {
    case "SCHEDULED":
    case "TIMED":
      return 0;
    case "IN_PLAY":
    case "PAUSED":
      return 1;
    default:
      return 2;
  }
};

export const sortMatches = (matches: Match[]) =>
  [...matches].sort((a, b) => {
    const statusDiff = statusOrder(a.status) - statusOrder(b.status);
    if (statusDiff !== 0) return statusDiff;
    return new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime();
  });

export const formatKickoff = (utcDate: string) => {
  const date = new Date(utcDate);
  return {
    date: date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }),
    time: date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

export const statusLabel = (status: string) => {
  switch (status) {
    case "FINISHED":
      return "FT";
    case "IN_PLAY":
      return "Live";
    case "PAUSED":
      return "HT";
    case "POSTPONED":
      return "Postponed";
    case "CANCELLED":
      return "Canceled";
    default:
      return null;
  }
};

export const getFormResult = (
  match: {
    homeTeam: { id: number };
    awayTeam: { id: number };
    score: { winner: string | null };
  },
  teamId: number,
): "W" | "D" | "L" => {
  const { winner } = match.score;
  if (winner === null) return "D";
  const isHome = match.homeTeam.id === teamId;
  if (winner === "DRAW") return "D";
  if ((winner === "HOME_TEAM" && isHome) || (winner === "AWAY_TEAM" && !isHome))
    return "W";
  return "L";
};
