import Cell from "./Cell";

interface RowProps {
  guess: string;
  result: string[];
  isCurrentRow?: boolean;
  currentInput?: string;
}

export default function Row({ guess, result, isCurrentRow, currentInput = "" }: RowProps) {
  const groups = [[0, 1], [2, 3, 4], [5, 6, 7]];

  return (
    <div className="flex items-center gap-3">
      {groups.map((group, gi) => (
        <div key={gi} className="flex gap-1.5">
          {group.map((i) => {
            const submitted = guess[i] || "";
            const live = isCurrentRow ? currentInput[i] || "" : "";
            const display = submitted || live;
            const isActive = isCurrentRow && !submitted && i === currentInput.length;
            return (
              <Cell
                key={i}
                value={display}
                status={result?.[i]}
                isActive={isActive}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}