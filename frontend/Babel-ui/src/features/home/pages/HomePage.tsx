import HeroSection from "../sections/HeroSection";
import AboutSection from "../sections/AboutSection";
import FeaturedProjectSection from "../sections/FeaturedProjectSection";

export default function HomePage() {
  return (
    <div className="container">
      <HeroSection />
      <AboutSection />
      <FeaturedProjectSection />
    </div>
  );
}