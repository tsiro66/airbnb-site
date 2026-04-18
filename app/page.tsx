import Hero from "./components/Hero";
import About from "./components/About";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      {/* Main content — sits above footer */}
      <div className="relative z-10 bg-[#faf4dd]">
        <Hero />
        <About />
      </div>

      {/* Footer — revealed from beneath as content scrolls away */}
      <Footer />
    </>
  );
}
