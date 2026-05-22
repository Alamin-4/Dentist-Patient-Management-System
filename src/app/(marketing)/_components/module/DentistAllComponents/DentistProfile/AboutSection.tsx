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
        <p className="text-[#6B7280] text-sm space-y-4 *:inline-block">
          <span>
            Dr. Ava Johnson is a board-certified dentist with over eight years
            of experience helping patients achieve healthy, confident smiles
            through compassionate, personalized care. She specializes in
            preventive, restorative, and family dentistry, providing comfortable
            treatment in a welcoming environment.
          </span>
          <span>
            Dr. Albano earned her Doctor of Dental Medicine degree and completed
            advanced clinical training with a focus on comprehensive oral
            health. She is known for her gentle approach, clear communication,
            and commitment to patient comfort.
          </span>
          <span>
            She provides routine checkups, cleanings, fillings, cosmetic
            treatments, and personalized treatment plans tailored to each
            patient’s needs. No referral required, and insurance-friendly
            options available.
          </span>
          <span>
            For accessible, patient-focused dental care, schedule an appointment
            with Dr. Alanna Albano today.{" "}
            <span className="text-blue-500 underline cursor-pointer">
              See more
            </span>
          </span>
        </p>
      </div>
    </section>
  );
}
