"use client";
import { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";

const names = ["Alice", "Bob", "Carol"];
const pets = ["Cat", "Dog", "Bird"];

const clues = [
  "Alice does not own the dog.",
  "The person who owns the cat is not Carol.",
  "Bob owns the bird.",
];
const answerKey: Record<string, "yes" | "no"> = {
  "Alice-Cat": "yes",
  "Alice-Dog": "no",
  "Alice-Bird": "no",

  "Bob-Cat": "no",
  "Bob-Dog": "no",
  "Bob-Bird": "yes",

  "Carol-Cat": "no",
  "Carol-Dog": "yes",
  "Carol-Bird": "no",
};

type GridState = Record<string, "yes" | "no" | "">;

export default function LogicGridPuzzle() {
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [grid, setGrid] = useState<GridState>({});

  const checkAnswers = () => {
    const correctKeys = Object.entries(answerKey)
      .filter(([_, val]) => val === "yes")
      .map(([key]) => key);

    const userYesKeys = Object.entries(grid)
      .filter(([_, val]) => val === "yes")
      .map(([key]) => key);

    const isCorrect =
      correctKeys.length === userYesKeys.length &&
      correctKeys.every((key) => userYesKeys.includes(key));

    setIsCorrect(isCorrect);
    setChecked(true);
  };

  const toggleCell = (key: string) => {
    setGrid((prev) => {
      const current = prev[key] || "";
      const next = current === "" ? "yes" : current === "yes" ? "no" : "";
      return { ...prev, [key]: next };
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Logic Grid Puzzle</h2>
      <Card className="p-4 mb-6 bg-stone-700">
        <h3 className="font-semibold mb-2">Clues</h3>
        <ul className="list-disc pl-6 space-y-1">
          {clues.map((clue, i) => (
            <li key={i}>{clue}</li>
          ))}
        </ul>
      </Card>

      <div className="overflow-x-auto rounded">
        <table className="table-auto border-collapse w-full">
          <thead>
            <tr>
              <th className="border p-2">Name / Pet</th>
              {pets.map((pet) => (
                <th key={pet} className="border p-2 text-center">
                  {pet}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {names.map((name) => (
              <tr key={name}>
                <td className="border p-2 font-semibold">{name}</td>
                {pets.map((pet) => {
                  const key = `${name}-${pet}`;
                  const value = grid[key] || "";
                  return (
                    <td
                      key={pet}
                      className={cn(
                        "border p-2 text-center cursor-pointer select-none",
                        value === "yes"
                          ? "bg-green-300"
                          : value === "no"
                          ? "bg-red-300"
                          : "bg-slate-800",
                        checked &&
                          answerKey[key] === "yes" &&
                          value !== "yes" &&
                          "bg-yellow-300" // Incorrect or missing
                      )}
                      onClick={() => toggleCell(key)}
                    >
                      {value === "yes" ? "✔" : value === "no" ? "✖" : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 ">
        <Button onClick={() => setGrid({})}>Reset Grid</Button>
        <Button className="ml-4" onClick={checkAnswers}>
          Check Answers
        </Button>
        {checked && (
          <div className="mt-4 text-lg font-semibold">
            {isCorrect ? "✅ Correct!" : "❌ Not quite, try again!"}
          </div>
        )}
      </div>
    </div>
  );
}
