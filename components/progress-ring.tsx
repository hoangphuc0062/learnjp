export function ProgressRing({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const safe = Math.min(100, Math.max(0, value));

  return (
    <div
      className="grid size-16 place-items-center rounded-full"
      style={{
        background: `conic-gradient(#17665c ${safe * 3.6}deg, #ece9e2 0deg)`,
      }}
      aria-label={`Tiến độ ${safe}%`}
    >
      <div className="grid size-12 place-items-center rounded-full bg-white text-xs font-bold text-stone-800">
        {label}
      </div>
    </div>
  );
}
