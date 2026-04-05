export function generateNumber(): string {
  const nonSeven = ["2", "3", "5", "9"];
  const usesSeven = Math.random() < 0.2;

  if (usesSeven) {
    const second = Math.random() < 0.5 ? "1" : "2";
    let rest = "";
    for (let i = 0; i < 6; i++) rest += Math.floor(Math.random() * 10);
    return "7" + second + rest;
  }

  const first = nonSeven[Math.floor(Math.random() * nonSeven.length)];
  let rest = "";
  for (let i = 0; i < 7; i++) rest += Math.floor(Math.random() * 10);
  return first + rest;
}