import Image from "next/image";
import HeroContent from "./hero-content";

export default function Hero() {
  return (
    <section className="relative w-full bg-white py-12">
      <div className="mx-auto flex max-w-400 w-11/12 flex-col-reverse items-center justify-between gap-12 lg:flex-row">

        <div className="w-full lg:w-3/5">
          <HeroContent />
        </div>

        <div className="relative w-full lg:w-2/5">
          <div className="relative aspect-video lg:aspect-4/3 w-full overflow-hidden rounded-lg">
            <Image
              src="/images/hero.png"
              height={400}
              width={600}
              loading="eager"
              alt="Dental Clinic Entry"
              className="h-full w-full object-cover object-top bg-top"
            />
            <div className="absolute inset-0" />
          </div>
        </div>

      </div>
    </section>
  );
}