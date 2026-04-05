export default function Footer() {
  return (
    <footer
      className="relative z-10 w-full py-4 text-center border-t"
      style={{ borderColor: "var(--header-border)" }}
    >
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        made by{" "}
        <span className="font-semibold text-indigo-400">Yassine</span>
        {" "}with{" "}
        <span className="text-red-500">♥</span>
      </p>
    </footer>
  );
}