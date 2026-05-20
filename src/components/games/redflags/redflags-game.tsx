"use client";

import { AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";

import { redFlagScenarios } from "@/data/redFlags";
import type {
  RedFlagDifficulty,
  RedFlagRoundResult,
} from "@/types/redflags";
import { RedFlagsLanding } from "@/components/games/redflags/redflags-landing";
import { RedFlagsPlay } from "@/components/games/redflags/redflags-play";
import { RedFlagsFeedback } from "@/components/games/redflags/redflags-feedback";
import { RedFlagsResults } from "@/components/games/redflags/redflags-results";

type GameScreen = "landing" | "play" | "feedback" | "results";

type RoundOutcome = {
  scenarioSlug: string;
  result: RedFlagRoundResult;
};

function getRating(score: number) {
  if (score < 120) {
    return {
      rating: "Beginner",
      message: "Ei! The hacker almost chop your account like banku 😭",
    };
  }

  if (score < 240) {
    return {
      rating: "Alert",
      message: "Solid effort. You catch most of the scam drama before it got loud.",
    };
  }

  return {
    rating: "Cyber Expert",
    message: "You dey detect scam like seasoned cyber captain. Respect.",
  };
}

export function RedFlagsGame() {
  const [screen, setScreen] = useState<GameScreen>("landing");
  const [difficulty, setDifficulty] = useState<RedFlagDifficulty>("Easy");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<RoundOutcome[]>([]);

  const currentScenario = redFlagScenarios[currentIndex];
  const isLastRound = currentIndex === redFlagScenarios.length - 1;
  const maxScore = redFlagScenarios.length * 75;

  const ratingState = useMemo(() => getRating(score), [score]);

  function handleStart() {
    setScreen("play");
  }

  function handleToggleChoice(choiceId: string) {
    setSelectedIds((current) =>
      current.includes(choiceId)
        ? current.filter((item) => item !== choiceId)
        : [...current, choiceId],
    );
  }

  function handleSubmit() {
    const suspiciousIds = currentScenario.elements
      .filter((element) => element.suspicious)
      .map((element) => element.id);
    const correct = selectedIds.filter((id) => suspiciousIds.includes(id));
    const incorrect = selectedIds.filter((id) => !suspiciousIds.includes(id));
    const missed = suspiciousIds.filter((id) => !selectedIds.includes(id));

    const points = Math.max(
      0,
      correct.length * 20 - incorrect.length * 10 + (missed.length === 0 && incorrect.length === 0 ? 15 : 0),
    );

    const result: RedFlagRoundResult = {
      correct: currentScenario.elements
        .filter((element) => correct.includes(element.id))
        .map((element) => element.label),
      missed: currentScenario.elements
        .filter((element) => missed.includes(element.id))
        .map((element) => element.label),
      incorrect: currentScenario.elements
        .filter((element) => incorrect.includes(element.id))
        .map((element) => element.label),
      points,
    };

    setScore((current) => current + points);
    setHistory((current) => [...current, { scenarioSlug: currentScenario.slug, result }]);
    setScreen("feedback");
  }

  function handleNext() {
    if (isLastRound) {
      setScreen("results");
      return;
    }

    setCurrentIndex((current) => current + 1);
    setSelectedIds([]);
    setScreen("play");
  }

  function handleRestart() {
    setScreen("landing");
    setCurrentIndex(0);
    setSelectedIds([]);
    setScore(0);
    setHistory([]);
    setDifficulty("Easy");
  }

  return (
    <AnimatePresence mode="wait">
      {screen === "landing" ? (
        <RedFlagsLanding
          key="landing"
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          onStart={handleStart}
        />
      ) : null}

      {screen === "play" ? (
        <RedFlagsPlay
          key={currentScenario.slug}
          scenario={currentScenario}
          selectedIds={selectedIds}
          onToggleChoice={handleToggleChoice}
          onSubmit={handleSubmit}
          onBackToLanding={handleRestart}
          roundNumber={currentIndex + 1}
          totalRounds={redFlagScenarios.length}
        />
      ) : null}

      {screen === "feedback" && history.length ? (
        <RedFlagsFeedback
          key={`feedback-${currentScenario.slug}`}
          scenario={currentScenario}
          result={history[history.length - 1].result}
          totalScore={score}
          isLastRound={isLastRound}
          onNext={handleNext}
        />
      ) : null}

      {screen === "results" ? (
        <RedFlagsResults
          key="results"
          score={score}
          maxScore={maxScore}
          rating={ratingState.rating}
          message={ratingState.message}
          onRestart={handleRestart}
        />
      ) : null}
    </AnimatePresence>
  );
}
