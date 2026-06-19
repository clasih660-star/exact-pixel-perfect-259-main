import { Navigation } from "@/components/landing/Navigation";
import { Hero } from "@/components/landing/Hero";
import { InstitutionStrip } from "@/components/landing/InstitutionStrip";
import { LearningJourney } from "@/components/landing/LearningJourney";
import { ClassroomExperience } from "@/components/landing/ClassroomExperience";
import { AccessibilityExperience } from "@/components/landing/AccessibilityExperience";
import { InstitutionControl } from "@/components/landing/InstitutionControl";
import { Solutions } from "@/components/landing/Solutions";
import { Pricing } from "@/components/landing/Pricing";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-page-background text-body landing-page-shell"
    >
      <Navigation />
      <Hero />
      <InstitutionStrip />
      <LearningJourney />
      <ClassroomExperience />
      <AccessibilityExperience />
      <InstitutionControl />
      <Solutions />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
