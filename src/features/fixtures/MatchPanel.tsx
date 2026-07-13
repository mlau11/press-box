import { Button } from "@/components/ui/button";
import { LiveDot, Pill } from "@/components/ui/pill";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ticker } from "@/components/ui/typography";
import { leagueLabel, WC_STAGES } from "@/constants";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import { useAuthModal } from "@/features/auth/context/AuthModalContext";
import { useSubmitPrediction } from "@/features/predictions/hooks/usePredictions";
import { cn } from "@/lib/utils";
import type { Match, Prediction } from "@/types/index";
import { formatKickoff, getFormResult, statusLabel } from "@/utils/matches";
import { useEffect, useRef, useState } from "react";
import MatchPanelSkeleton from "./MatchPanelSkeleton";
import {
  useStandings,
  useTeamForm,
  type FormMatch,
  type StandingEntry,
} from "./hooks/useMatchStats";

interface MatchPanelProps {
  match: Match | null;
  existingPrediction: Prediction | undefined;
  leagueCode: string;
}

function FormRow({ match, teamId }: { match: FormMatch; teamId: number }) {
  const isHome = match.homeTeam.id === teamId;
  const opponent = isHome ? match.awayTeam : match.homeTeam;
  const teamScore = isHome
    ? match.score.fullTime.home
    : match.score.fullTime.away;
  const opponentScore = isHome
    ? match.score.fullTime.away
    : match.score.fullTime.home;
  const result = getFormResult(match, teamId);

  const resultColor = {
    W: "text-success",
    D: "text-foreground-muted",
    L: "text-destructive",
  }[result];

  return (
    <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 py-2.5 border-b border-border last:border-0">
      <img
        src={opponent.crest}
        alt={opponent.shortName}
        className="w-5 h-5 rounded-full object-cover flex-shrink-0"
      />
      <span className="text-sm text-foreground truncate">
        {opponent.shortName}
      </span>
      <span className="text-sm tabular-nums text-foreground-muted">
        {teamScore ?? 0}-{opponentScore ?? 0}
      </span>
      <span className={cn("text-sm font-medium w-4 text-right", resultColor)}>
        {result}
      </span>
    </div>
  );
}

const renderStandingsTable = (
  rows: StandingEntry[],
  ...highlightIds: (number | null)[]
) => (
  <div className="overflow-hidden">
    <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto_auto_auto] items-center gap-x-2 py-2 border-b border-border">
      <Ticker className="w-5 text-center">#</Ticker>
      <Ticker>Club</Ticker>
      <Ticker className="w-5 text-center">W</Ticker>
      <Ticker className="w-5 text-center">D</Ticker>
      <Ticker className="w-5 text-center">L</Ticker>
      <Ticker className="w-5 text-center">GF</Ticker>
      <Ticker className="w-5 text-center">GA</Ticker>
      <Ticker className="w-5 text-center">GD</Ticker>
      <Ticker className="w-6 text-center">Pts</Ticker>
    </div>
    {rows.map((entry) => {
      const isHighlighted = highlightIds.includes(entry.team.id);
      return (
        <div
          key={entry.team.id}
          className={cn(
            "grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto_auto_auto] items-center gap-x-2 py-2.5",
            isHighlighted ? "text-foreground" : "text-foreground-muted",
          )}
        >
          <span className="w-5 text-center text-xs">{entry.position}</span>
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={entry.team.crest}
              alt={entry.team.shortName}
              className="w-5 h-5 rounded-full object-cover flex-shrink-0"
            />
            <span
              className={cn(
                "text-xs truncate",
                isHighlighted ? "text-foreground" : "text-foreground-muted",
              )}
            >
              {entry.team.shortName}
            </span>
          </div>
          <span className="w-5 text-center text-xs">{entry.won}</span>
          <span className="w-5 text-center text-xs">{entry.draw}</span>
          <span className="w-5 text-center text-xs">{entry.lost}</span>
          <span className="w-5 text-center text-xs">{entry.goalsFor}</span>
          <span className="w-5 text-center text-xs">{entry.goalsAgainst}</span>
          <span className="w-5 text-center text-xs">
            {entry.goalDifference > 0
              ? `+${entry.goalDifference}`
              : entry.goalDifference}
          </span>
          <span className="w-6 text-center text-xs">{entry.points}</span>
        </div>
      );
    })}
  </div>
);

const stepperButtonClasses = cn(
  "w-[38px] h-7 rounded",
  "border border-border",
  "text-foreground-muted",
  "hover:text-foreground hover:border-border-strong",
  "active:translate-y-px active:bg-surface-4 active:border-border-strong",
  "disabled:opacity-50 disabled:pointer-events-none",
  "transition-all",
);

