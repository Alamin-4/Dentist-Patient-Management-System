export default function PhaseStep({
  step,
  title,
}: {
  step: number;
  title: string;
}) {
  return (
    <div>
      <span className="text-xs font-medium uppercase text-primary">
        Step {step}
      </span>
      <p className="text-lg font-medium text-foreground lg:text-xl">
        {title}
      </p>
    </div>
  );
}
