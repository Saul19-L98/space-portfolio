export function TechChips({ items, color }: { items: string[]; color?: string }) {
  if (!items.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
      {items.map((t) => (
        <li key={t} className="tech-chip" style={color ? { borderColor: `${color}55` } : undefined}>
          {t}
        </li>
      ))}
    </ul>
  );
}
