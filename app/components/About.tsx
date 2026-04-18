export default function About() {
  return (
    <section className="relative bg-[#faf4dd] px-6 md:px-16 lg:px-32 py-24 md:py-36">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-[family-name:var(--font-melodrama)] leading-tight">
            A place to call home in Patra
          </h2>
        </div>
        <div className="flex flex-col gap-6">
          <p className="text-base md:text-lg text-stone-600 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <p className="text-base md:text-lg text-stone-600 leading-relaxed">
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </p>
        </div>
      </div>
    </section>
  );
}
