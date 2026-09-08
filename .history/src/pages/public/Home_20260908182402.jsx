import Hero from "../../sections/home/Hero";
import Tokenization from "../../sections/home/Tokenization";
import Funds from "../../sections/home/Funds";
import PlatformFeatures from "../../sections/home/PlatformFeatures";
import Testimonials from "../../sections/home/Testimonials";
import PlatformMetrics from "../../sections/home/PlatformMetrics";
import HowItWorks from "../../sections/home/HowItWorks";
import FourPillars from "../../sections/home/FourPillars";
import Security from "../../sections/home/Security";
import FAQ from "../../sections/home/FAQ";
import Footer from "../../sections/home/Footer";

export default function Home() {
  return (
    <div>
      <Hero />
      <Tokenization />
      {/* <Funds /> */}
      <PlatformFeatures />
      <Testimonials />
      <PlatformMetrics />
      <HowItWorks />
      <FourPillars />
      <Security />
      <FAQ />
      <Footer />
    </div>
  );
}