const quickPickButtonClasses = cn(
  "flex items-center justify-center gap-1",
  "border border-border rounded px-2.5 py-1.5",
  "text-xs text-foreground-muted cursor-pointer",
  "hover:text-foreground hover:border-border-strong",
  "active:translate-y-px active:bg-surface-4 active:border-border-strong",
  "disabled:opacity-50 disabled:pointer-events-none",
  "transition-all",
);

const scoreInputClasses = (isEditable: boolean) =>
  cn(
    "w-32 rounded-md bg-surface-4 py-6",
    "text-center text-[56px] leading-none tabular-nums",
    "text-foreground placeholder:text-foreground-dim",
    "border border-transparent outline-none",
    "focus:border-primary",
    "transition-all",
    !isEditable && "cursor-not-allowed",
  );

export default function MatchPanel({
  match,
  existingPrediction,
  leagueCode,
}: MatchPanelProps) {
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const prevUserRef = useRef<string | null>(null);

  const { user } = useAuthContext();
  const { openAuthModal } = useAuthModal();
  const { mutate: submitPrediction, isPending } = useSubmitPrediction();

  const { data: homeForm } = useTeamForm(match?.homeTeam.id ?? undefined);
  const { data: awayForm } = useTeamForm(match?.awayTeam.id ?? undefined);
  const { data: standings } = useStandings(leagueCode);

  const shouldFilterStandings = leagueCode !== "WC";

  const matchData = match
    ? {
        homeTeam: match.homeTeam.name ?? "",
        awayTeam: match.awayTeam.name ?? "",
        homeShortName: match.homeTeam.shortName ?? "",
        awayShortName: match.awayTeam.shortName ?? "",
        homeCrest: match.homeTeam.crest ?? "",
        awayCrest: match.awayTeam.crest ?? "",
        kickoffAt: match.utcDate,
        status: match.status,
      }
    : null;

  useEffect(() => {
    if (existingPrediction) {
      setHomeScore(existingPrediction.predicted_home.toString());
      setAwayScore(existingPrediction.predicted_away.toString());
    } else {
      setHomeScore("");
      setAwayScore("");
    }
  }, [match?.id, existingPrediction]);

  useEffect(() => {
    const currentUserId = user?.id ?? null;
    const wasLoggedOut = prevUserRef.current === null;
    const isNowLoggedIn = currentUserId !== null;

    prevUserRef.current = currentUserId;

    if (!wasLoggedOut || !isNowLoggedIn) return;
    if (!match || !matchData || homeScore === "" || awayScore === "") return;

    submitPrediction({
      userId: user!.id,
      matchId: match.id,
      leagueCode,
      matchday: match.matchday ?? 0,
      predictedHome: parseInt(homeScore),
      predictedAway: parseInt(awayScore),
      matchData,
    });
  }, [user]);

  if (!match) return <MatchPanelSkeleton />;

  const { date, time } = formatKickoff(match.utcDate);
  const isFinished = match.status === "FINISHED";
  const isLive = match.status === "IN_PLAY" || match.status === "PAUSED";
  const isUnplayed =
    !isFinished &&
    !isLive &&
    match.status !== "POSTPONED" &&
    match.status !== "CANCELLED";
  const isEditable = isUnplayed;
  const label = statusLabel(match.status);
  const homeTeamId = match.homeTeam.id;
  const awayTeamId = match.awayTeam.id;
  const homeFormRows = homeForm?.length ? homeForm : null;
  const awayFormRows = awayForm?.length ? awayForm : null;
  const stageLabel = match.stage
    ? (WC_STAGES.find((s) => "stage" in s && s.stage === match.stage)?.label ??
      match.stage)
    : null;

  const bumpHome = (delta: number) =>
    setHomeScore(String(Math.max(0, (parseInt(homeScore) || 0) + delta)));
  const bumpAway = (delta: number) =>
    setAwayScore(String(Math.max(0, (parseInt(awayScore) || 0) + delta)));

  const handleSubmit = () => {
    if (homeScore === "" || awayScore === "") return;
    if (!user) {
      openAuthModal();
      return;
    }
    if (!matchData) return;
    submitPrediction({
      userId: user.id,
      matchId: match.id,
      leagueCode,
      matchday: match.matchday ?? 0,
      predictedHome: parseInt(homeScore),
      predictedAway: parseInt(awayScore),
      matchData,
    });
  };

  const standingsContent = standings
    ? (() => {
        const homeGroup = standings.find((g) =>
          g.table.some((e) => e.team.id === match.homeTeam.id),
        );
        const awayGroup = standings.find((g) =>
          g.table.some((e) => e.team.id === match.awayTeam.id),
        );
        const isSameGroup = homeGroup === awayGroup;

        if (!homeGroup && !awayGroup) return null;

        if (isSameGroup && homeGroup) {
          return (
            <div>
              <Ticker className="block mb-3">
                {homeGroup.group ?? "Group standings"}
              </Ticker>
              {renderStandingsTable(
                shouldFilterStandings
                  ? homeGroup.table.filter(
                      (e) =>
                        e.team.id === match.homeTeam.id ||
                        e.team.id === match.awayTeam.id,
                    )
                  : homeGroup.table,
                match.homeTeam.id,
                match.awayTeam.id,
              )}
            </div>
          );
        }

        return (
          <div className="grid grid-cols-2 gap-6">
            {homeGroup && (
              <div>
                <Ticker className="block mb-3">
                  {homeGroup.group ?? "Home group"}
                </Ticker>
                {renderStandingsTable(
                  shouldFilterStandings
                    ? homeGroup.table.filter(
                        (e) => e.team.id === match.homeTeam.id,
                      )
                    : homeGroup.table,
                  match.homeTeam.id,
                )}
              </div>
            )}
            {awayGroup && (
              <div>
                <Ticker className="block mb-3">
                  {awayGroup.group ?? "Away group"}
                </Ticker>
                {renderStandingsTable(
                  shouldFilterStandings
                    ? awayGroup.table.filter(
                        (e) => e.team.id === match.awayTeam.id,
                      )
                    : awayGroup.table,
                  match.awayTeam.id,
                )}
              </div>
            )}
          </div>
        );
      })()
    : null;

  return (
    <div className="flex flex-col gap-4">
      {/* ===== Scoreboard ===== */}
      <div className="relative overflow-hidden rounded-xs p-4 bg-surface-1/50">
        <svg
          viewBox="8 8 1184 344"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.08] z-0"
          style={{
            strokeWidth: 2.5,
            vectorEffect: "non-scaling-stroke",
            stroke: "var(--foreground)",
            fill: "none",
          }}
        >
          <rect x="8" y="8" width="1184" height="344" />
          <line x1="600" y1="8" x2="600" y2="352" />
          <ellipse cx="600" cy="180" rx="78" ry="70" />
          <circle
            style={{ fill: "var(--foreground)", stroke: "none" }}
            cx="600"
            cy="180"
            r="5"
          />
          <rect x="8" y="90" width="150" height="180" />
          <rect x="8" y="130" width="50" height="100" />
          <circle
            style={{ fill: "var(--foreground)", stroke: "none" }}
            cx="105"
            cy="180"
            r="5"
          />
          <path d="M 158 134 A 78 70 0 0 1 158 226" />
          <rect x="1058" y="90" width="150" height="180" />
          <rect x="1158" y="130" width="50" height="100" />
          <circle
            style={{ fill: "var(--foreground)", stroke: "none" }}
            cx="1095"
            cy="180"
            r="5"
          />
          <path d="M 1058 134 A 78 70 0 0 0 1058 226" />
          <path d="M 26 8 A 18 18 0 0 1 8 26" />
          <path d="M 1174 8 A 18 18 0 0 0 1192 26" />
          <path d="M 8 334 A 18 18 0 0 1 26 352" />
          <path d="M 1192 334 A 18 18 0 0 0 1174 352" />
        </svg>

        <div className="relative px-6 pt-4 pb-6">
          <div className="flex items-center justify-between mb-6">
            <Ticker>
              {leagueLabel[leagueCode] ?? leagueCode}
              {match.matchday
                ? ` · Matchday ${match.matchday}`
                : stageLabel
                  ? ` · ${stageLabel}`
                  : ""}
            </Ticker>
            <Ticker>
              {date} · {time}
            </Ticker>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <img
                src={match.homeTeam.crest ?? ""}
                alt={match.homeTeam.name ?? ""}
                className="w-16 h-16 object-contain"
              />
              <span className="text-base text-foreground">
                {match.homeTeam.name ?? ""}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1.5 px-2">
              {isFinished || isLive ? (
                <>
                  <div className="flex items-baseline gap-12">
                    <span
                      className={cn(
                        "text-[56px] leading-none tabular-nums",
                        isLive ? "text-success" : "text-foreground",
                      )}
                    >
                      {match.score.fullTime.home ?? 0}
                    </span>
                    <span
                      className={cn(
                        "text-[56px] leading-none tabular-nums",
                        isLive ? "text-success" : "text-foreground",
                      )}
                    >
                      {match.score.fullTime.away ?? 0}
                    </span>
                  </div>
                  {label && (
                    <Pill variant={isLive ? "success" : "neutral"}>
                      {isLive && <LiveDot className="animate-pulse" />}
                      {label}
                    </Pill>
                  )}
                </>
              ) : (
                <>
                  <span className="text-[44px] leading-none text-foreground tabular-nums">
                    {time}
                  </span>
                  <Ticker>Kick-off</Ticker>
                  {label && (
                    <div className="mt-1">
                      <Pill variant="neutral">{label}</Pill>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-col items-center gap-2 text-center">
              <img
                src={match.awayTeam.crest ?? ""}
                alt={match.awayTeam.name ?? ""}
                className="w-16 h-16 object-contain"
              />
              <span className="text-base text-foreground">
                {match.awayTeam.name ?? ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-1 rounded-sm py-5 px-7">
        {/* Prediction */}
        <div className="pb-5">
          <p className="text-base text-foreground mb-5">
            What's the verdict, pundit?
          </p>

          <div className="grid grid-cols-2 gap-6 items-center mb-4">
            {/* Home */}
            <div className="flex flex-col gap-1.5 items-center">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0"
                value={homeScore}
                readOnly={!isEditable}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^[0-9]{0,2}$/.test(val)) setHomeScore(val);
                }}
                className={scoreInputClasses(isEditable)}
              />
              <div className="flex justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => bumpHome(-1)}
                  disabled={!isEditable}
                  className={stepperButtonClasses}
                  aria-label="Decrease home score"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => bumpHome(1)}
                  disabled={!isEditable}
                  className={stepperButtonClasses}
                  aria-label="Increase home score"
                >
                  +
                </button>
              </div>
            </div>

            {/* Away */}
            <div className="flex flex-col gap-1.5 items-center">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0"
                value={awayScore}
                readOnly={!isEditable}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^[0-9]{0,2}$/.test(val)) setAwayScore(val);
                }}
                className={scoreInputClasses(isEditable)}
              />
              <div className="flex justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => bumpAway(-1)}
                  disabled={!isEditable}
                  className={stepperButtonClasses}
                  aria-label="Decrease away score"
                >
                  −
                </button>
                <button
                  type="button"
                  onClick={() => bumpAway(1)}
                  disabled={!isEditable}
                  className={stepperButtonClasses}
                  aria-label="Increase away score"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            <span className="text-xs text-foreground-dim mr-1">
              Quick picks
            </span>
            {(
              [
                ["2", "1"],
                ["1", "1"],
                ["1", "0"],
                ["0", "0"],
                ["0", "1"],
                ["1", "2"],
              ] as [string, string][]
            ).map(([h, a]) => (
              <button
                key={`${h}-${a}`}
                type="button"
                disabled={!isEditable}
                onClick={() => {
                  setHomeScore(h);
                  setAwayScore(a);
                }}
                className={quickPickButtonClasses}
              >
                <span className="w-3 text-right tabular-nums">{h}</span>
                <span className="text-foreground-dim">-</span>
                <span className="w-3 text-left tabular-nums">{a}</span>
              </button>
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={
              !isEditable || isPending || homeScore === "" || awayScore === ""
            }
            className="w-full py-3 text-sm active:translate-y-px active:brightness-90 transition-all"
          >
            {!isEditable
              ? isFinished
                ? "Match finished"
                : "Match in progress"
              : isPending
                ? "Submitting…"
                : homeScore === "" || awayScore === ""
                  ? "Enter a score to predict"
                  : existingPrediction
                    ? "Update prediction"
                    : user
                      ? "Submit prediction"
                      : "Sign in to predict"}
          </Button>
        </div>

        {/* Form + Standings Tabs */}
        <div className="pt-4">
          <Tabs defaultValue="form">
            <TabsList className="bg-transparent p-0 gap-8 justify-start mb-4 h-auto">
              <TabsTrigger
                value="form"
                className={cn(
                  "bg-transparent p-0 text-sm border-0",
                  "text-foreground-muted",
                  "data-[state=active]:bg-transparent",
                  "data-[state=active]:text-foreground",
                  "data-[state=active]:shadow-none",
                )}
              >
                Form
              </TabsTrigger>
              <TabsTrigger
                value="standings"
                className={cn(
                  "bg-transparent p-0 text-sm border-0",
                  "text-foreground-muted",
                  "data-[state=active]:bg-transparent",
                  "data-[state=active]:text-foreground",
                  "data-[state=active]:shadow-none",
                )}
              >
                Standings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="form">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Ticker className="block mb-3">
                    {match.homeTeam.shortName}
                  </Ticker>
                  {homeFormRows && homeTeamId !== null ? (
                    homeFormRows.map((m) => (
                      <FormRow key={m.id} match={m} teamId={homeTeamId} />
                    ))
                  ) : (
                    <Ticker>No data</Ticker>
                  )}
                </div>
                <div>
                  <Ticker className="block mb-3">
                    {match.awayTeam.shortName}
                  </Ticker>
                  {awayFormRows && awayTeamId !== null ? (
                    awayFormRows.map((m) => (
                      <FormRow key={m.id} match={m} teamId={awayTeamId} />
                    ))
                  ) : (
                    <Ticker>No data</Ticker>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="standings">
              {standingsContent ?? <Ticker>No standings available</Ticker>}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
