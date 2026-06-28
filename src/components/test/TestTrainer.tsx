"use client";

import { useMemo, useState } from "react";
import { pickExamQuestions, TEST_QUESTIONS, type TestQuestion } from "@/lib/data/test-questions";

type Mode = "menu" | "training" | "exam" | "result";
type Phase = "question" | "review";

export function TestTrainer() {
  const [mode, setMode] = useState<Mode>("menu");
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [phase, setPhase] = useState<Phase>("question");
  const [selected, setSelected] = useState<number | null>(null);

  const current = questions[index];
  const isExam = mode === "exam";

  const score = useMemo(() => {
    return answers.reduce<number>((acc, a, i) => {
      if (a === questions[i]?.correctIndex) return acc + 1;
      return acc;
    }, 0);
  }, [answers, questions]);

  function startTraining() {
    setQuestions(TEST_QUESTIONS);
    setAnswers(new Array(TEST_QUESTIONS.length).fill(null));
    setIndex(0);
    setPhase("question");
    setSelected(null);
    setMode("training");
  }

  function startExam() {
    const exam = pickExamQuestions(10);
    setQuestions(exam);
    setAnswers(new Array(10).fill(null));
    setIndex(0);
    setPhase("question");
    setSelected(null);
    setMode("exam");
  }

  function submitAnswer() {
    if (selected === null || !current) return;
    const next = [...answers];
    next[index] = selected;
    setAnswers(next);

    if (mode === "training") {
      setPhase("review");
      return;
    }

    if (index + 1 >= questions.length) {
      setMode("result");
      return;
    }
    setIndex(index + 1);
    setSelected(null);
  }

  function nextTraining() {
    if (index + 1 >= questions.length) {
      setMode("result");
      return;
    }
    setIndex(index + 1);
    setSelected(null);
    setPhase("question");
  }

  const errors = questions.length - score;
  const examPassed = isExam && errors <= 1;

  if (mode === "menu") {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <button type="button" onClick={startTraining} className="card-surface text-left transition hover:shadow-md">
          <h3 className="text-xl font-bold">Тренировка</h3>
          <p className="mt-2 text-sm text-[var(--foreground)]/70">
            Все вопросы с пояснениями после каждого ответа. Без ограничения по времени.
          </p>
        </button>
        <button type="button" onClick={startExam} className="card-surface text-left transition hover:shadow-md">
          <h3 className="text-xl font-bold">Экзамен</h3>
          <p className="mt-2 text-sm text-[var(--foreground)]/70">
            10 случайных вопросов. Допускается 1 ошибка — как на экзамене Росгвардии.
          </p>
        </button>
      </div>
    );
  }

  if (mode === "result") {
    return (
      <div className="card-surface max-w-2xl space-y-4">
        <h3 className="text-2xl font-bold">Результат</h3>
        <p className="text-lg">
          Правильных ответов: <strong>{score}</strong> из {questions.length}
        </p>
        {isExam && (
          <p className={`text-lg font-semibold ${examPassed ? "text-[var(--success)]" : "text-[var(--error)]"}`}>
            {examPassed ? "Экзамен сдан!" : "Экзамен не сдан. Допустима не более 1 ошибки."}
          </p>
        )}
        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={q.id} className="rounded-lg border border-[var(--border)] p-3 text-sm">
              <p className="font-medium">{i + 1}. {q.text}</p>
              <p className={answers[i] === q.correctIndex ? "text-[var(--success)]" : "text-[var(--error)]"}>
                Ваш ответ: {answers[i] !== null ? q.options[answers[i]!] : "—"}
              </p>
              {answers[i] !== q.correctIndex && (
                <p className="text-[var(--success)]">Верно: {q.options[q.correctIndex]}</p>
              )}
              <p className="mt-1 text-[var(--foreground)]/70">{q.explanation}</p>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setMode("menu")} className="btn-primary">
          Начать заново
        </button>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="card-surface max-w-2xl space-y-4">
      <div className="flex items-center justify-between text-sm text-[var(--foreground)]/60">
        <span>
          {mode === "training" ? "Тренировка" : "Экзамен"} — вопрос {index + 1} / {questions.length}
        </span>
        {isExam && <span>Ошибок: {errors}</span>}
      </div>

      <h3 className="text-lg font-semibold">{current.text}</h3>

      <div className="space-y-2">
        {current.options.map((opt, i) => (
          <label
            key={opt}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
              selected === i ? "border-[var(--accent)] bg-[var(--accent)]/5" : "border-[var(--border)]"
            } ${phase === "review" && i === current.correctIndex ? "border-[var(--success)] bg-green-50" : ""}`}
          >
            <input
              type="radio"
              name="answer"
              checked={selected === i}
              disabled={phase === "review"}
              onChange={() => setSelected(i)}
            />
            {opt}
          </label>
        ))}
      </div>

      {phase === "review" && (
        <div className="rounded-lg bg-[var(--muted)] p-4 text-sm">
          <p className="font-medium">
            {selected === current.correctIndex ? "Верно!" : "Неверно"}
          </p>
          <p className="mt-1">{current.explanation}</p>
        </div>
      )}

      {phase === "question" ? (
        <button type="button" onClick={submitAnswer} disabled={selected === null} className="btn-primary">
          {isExam ? "Ответить" : "Проверить"}
        </button>
      ) : (
        <button type="button" onClick={nextTraining} className="btn-primary">
          {index + 1 >= questions.length ? "Завершить" : "Следующий вопрос"}
        </button>
      )}
    </div>
  );
}
