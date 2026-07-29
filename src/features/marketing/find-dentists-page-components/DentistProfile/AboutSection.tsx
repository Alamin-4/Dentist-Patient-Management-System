export default function AboutSection({
  name,
  bio,
}: {
  name: string;
  bio: string;
}) {
  return (
    <section id="overview" className="rounded-lg border border-slate-200 bg-white p-6">
      <p className="text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-6">
        About {name}
      </p>
      <div className="max-w-3xl">
        <p className="text-sec-text text-sm whitespace-pre-line">
          {bio}
        </p>
      </div>
    </section>
  );
}
