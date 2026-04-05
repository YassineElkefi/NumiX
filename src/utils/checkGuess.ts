export function checkGuess(secret: string, guess: string): string[] {
  const result: string[] = new Array(guess.length).fill("absent");
  const secretCounts: Record<string, number> = {};
  const usedAsPresent: Record<string, number> = {};

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === secret[i]) {
      result[i] = "correct";
    } else {
      secretCounts[secret[i]] = (secretCounts[secret[i]] || 0) + 1;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "correct") continue;
    const d = guess[i];
    const available = (secretCounts[d] || 0) - (usedAsPresent[d] || 0);
    if (available > 0) {
      result[i] = "present";
      usedAsPresent[d] = (usedAsPresent[d] || 0) + 1;
    }
  }

  return result;
}