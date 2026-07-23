import Navbar from "../components/home/Navbar";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import Stats from "../components/home/Stats";
import PopularBooks from "../components/home/PopularBooks";
import Testimonials from "../components/home/Testimonials";
import CTA from "../components/home/CTA";
import Footer from "../components/home/Footer";

const Home = () => {
  return (
    <main className="min-h-screen bg-slate-950">
      <Navbar />
      <Hero />
      <Features />
      <Stats />
      <PopularBooks />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
};

export default Home;