import { Drawer, DrawerContent } from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Ticker } from "@/components/ui/typography";
import type { WCStage } from "@/constants";
import { LEAGUES } from "@/constants";
import { useAuthContext } from "@/features/auth/context/AuthContext";
import { useUserPredictions } from "@/features/predictions/hooks/usePredictions";
import type { Match } from "@/types";
import { sortMatches } from "@/utils/matches";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import FixturesSkeleton from "./FixturesSkeleton";
import MatchCard from "./MatchCard";
import MatchPanel from "./MatchPanel";
import { useFixtures } from "./hooks/useFixtures";

const toDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toLocalDateString = (utcDate: string): string => {
  return toDateString(new Date(utcDate));
};

const addDays = (date: Date, days: number): Date => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const formatNavigatorDate = (dateStr: string): string => {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const yesterday = addDays(today, -1);

  if (dateStr === toDateString(today)) return "Today";
  if (dateStr === toDateString(tomorrow)) return "Tomorrow";
  if (dateStr === toDateString(yesterday)) return "Yesterday";

  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

interface LeagueFixturesProps {
  leagueCode: string;
  activeMatch: Match | null;
  predictions: { match_id: number }[];
  onMatchSelect: (match: Match) => void;
  onAutoSelect: (match: Match) => void;
  onMatchesLoad: (matchIds: number[]) => void;
  stages: WCStage[] | null;
}

function LeagueFixtures({
  leagueCode,
  activeMatch,
  predictions,
  onMatchSelect,
  onAutoSelect,
  onMatchesLoad,
}: LeagueFixturesProps) {
  const today = useMemo(() => new Date(), []);
  const dateFrom = useMemo(() => toDateString(addDays(today, -60)), [today]);
  const dateTo = useMemo(() => toDateString(addDays(today, 60)), [today]);
  const todayStr = useMemo(() => toDateString(today), [today]);

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const { data, isLoading, isError } = useFixtures(
    leagueCode,
    undefined,
    undefined,
    dateFrom,
    dateTo,
  );

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const fixtureDates = useMemo(() => {
    if (!data?.matches) return [];
    const dates = data.matches
      .filter((m) => m.homeTeam !== null && m.awayTeam !== null)
      .map((m) => toLocalDateString(m.utcDate))
      .filter((d): d is string => !!d);
    return [...new Set(dates)].sort();
  }, [data]);

  useEffect(() => {
    if (!fixtureDates.length) return;
    const upcoming = fixtureDates.find((d) => d >= todayStr);
    const defaultDate = upcoming ?? fixtureDates[fixtureDates.length - 1]!;
    setSelectedDate(defaultDate);
  }, [fixtureDates, todayStr]);

  const matches = useMemo(() => {
    if (!data?.matches) return [];
    return sortMatches(
      data.matches.filter(
        (m) =>
          m.homeTeam !== null &&
          m.awayTeam !== null &&
          toLocalDateString(m.utcDate) === selectedDate,
      ),
    );
  }, [data, selectedDate]);

  useEffect(() => {
    if (!matches.length) return;
    onMatchesLoad(matches.map((m) => m.id));
    const firstUnplayed = matches.find(
      (m) => m.status === "SCHEDULED" || m.status === "TIMED",
    );
    const matchToSelect = firstUnplayed ?? matches[0];
    if (matchToSelect && !activeMatch) {
      onAutoSelect(matchToSelect);
    }
  }, [matches, onMatchesLoad, onAutoSelect]);

  const currentIndex = fixtureDates.indexOf(selectedDate);
  const isPrevDisabled = currentIndex <= 0;
  const isNextDisabled = currentIndex >= fixtureDates.length - 1;

  const handlePrev = () => {
    if (currentIndex > 0) setSelectedDate(fixtureDates[currentIndex - 1]!);
  };

  const handleNext = () => {
    if (currentIndex < fixtureDates.length - 1)
      setSelectedDate(fixtureDates[currentIndex + 1]!);
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(toDateString(date));
    setCalendarOpen(false);
  };

  if (isLoading) return <FixturesSkeleton />;

  if (isError)
    return (
      <div className="py-12 text-center">
        <Ticker>Failed to load fixtures. Try again later.</Ticker>
      </div>
    );

  const selectedDateObj = selectedDate
    ? new Date(selectedDate + "T00:00:00")
    : undefined;

  return (
    <div className="flex flex-col gap-3">
      {/* Date navigator */}
      <div className="flex items-center justify-between py-3 px-4">
        <button
          onClick={handlePrev}
          disabled={isPrevDisabled}
          aria-label="Previous date"
          className="p-1 text-foreground-muted hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <button
              className="flex items-center gap-1 text-sm text-foreground hover:text-foreground-muted transition-colors"
              aria-label="Open date picker"
            >
              {selectedDate ? formatNavigatorDate(selectedDate) : "—"}
              <ChevronDown className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={selectedDateObj}
              onSelect={handleCalendarSelect}
              disabled={(date) => {
                const dateStr = toDateString(date);
                return dateStr < dateFrom || dateStr > dateTo;
              }}
            />
          </PopoverContent>
        </Popover>

        <button
          onClick={handleNext}
          disabled={isNextDisabled}
          aria-label="Next date"
          className="p-1 text-foreground-muted hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {matches.length === 0 ? (
        <p className="py-12 text-center">
          <Ticker>No fixtures for this date</Ticker>
        </p>
      ) : (
        <div className="flex flex-col">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              isActive={isDesktop && activeMatch?.id === match.id}
              isPredicted={predictions.some((p) => p.match_id === match.id)}
              onClick={() => onMatchSelect(match)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Fixtures() {
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentMatchIds, setCurrentMatchIds] = useState<number[]>([]);
  const [activeLeague, setActiveLeague] = useState(LEAGUES[0]!.code);

  const { user } = useAuthContext();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const { data: predictionsData } = useUserPredictions(
    user?.id,
    currentMatchIds,
  );

  const existingPrediction = predictionsData?.find(
    (p) => p.match_id === activeMatch?.id,
  );

  const handleAutoSelect = useCallback((match: Match) => {
    setActiveMatch(match);
  }, []);

  const handleMatchSelect = useCallback(
    (match: Match) => {
      setActiveMatch(match);
      if (!isDesktop) setDrawerOpen(true);
    },
    [isDesktop],
  );

  const handleLeagueChange = (league: string) => {
    setActiveLeague(league);
    setActiveMatch(null);
    setCurrentMatchIds([]);
  };

  const activeLeagueData = LEAGUES.find((l) => l.code === activeLeague);

  return (
    <div
      className="
        mx-auto w-full max-w-7xl px-6 py-6
        grid items-start gap-5
        grid-cols-1 lg:grid-cols-[minmax(300px,35%)_1fr]
      "
    >
      {/* Left column — fixture list */}
      <div className="min-w-0 flex flex-col bg-surface-1 rounded-xs overflow-hidden pt-5">
        {/* League selector */}
        <div className="px-4 pb-3">
          <Select value={activeLeague} onValueChange={handleLeagueChange}>
            <SelectTrigger
              className="
                border-0 bg-transparent shadow-none
                p-1 gap-1.5 text-sm font-medium text-foreground
                h-auto rounded-sm
              "
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start" className="p-1">
              {LEAGUES.map((league) => (
                <SelectItem key={league.code} value={league.code}>
                  {league.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fixtures */}
        {activeLeagueData && (
          <LeagueFixtures
            leagueCode={activeLeagueData.code}
            stages={activeLeagueData.stages ?? null}
            activeMatch={activeMatch}
            onMatchSelect={handleMatchSelect}
            onAutoSelect={handleAutoSelect}
            predictions={predictionsData ?? []}
            onMatchesLoad={setCurrentMatchIds}
          />
        )}
      </div>

      {/* Right column — match panel */}
      <div className="hidden lg:block min-w-0">
        <MatchPanel
          match={activeMatch}
          existingPrediction={existingPrediction}
          leagueCode={activeLeague}
        />
      </div>

      {!isDesktop && (
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerContent className="max-h-[85vh] overflow-y-auto px-6 pb-8">
            <div className="mt-4">
              <MatchPanel
                match={activeMatch}
                existingPrediction={existingPrediction}
                leagueCode={activeLeague}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
