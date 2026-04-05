import Row from "./Row";

interface BoardProps {
  guesses: string[];
  results: string[][];
  maxRows: number;
  currentInput: string;
}

export default function Board({ guesses, results, maxRows, currentInput }: BoardProps) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: maxRows }).map((_, i) => (
        <Row
          key={i}
          guess={guesses[i] || ""}
          result={results[i] || []}
          isCurrentRow={i === guesses.length}
          currentInput={i === guesses.length ? currentInput : ""}
        />
      ))}
    </div>
  );
}