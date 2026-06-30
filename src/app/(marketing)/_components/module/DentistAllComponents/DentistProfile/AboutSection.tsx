export default function AboutSection({
  name,
  bio,
}: {
  name: string;
  bio: string;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0E3E65] mb-6">
        About {name}
      </p>
      <div className="max-w-3xl">
        <p className="text-[#6B7280] text-sm whitespace-pre-line">
          {bio}
        </p>
      </div>
    </section>
  );
}
