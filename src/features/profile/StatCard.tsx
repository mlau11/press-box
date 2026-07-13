export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-secondary rounded-lg p-4 flex flex-col gap-1">
      <p className="text-xs text-foreground-muted">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
