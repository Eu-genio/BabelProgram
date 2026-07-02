import HeroSection from "../sections/HeroSection";
import FeaturedProjectSection from "../sections/FeaturedProjectSection";

export default function HomePage() {
  return (
    <div className="home-page">
      <HeroSection />
      <FeaturedProjectSection />
    </div>
  );
}
